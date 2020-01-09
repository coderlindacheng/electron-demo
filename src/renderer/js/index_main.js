global();
$(function () {
    $.get("sidebar.html", function (data) {
        $("#accordionSidebar").prepend(data);
    });
    $("#mainPage").load("../../renderer/html/json_parser.html");
});

/**
 * 加载一些需要影响的全局js
 */
function global() {
    $.getScript("../js/json_parser_objs.js");
}

