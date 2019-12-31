//管理页面的大对象
const genJsonHelper = {
    template: {main: {}},//模板敌营的clone方法,要注意的是模板里面存的一定是队列,而且在clone的时候,嵌套队列会被移除
    json: {},//当前的json字符串
    toAddCount: {},//存放全局的可增加实体的自增id
    type: ""//推送数据的类型
};

//推送类型,枚举
const PUSH_TYPE = {
    OPERATION_WAYBILL: "operation.waybill",
    ACKBILL_RECEIVE: "ackbill",
    ACKBILL_WBEP: "ackbill.wbep",
    PKG_STATE: "package.state",
};

const SYNC_FIELD = ["waybillNo"];

if (Object.freeze){
    Object.freeze(PUSH_TYPE);
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

//包裹状态DTO模板
function getPkgStateDto(){
    return JSON.parse(`{
        "id": "",
        "packageNo": "",
        "packageStatus": "",
        "operateCode": "",
        "eventCode": "",
        "operateReasonCode": "",
        "operateEmpCode": "",
        "operateZoneCode": "",
        "responseType": "",
        "responseCode": "",
        "responseDescription": "",
        "sysSource": "FVP-",
        "operateTm": "",
        "createTm": "",
        "extendInfoList": [
            {
                "key": "",
                "value": ""
            }
        ]
}`);
}

function getAckDto() {
//回单dto模板
    return JSON.parse(`{
    "waybillNo": "",
    "deliverEmpCode": "",
    "subscriberName": "",
    "clientCode": "",
    "destZoneCode": "",
    "signinTm": "",
    "deliveredType": "",
    "realWeightQty": "",
    "inputerEmpCode": "",
    "extAttrJson": "",
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

function getWbepAckDto() {
//wbep回单dto模板
    return JSON.parse(`{
	"waybillNo":"",
    "opType":"",
	"sourceZoneCode":"",
	"oneselfPickupFlg":"",
	"consignorCompName":"",
	"consignorPhone":"",
	"consignorContName":"",
	"consignorMobile":"",
	"consigneeEmpCode":"",
	"addresseeCompName":"",
	"addresseePhone":"",
	"addresseeContName":"",
	"addresseeMobile":"",
	"consignedTm":"",
	"innerParcelFlg":"",
	"frangibleParcelFlg":"",
	"trustParcelFlg":"",
	"logId":"",
	"destZoneCode":"",
	"consignorAddr":"",
	"addresseeAddr":"",
	"deliverEmpCode":"",
	"quantity":"",
	"freeParcelFlg":"",
	"preCustomsDt":"",
	"signinTm":"",
	"waybillRemk":"",
	"customsBatchs":"",
	"auditedFlg":"",
	"suppTypeCode":"",
	"boxTypeCode":"",
	"cargoTypeCode":"",
	"limitTypeCode":"",
	"expressTypeCode":"",
	"distanceTypeCode":"",
	"transportTypeCode":"",
	"inputTypeCode":"",
	"unifiedCode":"",
	"auditedTm":"",
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
	"meterageWeightQty":"",
	"realWeightQty":"",
	"volume":"",
	"billLong":"",
	"billWidth":"",
	"billHigh":"",
	"consultCode":"",
	"invoiceNo":"",
	"isCredit":"",
	"airportCode":"",
	"cvsCode":"",
	"unitOfWeight":"",
	"refundFreeFlg":"",
	"newInputTm":"",
	"inputTm":"",
	"hvalueBoxType":"",
	"codBillFlg":"",
	"codType":"",
	"totalConsValue":"",
	"subscriberName":"",
	"inputerEmpCode":"",
	"auditerEmpCode":"",
	"customsTypeCode":"",
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
			"inputTypeCode":"",
			"versionNo":"",
			"lockVersionNo":"",
			"inputTm":"",
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
			"feeAmtInd":"",
			"feeIndType":"",
			"currencyCode":"",
			"gatherEmpCode":"",
			"sourceFeeAmt":"",
			"exchangeRate":"",
			"gstFeeAmt":"",
			"refundFeeAmt":""
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
			"versionNo":"",
			"lockVersionNo":"",
			"waybillChildId":"",
			"waybillLogId":"",
			"waybillChildNo":"",
			"inputTm":"",
			"newInputTm":""
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
			"addId": "",
			"waybillNo": "",
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
			"attr050": ""
        }]
}`)
}

function getRedinkDto() {
//红冲模板
    return JSON.parse(`{
    "waybillNo": "",
    "sysCode": "",
    "empCode": "",
    "propertyMap": {
        "consignedTm": "",
        "signinTm": "",
        "consigneeEmpCode": "",
        "deliverEmpCode": "",
        "transportTypeCode": "",
        "sourceZoneCode": "",
        "destZoneCode": "",
        "expressTypeCode": "",
        "limitTypeCode": "",
        "distanceTypeCode": "",
        "cargoTypeCode": "",
        "meterageWeightQty": "",
        "realWeightQty": "",
        "quantity": "",
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
            "feeTypeCode": "",
            "serviceProdCode": "",
            "feeAmt": "",
            "currencyCode": ""
            "gatherZoneCode": "",
            "settlementTypeCode": "",
            "paymentTypeCode": "",
            "paymentChangeTypeCode": "",
            "customerAcctCode": "",
            "sourceCodeFeeAmt": "",
            "sourceCurrencyCode": "",
            "attribute1": "",
            "attribute2": "",
            "attribute3": "",
            "attribute4": "",
            "attribute5": "",
            "operationType": "",
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

function getOperWaybillDto() {
//操作运单模板
    return JSON.parse(`{
    "waybillNo": "",
    "destZoneCode": "",
    "sourceZoneCode": "",
    "consigneeEmpCode": "",
    "deliverEmpCode": "",
    "consignedTm": "",
    "signinTm": "",
    "cargoTypeCode": "",
    "limitTypeCode": "",
    "productCode": "",
    "volume": "",
    "billLong": "",
    "billWidth": "",
    "billHigh": "",
    "realWeightQty": "",
    "meterageWeightQty": "",
    "quantity": "",
    "distanceTypeCode": "",
    "transportTypeCode": "",
    "expressTypeCode": "",
    "lockVersionNo": "",
    "versionNo": "",
    "unitWeight": "",
    "consValue": "",
    "waybillRemark": "",
    "orderNo": "",
    "expectStartTm": "",
    "provider": "",
    "actionJson": "",
    "updateSource": "",
    "genOrderFlag": "",
    "clientCode": "",
    "currentSource": "",
    "consValueCurrencyCode": "",
    "expectFinishTm": "",
    "dynExpcDeliveryTm": "",
    "subscriberName": "",
    "extJson": "",
    "updateTm": "",
    "createTm": "",
    "operationWaybillCustoms": {
        "waybillNo": "",
        "orderNo": "",
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
        "consultCode": "",
        "extJson": "",
        "updateTm": "",
        "createTm": ""
    },
    "operationWaybillMarkList": [
        {
            "orderNo": "",
            "waybillNo": "",
            "labellingId": "",
            "labellingPattern": "",
            "extJson": "",
            "updateTm": "",
            "createTm": ""
        }
    ],
    "operationWaybillFeeList": [
        {
            "orderNo": "",
            "waybillNo": "",
            "feeTypeCode": "",
            "feeAmt": "",
            "feeAmtInd": "",
            "feeIndType": "",
            "currencyCode": "",
            "gatherEmpCode": "",
            "gatherZoneCode": "",
            "paymentTypeCode": "",
            "settlementTypeCode": "",
            "paymentChangeTypeCode": "",
            "exchangeRate": "",
            "customerAcctCode": "",
            "bizOwnerZoneCode": "",
            "sourceCodeFeeAmt": "",
            "destCurrencyCode": "",
            "valutionAcctCode": "",
            "extJson": "",
            "updateTm": "",
            "createTm": ""
        }
    ],
    "operationWaybillAdditionList": [
        {
            "orderNo": "",
            "waybillNo": "",
            "additionalId": "",
            "additionalKey": "",
            "additionalValues": "",
            "extJson": "",
            "updateTm": "",
            "createTm": ""
        }
    ],
    "operationWaybillCustomsList": [
        {
            "orderNo": "",
            "waybillNo": "",
            "exportId": "",
            "customsTypeCode": "",
            "consignorPostalCode": "",
            "addresseePostalCode": "",
            "consignorTaxNo": "",
            "twinvoiceTypeCode": "",
            "customsBatchs": "",
            "preCustomsDt": "",
            "sourcearea": "",
            "countryCode": "",
            "unifiedCode": "",
            "consultCode": "",
            "extJson": "",
            "updateTm": "",
            "createTm": ""
        }
    ],
    "operationWaybillServiceList": [
        {
            "orderNo": "",
            "waybillNo": "",
            "serviceProdCode": "",
            "attribute1": "",
            "attribute2": "",
            "attribute3": "",
            "attribute4": "",
            "attribute5": "",
            "extJson": "",
            "updateTm": "",
            "createTm": ""
        }
    ],
    "optWaybillAdditionExtList": [
        {
            "orderNo": "",
            "waybillNo": "",
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
            "extJson": "",
            "updateTm": "",
            "createTime": ""
        }
    ]
}`);
}