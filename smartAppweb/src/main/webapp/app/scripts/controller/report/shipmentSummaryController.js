
define(['../controller',
        '../../model/warehouse/out/shipmentSummaryModel'
    ],function(controller, shipmentSummaryModel){
        "use strict";
        controller.controller('reportOutShipmentSummaryController',
            ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource',
                function($scope, $rootScope, $sync, $url, wmsDataSource){
                    var shipmentSummaryUrl = $url.warehouseOutShipmentSummaryUrl,
                        shipmentSummaryColumns = [
                            {filterable: false,title: '商品名称', field:'itemName', align:'left', width:"120px"},
//                            {filterable: false,title: '商品编码', field:'sku', align:'left', width:"120px"},
                            {filterable: false,title: '颜色', field:'colorCode', align:'left', width:"120px", template: WMS.UTILS.codeFormat('skuColorCode', 'SKUColor')},
                            {filterable: false,title: '尺码', field:'sizeCode', align:'left', width:"120px"},
                            {filterable: false,title: '货号', field:'productNo', align:'left', width:"120px"},
                            {filterable: false,title: '型号', field:'model', align:'left', width:"120px"},
                            {filterable: false,title: '条码', field:'barcode', align:'left', width:"120px"},
                            {filterable: false,title: '发货数量', field:'shippedQty', align:'left', width:"120px"}
                        ],
                        shipmentSummaryDataSource = wmsDataSource({
                           url: shipmentSummaryUrl,
                           schema: {
                               model: shipmentSummaryModel.shipmentSummaryDetail
                           }
                        });

                    $scope.shipmentSummaryOptions = WMS.GRIDUTILS.getGridOptions({
                        dataSource:shipmentSummaryDataSource,
                        exportable: true,
                        columns: shipmentSummaryColumns
                    }, $scope);
                }
            ]
        );
    }

)