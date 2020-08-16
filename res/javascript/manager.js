var managerServiceUrlPrefix = "http://api.shop.com/manager";
var itemImageEditor, itemRemarkEditor;
var images = new Array();
var MANAGER_ITEM = {
    addItem: function () {
        AJAX.html("itemAdd.html", function (html) {
            $("#right").html(html);
        });
    },
    saveItem: function () {
        $("#images").val(images.join());
        $("#remark").val(itemRemarkEditor.txt.html());
        AJAX.post(
            managerServiceUrlPrefix + "/item/save",
            $("#myForm").serialize(),
            function (result) {
                layer.alert(result.message);
            }
        );
    },

    listItem: function () {
        AJAX.html("itemFindAll.html", function (html) {
            $("#right").html(html);
        });
    },

    edit: function (id) {
        var url = "itemEdit.html"
        AJAX.html(url, function (html) {
            layer.open({
                type: 1,
                content: html,
                area: '500px'
            });
            $("#id").val(id);
        });
    },

    editData: function () {
        var url = managerServiceUrlPrefix+"/item/edit";
        AJAX.post(url, {id: $("#id").val()}, function (result) {
            itemRemarkEditor.txt.html(result.remark);
        });
    },

    update: function (id) {
        $("#remark").val(itemRemarkEditor.txt.html());
        // alert($("#remark").val());
        AJAX.post(
            managerServiceUrlPrefix+"/item/update",
            $("#myForm2").serialize(),
            function (result) {
                $("#id").val(id);
                layer.alert(result.message);
            }
        );
    },

    delete: function (id) {
        $("#remark").val(itemRemarkEditor.txt.html());
        AJAX.post(
            managerServiceUrlPrefix + "/item/delete",
            $("#myForm").serialize(),
            function (result) {
                $("#id").val(id);
                layer.alert(result.message);
            }
        );
    }
};

var CATE={

    one:function(obj) {
        var id = obj.value;
        if (id==""){
            $("#cate2").html("");
            return;
        }
        CATE.parentId(id,"cate2");
    },

    parentId:function(id ,containerId) {
        var url=managerServiceUrlPrefix + "/cate/by/parent"
        AJAX.get(url ,{parentId:id},function (arr) {
            var option ="<option value=''>请选择</option>";
            for (var i=0;i<arr.length;i++){
                var cate = arr[i];
                option += "<option value='"+cate.id+"'>"+cate.name+"</option>";
            }
            $("#"+containerId).html(option);
        });
    }
};
var MANAGER_EDITOR = {
    createItemImageEditor: function () {
        var E = window.wangEditor;
        itemImageEditor = new E("#itemImageEditor");
        var editor = itemImageEditor;
        editor.customConfig.menus = ['image'];
        editor.customConfig.uploadImgServer = managerServiceUrlPrefix + "/item/upload";
        editor.customConfig.uploadFileName = "imgFile";

        editor.customConfig.uploadImgHooks = {
            customInsert: function (insertImg, result, editor) {
                for (var i = 0; i < result.data.length; i++) {
                    editor.txt.append("<img src='" + result.data[i] + "' style='width:150px;height:120px; margin:10px'>");
                }
            },
            success: function (xhr, editor, result) {
                for (var i = 0; i < result.data.length; i++) {
                    images.push(result.data[i]);
                }
                // alert(images.join(;));
            }
        };

        editor.create();
    },
    createItemRemarkEditor: function (id) {
        var E = window.wangEditor;
        itemRemarkEditor = new E(id);
        var editor = itemRemarkEditor;
        editor.customConfig.uploadImgServer = managerServiceUrlPrefix + "/item/upload";
        editor.customConfig.uploadFileName = "imgFile";
        editor.create();
    }
};

var CART={

    addCart:function()  {
        var url = "http://api.shop.com/cart/add/";
        AJAX.postWithCookie(
            url,
            {
                id:$("#id").val()
                // num:1
            },
            function (result) {
            if (result.code == "401") {
                // alert(401);
                AJAX.html("http://sso.shop.com/login.html", function (html) {
                    layer.open({
                        type: 1,
                        area: ['500px', '300px'],
                        content: html
                    });
                });
            } else {
                layer.alert(result.message);
            }
        });
    },

    update: function (num, id) {
        var input = $("#" + id);
        num = Number(num);
        var quantity = Number(input.val());
        if (num === -1 && quantity === 1) {
            layer.alert("不能再减了");
            return;
        }
        var url = "http://api.shop.com/cart/add";
        AJAX.postWithCookie(url, {
            id: id,
            num: num
        }, function (result) {
            if (result.code == "200") {
                layer.alert(result.message);
                //修改页面上input框内的数量
                input.val(quantity + num);
            } else {
                layer.alert(result.message);
            }
        });
    },

    delete: function (id) {
        var url = "http://api.shop.com/cart/delete";
        layer.confirm('is not?', function (index) {
            AJAX.postWithCookie(url, {id: id}, function (result) {
                if (result.code == "200") {
                    layer.alert(result.message);
                    $("#tr_" + id).remove();
                    var arr = $("#table").find("tr");
                    if (arr.length == 1) {
                        $("#table").html("<tr><td>空空如也</td></tr>");
                        $("#cacuBtn").hide();
                    }
                } else {
                    layer.alert(result.message);
                }
                layer.close(index);
            });
        });
    }

};

var SSO={
    login: function() {
    var url = "http://api.shop.com/sso/login";
    AJAX.postWithCookie(url,$("#loginForm").serialize(),function (result) {
        if (result.code='500'){
            alert(result.message);
        }else {
            alert("OK!!");
            layer.closeAll();
        }
    });
}
};
var MANAGER_TABLE = {
    init: function () {
        $('#table').bootstrapTable({
            url: managerServiceUrlPrefix + '/item',
            pagination: true,
            sidePagination: "server",    //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1,                      //初始化加载第一页，默认第一页,并记录
            //pageSize: rows,                   //每页的记录行数（*）
            pageList: [5, 10, 20],              //可供选择的每页的行数（*）
            columns: [{
                field: 'image',
                title: '图片',
                formatter: function (value) {
                    return "<img width='100' height='80' src='" + value + "'>";
                }
            }, {
                field: 'id',
                title: 'ID'
            }, {
                field: 'name',
                title: '名称'
            }, {
                field: 'price',
                title: '价格'
            }, {
                //field: 'cateId',
                field: 'cateName',
                title: '分类'
            }, {
                field: 'num',
                title: '库存'
            }, {
                field: 'created',
                title: '日期',
                formatter: function (value) {
                    return formatDate(value, "yyyy-MM-dd HH:mm:ss");
                }
            }]
        });
    }
};