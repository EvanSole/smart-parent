define(['../controller'
    ], function (controller) {
        "use strict";
        controller.controller('reportOutShipmentCartonController',
            ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource',
                function ($scope, $rootScope, $sync, $url, wmsDataSource) {
                    var shipmentHeaderUrl = $url.warehouseOutShipmentCartonUrl,
                        shipmentHeaderColumns = [
                            {filterable: false, title: '箱型', field: 'cartongroupCode', align: 'left', width: "50px"},
                            {filterable: false, title: '使用量', field: 'cartonGroupCount',footerTemplate: "#: sum #", align: 'left', width: "150px"}
                        ],
                        shipmentHeaderDataSource = wmsDataSource({
                            url: shipmentHeaderUrl,
                            aggregate: [
                                { field: "cartonGroupCount", aggregate: "sum" }
                            ],
                            schema: {
                                model: {
                                    id: "id",
                                    fields: {
                                        id: {type:"number", editable: false, nullable: true},
                                        cartonGroupCount: { type: 'number' }
                                    }
                                }
                            }
                        });
                    $scope.shipmentCartonOptions = WMS.GRIDUTILS.getGridOptions({
                        dataSource: shipmentHeaderDataSource,
                        exportable: true,
                        autoBind: true,
                        hasFooter: true,
                        toolbar: [
                        ],
                        columns: shipmentHeaderColumns
                    }, $scope);
                }
            ]
        );
    }
)