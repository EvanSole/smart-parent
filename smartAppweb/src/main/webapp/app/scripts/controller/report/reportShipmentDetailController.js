define(['../controller',
        '../../model/warehouse/out/shipmentDetailModel'
    ], function (controller, shipmentDetailModel) {
        "use strict";
        controller.controller('reportOutShipmentDetailController',
            ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource',
                function ($scope, $rootScope, $sync, $url, wmsDataSource) {
                    var shipmentDetailUrl = $url.warehouseOutShipmentDetailUrl,
                        shipmentDetailColumns = [
                            {filterable: false, title: '出库单号', field: 'shipmentId', align: 'left', width: "120px"},
                            {filterable: false, title: 'ERP单号', field: 'fromErpNo', align: 'left', width: "120px;"},
                            { filterable: false, title: '交易单号', field: 'tradeNos', align: 'left', width: "160px;"},
                            {filterable: false, title: '波次单号', field: 'waveId', align: 'left',width:"120px;"},
                            {filterable: false, title: '物流单号', field: 'carrierReferNo', align: 'left',width:"120px"},
                            {filterable: false, title: '承运商', field: 'carrierNo',template:WMS.UTILS.carrierFormat("carrierNo"), align: 'left',width:"120px"},
                            {filterable: false, title: '订单来源', field: 'fromtypeCode', align: 'left', width: "100px", template: WMS.UTILS.codeFormat('fromtypeCode', 'AllShipmentFrom')},
                            {filterable: false, title: '店铺名称', field: 'shopName', align: 'left', width: "120px"},
                            {filterable: false, title: '商家名称', field: 'storerId', align: 'left', width: "120px;", template: WMS.UTILS.storerFormat},
                            {filterable: false, title: '发货时间', field: 'deliveryTime', template: WMS.UTILS.timestampFormat("deliveryTime", "yyyy-MM-dd HH:mm:ss"), align: 'left', width: "150px"},
                            {filterable: false, title: '商品名称', field: 'skuItemName', align: 'left', width: "120px"},

//                            {filterable: false,title: '商品编码', field:'sku', align:'left', width:"120px"},
                            { field: 'skuColorCode', title: '商品颜色', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.codeFormat('skuColorCode', 'SKUColor')},
                            { field: 'skuSizeCode', title: '商品尺码', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.codeFormat('skuSizeCode', 'SKUSize')},
                            { field: 'inventoryStatusCode', title: '库存状态', filterable: false, align: 'left', width: '100px',template:WMS.UTILS.codeFormat("inventoryStatusCode","InventoryStatus")},
//                            {filterable: false, title: '颜色', field: 'skuColorCode', align: 'left', width: "120px"},
//                            {filterable: false, title: '尺码', field: 'skuSizeCode', align: 'left', width: "120px"},
                            {filterable: false, title: '货号', field: 'skuProductNo', align: 'left', width: "120px"},
                            {filterable: false, title: '型号', field: 'skuModel', align: 'left', width: "120px"},
                            {filterable: false, title: '条码', field: 'skuBarcode', align: 'left', width: "120px"},
//                            {filterable: false,title: '发货数量', field:'shippedQty', align:'left', width:"120px"},
                            {filterable: false, title: '发货数量', field: 'orderedQty', footerTemplate: "#: sum #", align: 'left', width: "120px"},
                            {filterable: false, title: '分配数量', field: 'allocatedQty', footerTemplate: "#: sum #", align: 'left', width: "120px"}
                        ],
                        shipmentDetailDataSource = wmsDataSource({
                            url: shipmentDetailUrl,
                            aggregate: [
                                { field: "orderedQty", aggregate: "sum" },
                                { field: "allocatedQty", aggregate: "sum" }
                            ],
                            schema: {
                                model: shipmentDetailModel.shipmentDetail
                            }
                        });

                    $scope.shipmentDetailOptions = WMS.GRIDUTILS.getGridOptions({
                        dataSource: shipmentDetailDataSource,
                        exportable: true,
                        hasFooter: true,
                        columns: shipmentDetailColumns
                    }, $scope);
//                    //导出Excel
//                    $scope.exportExcel = function () {
//                        exportCurrent($scope.shipmentDetailGrid, shipmentDetailUrl,'出库明细.xls');
//                    };
//
//                    $scope.exportExcelAll = function () {
//                        exportCurrentAll($scope.shipmentDetailGrid, shipmentDetailUrl,'出库明细.xls');
//                    };

                }
            ]
        );
    }
)