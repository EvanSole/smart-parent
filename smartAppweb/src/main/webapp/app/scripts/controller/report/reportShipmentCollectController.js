define(['../controller',
        '../../model/warehouse/out/shipmentDetailModel'
    ], function (controller, shipmentDetailModel) {
        "use strict";
        controller.controller('reportOutShipmentCollectController',
            ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource',
                function ($scope, $rootScope, $sync, $url, wmsDataSource) {
                    var shipmentDetailUrl = $url.warehouseOutShipmentCollectUrl,
                        shipmentDetailColumns = [

//                          {filterable: false, title: 'SKU', field: 'skuId', align: 'left', width: "120px"},
                            { filterable: false, title: '商家名称', field: 'storerId', align: 'left', width: "120px;", template: WMS.UTILS.storerFormat},
                            {filterable: false, title: '商品名称', field: 'skuItemName', align: 'left', width: "120px"},
                            {filterable: false,title: '商品条码', field:'skuBarcode', align:'left', width:"160px"},
                            { field: 'skuColorCode', title: '商品颜色', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.codeFormat('skuColorCode', 'SKUColor')},
                            { field: 'skuSizeCode', title: '商品尺码', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.codeFormat('skuSizeCode', 'SKUSize')},
                            {filterable: false, title: '商品货号', field: 'skuProductNo', align: 'left', width: "120px"},
                            {filterable: false, title: '库存状态', field: 'inventoryStatusCode',template:WMS.UTILS.codeFormat("inventoryStatusCode","InventoryStatus"),align: 'left', width: "120px"},
                            {filterable: false, title: '出库数量', field: 'shippedQty',footerTemplate: "#: sum #", align: 'left', width: "80px"}
//                            {filterable: false, title: '发货时间', field: 'deliveryTime',template: WMS.UTILS.timestampFormat("deliveryTime", "yyyy-MM-dd"), align: 'left', width: "150px"}
                        ],
                        shipmentDetailDataSource = wmsDataSource({
                            url: shipmentDetailUrl,
                            aggregate: [
                                { field: "shippedQty", aggregate: "sum" }
                            ],
                            schema: {
                                model: shipmentDetailModel.shipmentDetail
                            }
                        });

                    $scope.shipmentDetailOptions = WMS.GRIDUTILS.getGridOptions({
                        dataSource: shipmentDetailDataSource,
                        exportable: true,
                        autoBind: true,
                        hasFooter: true,
                        columns: shipmentDetailColumns
                    }, $scope);
                }
            ]
        );
    }
)