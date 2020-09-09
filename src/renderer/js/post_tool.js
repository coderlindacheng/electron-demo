$(function () {
    $("#sendUrl").val(postUrl);
    $("#psot_content").val(postContent)
});


var postUrl;
var postContent;
function saveUrl(url){
    postUrl = $(url).val();
}

function savePostContent(content){
    postContent=$(content).val();
}

/**
 * 推送数据到服务器
 *
 * @param btn
 */
function sendData(btn) {
        $.ajax({
            type: 'post',
            url: $("#sendUrl").val(),
            data: $("#psot_content").val(),
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            async: true,
            success: function (data) {
                $("#psot_res").val(JSON.stringify(data));
            },
            error: function (request, textStatus, errorThrown) {
                alert(`发送数据失败`);
                $("#psot_res").val(`status=${JSON.stringify(request.status)},readyState=${JSON.stringify(request.readyState)},textStatus=${JSON.stringify(textStatus)}`);
            }
        });
}