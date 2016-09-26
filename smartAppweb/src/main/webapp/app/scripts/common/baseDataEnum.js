define(['app'], function (app) {
        'use strict';
        /***
         * basic enum datas
         * @auth wuren
         * @date 2016-04-11 15:00
         */
        app.factory('dataEnum', ['$http','sync','url', function ($http,$sync,url) {

        return {
             QcOrderCloseStatusEnum : [
                    {code: "UNCLOSE", value: 1, description: "初始化,未关闭"},
                    {code: "TIMEOUT_CLOSE", value: 2, description: "超时关闭"},
                    {code: "LOSE_CLOSE", value: 3, description: "遗失关闭"},
                    {code: "UNSEND_CLOSE", value: 4, description: "未寄送关闭"}
             ],
             QcOrderPlatformStatusEnum : [
                {code: "APPLY", value: 1, description: "待发起退款申请"},
                {code: "CONFIRMED", value: 2, description: "已发起退款申请待商家确认"},
                {code: "REFUND", value: 3, description: "商家已确认退货待退款"},
                {code: "DRAWBACK", value: 4, description: "商家已确认退款"},
                {code: "REFUSE", value:5 , description: "商家已拒绝"},
                {code: "PURCHASE", value:6 , description: "已购买"}
             ],
             QcOrderProcessStatusEnum : [
                {code: "INIT", value: 1, description: "初始化"},
                {code: "CONFIRMED", value: 2, description: "已确认,待入库"},
                {code: "WAREHOUSED", value: 3, description: "已入库,待质检"},
                {code: "QUALIFIED", value: 4, description: "已质检,待上架"},
                {code: "SHELVED", value: 5, description: "已放入仓库货架"},
                {code: "PRINTED", value: 6, description: "已打电子面单"},
                {code: "REFUND_SHIPPED", value: 7, description: "退货已发货"},
                {code: "CANCELED", value: 9, description: "已取消"},
                {code: "CANCELED", value: 10, description: "已推送处罚"},
                {code: "FINISHED", value: 20, description: "已完成"}
            ],
            QcOrderQualityLevelEnum : [
                {code: "UNCHECKED", value: 1, description: "未检测"},
                {code: "ORDINARY", value: 2, description: "普通"},
                {code: "GOOD", value: 3, description: "良好"},
                {code: "EXCELLENT", value: 4, description: "优秀"},
                {code: "SUPER_EXCELLENT", value: 5, description: "超优"}
            ],
            QcOrderQualityResultEnum : [
                {code: "UNCHECKED", value: 1, description: "未检测"},
                {code: "QUALIFIED", value: 2, description: "合格"},
                {code: "UNQUALIFIED", value: 3, description: "不合格"},
                {code: "UNCERTAIN", value: 4, description: "无法确定"}
            ],
            QcOrderRefundStatusEnum : [
                {code: "UNAPPLIED", value: 1, description: "买家未申请"},
                {code: "APPLIED", value: 2, description: "买家已申请"},
                {code: "CONFIRMED", value: 3, description: "商家已确认"},
                {code: "REFUSED", value: 4, description: "商家已拒绝"}
            ],
            QcOrderReturnTypeEnum : [
                {code: "IMMEDIATELY", value: 1, description: "立即可退"},
                {code: "SEVEN_DAYS", value: 2, description: "7天可退"},
                {code: "FOURTEEN_DAYS", value: 3, description: "14天可退"}
            ],
            QcOrderTypeEnum : [
                {code: "MYSTERY_GUEST", value: 0, description: "神秘客质检-日常"},
                {code: "REFUND", value: 1, description: "退货质检-日常"},
                {code: "MYSTERY_GUEST_SAMPLE", value: 2, description: "神秘客质检-抽检"},
                {code: "REFUND_SAMPLE", value: 3, description: "退货质检-抽检"}
            ],
            WarehouseLogLevelEnum : [
                {code: "1", value: "WARN", description: "WARN级别日志"},
                {code: "2", value: "ERROR", description: "ERROR级别日志"}
            ],
            WarehouseResponseEnum : [
                {code: 1001, value: "success", description: "Success"},
                {code: 2001, value: "param_error", description: "IllegalArgumentException"},
                {code: 2002, value: "warehouse_error", description: "WarehouseException"},
                {code: 2003, value: "sql_error", description: "SQLException"},
                {code: 2004, value: "data_access_error", description: "DataAccessException"},
                {code: 3001, value: "query_skuinfo_fail", description: "查询sku信息失败"},
                {code: 4004, value: "fail", description: "fail"}
            ],
            ExpressCodeEnum : [
                {code: 1001, value: "YTO", description: "圆通"},
                {code: 2001, value: "SF", description: "顺丰"},
                {code: 3001, value: "YUNDA", description: "韵达"},
                {code: 4001, value: "TTKDEX", description: "天天快递"}
            ],
            BussessLogTypeEnum : [
                {code: "SYNC", value: "1", description: "同步作业"},
                {code: "IN", value: "2", description: "入库作业"},
                {code: "QC", value: "3", description: "质检作业"},
                {code: "OUT", value: "4", description: "出库作业"},
                {code: "REFUND", value: "5", description: "退货作业"},
                {code: "OTHER", value: "6", description: "其它作业"},
                {code: "SHELVE", value: "7", description: "上架作业"}
            ],
            OptTypeEnum : [
                {code: "ORDER_CREATE", value: 1, description: "创建质检单"},
                {code: "ORDER_IN", value: 2, description: "质检入库"},
                {code: "ORDER_CONFIRM", value: 3, description: "质检单确认"},
                {code: "ORDER_CANCEL", value: 4, description: "质检单取消"},
                {code: "ORDER_QC", value: 5, description: "质检操作"},
                {code: "ORDER_REFUND_APPLY", value: 6, description: "向商家发起退货退款申请"},
                {code: "ORDER_TRADE_ADDRESS_SYNC", value: 7, description: "退货地址同步"},
                {code: "ORDER_PLATFORM_STATUS_SYNC", value: 8, description: "同步平台状态"},
                {code: "ORDER_CONFIRM_REFUND", value: 9, description: "商家已确认退货"},
                {code: "ORDER_DELIVERY_FINISH", value: 10, description: "发货完成"},
                {code: "ORDER_EXPRESS_SYNC", value: 11, description: "同步物流单号到平台"},
                {code: "ORDER_QC_REPORT", value: 12, description: "质检不合格创建质检报告单"},
                {code: "ORDER_QC_PUNISH", value: 13, description: "推送处罚接口"},
                {code: "ORDER_QC_DUODUO", value: 14, description: "推送多多消息"},
                {code: "ORDER_CLOSE", value: 15, description: "质检单关闭"},
                {code: "ORDER_SHELVE", value: 16, description: "包裹上架"},
                {code: "ORDER_WAY_BILL",value: 17, description: "获取电子面单号"},
                {code: "ORDER_QC_PIC_UPLOAD",value: 18, description: "图片上传"}
            ],
            ShopTagEnum :[
                {code: "Other", value: 0, description: "未分配类目"},
                {code: "Clothes", value: 5, description: "衣服"},
                {code: "Shoes", value: 6, description: "鞋子"},
                {code: "Bags", value: 7, description: "包包"},
                {code: "Acc", value: 1000000000, description: "配饰"},
                {code: "Beauty", value: 100001, description: "美妆"},
                {code: "Home_Building_Materials", value: 1000000000, description: "家居建材"},
                {code: "men_clothing", value: 200, description: "男装"},
                {code: "Maternal_and_Child", value: 300, description: "母婴"},
                {code: "Underwear", value: 400, description: "内衣"},
                {code: "Food", value: 500, description: "食品"},
                {code: "Sort_OutDoor", value: 600, description: "运动户外"},
                {code: "MobileDigital", value: 700, description: "手机数码"},
                {code: "Accessories", value: 8, description: "服饰配件"},
                {code: "Jewelry", value: 9, description: "首饰"},
                {code: "Hair_Accessories", value: 10, description: "发饰"},
                {code: "household_appliances", value: 101, description: "家用电器"},
                {code: "general_merchandise", value: 102, description: "百货"}
            ], 
            QcTypeEnum : [
                {code: "QUALITY", value: 1, description: "品质商家"},
                {code: "ORDINARY", value: 0, description: "普通商家"}
            ],
            ExceptionLogStatus : [
                {code: "CREATE", value: 0, description: "新建"},
                {code: "COMMIT", value: 1, description: "已提交"}
            ],
            QcOrderSellerType : [
                {code: "UN_QUALITY_STORER", value: 0, description: "非品质商家"},
                {code: "QUALITY_STORER", value: 1, description: "品质商家"},
                {code: "UN_QUALITY_APPLY_STORER", value: 2, description: "非品质报名商家"}
            ],
            QcOrderSellerTypeEnum : [
                {code: "UN_QUALITY_STORER", value: 0, description: "非品质商家"},
                {code: "QUALITY_STORER", value: 1, description: "品质商家"},
                {code: "UN_QUALITY_APPLY_STORER", value: 2, description: "非品质报名商家"}
            ],
            QcOrderQcType : [
                {code: "QC_TYPE_NORMAL", value: 0, description: "普通质检"},
                {code: "QC_TYPE_QUALITY", value: 1, description: "品质质检"}
            ],
            ExceptionLogDataSource : [
                {code: "DATA_SOURCE_SYS", value: "0", description: "系统创建"},
                {code: "DATA_SOURCE_MANUAL", value: "1", description: "手工创建"}
            ]
        }
    }]);

});