function doAjax(method, dataType, url, data, successFunction) {
    var ajax_timeout = 15 * 1000;
    var layerLoadIndex;
    $.ajax({
        beforeSend: function () {
            layerLoadIndex = layer.load(3, {
                time: ajax_timeout
            });
        },
        complete: function () {
            layer.close(layerLoadIndex);
        },
        cache: false,
        data: data,
        dataType: dataType,
        error: function (xhr, status, error) {
            if ("timeout" == status) {
                layer.alert("_请求超时_");
            } else if ("error" == status) {
                layer.alert("_请求错误_");
            } else if ("abort" == status) {
                layer.alert("_请求中止_");
            } else if ("parsererror" == status) {
                layer.alert("_解析错误_");
            } else {
                layer.alert("_未知错误_");
            }
        },
        global: false,
        success: successFunction,
        timeout: ajax_timeout,
        type: method,
        url: url
    });
}

function doAjaxWithCookie(method, dataType, url, data, successFunction) {
    $.ajax({
        data: data,
        dataType: dataType,
        success: successFunction,
        type: method,
        url: url,
        // 允许跨域
        crossDomain: true,
        // 允许携带凭证 (cookie)
        xhrFields: {withCredentials: true}
    });
}

var AJAX = {
    html: function (url, successFunction) {
        doAjax("GET", "html", url, {}, successFunction);
    },
    get: function (url, data, successFunction) {
        doAjax("GET", "json", url, data, successFunction);
    },
    post: function (url, data, successFunction) {
        doAjax("POST", "json", url, data, successFunction);
    },
    put: function (url, data, successFunction) {
        doAjax("PUT", "json", url, data, successFunction);
    },
    delete: function (url, data, successFunction) {
        doAjax("DELETE", "json", url, data, successFunction);
    },
    postWithCookie: function (url, data, successFunction) {
        doAjaxWithCookie("POST", "json", url, data, successFunction);
    }
}

function formatDate(time, format) {
    var t = new Date(time);
    var tf = function (i) {
        return (i < 10 ? '0' : '') + i
    };
    // "yyyy-MM-dd HH:mm:ss"
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
            case 'yyyy':
                return t.getFullYear();
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
}