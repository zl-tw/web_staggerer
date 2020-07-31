// 每次调用 ajax 的时候都会先调用 ajaxPrefilter 函数
// 在这个函数中我们可以拿到给 ajax 提供的配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url;

    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂在complete函数
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            location.href = '/login.html'
            localStorage.removeItem('token')
        }
    }
})