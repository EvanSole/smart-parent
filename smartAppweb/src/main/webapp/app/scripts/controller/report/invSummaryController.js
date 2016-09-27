
define(['scripts/controller/controller'], function(controller){
    "use strict";

    controller.controller('reportInvSummaryController',
    ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource',
        function($scope, $rootScope, $sync, $url, wmsDataSource){
            var invSummaryUrl = "/inventory/summary",
                invSummaryColumns = [
                    { field: 'storerId', title: '商家', filterable: false, align: 'left', width: '100px', template:WMS.UTILS.storerFormat},
//                    { field: 'skuSku', title: 'SKU', filterable: false, align: 'left', width: '100px'},
                    { field: 'skuItemName', title: '商品名称', filterable: false, align: 'left', width: '100px'},
                    { field: 'inventoryStatusCode', title: '库存状态', align: 'left', width: '120px', template: WMS.UTILS.codeFormat("inventoryStatusCode", "InventoryStatus")},
                    { field: 'skuBarcode', title: '条码', filterable: false, align: 'left', width: '100px'},
                    { field: 'skuColorCode', title: '颜色', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.codeFormat('skuColorCode', 'SKUColor')},
                    { field: 'skuSizeCode', title: '尺码', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.codeFormat('skuSizeCode', 'SKUSize')},
                    { field: 'skuProductNo', title: '产品货号', filterable: false, align: 'left', width: '100px'},
//                    { field: 'skuUnitCode', title: '单位', template: WMS.UTILS.codeFormat('skuUnitCode', 'MasterUnit'), filterable: false, align: 'left', width: '100px'},
                    { field: 'onhandQty', title: '在库数量', footerTemplate: "#: sum #", filterable: false, align: 'left', width: '100px'},
                    { field: 'allocatedQty', title: '已分配数量', footerTemplate: "#: sum #", filterable: false, align: 'left', width: '100px'},
                    { field: 'activeQty', title: '可用数量', footerTemplate: "#: sum #", filterable: false, align: 'left', width: '100px',excelExport:"calcParse:onhandQty-allocatedQty"},
                    { field: 'pickedQty', title: '已拣货数量', footerTemplate: "#: sum #", filterable: false, align: 'left', width: '100px'}
//                    { field: 'createTime', title: '入库时间', filterable: false, align: 'left', width: "150px", template: WMS.UTILS.timestampFormat("createTime")},
                ],
                invSummaryDataSource = wmsDataSource({
                    url: invSummaryUrl,
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
                dataSource: invSummaryDataSource,
                exportable: true,
                hasFooter: true,
                columns: invSummaryColumns,
                editable: false
            }, $scope);
        }
    ]);
});