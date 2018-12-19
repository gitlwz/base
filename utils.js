/**
 * 文件下载
 * @param url
 * @param params
 * @param option
 */
function download(url, params, option) {
    if (option == undefined || option.type == "form") {
        var form = document.createElement('form');
        form.setAttribute("method", "get");
        form.setAttribute("action", url);
        for (var key in params) {
            var item = document.createElement("input");
            item.setAttribute("name", key);
            item.setAttribute("value", params[key]);
            form.appendChild(item);
        }
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    } else {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("authority", AuthToken.getAuthenticationStr());
        xhr.setRequestHeader("icop-token", AuthToken.getToken());
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var filename = xhr.getResponseHeader("File-Name");
                if (filename != null) {
                    var _url = window.URL.createObjectURL(this.response);
                    var a = document.createElement('a');
                    a.href = _url;
                    a.download = decodeURIComponent(filename);
                    a.click();
                    window.URL.revokeObjectURL(_url);
                } else if (option.onError) {
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        option.onError(event.target.result);
                    };
                    reader.readAsText(this.response);
                }
            }
        };
        xhr.send(JSON.stringify(params));
    }
}





/**
 * 文件上传
 *
 * @param datas
 * @param url
 * @param callback
 */
function upload(datas, url, callback) {
    var file = document.createElement("input");
    file.setAttribute("type", "file");
    document.body.appendChild(file);
    file.onchange = doUpload;
    file.click();

    function doUpload() {
        var form = new FormData();
        form.append("file", file.files[0]);
        for (var key in datas) {
            form.append(key, datas[key]);
        }
        var xhr = new XMLHttpRequest();
        xhr.open("post", url, true);
        xhr.setRequestHeader("authority", AuthToken.getAuthenticationStr());
        xhr.setRequestHeader("icop-token", AuthToken.getToken());
        xhr.onload = uploadComplete;
        xhr.onerror = uploadFailed;
        xhr.send(form);
    }

    function uploadComplete(event) {
        document.body.removeChild(file);
        var back = event.currentTarget.response;
        callback(JSON.parse(back));
    }

    function uploadFailed() {
        document.body.removeChild(file);
    }
}



