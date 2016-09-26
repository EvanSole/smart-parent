define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('qcOrderListController',
        ['$scope', '$rootScope', '$http', 'url','wmsDataSource', 'sync', '$filter', 'wmsLog', 'wmsReportPrint',
            function($scope, $rootScope, $http, url, wmsDataSource, sync, $filter, wmsLog, wmsReportPrint) {
                var  qcOrderColumns = [
                    WMS.UTILS.CommonColumns.checkboxColumn,
                    {filterable: false, title: '质检单号', field: 'qcOrderId', align: 'left', width: "100px"},
                    {filterable: false, title: '质检单类型',template: WMS.UTILS.statesFormat('type', 'QcOrderTypeEnum'), field: 'type', align: 'left', width: "120px"},
                    {filterable: false, title: '质检单状态',template: WMS.UTILS.statesFormat('processStatus', 'QcOrderProcessStatusEnum'), field: 'processStatus', align: 'left', width: "100px"},
                    //{filterable: false, title: '质检单详情状态',template: WMS.UTILS.statesFormat('closeStatus', 'QcOrderCloseStatusEnum'), field: 'closeStatus', align: 'left', width: "130px"},
                    {filterable: false, title: '质检结果',template: WMS.UTILS.statesFormat('qcResult', 'QcOrderQualityResultEnum'), field: 'qcResult', align: 'left', width: "100px"},
                    {filterable: false, title: '店铺名称', field: 'shopName', align: 'left', width: "150px"},
                    // {filterable: false, title: '商家名称', field: 'sellerUserName', align: 'left', width: "150px"},
                    {filterable: false, title: '商品类目', field: 'goodsCategoryName', align: 'left', width: "200px"},
                    {filterable: false, title: '店铺主营类目',template: WMS.UTILS.statesFormat('shopTagId', 'ShopTagEnum'), field: 'shopTagId', align: 'left', width: "150px"},
                    {filterable: false, title: '商品编码', field: 'goodsCode', align: 'left', width: "200px"},
                    {filterable: false, title: '商品ID', field: 'goodsId', align: 'left', width: "100px"},
                    {filterable: false, title: '商品名称', field: 'goodsName', align: 'left', width: "330px"},
                    {filterable: false, title: '商品连接', field: 'goodsLink', align: 'left', width: "230px",template:function(data){
                       return "<a class='k-button k-button-icontext' target=_blank href='"+data.goodsLink+"'>"+data.goodsLink+"</a>"
                    }},
                    {filterable: false, title: '交易单号', field: 'shopOrderId', align: 'left', width: "100px"},
                    {filterable: false, title: '退货单号', field: 'refundId', align: 'left', width: "100px"},
                    {filterable: false, title: '下单账号', template: WMS.UTILS.orderUserFormat('buyerUserId'),field: 'buyerUserId', align: 'left', width: "100px"},
                    {filterable: false, title: '物流公司', field: 'expressCode', align: 'left', width: "100px"},
                    {filterable: false, title: '物流单号', field: 'expressId', align: 'left', width: "100px"},
                    {filterable: false, title: '寄回快递单号', field: 'refundExpressId', align: 'left', width: "150px"},
                    {filterable: false, title: '创建时间', field: 'created', align: 'left', width: "200px", template: WMS.UTILS.timestampFormat("created", "yyyy-MM-dd HH:mm:ss")},
                    {filterable: false, title: '修改时间', field: 'update', align: 'left', width: "200px", template: WMS.UTILS.timestampFormat("updated", "yyyy-MM-dd HH:mm:ss")},
                    {filterable: false, title: '操作人', field: 'optUserName', align: 'left', width: "100px"},
                    {filterable: false, title: '质检报告', align: 'left', width: "150px", template:"<a class='k-button k-button-custom-command'  name='qcReport' href='\\#' ng-click='openQcReport(this);' >质检报告</a>"},
                    {filterable: false, title: '是否购买', field: 'platformStatus', align: 'left', width: "100px", template: function(data) {
                        if (data.platformStatus == 6) {
                            return '已购买'
                        } else {
                            return ''
                        }
                    }}
                ];

                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

                var qcOrderDataSource = wmsDataSource({
                    url: url.qcOrderQueryUrl,
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
                    toolbar: [{ name: "create", text: "新增", className:'btn-auth-add'},
                              //{ name: "confirmQcOrder", text: "确认", className:'btn-auth-confirm'},
                              { name: "cancelQcOrder", text: "取消", className:'btn-auth-cancel'},
                              { name: "syncQcOrderRefund", text: "退货地址同步", className:'btn-auth-sync'},
                              { template: '<a class="k-button k-button-icontext k-grid-callPunish" ng-click="callPunish()">发送处罚</a>', className: "btn-auth-punish"},
                              { template: '<a class="k-button k-button-icontext k-grid-claimRefund" ng-click="claimRefund()">申请退货</a>', className: "btn-auth-claimRefund"},
                              { template: '<a class="k-button k-button-icontext k-grid-printQcOrderIds" ng-click="printQcOrderIds()">打印质检单号</a>', className: "btn-auth-printQcOrderIds"},
                              { template: '<a class="k-button k-button-icontext k-grid-purchase" ng-click="purchase()">购买</a>', className: "btn-auth-purchase"},
                              { template: '<a class="k-button k-button-icontext k-grid-purchase_cancel" ng-click="purchase_cancel()">取消购买</a>', className: "btn-auth-purchase_cancel"}
                             ],

                    editable: {
                        mode: "popup",
                        template: kendo.template($("#qcOrderEditor").html())
                    }
                }, $scope);

                //操作日志 added by zw 2016-05-27 14:00:57
                $scope.logOptions = wmsLog.operationLog;


                var qcRefundAddressColumns = [
                    {filterable: false, title: 'Id', field: 'refundId', hidden: true, align: 'left', width: "50px"},
                    {filterable: false, title: '质检单号', field: 'qcOrderId', align: 'left', width: "100px"},
                    {filterable: false, title: '物流公司', field: 'expressCode', align: 'left', width: "100px"},
                    {filterable: false, title: '发货物流单号', field: 'expressId', align: 'left', width: "120px"},
                    {filterable: false, title: '省份', field: 'receiveProvince', align: 'left', width: "100px"},
                    {filterable: false, title: '城市', field: 'receiveCity', align: 'left', width: "150px"},
                    {filterable: false, title: '区域', field: 'receiveArea', align: 'left', width: "100px"},
                    {filterable: false, title: '街道', field: 'receiveStreet', align: 'left', width: "150px"},
                    {filterable: false, title: '详细地址', field: 'receiveAddress', align: 'left', width: "350px"},
                    {filterable: false, title: '邮编', field: 'receiveZip', align: 'left', width: "150px"},
                    {filterable: false, title: '收货人姓名', field: 'receiveName', align: 'left', width: "120px"},
                    {filterable: false, title: '收货人手机', field: 'receivePhone', align: 'left', width: "120px"}
                ];
                $scope.refundAddressOptions = function (dataItem) {
                    return WMS.GRIDUTILS.getGridOptions({
                        columns: qcRefundAddressColumns,
                        dataSource: wmsDataSource({
                            url: window.BASEPATH + "/qc/refund/address/" + dataItem,
                            schema: {
                                model: {
                                    id: "refundId",
                                    fields: {
                                        id: {type: "number", editable: false, nullable: true }
                                    }
                                }
                            }
                        })
                    }, $scope);
                }

                //绑定事件
                $scope.$on("kendoWidgetCreated", function (event, widget) {

                    //质检单确认弹出层
                    $(".k-grid-confirmQcOrder").on("click", function () {
                        var selectData = WMS.GRIDUTILS.getCustomSelectedData($scope.qcOrderGrid);
                        var ids = [];
                        var errorMesg = '';
                        selectData.forEach(function (data) {
                            if (data.processStatus != 1) {
                                errorMesg = "质检单状态不匹配,不能确认操作!";
                                return;
                            }
                            ids.push(data.id);
                        });
                        if (errorMesg !== "") {
                            kendo.ui.ExtAlertDialog.showError(errorMesg);
                            return;
                        }
                        var id = ids.join(",");
                        if (id.length === 0) {
                            kendo.ui.ExtAlertDialog.showError("请选择一条质检单信息!");
                            return;
                        }
                        if(id.toString().indexOf(",") != -1) {//只允许选择一条信息
                            kendo.ui.ExtAlertDialog.showError("只能选择一条质检单信息！");
                            return;
                        }
                        $scope.confirmQcOrderPopup.refresh().open().center();

                        $scope.$apply(function () {
                            $scope.$parent.qcOrderModel={};
                            $scope.$parent.qcOrderModel.qcOrderId=selectData[0].qcOrderId;
                            $scope.$parent.qcOrderModel.type={value:selectData[0].type};
                        });
                    });

                    //关闭
                    $scope.qcOrderPopupClose = function() {
                        $scope.$parent.qcOrderModel = {};
                        $scope.confirmQcOrderPopup.close();
                    };

                    //质检单确认
                    $scope.qcOrderConfirm = function () {
                        var qcOrderId = $scope.$parent.qcOrderModel.qcOrderId;
                        var type = $scope.$parent.qcOrderModel.type.value;
                        var buyerUserName = $scope.$parent.qcOrderModel.buyerUserName;
                        var shopOrderId = $scope.$parent.qcOrderModel.shopOrderId;
                        var expressCode = $scope.$parent.qcOrderModel.expressCode;
                        var expressId = $scope.$parent.qcOrderModel.expressId;
                        if (buyerUserName === '') {
                            kendo.ui.ExtAlertDialog.showError("下单账号不能为空!");
                            return;
                        }
                        if (shopOrderId === '') {
                            kendo.ui.ExtAlertDialog.showError("交易单号不能为空!");
                            return;
                        }
                        if (expressCode === '') {
                            kendo.ui.ExtAlertDialog.showError("物流公司不能为空!");
                            return;
                        }
                        if (expressId === '') {
                            kendo.ui.ExtAlertDialog.showError("物流单号不能为空!");
                            return;
                        }
                        var dataParam = { data:{ qcOrderId:qcOrderId, type:type, buyerUserName: buyerUserName, shopOrderId: shopOrderId,expressCode: expressCode, expressId:expressId}}
                        sync(url.qcOrderConfirmUrl + "/" + qcOrderId, "POST",dataParam)
                            .then(function (data) {
                                //刷新页面
                                //$state.reload();
                                $scope.qcOrderGrid.dataSource.read({});
                                $scope.confirmQcOrderPopup.close();
                            }, function () {
                                //$state.reload();
                                $scope.qcOrderGrid.dataSource.read({});
                                $scope.confirmQcOrderPopup.close();
                            });
                    }

                    //质检单取消
                    $(".k-grid-cancelQcOrder").on("click", function () {
                        var selectData = WMS.GRIDUTILS.getCustomSelectedData($scope.qcOrderGrid);
                        var ids = [];
                        var errorMesg = '';
                        selectData.forEach(function (data) {
                            if (data.processStatus > 3) {
                                errorMesg = "质检单状态不匹配,不能取消操作!";
                                return;
                            }
                            ids.push(data.id);
                        });
                        if (errorMesg !== "") {
                            kendo.ui.ExtAlertDialog.showError(errorMesg);
                            return;
                        }
                        var id = ids.join(",");
                        if (id.length === 0) {
                            kendo.ui.ExtAlertDialog.showError("请选择一条质检单信息!");
                            return;
                        }
                        if (id.toString().indexOf(",") != -1) {//只允许选择一条信息
                            kendo.ui.ExtAlertDialog.showError("只能选择一条质检单信息！");
                            return;
                        }

                        kendo.ui.ExtOkCancelDialog.show({
                            title: "取消",
                            message: "您确定要取消质检单?",
                            icon: 'k-ext-question' }).then(function (resp) {
                            if (resp.button === 'OK') {
                                sync(url.qcOrderCancelUrl + "/" + id, "PUT")
                                    .then(function (data) {
                                        //刷新页面
                                        //$state.reload();
                                        $scope.qcOrderGrid.dataSource.read({});
                                        $scope.confirmQcOrderPopup.close();
                                    }, function () {
                                        //$state.reload();
                                        $scope.qcOrderGrid.dataSource.read({});
                                        $scope.confirmQcOrderPopup.close();
                                    });
                            }else{
                                return;
                            }
                        });
                    });

                    //质检单退货信息同步
                    $(".k-grid-syncQcOrderRefund").on("click", function () {
                        var selectData = WMS.GRIDUTILS.getCustomSelectedData($scope.qcOrderGrid);
                        var ids = [];
                        selectData.forEach(function (data) {
                            ids.push(data.id);
                        });
                        var id = ids.join(",");
                        if (id.length === 0) {
                            kendo.ui.ExtAlertDialog.showError("请选择一条质检单信息!");
                            return;
                        }
                        sync(url.qcOrderSyncRefundUrl + "/" + ids , "POST")
                            .then(function (data) {
                                //刷新页面
                                $scope.qcOrderGrid.dataSource.read({});
                            }, function () {
                                $scope.qcOrderGrid.dataSource.read({});
                            });
                    });


                });

                $scope.openQcReport = function openQcReport(data){
                    console.log(data);
                    var qcOrderId = data.dataItem.id;
                    $scope.qcReportPushModel = {} ;
                    //1、查询后台
                    sync(window.BASEPATH + "/qc/report/" + qcOrderId, "GET", {data : null}).then(function(xhr){
                        if(xhr.data === null){
                            return ;
                        }
                        var imageUrls = xhr.data.pngUrl;
                        $scope.qcReportPushModel.isPushSMS = xhr.data.isPushSMS ? '已推送' : '未推送';
                        //return "<span ng-bind=\"dataItem." + tempstamp + "|dateFilter|date:'" + format + "'|dataIgnore\"></span>";
                        $scope.qcReportPushModel.pushSMSDate = xhr.data.pushSMSDate === 0 ? '-' : $filter("date")(xhr.data.pushSMSDate * 1000, "yyyy/MM/dd 00:00:00");
                        $scope.qcReportPushModel.contentSMS = xhr.data.contentSMS;
                        $scope.qcReportPushModel.isPushDD = xhr.data.isPushDD ? '已推送' : '未推送';
                        $scope.qcReportPushModel.pushDDDate = xhr.data.pushDDDate === 0 ? '-' : $filter("date")(xhr.data.pushDDDate * 1000, "yyyy/MM/dd 00:00:00");
                        $scope.qcReportPushModel.contentDD = xhr.data.contentDD;
                        $scope.qcReportPushModel.isPushPunish = xhr.data.isPushPunish ? '已推送' : '未推送';
                        $scope.qcReportPushModel.pushPunishDate = xhr.data.pushPunishDate === 0 ? '-' : $filter("date")(xhr.data.pushPunishDate * 1000, "yyyy/MM/dd 00:00:00");
                        $scope.qcReportPushModel.pngUrl = imageUrls;
                        $scope.qcReportPushPopup.refresh().open().center();
                    });
                }

                $scope.closeQcReport = function openQcReport(data){

                    $scope.qcReportPushModel = {} ;
                    $scope.qcReportPushPopup.close();

                }


                $scope.callPunish = function callPunish(){
                    //发送处罚接口 zw 2016-05-09
                    var selectData = WMS.GRIDUTILS.getCustomSelectedData($scope.qcOrderGrid);
                    var ids = [];
                    selectData.forEach(function (data) {
                        ids.push(data.id);
                    });
                    var id = ids.join(",");
                    if (id.length === 0) {
                        kendo.ui.ExtAlertDialog.showError("请选择一条质检单信息!");
                        return;
                    }
                    sync(url.callPunishUrl + "/" + ids , "GET")
                        .then(function (data) {
                            //刷新页面
                            $scope.qcOrderGrid.dataSource.read({});
                        }, function () {
                            $scope.qcOrderGrid.dataSource.read({});
                        });
                }

                $scope.claimRefund = function () {
                    var selectData = WMS.GRIDUTILS.getCustomSelectedData($scope.qcOrderGrid);
                    var ids = [];
                    selectData.forEach(function (data) {
                        ids.push(data.id);
                    });
                    var id = ids.join(",");
                    if (id.length === 0) {
                        kendo.ui.ExtAlertDialog.showError("请选择一条质检单信息!");
                        return;
                    }
                    sync(window.BASEPATH + "/qc/order/refundByManual/" + ids , "POST")
                        .then(function (data) {
                            //刷新页面
                            $scope.qcOrderGrid.dataSource.read({});
                        }, function () {
                            $scope.qcOrderGrid.dataSource.read({});
                        });
                }
                
                
                $scope.printQcOrderIds = function (){
                    var selectedData = WMS.GRIDUTILS.getCustomSelectedData($scope.qcOrderGrid);
                    var ids=[];
                    selectedData.forEach(function(value){
                        var id = {};
                        id["qcOrderId"] = value.id;
                        ids.push(id);
                    });
                    if(ids.length === 0){
                        kendo.ui.ExtAlertDialog.showError("请选择一条质检单信息!");
                        return ;
                    }
                    wmsReportPrint.printQcOrderId(ids,1);
                    $scope.qcOrderGrid.dataSource.read({});

                };

                $scope.purchase = function () {
                    var selectData = WMS.GRIDUTILS.getCustomSelectedData($scope.qcOrderGrid);
                    var ids = [];
                    selectData.forEach(function (data) {
                        ids.push(data.id);
                    });
                    var id = ids.join(",");
                    if (id.length === 0) {
                        kendo.ui.ExtAlertDialog.showError("请选择一条质检单信息!");
                        return;
                    }
                    sync(window.BASEPATH + "/qc/order/purchase/" + ids , "POST")
                        .then(function (data) {
                            //刷新页面
                            $scope.qcOrderGrid.dataSource.read({});
                        }, function () {
                            $scope.qcOrderGrid.dataSource.read({});
                        });
                }

                $scope.purchase_cancel = function () {
                    var selectData = WMS.GRIDUTILS.getCustomSelectedData($scope.qcOrderGrid);
                    var ids = [];
                    selectData.forEach(function (data) {
                        ids.push(data.id);
                    });
                    var id = ids.join(",");
                    if (id.length === 0) {
                        kendo.ui.ExtAlertDialog.showError("请选择一条质检单信息!");
                        return;
                    }
                    sync(window.BASEPATH + "/qc/order/purchase/cancel/" + ids , "POST")
                        .then(function (data) {
                            //刷新页面
                            $scope.qcOrderGrid.dataSource.read({});
                        }, function () {
                            $scope.qcOrderGrid.dataSource.read({});
                        });
                }

        }]);
})