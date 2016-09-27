define(['scripts/controller/controller',
    '../../model/inventory/inventoryLogModel'], function (controller, inventoryLogModel) {
    "use strict";

    controller.controller('reportIntegrationInventoryLogController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource', '$filter',
            function ($scope, $rootScope, $sync, $url, wmsDataSource, $filter) {
                var columnEditor = {
                    hidden: function (container, options) {
                        container.prev().hide();
                        container.hide();
                    },
                    readOnly: function (container, options) {
                        var input = $("<input/>", {readOnly: "readOnly"});
                        input.attr("name", options.field);
                        input.appendTo(container);
                    }
                };
                var url = $url.inventoryLogUrl,
                    columns = [
                        { title: '库存编号', field: 'inventoryId', align: 'left', width: "120px" },
                        { title: '单据号', field: 'orderId', align: 'left', width: "120px"},
                        { title: '进出存类型', field: 'typeCode', align: 'left', width: "150px", template: WMS.UTILS.codeFormat("typeCode", "AccountType")},
                        { field: 'storerId', title: '商家', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.storerFormat},
                        { title: 'SKU编码', field: 'skuSku', align: 'left', width: "100px"},
                        { title: '商品条码', field: 'skuBarcode', align: 'left', width: "160px"},
                        { title: '商品名称', field: 'skuItemName', align: 'left', width: "120px"},
                        { field: 'inventoryStatusCode', title: '库存状态', align: 'left', width: '120px', template: WMS.UTILS.codeFormat("inventoryStatusCode", "InventoryStatus")},
                        { field: 'lotKey', title: '批次号', filterable: false, align: 'left', width: '100px'},
                        { title: '货号', field: 'skuProductNo', align: 'left', width: "100px"},
                        { title: '型号', field: 'skuModel', align: 'left', width: "100px"},
                        { title: '颜色', field: 'skuColorCode', align: 'left', width: "100px", template: WMS.UTILS.codeFormat('skuColorCode', 'SKUColor')},
                        { title: '尺码', field: 'skuSizeCode', align: 'left', width: "100px", template: WMS.UTILS.codeFormat('skuSizeCode', 'SKUSize')},
                        { title: '库存变动', field: 'qty', footerTemplate: "#: sum #", align: 'left', width: "100px"},
                        { title: '单位', field: 'skuUnitCode', align: 'left', width: "100px", template: WMS.UTILS.codeFormat('skuUnitCode', 'MasterUnit')},
                        { editor: columnEditor.hidden, filterable: false, title: '创建人', field: 'createUser', align: 'left', width: "100px"} ,
                        { editor: columnEditor.hidden, filterable: false, title: '创建时间', field: 'createTime', align: 'left', width: "150px", template: WMS.UTILS.timestampFormat("createTime")}
                    ],
                    DataSource = wmsDataSource({
                        url: url,
                        aggregate: [
                            { field: "qty", aggregate: "sum" }
                        ],
                        schema: {
                            model: inventoryLogModel.header
                        }
                    });
//                columns = columns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    hasFooter: true,
                    exportable: true,
                    dataSource: DataSource,
                    columns: columns
                }, $scope);
//
//                //导出Excel
//                $scope.exportExcel = function () {
//                    exportCurrent($scope.reportInventoryLogGrid, url,'进出存明细.xls');
//                };
//
//                $scope.exportExcelAll = function () {
//                    exportCurrentAll($scope.reportInventoryLogGrid, url,'进出存明细.xls');
//                };

                // 初始化检索区数据
//                $scope.query = {
//                    startTime: $filter('date')(new Date(),'yyyy/MM/dd 00:00:00')
//                };

            }
        ]
    );
});