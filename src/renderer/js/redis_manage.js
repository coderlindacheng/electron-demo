var Redis = require("ioredis");
var sitRedisConfig = `{
    "sentinels": [
        {"host": "shiva-oms-sws1.cachesit.sfdc.com.cn", "port": "8001"},
        {"host": "shiva-oms-sws2.cachesit.sfdc.com.cn", "port": "8001"},
        {"host": "shiva-oms-sws3.cachesit.sfdc.com.cn", "port": "8001"}
    ],
    "name": "SHIVA_OMS_SWS_REDIS_C01",
    "password": "gmjisnkpp8jtwqsx"
}`;
var devRedisConfig = `{
    "sentinels": [
        {"host": "Qv9138Nt-1.cachesit.sfcloud.local", "port": "8001"},
        {"host": "Qv9138Nt-2.cachesit.sfcloud.local", "port": "8001"},
        {"host": "Qv9138Nt-3.cachesit.sfcloud.local", "port": "8001"}
    ],
    "name": "SHIVA-OMS-SWS_Qv9138Nt_CLUSTER01",
    "password": "AhXv30rElUfc"
}`;
var redis;
var dev = true;
$('[data-toggle="tooltip"]').tooltip();
initRedisConnect(devRedisConfig);

function initRedisConnect(conf, setText) {
    if (redis !== undefined) {
        redis.disconnect();
    }
    redis = new Redis(JSON.parse(conf));
    if (!setText) {
        $("#redisConfig").val(conf);
    }
}

function switchConnect(btn) {
    let $btn = $(btn);
    $btn.empty();
    if (dev) {
        dev = false;
        initRedisConnect(sitRedisConfig)
        $btn.append("测试环境");
    } else {
        dev = true;
        initRedisConnect(devRedisConfig)
        $btn.append("研发环境");
    }
}

function onSearch() {
    let key = $("#keyPrefix").val() + $("#keyContent").val();
    redis.get(key, buildTable);
}

function buildTable(err, result) {
    let showData = $("#showData");
    showData.empty();
    if (err !== undefined && err !== null) {
        tips(`<strong>查询失败:</strong> <strong>${err}</strong>`);
        return;
    }
    if (result === undefined || result === null || result.length === 0) {
        tips(`<strong>查询不到任何记录</strong>`);
        return;
    }
    let parse = JSON.parse(result);
    if (!(parse instanceof Array) || parse.length === 0) {
        tips(`<strong>查询到的数据不是数组:</strong><p>${result}</p>`);
        return;
    }
    let title = [];
    let dataSet = [];
    $.each(parse, function (index, rowObj) {
        let rowData = [];
        if (index === 0) {
            for (let k in rowObj) {
                title.push({title: k});
            }
        }
        for (let k in rowObj) {
            rowData.push(rowObj[k]);
        }
        dataSet.push(rowData);
    });

    //DataTable只能创建一次,而且清不调,只能在最上层清楚,而且这个table得严格按照这个格式去显示,很蛋疼
    showData.append(`<table class="table table-bordered" id="dataTable" width="100%" cellspacing="0"></table>`);
    $('#dataTable').DataTable({
        data: dataSet,
        columns: title
    });
}

function onDel() {
    let key = $("#keyPrefix").val() + $("#keyContent").val();
    redis.del(key, function (err, result) {
        if (err !== undefined && err != null) {
            tips(`<strong>删除失败:</strong><strong>${err}</strong>`);
        } else {
            tips(`<strong>删除了${result}条记录</strong>`);
        }
    });
}

function tips(msg) {
    let delResult = $("#delResult");
    delResult.empty();
    delResult.append(msg);
    $('#OperTips').modal('show');
}

