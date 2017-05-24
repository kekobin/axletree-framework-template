'use strict';

var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var router = require('./router');
var _ = require('lodash');
var async = require('async');
var loader = require('./loader.js');

var Axletree = function() {
    this.express = express;
    this.require = null;
    this.app = null;
    this._ = _;
};

Axletree.prototype.bootstrap = function(options, cb) {
    var rootPath, pluginsPath, confPath, started;

    function loadPlugins(cb) {
        //加载默认插件
        var pluginFactory = loader.loadPlugins(__dirname + '/plugins');
        //加载用户自定义插件
        _.extend(pluginFactory, loader.loadPlugins(pluginsPath));
        //注入插件加载代码
        pluginFactory = _.mapValues(pluginFactory, loader.injectPluginFactory);
        //执行插件初始化
        async.auto(pluginFactory, cb);
    }

    options = options || {};
    //设置yog根目录，默认使用启动文件的目录
    rootPath = options.rootPath || path.dirname(require.main.filename);
    //设置plugins目录
    pluginsPath = options.pluginsPath || (rootPath + '/plugins');
    //设置app，未设置则直接使用express
    this.app = options.app || express();

    //设置全局require
    this.require = require('./require.js')(rootPath);

    // view engine setup
    this.app.set('views', path.join(__dirname, '../views'));
    this.app.engine('html', swig.renderFile);
    this.app.set('view engine', 'html');

    // uncomment after placing your favicon in /public
    this.app.use(favicon(path.join(__dirname, '../favicon.ico')));
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({
        extended: false
    }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, '../static')));

    //设置路由
    router(this.app);
    //错误处理
    this.errorHandler(this.app);

    //设置启动期的拦截
    this.app.use(function (req, res, next) {
        if (started) {
            next();
            return;
        }
        res.status(503).send('Server is starting...');
    });

    this.DEBUG = (process.env.AXLE_DEBUG === 'true') || false;

    //加载插件
    loadPlugins(function (err) {
        if (err) throw err;
        started = true;
        cb && cb();
    });

    return this.app;
};

Axletree.prototype.errorHandler = function(app) {
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render(path.join(__dirname, '../views/error'), {
            message: err.message,
            error: {}
        });
    });
};

//register global variable
Object.defineProperty(global, 'axletree', {
    enumerable: true,
    writable: true,
    value: new Axletree()
});

module.exports = global.axletree;
