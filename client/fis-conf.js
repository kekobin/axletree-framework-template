/**
 * @file 设置项目名称，也即静态资源发布的目录
 */
var projectName = '{{-project_name-}}';

/**
 *发布的cdn域
 */
var domain = '';

/**
 * chrome下可以安装插件实现livereload功能
 * https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
 */

fis.config.set('livereload.port', 35729);

/**
 * 生产环境
 */
fis.media('prod')
.match('/(**.html)', {
    release: '/$1'
})
.match('!{*.{html,tpl}, js/mod/**}', {
    domain: domain + projectName,
    deploy: fis.plugin('local-deliver', {
        to: '../pub/'+projectName+'/'
    })
})
.match('widget/**.tpl', {
    parser: fis.plugin('tpl-imgpath', {
    	path: domain + projectName
    })
})
.match('{widget/**.tpl,**.html,apiConf.js}', {
    deploy: fis.plugin('local-deliver', {
        to: '../pub/'+projectName+'View/'
    })
});
