$(function() {
    var layer = layui.layer

    userInfo();


    // 退出功能
    $('#exit').on('click', function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            location.href = '/login.html';
            localStorage.removeItem('token');

            layer.close(index);
        });

    })
})


function userInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            avatar(res.data)
        },
        // ajax的回调函数，已在 baseAPI 全局挂载
        // complete: function(res) {
        //     console.log(res.responseJSON.message);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         location.href = '/login.html'
        //         localStorage.removeItem('token')
        //     }
        // }
    })
}


//渲染图片头像
function avatar(data) {
    var name = data.nickname || data.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (data.user_pic) {
        $('.layui-nav-img').attr('src', data.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    }
}