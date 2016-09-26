define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('qcRefundListController',
        ['$scope', '$rootScope', '$http', 'url','wmsDataSource', 'sync','wmsPrint', 'wmsLog',
            function($scope, $rootScope, $http, url, wmsDataSource, sync,wmsPrint, wmsLog) {
                var  qcOrderColumns = [
                    WMS.UTILS.CommonColumns.checkboxColumn,
                    {filterable: false, title: '质检单类型',template: WMS.UTILS.statesFormat('type', 'QcOrderTypeEnum'), field: 'type', align: 'left', width: "150px"},
                    {filterable: false, title: '质检单号', field: 'qcOrderId', align: 'left', width: "100px"},
                    {filterable: false, title: '平台状态', field: 'platformStatus', align: 'left', width: "100px",template: WMS.UTILS.statesFormat('platformStatus', 'QcOrderPlatformStatusEnum')},
                    {filterable: false, title: '退货单号', field: 'refundId', align: 'left', width: "100px"},
                    {filterable: false, title: '商品ID', field: 'goodsId', align: 'left', width: "100px"},
                    {filterable: false, title: '质检单状态',template: WMS.UTILS.statesFormat('processStatus', 'QcOrderProcessStatusEnum'), field: 'processStatus', align: 'left', width: "100px"},
                    {filterable: false, title: '质检状态',template: WMS.UTILS.statesFormat('qcResult', 'QcOrderQualityResultEnum'), field: 'qcResult', align: 'left', width: "100px"},
                    {filterable: false, title: '店铺名称', field: 'shopName', align: 'left', width: "150px"},
                    // {filterable: false, title: '商家名称', field: 'sellerUserName', align: 'left', width: "150px"},
                    {filterable: false, title: '交易单号', field: 'shopOrderId', align: 'left', width: "100px"},
                    {filterable: false, title: '商品类目', field: 'goodsCategoryName', align: 'left', width: "200px"},
                    {filterable: false, title: '商品编码', field: 'goodsCode', align: 'left', width: "200px"},
                    {filterable: false, title: '商品名称', field: 'goodsName', align: 'left', width: "330px"},
                    {filterable: false, title: '下单账号', template: WMS.UTILS.orderUserFormat('buyerUserId'), field: 'buyerUserId', align: 'left', width: "100px"},
                    {filterable: false, title: '物流公司', field: 'expressCode', align: 'left', width: "100px"},
                    {filterable: false, title: '物流单号', field: 'expressId', align: 'left', width: "100px"},
                    {filterable: false, title: '寄回快递单号', field: 'refundExpressId', align: 'left', width: "150px"},
                    {filterable: false, title: '创建时间', field: 'created', align: 'left', width: "200px", template: WMS.UTILS.timestampFormat("created", "yyyy-MM-dd HH:mm:ss")},
                    {filterable: false, title: '退货发货时间', field: 'refundShipTime', align: 'left', width: "200px", template: WMS.UTILS.timestampFormat("refundShipTime", "yyyy-MM-dd HH:mm:ss")}
                ];

                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

                var qcOrderDataSource = wmsDataSource({
                    url: url.qcRefundQueryUrl,
                    schema: {
                        model: {
                            id:"qcOrderId",
                            fields: {
                                id: { type: "number", editable: false, nullable: true }
                            }
                        },
                        total: function (total) {
                            return total.length > 0 ? total[0].total : 0;
                        }
                    }
                });

                $scope.qcOrderGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: qcOrderDataSource,
                    columns: qcOrderColumns,
                    autoBind:false,
                    exportable: true,
                    toolbar: [{ name: "pick", text: "打印拣货单", className:'btn-auth-pick'},
                              { name: "express", text: "打印快递单", className:'btn-auth-express'}
                        //,{ name: "confirm", text: "获取商家退款确认状态", className:'btn-auth-confirm'}
                    ],
                    widgetId:"qcRefundWidget"
                }, $scope);

                //操作日志 added by zw 2016-05-27 14:00:57
                $scope.logOptions = wmsLog.operationLog;

                function print(result){
                    var printObj = {};
                    var refund = result.qualityCheckOrderRefundDTO;
                    if(refund.expressId==null || refund.expressId==""){
                        kendo.ui.ExtAlertDialog.showError("未做订单退货操作不能打印!！");
                        return ;
                    }
                    var printInfo = $.parseJSON(refund.printInfo)

                    printObj.goodCode = "商品编码:"+result.qualityCheckOrderDetailDTO.goodsCode;
                    printObj.tradeNos = "订单号:"+result.qualityCheckOrderDTO.shopOrderId;
                    printObj.shopContact = result.sendName;
                    printObj.shopTel = result.sendPhone;
                    printObj.shopAddress = result.addressDetail;
                    printObj.cityName = result.city;//发件城市(中国邮政要求)
                    printObj.logisticAreaName = printInfo;//大头笔


                    printObj.receiverName = refund.receiveName;
                    printObj.mobile = refund.receivePhone;
                    printObj.address = refund.receiveAddress;
                    printObj.carrierReferNo = refund.expressId;
                    printObj.deliveryTime = '';//发件日期(中通要求)
                    var printFlag = wmsPrint.printExpress(refund.expressCode, printObj)
                }


                //绑定事件
                $scope.$on("kendoWidgetCreated", function (event, widget) {

                    if (widget.options !== undefined && widget.options.widgetId === 'qcRefundWidget') {
                        //打印拣货单
                        $(".k-grid-pick").on("click", function () {
                            var selectData = WMS.GRIDUTILS.getCustomSelectedData($scope.qcOrderGrid);
                            if(selectData.length==0){
                                kendo.ui.ExtAlertDialog.showError("请选择质检单!");
                                return;
                            }
                            var ids = [];
                            selectData.forEach(function (data) {
                                if (data.processStatus == 'INIT') {
                                    kendo.ui.ExtAlertDialog.showError(data.qcOrderId + ",质检单状态不匹配不能执行确认操作！");
                                    return;
                                }
                                ids.push(data.id);
                            });
                            var id = ids.join(",");
                            sync(url.qcPickOrderUrl + "/" + id, "GET", {wait: false}).then(function (resp) {
                                var data = {};
                                data.item = resp.data;
                                wmsPrint.printData(data,wmsPrint.PrintType.QC_Pick);
                            });

                        });

                        //打印快递单
                        $(".k-grid-express").on("click", function () {
                            var selectData = WMS.GRIDUTILS.getCustomSelectedData($scope.qcOrderGrid);
                            if(selectData.length==0){
                                kendo.ui.ExtAlertDialog.showError("请选择质检单!");
                                return;
                            }
                            if(selectData.length>1){
                                kendo.ui.ExtAlertDialog.showError("只能选择一单打印!");
                                return;
                            }
                            var ids = [];
                            selectData.forEach(function (data) {
                                if (data.processStatus == 'INIT') {
                                    kendo.ui.ExtAlertDialog.showError(data.qcOrderId + ",质检单状态不匹配不能执行确认操作！");
                                    return;
                                }
                                ids.push(data.id);
                            });
                            var id = ids.join(",");
                            sync(url.qcOrderWaybillPrint + "/" + id, "GET", {wait: false}).then(function (resp) {
                                print(resp.data);
                            });


                        });

                        //获取商家退款确认状态
                        $(".k-grid-confirm").on("click", function () {
                            var selectData = WMS.GRIDUTILS.getCustomSelectedData($scope.qcOrderGrid);
                            if(selectData.length==0){
                                kendo.ui.ExtAlertDialog.showError("请选择质检单!");
                                return;
                            }
                            if(selectData.length>1){
                                kendo.ui.ExtAlertDialog.showError("只能选择一单确认!");
                                return;
                            }
                            var ids = [];
                            selectData.forEach(function (data) {
                                ids.push(data.id);
                            });
                            var id = ids.join(",");
                            sync(url.sellRefundUrl + "/" + id, "PUT", {wait: false});
                        });
                    }
                })
        }]);
})