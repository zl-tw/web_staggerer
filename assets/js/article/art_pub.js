$(function() {
    getCate();

    // 获取文章类别
    function getCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                var htmlStr = template('cate', res);
                $('[name="cate_id"]').html(htmlStr);
                layui.form.render();
            }
        })
    }

    // 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#coverFile').on('click', function() {
        $('[type="file"]').click();
    })

    // 获取选择的图片文件
    $('[type="file"]').on('change', function(e) {
        var len = e.target.files.length;
        if (len === 0) {
            return layui.layer.msg('请选择图片')
        }
        var file = e.target.files[0];
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    var art_state = '已发布';
    $('#btn-save').on('click', function() {
        art_state = '草稿';
    })

    // 监听表单 submit 事件
    $('form').on('submit', function(e) {
        e.preventDefault();
        var fd = new FormData($(this)[0])

        // 将文章的发布状态存到 FormDate 中
        fd.append('state', art_state);

        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                fd.append('cover_img', blob);

                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)

                // 跳转文章列表页面
                location.href = '/article/art_list.html'
                window.parent.clickArtList()
            }
        })
    }
})