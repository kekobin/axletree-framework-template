var projectName = '{{-project_name-}}';//设置项目名称，也即静态资源发布的目录

// chrome下可以安装插件实现livereload功能
// https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
fis.config.set('livereload.port', 35729);

// 生产环境
fis.media('prod')
.match('!{*.{html,tpl}, js/mod/**}', {
    domain: 'http://hd.huya.com/${projectname}',
    deploy: fis.plugin('local-deliver', {
        to: '../pub/'+projectName+'/'
    })
})
.match('widget/**.tpl', {
    deploy: fis.plugin('local-deliver', {
        to: '../pub/'+projectName+'View/'
    })
}).match('/(**.html)', {
    release: '/$1',
    deploy: fis.plugin('local-deliver', {
        to: '../pub/'+projectName+'View/'
    })
});
