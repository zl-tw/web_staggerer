$(function() {
    var form = layui.form

    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        confirm: function(value) {
            if (value !== $('.newPwd').val()) {
                return "两次密码不一致！"
            }
        },
        cloudy: function(value) {
            if (value === $('.oldPwd').val()) {
                return "与原密码一样，请重新修改！"
            }
        }
    })

    $('form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
            }
        })
    })
})