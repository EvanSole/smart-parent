define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('qcReportDetailController',
        ['$scope', '$rootScope', '$http', 'url','wmsDataSource', 'sync',
            function($scope, $rootScope, $http, url, wmsDataSource, $sync) {

                var  qcReportDetailColumns = [
//                    WMS.UTILS.CommonColumns.checkboxColumn,
                    {filterable: false, title: '购买人', field: 'buyerUserId', align: 'left', width: "100px", template: WMS.UTILS.orderUserFormat('buyerUserId')},
                    {filterable: false, title: '购买时间', field: 'created', align: 'left', width: "100px",template: WMS.UTILS.timestampFormat("created", "yyyy-MM-dd HH:mm:ss")},
                    {filterable: false, title: '抽检日期', field: 'qcOptFinishedTime', align: 'left', width: "150px",template: WMS.UTILS.timestampFormat("qcOptFinishedTime", "yyyy-MM-dd HH:mm:ss")},
                    {filterable: false, title: '抽检操作人', field: 'optUserName', align: 'left', width: "150px"},
                    {filterable: false, title: '抽检序号', field: 'qcOrderId', align: 'left', width: "100px"},
                    {filterable: false, title: '是否退货', field: 'platformStatusValue', align: 'left', width: "100px"},
                    {filterable: false, title: '金额', field: 'orderAmount', align: 'left', width: "150px"},
                    {filterable: false, title: '订单号', field: 'shopOrderId', align: 'left', width: "150px"},
                    {filterable: false, title: '店铺名称', field: 'shopName', align: 'left', width: "150px"},
                    {filterable: false, title: '店铺ID', field: 'shopId', align: 'left', width: "150px"},
                    {filterable: false, title: '抽检商品链接', field: 'goodsLink', align: 'left', width: "100px", template:function(data){
                        return "<a class='k-button k-button-icontext' target=_blank href='"+data.goodsLink+"'>"+data.goodsLink+"</a>"
                    }},
                    {filterable: false, title: '商品类目二级', field: 'goodsCategoryName', align: 'left', width: "150px"},
                    {filterable: false, title: '最终判定结果', field: 'qcResultValue', align: 'left', width: "150px"},
                    {filterable: false, title: '一级不合格原因', field: 'firstReason', align: 'left', width: "150px"},
                    {filterable: false, title: '二级不合格原因', field: 'secondReason', align: 'left', width: "150px"},
                    {filterable: false, title: '三级不合格原因', field: 'thirdReason', align: 'left', width: "150px"},
                    {filterable: false, title: '是否品质商家', field: 'qcType', align: 'left', width: "150px",template: WMS.UTILS.statesFormat('qcType', 'QcTypeEnum')},
                    {filterable: false, title: '商家类型', field: 'sellerType', align: 'left', width: "150px",template: WMS.UTILS.statesFormat('sellerType', 'QcOrderSellerTypeEnum')},
                    {filterable: false, title: '优选等级', field: 'qcLevel', align: 'left', width: "150px",template: WMS.UTILS.statesFormat('qcLevel', 'QcOrderQualityLevelEnum')},
                    {filterable: false, title: '快递单号', field: 'expressId', align: 'left', width: "150px"},
                    {filterable: false, title: '是否到货', field: 'isReceived', align: 'left', width: "120px"},
                    {filterable: false, title: '寄回快递单号', field: 'refundExpressId', align: 'left', width: "120px"}
                ];

                var qcReportDetailDataSource = wmsDataSource({
                    url: window.BASEPATH + "/qc/report/queryQcReportDetail",
                    schema: {
                        model: {
                            id:"goodsCategoryName",
                            fields: {
                                id: { type: "string", editable: false, nullable: true }
                            }
                        }
                    }
                });

                $scope.qcReportDetailGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: qcReportDetailDataSource,
                    columns: qcReportDetailColumns,
                    exportable: true,
                    widgetId:"qcReportDetailWidget"
                }, $scope);
        }]);
})