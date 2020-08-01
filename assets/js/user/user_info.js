$(function() {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称必须在 1 ~ 6 个字符之间';
            }
        }
    })

    userInfo();

    // 发起请求获取用户信息 为表单赋值
    function userInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 利用layui 快速为表单赋值
                form.val('userInfo', res.data)
            }

        })
    }

    // 重置按钮
    $('#re-btn').on('click', function(e) {
        e.preventDefault();
        userInfo();
    })

    // 确认修改
    $('form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                    // 调用父页面的方法，重新渲染用户头像和信息
                window.parent.userInfo();
            }
        })
    })

})