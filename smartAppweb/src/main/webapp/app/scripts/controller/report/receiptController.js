/**
 * Created by MLS on 15/3/31.
 */

define(['scripts/controller/controller', '../../model/warehouse/in/receiptModel'], function (controller, receiptModel) {
    "use strict";
    controller.controller('reportInReceiptController',
        ['$scope', '$rootScope', '$http', 'url', 'wmsDataSource', 'wmsLog', 'sync',
            function ($scope, $rootScope, $http, $url, wmsDataSource, wmsLog, $sync) {
                var headerUrl = $url.reportInReceiptUrl + "/detail",
                    headerColumns = [
                        { filterable: false, title: '入库单号', field: 'headerEntity.id', align: 'left', width: "125px"},
                        { filterable: false, title: '参考单号', field: 'headerEntity.referNo', align: 'left', width: "125px"},
                        { filterable: false, title: 'ERP单号', field: 'headerEntity.fromErpNo', align: 'left', width: "120px;"},
                        { filterable: false, title: '到货通知单号', field: 'headerEntity.asnId', align: 'left', width: "150px"},
                        { filterable: false, title: '供应商', field: 'headerEntity.supplierId', align: 'left', width: "150px", template: WMS.UTILS.vendorFormat('headerEntity.supplierId')},
                        { filterable: false, title: '仓库', field: 'headerEntity.warehouseId', align: 'left', width: "100px", template: WMS.UTILS.whFormat('headerEntity.warehouseId')},
                        { filterable: false, title: '商家', field: 'headerEntity.storerId', align: 'left', width: "100px", template: WMS.UTILS.storerFormat('headerEntity.storerId')},
//                        { filterable: false, title: 'SKU', field: 'skuSku', align: 'left', width: "120px;"},
                        { field: 'skuItemName', title: '商品名称', filterable: false, align: 'left', width: '100px'},
                        { filterable: false, title: '商品条码', field: 'skuBarcode', align: 'left', width: "160px"},
                        { filterable: false, title: 'SKU描述', field: 'skuDescription', align: 'left', width: "120px", template: function (dataItem) {
                            return WMS.UTILS.tooLongContentFormat(dataItem, 'skuDescription');
                        }},
                        { filterable: false, title: '库存状态', field: 'inventoryStatusCode', template: WMS.UTILS.codeFormat('inventoryStatusCode', 'InventoryStatus'), align: 'left', width: "120px;"},
                        { filterable: false, title: '颜色', field: 'skuColorCode', align: 'left', width: "120px;", template: WMS.UTILS.codeFormat('skuColorCode', 'SKUColor')},
                        { filterable: false, title: '尺码', field: 'skuSizeCode', align: 'left', width: "120px;"},
                        { filterable: false, title: '货号', field: 'skuProductNo', align: 'left', width: "120px;"},
                        { filterable: false, title: '型号', field: 'skuModel', align: 'left', width: "120px;"},
                        { filterable: false, title: '收货数量', footerTemplate: "#: sum #", field: 'receivedQty', align: 'left', width: "120px"},
                        { filterable: false, title: '箱号', field: 'cartonNo', align: 'left', width: "120px"},
                        { filterable: false, title: '托盘号', field: 'palletNo', align: 'left', width: "120px"},
                        { filterable: false, title: '净重(g)', field: 'netWeight', align: 'left', width: "120px"},
                        { filterable: false, title: '毛重(g)', field: 'grossWeight', align: 'left', width: "120px"},
                        { filterable: false, title: '体积(cm³)', field: 'cube', align: 'left', width: "120px"},
                        { filterable: false, title: '收货日期', field: 'receiptTime', template: WMS.UTILS.timestampFormat("receipt_time"), align: 'left', width: "120px"},
                        WMS.UTILS.CommonColumns.defaultColumns
                    ],

                    headerDataSource = wmsDataSource({
                        url: headerUrl,
                        aggregate: [
                            { field: "receivedQty", aggregate: "sum" }
                        ],
                        schema: {
                            model: receiptModel.header
                        }
                    });
                headerColumns = headerColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    widgetId: "header",
                    exportable: true,
                    dataSource: headerDataSource,
                    columns: headerColumns,
                    dataBound: function (e) {
                    }
                }, $scope);
                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;
//                //导出Excel
//                $scope.exportExcel = function () {
//                    exportCurrent($scope.receiptHeaderGrid, headerUrl,'入库明细.xls');//exportCurrent
//                };
//
//                $scope.exportExcelAll = function () {
//                    exportCurrentAll($scope.receiptHeaderGrid, headerUrl,'入库明细.xls');//exportCurrent
//                };

            }]);
})