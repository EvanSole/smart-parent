/**
 * Created by xiagn on 15/4/1.
 */
define(['scripts/controller/controller'], function (controller, sku) {
    "use strict";

    controller.controller('reportInvDetailController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource','$http', '$filter',
            function ($scope, $rootScope, $sync, $url, wmsDataSource,$http,$filter) {

                var inventoryUrl = "/inventory",
                    inventoryColumns = [
                        { field: 'storerId', title: '商家', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.storerFormat},
                        { field: 'warehouseId', title: '仓库', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.whFormat},
                        { field: 'zoneId', title: '货区类型', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.zoneTypeFormat},
                        { field: 'skuProductNo', title: '货号', filterable: false, align: 'left', width: '100px'},
                        { field: 'lotKey', title: '批次号', filterable: false, align: 'left', width: '100px'},
                        { field: 'skuSku', title: 'SKU', filterable: false, align: 'left', width: '100px'},
                        { field: 'skuItemName', title: '商品名称', filterable: false, align: 'left', width: '100px'},
                        { field: 'inventoryStatusCode', title: '库存状态', align: 'left', width: '120px', template: WMS.UTILS.codeFormat("inventoryStatusCode", "InventoryStatus")},
                        { field: 'skuBarcode', title: '条码', filterable: false, align: 'left', width: '100px'},
                        { field: 'skuColorCode', title: '颜色', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.codeFormat('skuColorCode', 'SKUColor')},
                        { field: 'skuSizeCode', title: '尺码', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.codeFormat('skuSizeCode', 'SKUSize')},
                        { field: 'skuUnitCode', title: '单位', template: WMS.UTILS.codeFormat('skuUnitCode', 'MasterUnit'), filterable: false, align: 'left', width: '100px'},
                        { field: 'price', title: '成本价', filterable: false, align: 'left', width: '100px'},
                        { field: 'onhandQty', title: '在库数量', footerTemplate: "#: sum #", filterable: false, align: 'left', width: '100px'},
                        { field: 'allocatedQty', title: '已分配数量', footerTemplate: "#: sum #", filterable: false, align: 'left', width: '100px',
                            template: "<a class='k-button k-button-custom-command' name='showAllocateDetail' href='\\#' ng-click='showAllocateDetail(this);' ><span ng-bind='dataItem.allocatedQty'></span></a> "},
                        { field: 'activeQty', title: '可用数量', footerTemplate: "#: sum #", filterable: false, align: 'left', width: '100px',excelExport:"calcParse:onhandQty-allocatedQty"},
                        { field: 'pickedQty', title: '已拣货数量', footerTemplate: "#: sum #", filterable: false, align: 'left', width: '100px',
                            template: "<a class='k-button k-button-custom-command'  name='showPickDetail' href='\\#' ng-click='showPickDetail(this);' ><span ng-bind='dataItem.pickedQty'></span></a>"},
                        { field: 'zoneId', title: '区域', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.zoneNoFormat },
                        { field: 'locationId', title: '货位', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.locationFormat, sortable: {
                            compare: function(a, b) {
                                return $filter("locationFormat")(a.locationId).localeCompare($filter("locationFormat")(b.locationId));
                            }
                        }},
//                      { field: 'palletNo', title: '托盘', filterable: false, align:'left', width: '100px'},
//                        { field: 'cartonNo', title: '箱号', filterable: false, align:'left', width: '100px'},
                        { field: 'createTime', title: '入库时间', filterable: false, align: 'left', width: "150px", template: WMS.UTILS.timestampFormat("createTime")},
                        { field: 'isHold', title: '是否冻结', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.checkboxDisabledTmp('isHold', 'yesOrNoHoldFormat')},
                        { field: 'holdId', title: '冻结ID', filterable: false, align: 'left', width: '100px'},
                        { field: 'cycleCountId', title: '盘点ID', filterable: false, align: 'left', width: '100px'},
                        { field: 'isCycleCount', title: '是否盘点', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.checkboxDisabledTmp('isCycleCount', 'yesOrNoCycleFormat')},
                        { filterable: false, title: '生产日期', field: 'productionTime', align: 'left', width: "150px",template: WMS.UTILS.timestampFormat("productionTime")},
                        { filterable: false, title: '过期日期', field: 'expiredTime', align: 'left', width: "150px",template: WMS.UTILS.timestampFormat("expiredTime")},
                        { field: 'updateUser', title: '修改人', filterable: false, align: 'left', width: '100px'},
                        { field: 'updateTime', title: '修改时间', filterable: false, align: 'left', width: '150px', template: WMS.UTILS.timestampFormat("updateTime")}
                    ],
                    inventoryDataSource = wmsDataSource({
                        url: inventoryUrl,
                        aggregate: [
                            { field: "activeQty", aggregate: "sum" },
                            { field: "onhandQty", aggregate: "sum" },
                            { field: "pickedQty", aggregate: "sum" },
                            { field: "allocatedQty", aggregate: "sum" }
                        ],
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: { type: "number", editable: false, nullable: true }
                                }
                            },
                            parse: function (data) {
                                return _.map(data, function (record) {
                                    record.activeQty = record.onhandQty - record.allocatedQty;
                                    return record;
                                });
                            }

                        }
                    });
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: inventoryDataSource,
                    exportable: true,
                    hasFooter: true,
                    columns: inventoryColumns,
                    editable: false
                }, $scope);

                var pickDetailColumns = [
                    { field: 'waveId', title: '波次单号', filterable: false, align: 'left', width: '100px'},
                    { field: 'shipmentId', title: '出库单号', filterable: false, align: 'left', width: '100px'},
                    { field: 'locationNo', title: '小车编号', filterable: false, align: 'left', width: '100px'},
                    { field: 'pickedQty', title: '已拣货数量', filterable: false, align: 'left', width: '100px'}
                ];


                $scope.showPickDetail = function (data) {
                    $scope.pickDetailPopup.refresh().open().center();
                    var inventoryId = data.dataItem.id;
                    $("#pickDetailPopupGrid").kendoGrid({
                        columns: pickDetailColumns,
                        editable: false,
                        dataSource: wmsDataSource({
                            url: window.BASEPATH + "/inventory/report/pick/inventory/" + inventoryId,
                            schema: {
                                model: {
                                    id: "id",
                                    fields: {
                                        id: { type: "number", editable: false, nullable: true }
                                    }
                                }
                            }
                        })
                    });
                };

                var allocateDetailColumns = [
                    { field: 'waveId', title: '波次单号', filterable: false, align: 'left', width: '100px'},
                    { field: 'shipmentId', title: '出库单号', filterable: false, align: 'left', width: '100px'},
                    { field: 'detailLineNo', title: '出库单行号', filterable: false, align: 'left', width: '100px'},
//                    { field: 'warehouseId', title: '仓库', filterable: false, align:'left', width: '100px', template:WMS.UTILS.whFormat},
//                    { field: 'zoneId', title: '货区类型', filterable: false, align:'left', width: '100px',template:WMS.UTILS.zoneTypeFormat},
//                    { field: 'zoneId', title: '货区', filterable: false, align:'left', width: '100px',template:WMS.UTILS.zoneNoFormat},
//                    { field: 'locationId', title: '货位', filterable: false, align:'left', width: '100px', template:WMS.UTILS.locationFormat},
//                    { field: 'palletNo', title: '托盘号', filterable: false, align:'left', width: '100px'},
//                    { field: 'cartonNo', title: '箱号', filterable: false, align:'left', width: '100px'},
                    { field: 'skuBarcode', title: '商品条码', filterable: false, align: 'left', width: '160px'},
                    { field: 'orderedQty', title: '期望出库数量', filterable: false, align: 'left', width: '100px'},
                    { field: 'allocatedQty', title: '分配数量', filterable: false, align: 'left', width: '100px'},
                    { field: 'pickedQty', title: '拣货数量', filterable: false, align: 'left', width: '100px'}
//                    { field: 'shippedQty', title: '发货数量', filterable: false, align:'left', width: '100px'}
                ];

                $scope.showAllocateDetail = function (data) {
                    $scope.invAllocatePopup.refresh().open().center();
                    var inventoryId = data.dataItem.id;
                    $scope.invAllocatePopup.initParam = function (subScope) {
                        subScope.url = window.BASEPATH + "/inventory/report/allocate/inventory/" + inventoryId;
                    };


                };

//                $scope.showAllocateDetail = function(data){
//                    $scope.allocateDetailPopup.refresh().open().center();
//                    var inventoryId = data.dataItem.id;
//                    $("#allocateDetailPopupGrid").kendoGrid({
//                        columns: allocateDetailColumns,
//                        editable: false,
//                        dataSource: wmsDataSource({
//                            url: window.BASEPATH + "/inventory/report/allocate/inventory/"+inventoryId,
//                            schema:{
//                                model:{
//                                    id:"id",
//                                    fields: {
//                                        id: { type: "number", editable: false, nullable: true }
//                                    }
//                                }
//                            }
//                        })
//                    });
//                };
            }]);

})