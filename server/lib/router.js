var path = require('path');
var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require('fs-extra');

var apiConfig = require('../config/api');
var request = require('./request');
var uploadError = false;

for (var appName in apiConfig) {
	var appConf = apiConfig[appName],
		pages = appConf.pages;

	pages.forEach(function(pageItem) {
		var urls = pageItem['urls'],
			page = pageItem['page'];

		router.get('/' + appName + '/' + page, function(req, res, next) {
			request(req, urls, function(data) {
				//根据这个在页面中判断是否登录
				data.yyuid = req.cookies.yyuid;

				// res.render(path.join(__dirname, '../views/' + appName + 'View/index'), data);
				res.render(path.join(__dirname, '../views/' + page), data);
			});
		});
	});
}


//reload config
if(axletree.DEBUG) {
	router.get('/axletree/upload', function(req, res) {
		res.end(req.protocol + '://' + req.get('host') + '/axletree/upload is ready to work');
	});

	router.post('/axletree/upload', function(req, res, next) {
		console.log('resources upload!')
		if (uploadError) {
			return next(new Error('fs error'));
		}
		var goNext = function(err) {
			return next(err);
		};
		// parse a file upload
		var form = new multiparty.Form();
		form.parse(req, function(err, fields, files) {
			if (err) return goNext(err);
			if (!files.file || !files.file[0]) return goNext(new Error('invalid upload file'));
			res.end('0');
			// record uploading app
			fs.move(
				files.file[0].path, axletree.ROOT_PATH + fields.to, {
					clobber: true
				},
				function(err) {
					if (err) {
						uploadError = true;
					}
				}
			);
		});
	});
}


module.exports = router;