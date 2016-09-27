/**
 * Created by xiagn on 15/4/1.
 */
define(['scripts/controller/controller'], function (controller, sku) {
    "use strict";

    controller.controller('reportHistoryDetailController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource', '$filter',
            function ($scope, $rootScope, $sync, $url, wmsDataSource,$filter) {

                var inventoryUrl = "/inventory/history",
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
                        { field: 'allocatedQty', title: '已分配数量', footerTemplate: "#: sum #", filterable: false, align: 'left', width: '100px'},
                        { field: 'activeQty', title: '可用数量', footerTemplate: "#: sum #", filterable: false, align: 'left', width: '100px',excelExport:"calcParse:onhandQty-allocatedQty"},
                        { field: 'pickedQty', title: '已拣货数量', footerTemplate: "#: sum #", filterable: false, align: 'left', width: '100px'},
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
                        { field: 'holdId', title: '冻结ID', filterable: false, align: 'left', width: '100px', template: function(obj){
                            if (obj.holdId == 0) {return ''} else { obj.holdId}}},
                        { field: 'cycleCountId', title: '盘点ID', filterable: false, align: 'left', width: '100px', template: function(obj){
                            if (obj.cycleCountId == 0) {return ''} else { obj.cycleCountId}}},
                        { field: 'isCycleCount', title: '是否盘点', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.checkboxDisabledTmp('isCycleCount', 'yesOrNoCycleFormat')},
                        { filterable: false, title: '生产日期', field: 'productionTime', align: 'left', width: "150px",template: WMS.UTILS.timestampFormat("productionTime")},
                        { filterable: false, title: '过期日期', field: 'expiredTime', align: 'left', width: "150px",template: WMS.UTILS.timestampFormat("expiredTime")},
//                        { field: 'createUser', title: '创建人', filterable: false, align: 'left', width: '100px'},
//                        { field: 'createTime', title: '入库时间', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.timestampFormat("createTime")},
                        { field: 'updateUser', title: '修改人', filterable: false, align: 'left', width: '100px'},
                        { field: 'updateTime', title: '修改时间', filterable: false, align: 'left', width: '150px', template: WMS.UTILS.timestampFormat("updateTime")},
                        { field: 'execTime', title: '快照日期', filterable: false, align: 'left', width: '150px', template: WMS.UTILS.timestampFormat("execTime")}
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
            }]);

})