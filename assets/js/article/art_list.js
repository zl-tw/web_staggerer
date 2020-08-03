$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var flag = null;

    // 一定请求参数
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: '',
    }

    // 定义时间过滤器
    template.defaults.imports.DateFormat = function(date) {
        var df = new Date(date);
        var y = df.getFullYear();
        var m = df.getMonth() + 1;
        m = m < 10 ? '0' + m : m
        var d = df.getDate();
        d = d < 10 ? '0' + d : d

        var hh = df.getHours();
        hh = hh < 10 ? '0' + hh : hh
        var mm = df.getMinutes();
        mm = mm < 10 ? '0' + mm : mm
        var ss = df.getSeconds();
        ss = ss < 10 ? '0' + ss : ss

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    getList();
    getCate();

    // 获取文章列表数据
    function getList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                var htmlStr = template('tpl-list', res)
                $('tbody').html(htmlStr);

                // 调用渲染分页方法
                page(res.total)
            }
        })
    }

    // 获取文章分类
    function getCate(flag) {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                res.flag = flag;
                var htmlStr = template('cate', res)
                $('#sel-cate').html(htmlStr)

                // 通知 layui 重新渲染表单
                form.render();


            }
        })
    }

    // 监听筛选表单 submit 事件
    $('body').on('submit', '#form-select', function(e) {
        e.preventDefault();
        var cate_id = $('#sel-cate').val();
        var state = $('[name="state"]').val();
        q.cate_id = cate_id;
        q.state = state;
        getList()
    })

    // 定义渲染分页的函数
    function page(total) {
        layui.use('laypage', function() {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'peg', //注意，这里的 test1 是 ID，不用加 # 号
                count: total, //数据总数，从服务端得到
                limit: q.pagesize,
                curr: q.pagenum,
                limits: [2, 3, 5, 10],
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                jump: function(obj, first) {
                    q.pagenum = obj.curr;
                    q.pagesize = obj.limit;
                    if (!first) {
                        getList();
                    }
                }
            });
        });
    }


    // 删除
    $('tbody').on('click', '.btn-del', function() {
        var id = $(this).attr('data-id');
        var delLen = $('.btn-del').length;

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)

                    // 当数据删除完成之后，需要判断当前这一页中 是否还有剩余数据
                    // 如果没有剩余数据了 则让页码-1 再重新渲染页面
                    if (delLen === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                        getList();
                    }
                    getList();
                }
            })

            layer.close(index);
        });
    })

    // 编辑
    $('body').on('click', '.btn-edit', function() {
        var id = $(this).attr('data-id');
        var flag = $(this).attr('id') ? true : false;

        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.open({
                    type: 1,
                    title: '修改文章',
                    area: ['100%', '100%'],
                    content: $('#btn-edit'),
                });
                var htmlStr = template('btn-edit', res);
                $('body').html(htmlStr);
                getCate(flag);

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

                $('[name="title"]').attr('data-Id', id)
                    // 快速为表达赋值
                form.val('lay-filter', res.data)
            }
        })
    })

    // 通过代理监听编辑内 表单 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        var id = $('[name="title"]').attr('data-Id')
        var fd = new FormData($(this)[0])
        fd.append('id', id)
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                location.href = '/article/art_list.html';
            }
        })
    })
})