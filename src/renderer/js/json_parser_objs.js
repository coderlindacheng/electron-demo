//管理页面的大对象
const genJsonHelper = {
    template: { main: {} },//模板的clone方法,要注意的是模板里面存的一定是队列,而且在clone的时候,嵌套队列会被移除
    json: {},//当前的json字符串
    toAddCount: {},//存放全局的可增加实体的自增id
    pushInfo: undefined//推送数据的类型
};

function defaultPush(msg) {
    return JSON.stringify({
        "type": this.type,
        "msg": msg
    });
}

const defaultUrl = "http://localhost:8888/dev/jsonTest"

//推送类型,
const PUSH_INFO = {
    COMPANY_INFO: {
        url: defaultUrl,
        type: "company_info",
        pushJson: defaultPush,
        initObj: getCompanyInfoDto,
        option: function () { return `<option value=\"${this.type}\">公司信息</option>` }
    },
    COUNTRY_INFO: {
        url: defaultUrl,
        type: "county_info",
        pushJson: defaultPush,
        initObj: getCountryInfoDto,
        option: function () { return `<option value=\"${this.type}\">国家信息</option>` }
    }
};

const SYNC_FIELD = ["id"];

if (Object.freeze) {
    Object.freeze(PUSH_INFO);
    Object.freeze(SYNC_FIELD);
}

//格式化时间
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

//DTO模板
function getCompanyInfoDto() {
    return JSON.parse(`{
        "id": "",
        "companyName": "",
        "companyAddress": "",
        "apartments":[{
            "id": "",
            "name": "",
            "groups":[{
                "id": "",
                "name": "",
                "members":[
                    {
                        "id": "",
                        "firstName": "",
                        "lastName": "",
                        "phoneNum":""
                    }
                ]
            }]
        }]
    }`);
}

//DTO模板
function getCountryInfoDto() {
    return JSON.parse(`{
        "id": "",
        "countryName": "",
        "longitude": "",
        "longitude": "",
        "latitude": "",
        "timeZone": "",
        "province":[{
            "id": "",
            "name": "",
            "city":[{
                "id": "",
                "name": "",
                "block":[
                    {
                        "id": "",
                        "name": ""
                    }
                ]
            }]
        }]
    }`);
}