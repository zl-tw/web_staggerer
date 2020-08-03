$(function() {
    var layer = layui.layer;
    var form = layui.form;

    getArticleList();

    // 获取文章分类列表
    function getArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                var htmlStr = template('artList', res)
                $('tbody').html(htmlStr)
            }
        })
    }


    var indexAdd = null;
    // 添加分类
    $('#addCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#addLayer').html()
        });
    })

    // 通过代理的形式监听添加分类 submit 事件
    $('body').on('submit', '#formAdd', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                getArticleList();
                layer.close(indexAdd);
            }
        })
    })

    var indexEdit = null;
    // 通过代理的形式为编辑按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#edit').html()
        });

        // 通过添加类别的自定义属性过去每一条分类的id值
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('lay-filter', res.data);
            }
        })
    })

    // 通过代理形式监听 编辑 表单提交事件
    $('body').on('submit', '#formAlter', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                getArticleList();
                layer.close(indexEdit);
            }
        })
    })


    // 通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-del', function() {
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                getArticleList();
            }
        })
    })
})