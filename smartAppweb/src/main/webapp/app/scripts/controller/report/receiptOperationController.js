/**
 * Created by MLS on 15/3/31.
 */

define(['scripts/controller/controller', '../../model/warehouse/in/receiptModel'], function (controller, receiptModel) {
    "use strict";
    controller.controller('reportReceiptOperationController',
        ['$scope', '$rootScope', '$http', 'url', 'wmsDataSource', 'wmsLog', 'sync',
            function ($scope, $rootScope, $http, $url, wmsDataSource, wmsLog, $sync) {
                var headerUrl = $url.reportReceiptOperationUrl + "/operation",
                    headerColumns = [

                        //到货通知单号、ｅｒｐ单号、关联单号、单据类型、商品条码、颜色、尺码、货号、型号、状态、实收数量、收货人、收货时间、商家、容器编码；
                        { filterable: false, title: '到货通知单号', field: 'id', align: 'left', width: "125px"},
                        { filterable: false, title: '入库单号', field: 'receiptId', align: 'left', width: "125px"},
                        { filterable: false, title: 'ERP单号', field: 'fromErpNo', align: 'left', width: "120px;"},
                        { filterable: false, title: '关联单号', field: 'fromRelateNo', align: 'left', width: "150px"},
                        { filterable: false, title: '单据来源', field: 'fromTypeCode', template: WMS.UTILS.codeFormat('fromTypeCode', 'ReceiptFrom'), align: 'left', width: "120px;"},
                        { filterable: false, title: '数据来源', field: 'datasourceCode', template: WMS.UTILS.codeFormat('datasourceCode', 'DataSource'), align: 'left', width: "120px;"},
                        { field: 'skuItemName', title: '商品名称', filterable: false, align: 'left', width: '100px'},
                        { filterable: false, title: '商品条码', field: 'skuBarcode', align: 'left', width: "160px"},
                        { filterable: false, title: '颜色', field: 'skuColorCode', align: 'left', width: "120px;", template: WMS.UTILS.codeFormat('skuColorCode', 'SKUColor')},
                        { filterable: false, title: '尺码', field: 'skuSizeCode', align: 'left', width: "120px;", template: WMS.UTILS.codeFormat('skuSizeCode', 'SKUSize')},
                        { filterable: false, title: '货号', field: 'skuProductNo', align: 'left', width: "120px;"},
                        { filterable: false, title: '型号', field: 'skuModel', align: 'left', width: "120px;"},
                        { filterable: false, title: '商品状态', field: 'inventoryStatusCode', template: WMS.UTILS.codeFormat('inventoryStatusCode', 'InventoryStatus'), align: 'left', width: "120px;"},
                        { filterable: false, title: '实收数量',footerTemplate: "#: sum #", field: 'receivedQty', align: 'left', width: "120px"},
                        { filterable: false, title: '收货人', field: 'createUser', align: 'left', width: "120px"},
                        { filterable: false, title: '收货时间', field: 'receiptTime', align: 'left', width: "150px",template: WMS.UTILS.timestampFormat("receiptTime")},
                        { filterable: false, title: '商家', field: 'storerId', align: 'left', width: "120px", template: WMS.UTILS.storerFormat},
                        { filterable: false, title: '容器号', field: 'locationId', align: 'left', width: "120px",template: WMS.UTILS.locationFormat},
                        { filterable: false, title: '批次号', field: 'lotKey', align: 'left', width: "120px"},
                        { filterable: false, title: '生产日期', field: 'productionTime', align: 'left', width: "150px",template:  WMS.UTILS.timestampFormat("productionTime")},
                        { filterable: false, title: '过期日期', field: 'expiredTime', align: 'left', width: "150px",template: WMS.UTILS.timestampFormat("expiredTime")}
                        //WMS.UTILS.CommonColumns.defaultColumns
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
                //headerColumns = headerColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    hasFooter: true,
                    widgetId: "header",
                    exportable: true,
                    dataSource: headerDataSource,
                    columns: headerColumns,
                    dataBound: function (e) {
                    }
                }, $scope);
                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;



            }]);
})