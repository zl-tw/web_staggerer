$(function() {
    $('#login').on('click', function() {
        $('.login').hide();
        $('.reg').show();
    })

    $('#reg').on('click', function() {
        $('.reg').hide();
        $('.login').show();
    })


    // 表单验证
    var form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            if (value !== $('#reg-p').val()) {
                return '两次密码不一致！';
            }
        }
    })

    // 为注册按钮绑定submit事件
    var layer = layui.layer;
    $('.reg-from').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg [name="username"]').val(),
                password: $('.reg [name="password"]').val()
            },
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                $('#reg').click()
            }
        })
    })

    // 登录表单 submit 事件
    $('.login-from').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                // 将登录成功的 token 值保存到 local storage 中
                localStorage.setItem('token', res.token);
                // 登录成功，跳转到主页
                location.href = '/index.html';
            }
        })
    })


})