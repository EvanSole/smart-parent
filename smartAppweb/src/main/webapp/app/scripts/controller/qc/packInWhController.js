/**
 * Created by zw on 15/4/20.
 */

define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('packInWhController',
        ['$scope', '$rootScope', '$http', 'url','wmsDataSource', 'sync', '$filter', 'wmsPrint',
            function($scope, $rootScope, $http, $url, wmsDataSource, $sync, $filter, wmsPrint) {
                var packInWhColumns = [
                        WMS.UTILS.CommonColumns.checkboxColumn,
                        { field: 'type', title: '质检单类型', filterable: false, align: 'left', width: '110px', template: WMS.UTILS.statesFormat('type', 'QcOrderTypeEnum')},
                        { field: 'qcOrderId', title: '质检单号', filterable: false, align: 'left', width: '110px'},
                        { field: 'processStatus', title: '单据状态', filterable: false, align: 'left', width: '110px', template: WMS.UTILS.statesFormat('processStatus', 'QcOrderProcessStatusEnum')},
                        { field: 'closeStatus', title: '质检状态', filterable: false, align: 'left', width: '110px', template: WMS.UTILS.statesFormat('closeStatus', 'QcOrderCloseStatusEnum')},
                        { field: 'sellerUserName', title: '商家名称', filterable: false, align: 'left', width: '110px'},
                        { field: 'shopOrderId', title: '交易单号', filterable: false, align: 'left', width: '110px'},
                        { field: 'goodsCategoryName', title: '商品类目', filterable: false, align: 'left', width: '110px'},
                        { field: 'goodsCode', title: '商品编码', filterable: false, align: 'left', width: '110px'},
                        { field: 'goodsName', title: '商品名称', filterable: false, align: 'left', width: '110px'},
                        {filterable: false, title: '商品图片', field: 'goodsImage', align: 'left', width: "230px",template:function(data){
                            return "<img ng-src='http://s22.mogucdn.com/"+data.goodsImage+"' style='width:100px;height:100px;'></a>";
                        }},
                        { field: 'goodsPrice', title: '订单金额', filterable: false, align: 'left', width: '110px'},
                        { field: 'buyerUserId', title: '下单账号', filterable: false, align: 'left', width: '110px'},
                        { field: 'inspectionRemark', title: '备注', filterable: false, align: 'left', width: '110px'},
                        { field: 'expressId', title: '物流单号', filterable: false, align: 'left', width: '110px'},
                        { field: 'created', title: '创建时间', filterable: false, align: 'left', width: '110px'}
                    ];

                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

                var packInWhDataSource = new kendo.data.DataSource({
                    data: [],
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                id: {type: "number", editable: false, nullable: true }
                            }
                        }

                    }
                });

                $scope.qcOrderEnter = function () {
                    if ($("#packInOrderNo").val() == null || $("#packInOrderNo").val().length == 0) {
                        kendo.ui.ExtAlertDialog.showError("请输入物流单号/质检单号");
                        return;
                    }
                    var count = 0;
                    $scope.mainGridOptions.dataSource._data.forEach(function(data) {
                        if (data.expressId === $("#packInOrderNo").val() || data.qcOrderId === $("#packInOrderNo").val()) {
                            count++;
                            return;
                        }
                    });

                    if (count != 0) {
                        kendo.ui.ExtAlertDialog.showError("该物流单号/质检单号已在列表显示!");
                        return;
                    }

                    var conditions = {
                        "packInOrderNo": $("#packInOrderNo").val()
                    };

                    //包裹入库确认
                    $sync(window.BASEPATH + "/qc/oper/queryPackInWh/" + $("#packInOrderNo").val(), "GET")
                        .then(function (xhr) {
                            var packInResult = xhr.data;
                            $scope.packInWhGrid.dataSource.add({
                                type: packInResult.qualityCheckOrder.type,
                                qcOrderId: packInResult.qualityCheckOrder.qcOrderId,
                                processStatus: packInResult.qualityCheckOrder.processStatus,
                                closeStatus: packInResult.qualityCheckOrder.closeStatus,
                                sellerUserName: packInResult.qualityCheckOrder.sellerUserName,
                                shopOrderId: packInResult.qualityCheckOrder.shopOrderId,
                                goodsCategoryName: (packInResult.qualityCheckOrderDetail.goodsCategoryName == null ? '' : packInResult.qualityCheckOrderDetail.goodsCategoryName),
                                goodsCode: packInResult.qualityCheckOrderDetail.goodsCode,
                                goodsName: packInResult.qualityCheckOrderDetail.goodsName,
                                goodsImage: packInResult.qualityCheckOrderDetail.goodsImage,
                                goodsPrice: packInResult.qualityCheckOrderDetail.goodsPrice,
                                buyerUserId: packInResult.qualityCheckOrder.buyerUserId,
                                inspectionRemark: packInResult.qualityCheckOrderDetail.inspectionRemark,
                                expressId: packInResult.qualityCheckOrder.expressId,
                                created: packInResult.qualityCheckOrder.created
                            });

                            $scope.showCancelPopup.refresh();
                            $scope.showCancelPopup.open().center();
                            $scope.expressId = packInResult.qualityCheckOrder.expressId;
                            $scope.qcOrderId = packInResult.qualityCheckOrder.qcOrderId;
                            $scope.orderType = packInResult.orderType;
                            $scope.shopName = packInResult.qualityCheckOrder.sellerUserName;
                            $scope.goodsName = packInResult.qualityCheckOrderDetail.goodsName;
//
                        }, function (data) {
                            $("#packInOrderNo").val('');
                            setTimeout(function () {
                                $("#packInOrderNo").focus();
                            }, 500);
                        });
                };

                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: packInWhDataSource,
                    toolbar: [
                        {template: '<a class="k-button k-grid-print" ng-click="qcPrintBySelect()" href="\\#">打印质检单</a>'}
                    ],
                    columns: packInWhColumns

                }, $scope);

                $scope.confirmStorage = function() {

                    if ($("#packInOrderNo").val() == null || $("#packInOrderNo").val().length == 0) {
                        kendo.ui.ExtAlertDialog.showError("请输入物流单号/质检单号");
                        return;
                    }
                    var count = 0;
                    $scope.mainGridOptions.dataSource._data.forEach(function(data) {
                        if (data.expressId === $("#packInOrderNo").val() || data.qcOrderId === $("#packInOrderNo").val()) {
                            count++;
                        }
                    });

                    if (count === 0) {
                        kendo.ui.ExtAlertDialog.showError("请先回车查询该质检单对应商品是否正确!");
                        return;
                    }

                    var conditions = {
                        "packInOrderNo": $("#packInOrderNo").val()
                    };

                    //包裹入库确认
                    $sync(window.BASEPATH + "/qc/oper/packInWh/" + $("#packInOrderNo").val(), "POST")
                        .then(function (xhr) {
                            var packInResult = xhr.data;

                            $("#packInOrderNo").val('');
                            setTimeout(function () {
                                $("#packInOrderNo").focus();
                            }, 500);
                        }, function (data) {
                            $("#packInOrderNo").val('');
                            setTimeout(function () {
                                $("#packInOrderNo").focus();
                            }, 500);
                        });
                }

                $scope.qcOrderPrint = function(_this) {
                    var reqList = [];
                    reqList.push(_this.qcOrderId);
                    qcPrintsExec(reqList);
                }

                $scope.qcPrintBySelect = function() {

                    var grid = $scope.packInWhGrid;
                    var selectedData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                    var ids = [];
                    var reqList = [];
                    selectedData.forEach(function (value) {
                            reqList.push(value.qcOrderId);
                    });
                    if (reqList.length == 0) {
                        kendo.ui.ExtAlertDialog.showError("请至少选择一条记录进行打印");
                        return;
                    }

                    qcPrintsExec(reqList);
                }

                function qcPrintsExec(reqList) {
                    var qcOrderIds = reqList.join(',');
                    $sync(window.BASEPATH + "/qc/order/qcOrderPrint/" + qcOrderIds, "GET")
                        .then(function (xhr) {
                            var printObj = xhr.data;

                            var printData = [];
                            for (var i = 0; i < printObj.length; i++) {
                                var dtoObj = printObj[i];
                                var element = {
                                    'qcOrderId':dtoObj.qualityCheckOrder.qcOrderId,
                                    'type': dtoObj.orderType,
                                    'goodsName': dtoObj.qualityCheckOrderDetial == null ? '' : dtoObj.qualityCheckOrderDetial.goodsName,
                                    'doodsDesc': dtoObj.qualityCheckOrderDetial == null ? '' : dtoObj.qualityCheckOrderDetial.doodsDesc,
                                    'goodsCode': dtoObj.qualityCheckOrderDetial == null ? '' : dtoObj.qualityCheckOrderDetial.goodsCode,
                                    'goodsPrice': dtoObj.qualityCheckOrderDetial == null ? '' : dtoObj.qualityCheckOrderDetial.goodsPrice,
                                    'goodsImage': dtoObj.qualityCheckOrderDetial == null ? '' : dtoObj.qualityCheckOrderDetial.goodsImage,
                                    'sellerUserName': dtoObj.qualityCheckOrder.sellerUserName,
                                    'shopOrderId': dtoObj.qualityCheckOrder.shopOrderId,
                                    'expressName': dtoObj.qualityCheckOrder.expressName,
                                    'expressId': dtoObj.qualityCheckOrder.expressId,
                                    'buyerUserId': dtoObj.qualityCheckOrder.buyerUserId,
                                    'created': dtoObj.created
                                };

                                printData.push(element);
                          }
                            wmsPrint.printData(printData, wmsPrint.PrintType.QC_Order_Pick);
                        });
                }

                $scope.cancelClose = function () {
                    $scope.expressId = '';
                    $scope.qcOrderId = '';
                    $scope.orderType = '';
                    $scope.shopName = '';
                    $scope.goodsName = '';
                    $scope.showCancelPopup.close();
                };
    }]);

})