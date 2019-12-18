$(function () {
    if (Object.freeze){
        Object.freeze(PUSH_TYPE);
        Object.freeze(SYNC_FIELD);
    }
});

//管理页面的大对象
var genJsonHelper = {
    template: {main: {}},//模板敌营的clone方法,要注意的是模板里面存的一定是队列,而且在clone的时候,嵌套队列会被移除
    json: "",//当前的json字符串
    toAddCount: {},//存放全局的可增加实体的自增id
    type: ""//推送数据的类型
};

//推送类型,枚举
var PUSH_TYPE = {
    OPERATION_WAYBILL: "operation.waybill",
    ACKBILL_RECEIVE: "ackbill",
    ACKBILL_WBEP: "ackbill.wbep",
    PKG_STATE: "package.state",
};

var SYNC_FIELD = ["waybillNo"];

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

//包裹状态DTO模板
function getPkgStateDto(){
    return JSON.parse(`{
        "id": "",
        "packageNo": "",
        "packageStatus": "",
        "eventCode": "",
        "operateCode": "",
        "operateReasonCode": "",
        "operateTm": "",
        "operateEmpCode": "",
        "operateZoneCode": "",
        "responseType": "",
        "responseCode": "",
        "responseDescription": "",
        "sysSource": "FVP-",
        "createTm": "",
        "extendInfoList": [
            {
                "key": "",
                "value": ""
            }
        ]
}`);
}

//回单dto模板
function getAckDto() {
    return JSON.parse(`{
    "deliverEmpCode": "",
    "subscriberName": "",
    "waybillNo": "",
    "clientCode": "",
    "destZoneCode": "",
    "signinTm": "",
    "extAttrJson": "",
    "deliveredType": "",
    "realWeightQty": "",
    "inputerEmpCode": "",
    "waybillFeeDtoList": [
        {
            "waybillNo": "",
            "feeTypeCode": "",
            "feeAmt": "",
            "ticketNo": "",
            "ticketType": "",
            "ticketKind": "",
            "ticketPurpose": "",
            "currencyCode": "",
            "gatherZoneCode": "",
            "paymentTypeCode": "",
            "paymentChangeTypeCode": "",
            "customerAcctCode": "",
            "valutionAcctCode": "",
            "ticketOffsetAmt": "",
            "isOnlineDeduct": ""
        }
    ],
    "waybillServiceDtoList": [
        {
            "waybillNo": "",
            "serviceProdCode": "",
            "attribute1": "",
            "attribute2": "",
            "attribute3": "",
            "attribute4": "",
            "attribute5": ""
        }
    ],
    "waybillMarkDtoList": [
        {
            "waybillNo": "",
            "labellingPattern": ""
        }
    ],
    "waybillAdditionDtoList": [
        {
            "waybillNo": "",
            "additionValues": "",
            "additionKey": ""
        }
    ]
}`);
}

//wbep回单dto模板
function getWbepAckDto() {
    return JSON.parse(`{
    "opType":"",
	"sourceZoneCode":"",
	"oneselfPickupFlg":"",
	"consignorCompName":"",
	"consignorPhone":"",
	"consignorContName":"",
	"consignorMobile":"",
	"addresseeCompName":"",
	"addresseePhone":"",
	"addresseeContName":"",
	"addresseeMobile":"",
	"meterageWeightQty":"",
	"innerParcelFlg":"",
	"frangibleParcelFlg":"",
	"trustParcelFlg":"",
	"logId":"",
	"waybillNo":"",
	"destZoneCode":"",
	"consignorAddr":"",
	"addresseeAddr":"",
	"realWeightQty":"",
	"quantity":"",
	"freeParcelFlg":"",
	"preCustomsDt":"",
	"consignedTm":"",
	"signinTm":"",
	"waybillRemk":"",
	"customsBatchs":"",
	"auditedFlg":"",
	"inputTm":"",
	"auditedTm":"",
	"suppTypeCode":"",
	"boxTypeCode":"",
	"cargoTypeCode":"",
	"limitTypeCode":"",
	"inputTypeCode":"",
	"unifiedCode":"",
	"modifiedTm":"",
	"deleteFlg":"",
	"versionNo":"",
	"lockVersionNo":"",
	"otherNodeFlg":"",
	"tbOrderNo":"",
	"tbOrderType":"",
	"freeTicketNo":"",
	"selfSendFlg":"",
	"sourceArea":"",
	"countryCode":"",
	"isThirdFlg":"",
	"isCreditFlg":"",
	"volume":"",
	"consultCode":"",
	"invoiceNo":"",
	"isCredit":"",
	"airportCode":"",
	"cvsCode":"",
	"unitOfWeight":"",
	"refundFreeFlg":"",
	"newInputTm":"",
	"hvalueBoxType":"",
	"codBillFlg":"",
	"codType":"",
	"totalConsValue":"",
	"consigneeEmpCode":"",
	"deliverEmpCode":"",
	"subscriberName":"",
	"inputerEmpCode":"",
	"auditerEmpCode":"",
	"customsTypeCode":"",
	"distanceTypeCode":"",
	"transportTypeCode":"",
	"expressTypeCode":"",
	"inputedZoneCode":"",
	"needSignedBackFlg":"",
	"signedBackWaybillNo":"",
	"addresseeAddrNative":"",
	"modifiedEmpCode":"",
	"hasServiceProdFlg":"",
	"ackbillTypeCode":"",
	"sendDataCenter":"",
	"routeDataCenter":"",
	"twinvoiceTypeCode":"",
	"selfSendDiscount":"",
	"consignorPostalCode":"",
	"addresseePostalCode":"",
	"consValueCurrencyCode":"",
	"consignorTaxNo":"",
	"sourceCountryCode":"",
	"masterAirWaybillNo":"",
	"transferParcelFlg":"",
	"inputTimeByGMT":"",
	"modifyDateByGMT":"",
	"auditedTmByGMT":"",
	"sourceWaybillNo":"",
	"temperatureRange":"",
	"isSalePromotion":"",
	"isB2C":"",
	"goodsDealType":"",
	"remarkThird":"",
	"billLong":"",
	"billWidth":"",
	"billHigh":"",
	"productCode":"",
	"autoFeeFlag":"",
	"isHis":"",
	"suppResonCode":"",
	"distances":"",
	"isMsgPay":"",
	"isInterior":"",
	"cClient":"",
	"taskId":"",
	"agentNo":"",
	"sendRemarkTwo":"",
	"waybillFees":[
		{
			"logId":"",
			"waybillNo":"",
			"inputTm":"",
			"inputTypeCode":"",
			"versionNo":"",
			"lockVersionNo":"",
			"newInputTm":"",
			"isHis":"",
			"waybillLogId":"",
			"gatherZoneCode":"",
			"paymentTypeCode":"",
			"settlementTypeCode":"",
			"paymentChangeTypeCode":"",
			"customerAcctCode":"",
			"bizOwnerZoneCode":"",
			"destCurrenyCode":"",
			"valutionAcctCode":"",
			"attr1":"",
			"feeTypeCode":"",
			"feeAmt":"",
			"currencyCode":"",
			"gatherEmpCode":"",
			"sourceFeeAmt":"",
			"exchangeRate":"",
			"gstFeeAmt":"",
			"refundFeeAmt":"",
			"feeAmtInd":"",
			"feeIndType":""
		}
	],
	"waybillServices":[
		{
			"logId":"",
			"waybillNo":"",
			"inputTm":"",
			"versionNo":"",
			"lockVersionNo":"",
			"newInputTm":"",
			"waybillLogId":"",
			"attribute1":"",
			"attribute2":"",
			"attribute3":"",
			"attribute4":"",
			"attribute5":"",
			"serviceProdCode":""
		}
	],
	"waybillConsigns":[
		{
			"logId":"",
			"waybillNo":"",
			"inputTm":"",
			"versionNo":"",
			"lockVersionNo":"",
			"newInputTm":"",
			"waybillLogId":"",
			"productRecordNo":"",
			"consId":"",
			"qtyUnit":"",
			"consName":"",
			"consQty":"",
			"weightQty":"",
			"consValue":"",
			"hsCode":""
		}
	],
	"waybillChilds":[
		{
			"logId":"",
			"waybillNo":"",
			"inputTm":"",
			"versionNo":"",
			"lockVersionNo":"",
			"newInputTm":"",
			"waybillChildId":"",
			"waybillLogId":"",
			"waybillChildNo":""
		}
	],
	"waybillVolumes":[{
			"waybillNo": "",
			"volume": "",
			"volumeId": "",
			"width": "",
			"height": "",
			"tall": ""
        }],
	"waybillAdditionals":[{
			"waybillNo": "",
			"attr044": "",
			"attr045": "",
			"attr046": "",
			"attr047": "",
			"attr048": "",
			"attr049": "",
			"attr050": "",
			"addId": "",
			"attr001": "",
			"attr002": "",
			"attr003": "",
			"attr004": "",
			"attr005": "",
			"attr006": "",
			"attr007": "",
			"attr008": "",
			"attr009": "",
			"attr010": "",
			"attr011": "",
			"attr012": "",
			"attr013": "",
			"attr014": "",
			"attr015": "",
			"attr016": "",
			"attr017": "",
			"attr018": "",
			"attr019": "",
			"attr020": "",
			"attr021": "",
			"attr022": "",
			"attr023": "",
			"attr024": "",
			"attr025": "",
			"attr026": "",
			"attr027": "",
			"attr028": "",
			"attr029": "",
			"attr030": "",
			"attr031": "",
			"attr032": "",
			"attr033": "",
			"attr034": "",
			"attr035": "",
			"attr036": "",
			"attr037": "",
			"attr038": "",
			"attr039": "",
			"attr040": "",
			"attr041": "",
			"attr042": "",
			"attr043": ""
        }]
}`)
}

//红冲模板
function getRedinkDto() {
    return JSON.parse(`{
    "waybillNo": "",
    "sysCode": "",
    "empCode": "",
    "propertyMap": {
        "consignedTm": "",
        "signinTm": "",
        "consigneeEmpCode": "",
        "meterageWeightQty": "",
        "transportTypeCode": "",
        "sourceZoneCode": "",
        "expressTypeCode": "",
        "limitTypeCode": "",
        "destZoneCode": "",
        "distanceTypeCode": "",
        "realWeightQty": "",
        "cargoTypeCode": "",
        "quantity": "",
        "deliverEmpCode": "",
        "subscriberName": "",
        "productCode": "",
        "ackbillTypeCode": "",
        "deliveredType": "",
        "volume": "",
        "billLong": "",
        "billWidth": "",
        "billHigh": "",
        "pkgCurState": ""
    },
    "freightFeeMap": {
        "settlementTypeCode": "",
        "paymentChangeTypeCode": "",
        "paymentTypeCode": "",
        "customerAcctCode": "",
        "feeAmt": "",
        "otherFeeAmt": "",
        "currencyCode": "",
        "gatherZoneCode": "",
        "gatherEmpCode": "",
        "ticketNo": "",
        "ticketOffsetAmt": "",
        "ticketType": "",
        "lessCalFee": "",
        "selfSendFee": "",
        "selfPickFee": "",
        "codCustomerAcctCode": ""
    },
    "serviceFeeList": [
        {
            "sourceCodeFeeAmt": "",
            "paymentTypeCode": "",
            "customerAcctCode": "",
            "sourceCurrencyCode": "",
            "feeAmt": "",
            "attribute5": "",
            "attribute4": "",
            "settlementTypeCode": "",
            "paymentChangeTypeCode": "",
            "serviceProdCode": "",
            "attribute1": "",
            "operationType": "",
            "attribute3": "",
            "attribute2": "",
            "gatherZoneCode": "",
            "paymentTypeCode": "",
            "currencyCode": ""
        }
    ],
    "signFieldMap": {
        "TRANSFER_PARCEL_FLG": "",
        "FREE_PARCEL_FLG": "",
        "SELF_SEND_FLG": "",
        "ONESELF_PICKUP_FLG": "",
        "IS_INTERIOR": "",
        "INNER_PARCEL_FLG": "",
        "TRUST_PARCEL_FLG": "",
        "GO_UP_STAIRS_FLG": "",
        "FRANGIBLE_PARCEL_FLG": "",
        "DETAIL_FLG": ""
    },
    "additionFieldMap":{
        "INPUT_TM_GMT": "",
        "AIRPORT_CODE": "",
        "SGS_UPLOAD_TYPE_CODE": "",
        "BAR_50_SCAN_TM": "",
        "DISPATCH_TYPE": "",
        "PICK_UP": "",
        "IS_MOP_IMPORT": "",
        "INPUTER_EMP_CODE": "",
        "IS_ONLINE_DEDUCT": "",
        "DELIVER_GEN_TM": "",
        "WAYBILL_NO_TYPE": "",
        "MANY_RETURN_LESS_ADD": "",
        "TB_ORDER_NO": "",
        "CVS_CODE": "",
        "RECEIPT_CVS_CODE": "",
        "TEMPERATURE_RANGE": "",
        "SOURCE_WAYBILL_NO": "",
        "FREE_TICKET_NO": "",
        "DIFFERENCE": "",
        "TB_ORDER_TYPE": "",
        "SUPP_TYPE_CODE": "",
        "TWINVOICE_TYPE_CODE": "",
        "PICKUP": "",
        "OW_PICKUP_VERSION_NO": "",
        "APPLE_RMA": "",
        "CIRCLE_FIX_PRICE_INFO": ""
    }
}`);
}

//操作运单模板
function getOperWaybillDto() {
    return JSON.parse(`{
    "versionNo": "",
    "waybillNo": "",
    "destZoneCode": "",
    "realWeightQty": "",
    "quantity": "",
    "consignedTm": "",
    "cargoTypeCode": "",
    "limitTypeCode": "",
    "volume": "",
    "billLong": "",
    "billWidth": "",
    "billHigh": "",
    "sourceZoneCode": "",
    "meterageWeightQty": "",
    "consigneeEmpCode": "",
    "distanceTypeCode": "",
    "transportTypeCode": "",
    "expressTypeCode": "",
    "lockVersionNo": "",
    "unitWeight": "",
    "consValue": "",
    "productCode": "",
    "waybillRemark": "",
    "orderNo": "",
    "updateTm": "",
    "expectStartTm": "",
    "provider": "",
    "createTm": "",
    "extJson": "",
    "actionJson": "",
    "updateSource": "",
    "genOrderFlag": "",
    "signinTm": "",
    "clientCode": "",
    "currentSource": "",
    "consValueCurrencyCode": "",
    "expectFinishTm": "",
    "dynExpcDeliveryTm": "",
    "deliverEmpCode": "",
    "subscriberName": "",
    "operationWaybillCustoms": {
        "waybillNo": "",
        "orderNo": "",
        "updateTm": "",
        "createTm": "",
        "extJson": "",
        "customsTypeCode": "",
        "consignorPostalCode": "",
        "addresseePostalCode": "",
        "consignorTaxNo": "",
        "twinvoiceTypeCode": "",
        "exportId": "",
        "customsBatchs": "",
        "preCustomsDt": "",
        "sourcearea": "",
        "countryCode": "",
        "unifiedCode": "",
        "consultCode": ""
    },
    "operationWaybillMarkList": [
        {
            "waybillNo": "",
            "orderNo": "",
            "updateTm": "",
            "createTm": "",
            "extJson": "",
            "labellingPattern": "",
            "labellingId": ""
        }
    ],
    "operationWaybillFeeList": [
        {
            "waybillNo": "",
            "orderNo": "",
            "updateTm": "",
            "createTm": "",
            "extJson": "",
            "gatherZoneCode": "",
            "paymentTypeCode": "",
            "settlementTypeCode": "",
            "paymentChangeTypeCode": "",
            "customerAcctCode": "",
            "bizOwnerZoneCode": "",
            "sourceCodeFeeAmt": "",
            "destCurrencyCode": "",
            "valutionAcctCode": "",
            "feeTypeCode": "",
            "feeAmt": "",
            "currencyCode": "",
            "gatherEmpCode": "",
            "exchangeRate": "",
            "feeAmtInd": "",
            "feeIndType": ""
        }
    ],
    "operationWaybillAdditionList": [
        {
            "waybillNo": "",
            "orderNo": "",
            "updateTm": "",
            "createTm": "",
            "extJson": "",
            "additionalValues": "",
            "additionalId": "",
            "additionalKey": ""
        }
    ],
    "operationWaybillCustomsList": [
        {
            "waybillNo": "",
            "orderNo": "",
            "updateTm": "",
            "createTm": "",
            "extJson": "",
            "customsTypeCode": "",
            "consignorPostalCode": "",
            "addresseePostalCode": "",
            "consignorTaxNo": "",
            "twinvoiceTypeCode": "",
            "exportId": "",
            "customsBatchs": "",
            "preCustomsDt": "",
            "sourcearea": "",
            "countryCode": "",
            "unifiedCode": "",
            "consultCode": ""
        }
    ],
    "operationWaybillServiceList": [
        {
            "waybillNo": "",
            "orderNo": "",
            "updateTm": "",
            "createTm": "",
            "extJson": "",
            "serviceProdCode": "",
            "attribute3": "",
            "attribute4": "",
            "attribute5": "",
            "attribute1": "",
            "attribute2": ""
        }
    ],
    "optWaybillAdditionExtList": [
        {
            "waybillNo": "",
            "orderNo": "",
            "updateTm": "",
            "extJson": "",
            "extId": "",
            "attr001": "",
            "attr002": "",
            "attr003": "",
            "attr004": "",
            "attr005": "",
            "attr006": "",
            "attr007": "",
            "attr008": "",
            "attr009": "",
            "attr010": "",
            "attr011": "",
            "attr012": "",
            "attr013": "",
            "attr014": "",
            "attr015": "",
            "attr016": "",
            "attr017": "",
            "attr018": "",
            "attr019": "",
            "attr020": "",
            "attr021": "",
            "attr022": "",
            "attr023": "",
            "attr024": "",
            "attr025": "",
            "attr026": "",
            "attr027": "",
            "attr028": "",
            "attr029": "",
            "attr030": "",
            "attr031": "",
            "attr032": "",
            "attr033": "",
            "attr034": "",
            "attr035": "",
            "attr036": "",
            "attr037": "",
            "attr038": "",
            "attr039": "",
            "attr040": "",
            "attr041": "",
            "attr042": "",
            "attr043": "",
            "attr044": "",
            "attr045": "",
            "attr046": "",
            "attr047": "",
            "attr048": "",
            "attr049": "",
            "attr050": "",
            "createTime": ""
        }
    ]
}`);
}