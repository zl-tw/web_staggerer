// 每次调用 ajax 的时候都会先调用 ajaxPrefilter 函数
// 在这个函数中我们可以拿到给 ajax 提供的配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url
})