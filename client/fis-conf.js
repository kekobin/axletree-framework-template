fis.config.set('namespace', 'client');

// chrome下可以安装插件实现livereload功能
// https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
fis.config.set('livereload.port', 35729);

fis.media('debug').match('*', {
    optimizer: null,
    useHash: false,
    deploy: fis.plugin('http-push', {
        receiver: 'http://127.0.0.1:8085/axletree/upload',
        to: '/'
    })
});
fis.media('debug-prod').match('*', {
    deploy: fis.plugin('http-push', {
        receiver: 'http://127.0.0.1:8085/axletree/upload',
        to: '/'
    })
});