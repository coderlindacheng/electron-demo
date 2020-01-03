var Holmes = require("holmes.js");
var holmes;
$(function () {
    pickTemplate();
    $("#select_type").trigger("change");
    $("#operMain").sticky({topSpacing:0,zIndex:1});
});

/**
 * 每次动态构建元素的时候,就要从新初始化一次
 */
function initHolmes() {
    let toSearch;
    if (holmes !== undefined) {
        toSearch = holmes.inputString();
    }

    holmes = Holmes({
        input: '.search input', // default: input[type=search]
        find: '.results div', // querySelectorAll that matches each of the results individually
        // onHidden: function (el) {
        //         //     let $el = $(el);
        //         //     if ($el.hasClass("delbtn")){
        //         //         $el.removeClass("hidden");
        //         //     }
        //         // }
    });
    holmes.start();
    if (toSearch !== undefined) {
        holmes.setInput(toSearch);
        holmes.search();//触发搜索
    }
}
/**
 * json解析过滤器
 *
 * @param k
 * @param v
 * @returns {*} 返回 undefined 就是删除对应键值对的内容,但是要注意多试,里面坑蛮多的
 */
function jsonParseFilter(k, v) {
    if (isNeedlessObj(v)) {
        return undefined;
    } else if (isArray(v)) {
        let newV = [];
        for (let item of v) {
            if (!isNeedlessObj(item)) {
                newV.push(item);
            }
        }
        if (newV.length > 0) {
            return newV;
        } else {
            return undefined;
        }
    } else {
        for (let k2 in v) {
            if (!isNeedlessObj(v[k2])) {
                return v;
            }
        }
        return undefined;
    }
}

/**
 *依据文框的json值构建表单
 *
 * @param textarea 文本框实体
 */
function buildForm(textarea) {
    let toDraw = genJsonHelper.template.main();
    let toParse;
    if (textarea !== undefined && textarea.value !== undefined && textarea.value !== "") {
        try {
            toParse = JSON.parse(textarea.value, jsonParseFilter);
        } catch (e) {
            alert(e)
        }
    }
    buildTargetDto(toParse, toDraw);
    let genHtml = draw(toDraw);
    let fieldArea = $("#fields_area");
    fieldArea.empty();
    fieldArea.append(genHtml);
    syncFields();
    if (textarea !== undefined) {
        let json = JSON.stringify(toDraw, jsonParseFilter);
        let type = genJsonHelper.type;
        genJsonHelper.json[type] = json === undefined ? "" : json;
        textarea.value = genJsonHelper.json[type];
    }
    $('[data-toggle="tooltip"]').tooltip();
    initHolmes();
}

/**
 * 表单的字段值变动的时候从新生成json字符串到文本框
 */
function onChangeForm(clazz, input) {
    let jqueryInput = $(input);
    let inputV = jqueryInput.val();
    jqueryInput.val(inputV.replace(/\\/g, ''));
    if (clazz !== undefined && input !== undefined && $.inArray(clazz, SYNC_FIELD) >= 0) {
        $.each($(`input.${clazz}`), function (index, item) {
            $(item).val($(input).val());
        })
    }

    /**这个地方必须得这么写才能得到期望的json串
     从obj序列化到json串的时候是自顶向下的通过jsonParseFilter移除不需要的字段时,移除一次是移除不干净的
     如dto [{"a":""},{"a":""}]
     期望返回的json串是过滤掉空字符串所以期望是直接返回空串
     但是如果只执行一次JSON.stringify得到的结果将是 [null,null]
     */
    let obj = $('#fields_to_json').serializeJSON({useIntKeysAsArrayIndex: true});
    let json = JSON.stringify(obj, jsonParseFilter);
    obj = JSON.parse(json, jsonParseFilter);
    json = JSON.stringify(obj, jsonParseFilter);
    /** *************************************************************/
    let type = genJsonHelper.type;
    genJsonHelper.json[type] = json === undefined || json === null ? "" : json;
    $('#to_json').val(genJsonHelper.json[type]);
}

/**
 * 依据模本
 * @param source
 * @param target
 * @param prefix
 */
function buildTargetDto(source, target, prefix) {
    for (let sourceK in source) {
        let targetV = target[sourceK];
        if (targetV === undefined) {
            continue;
        }
        let sourceV = source[sourceK];
        let key;
        if (prefix === undefined) {
            key = sourceK;
        } else {
            key = `${prefix}_${sourceK}`;
        }
        if (isArray(sourceV) && sourceV.length > 0) {
            //构建模板的时候已经决定了只要对应的key存在模板,则模板对应的字段一定为数组
            let template = genJsonHelper.template[key];
            if (template !== undefined) {
                for (let item of sourceV) {
                    let newVar = template();
                    buildTargetDto(item, newVar, key);
                    targetV.push(newVar);
                }
            } else if (isArray(targetV)) {
                target[sourceK] = sourceV.toString();
            }
        } else if (!isNeedlessObj(sourceV) && !isArray(sourceV) && $.type(sourceV) === $.type(targetV)) {
            if (isString(sourceV)) {
                target[sourceK] = sourceV;
            } else {
                buildTargetDto(sourceV, targetV, key);
            }
        }
    }
}

/**
 * 初始化模板
 * @param dto
 */
function initTemplate(dto) {
    initChildTemplate(dto);
    genJsonHelper.template.main = function () {
        return cloneWithoutArray(dto);
    };
}

/**
 * 初始化子模板信息(这个是一个递归的方法)
 * @param dto 需要被解析的模板dto
 * @param prefix 组成模板对应的key时所需前缀
 */
function initChildTemplate(dto, prefix) {
    for (let fieldK in dto) {
        let fieldV = dto[fieldK];
        let key;
        if (prefix === undefined) {
            key = fieldK;
        } else {
            key = `${prefix}_${fieldK}`;
        }
        if (isArray(fieldV) && fieldV.length > 0) {
            if (fieldV.length > 1) {
                panic(`模板中不允许[${key}]的长度大于1`);
            }
            let firstItem = fieldV[0];
            dto[fieldK] = [];

            if (isArray(firstItem)) {
                panic(`模板中不允许[${key}]存在List套List的结构`);
            }
            if (!isString(firstItem) && !$.isEmptyObject(firstItem) && firstItem !== undefined && firstItem !== null) {
                let temp = cloneWithoutArray(firstItem);
                genJsonHelper.template[key] = function () {
                    let target = {};
                    $.extend(target, temp);
                    return target;
                };
                initChildTemplate(firstItem, key);
            }
        } else if ($.isEmptyObject(fieldV) || fieldV === undefined || fieldV === null) {
            //如果模板填的字段是个空对象,则把它变成字符串(例如填了一个"{}"之类的)
            dto[fieldK] = "";
        } else if (!isArray(fieldV) && !isString(fieldV)) {
            initChildTemplate(fieldV, key);
        }
    }
}

/**
 *
 * 利用json信息画出页面(这个是一个递归的方法)
 *
 * @param dto
 * @param namePrefix 组成每个字段html的name属性或可增删实体id的前缀,永远从form格式输出成json字符串
 * @param toAddPrefix html列表区域的id前缀(即可增删实体区域)
 * @returns {string} json组成的html
 */
function draw(dto, namePrefix, toAddPrefix) {
    let toShow = "";
    for (let fieldK in dto) {
        let name;
        let toAddid;
        if (namePrefix !== undefined) {
            name = `${namePrefix}[${fieldK}]`;
            toAddid = `${toAddPrefix}_${fieldK}`
        } else {
            name = fieldK;
            toAddid = name;
        }
        let fieldV = dto[fieldK];

        //如果是Tm结尾的字段,给个系统当前时间
        if (isBlankString(fieldV) && fieldK.endsWith("Tm")) {
            fieldV = new Date().Format("yyyy-MM-dd HH:mm:ss").toString();
            dto[fieldK] = fieldV;
        }
        if (isArray(fieldV) && genJsonHelper.template[toAddid] !== undefined) {
            genJsonHelper.toAddCount[toAddid] = 0;
            toShow += `<div class="col-12 mt-3 ml-5">
                            <div class="row">
                                <a href="##" class="btn btn-dark btn-icon-split" data-toggle="tooltip" data-placement="right" title="点一下新增" onclick="(function(obj) {appendItem('${toAddid}',draw,'${name}');})(this)">
                                            <span class="icon text-white-50">
                                              <i class="fas fa-plus"></i>
                                            </span>
                                            <span class="text">${name}</span>
                                          </a>
                            </div>
                            <div class="row">
                                            <div id ="${toAddid}" class="col-12 delbtn">`;
            for (let item of fieldV) {
                toShow += appendItem(toAddid, draw, `${name}`, item);
            }
            toShow += `</div>
                            </div>
                        </div>`;
        } else if (isString(fieldV) || isArray(fieldV)) {//模板已经把空对象和undefined,null变成了空字符串,所以这里不需要关注了
            toShow += `<div class="col-7">
                                <div class="input-group input-group-sm">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">${fieldK}</span>
                                    </div>
                                    <input id="${name}" name="${name}" type="text" class="${fieldK} form-control col-4" value='${fieldV}' onchange="onChangeForm('${fieldK}',this)">
                                </div>
                            </div>`;
        } else {
            toShow += `<div class="col-12 mt-3 ml-5">
                            <div class="row">
                                <a href="javascript:void(0);" class="btn btn-dark btn-icon-split">
                                            <span class="text">${name}</span>
                                          </a>
                            </div>
                <div class="row">`;
            toShow += draw(fieldV, name, toAddid);
            toShow += `</div>`;
            toShow += `</div>`;
        }
    }
    return toShow;
}

/**
 * 添加实体对应的html到指定id的区域
 *
 * @param toAddid
 * @param draw 递归调用的draw方法
 * @param name 组成每个字段html的name属性或可增删实体id的前缀,永远从form格式输出成json字符串
 * @param toDrawDto 需要被画出来的dto
 * @returns {string} 最后生成的html
 */
function appendItem(toAddid, draw, name, toDrawDto) {
    let toShow = "";
    name = `${name}[${genJsonHelper.toAddCount[toAddid]++}]`;
    toShow += `<div id="${name}" class="row mt-3">`;
    toShow += `<div class="col-12">`;
    toShow += ` <a href="##" class="btn btn-outline-dark btn-circle" data-toggle="tooltip" data-placement="right" title="点一下删除" onclick="(function() {delItem('${name}');})()">
                    <i class="fas fa-minus"></i>
                  </a>`;
    toShow += `</div>`;
    if (toDrawDto === undefined) {
        toShow += draw(genJsonHelper.template[toAddid](), name, toAddid);
    } else {
        toShow += draw(toDrawDto, name, toAddid);
    }
    toShow += `</div>`;

    if (toDrawDto === undefined) {
        $(`#${toAddid}`).append(toShow);
        $('[data-toggle="tooltip"]').tooltip('hide');
        initHolmes();
        syncFields();
        return;
    }
    return toShow;
}

/**
 * 同步指定字段
 */
function syncFields() {
    for (let toSync of SYNC_FIELD) {
        let syncVal = "";
        let target = $(`input.${toSync}`);
        $.each(target, function (index, item) {
            let v = $(item).val();
            if (v !== undefined && !isBlankString(v)) {
                syncVal = v;
                return;
            }
        });
        $.each(target, function (index, item) {
            $(item).val(syncVal);
        });
    }
}

/**
 * 删除实体
 *
 * @param toDelId
 */
function delItem(toDelId) {
    toDelId = toDelId.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
    $(`#${toDelId}`).remove();
    onChangeForm();
}

/**
 * 是否空白字符串
 * @param str 传入的参先保证它是字符串类型(如果非字符串类型则返回false)
 * @returns {boolean}
 */
function isBlankString(str) {
    return str === '' ? true : isString(str) && $.trim(str) === '';
}

/**
 * 是否字符串
 * @param obj
 * @returns {boolean}
 */
function isString(obj) {
    return typeof obj === "string";
}

function isObject(obj) {
    return obj instanceof Object;
}

function isArray(obj) {
    return obj instanceof Array;
}

function isNeedlessObj(obj) {
    return obj === undefined || isBlankString(obj) || $.isEmptyObject(obj) || obj === null;
}

function panic(msg) {
    alert(msg);
    throw msg;
}

/**
 * 克隆实体
 * @param source
 */
function cloneWithoutArray(source) {
    let target = {};
    $.extend(target, source);
    for (let k in target) {
        let item = target[k];
        if (isArray(item)) {
            target[k] = [];
        }
    }
    return target;
}

/**
 * 部署选择模板触发器
 */
function pickTemplate() {
    $("#select_type").on("change",function () {
        genJsonHelper.type = $(this).val();
        if (PUSH_TYPE.OPERATION_WAYBILL === genJsonHelper.type){
            initForm(getOperWaybillDto());
        }else if (PUSH_TYPE.ACKBILL_RECEIVE === genJsonHelper.type){
            initForm(getAckDto());
        }else if (PUSH_TYPE.ACKBILL_WBEP === genJsonHelper.type){
            initForm(getWbepAckDto());
        }else if (PUSH_TYPE.PKG_STATE === genJsonHelper.type){
            initForm(getPkgStateDto());
        }
    })
}

/**
 * 初始化表单
 * @param dto
 */
function initForm(dto) {
    if (dto === undefined || dto === null || $.isEmptyObject(dto) || (isArray(dto) && dto.length <= 0)) {
        alert("请配置合法的模板")
    }
    initTemplate(dto);
    buildForm();
    $('#to_json').val(genJsonHelper.json[genJsonHelper.type])
}

/**
 * 推送数据到服务器
 *
 * @param btn
 */
function sendData(btn) {
    let type = genJsonHelper.type;
    if (!isBlankString(genJsonHelper.json[type]) && genJsonHelper.json !== "{}" && genJsonHelper.json[type] !== undefined && genJsonHelper.json[type] !== null) {
        $.ajax({
            type: 'post',
            url: $("#sendUrl").val(),
            data: JSON.stringify({
                "type": type,
                "msg": genJsonHelper.json[type]
            }),
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            async: true,
            success: function (data) {
                alert(data.value);
            },
            error: function (request, textStatus, errorThrown) {
                console.error(`发送数据失败`);
                console.error(`status=${request.status},readyState=${request.readyState},textStatus=${textStatus}`);
            }
        });
    } else {
        $(btn).popover("不能推送空的报文");
    }

}