define(['scripts/controller/controller'], function(controller){
    "use strict";
    controller.controller('popupInvAllocateController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource',
            function($scope, $rootScope, $sync, $url, wmsDataSource){
                var allocateDetailColumns = [
                        { field: 'waveId', title: '波次单号', filterable: false, align:'left', width: '100px'},
                        { field: 'shipmentId', title: '出库单号', filterable: false, align:'left', width: '100px'},
//                        { field: 'detailLineNo', title: '出库单行号', filterable: false, align:'left', width: '100px'},
//                        { field: 'warehouseId', title: '仓库', filterable: false, align:'left', width: '100px', template:WMS.UTILS.whFormat},
                        { field: 'zoneId', title: '货区类型', filterable: false, align:'left', width: '100px',template:WMS.UTILS.zoneTypeFormat},
                        { field: 'zoneId', title: '货区', filterable: false, align:'left', width: '100px',template:WMS.UTILS.zoneNoFormat},
                        { field: 'locationId', title: '货位', filterable: false, align:'left', width: '100px', template:WMS.UTILS.locationFormat},
                        //                    { field: 'palletNo', title: '托盘号', filterable: false, align:'left', width: '100px'},
                        //                    { field: 'cartonNo', title: '箱号', filterable: false, align:'left', width: '100px'},
                        { field: 'skuBarcode', title: '商品条码', filterable: false, align:'left', width: '160px'},
                        { field: 'orderedQty', title: '期望出库数量', footerTemplate: "#: sum #", filterable: false, align:'left', width: '150px'},
                        { field: 'allocatedQty', title: '分配数量', footerTemplate: "#: sum #", filterable: false, align:'left', width: '100px'},
                        { field: 'pickedQty', title: '拣货数量', footerTemplate: "#: sum #", filterable: false, align:'left', width: '100px'}
                        //                    { field: 'shippedQty', title: '发货数量', filterable: false, align:'left', width: '100px'}
                    ];
                var invAllocateUrl = "";
                var invAllocateDataSource = wmsDataSource({
                    url: invAllocateUrl,
                    aggregate: [
                        { field: "orderedQty", aggregate: "sum" },
                        { field: "allocatedQty", aggregate: "sum" },
                        { field: "pickedQty", aggregate: "sum" }
                    ],
                    schema:{
                        model:{
                            id:"id",
                            fields: {
                                id: { type: "number", editable: false, nullable: true }
                            }
                        }
                    }
                });
                $scope.invAllocateOptions = WMS.GRIDUTILS.getGridOptions({
                    widgetId: "invAllocatePopup",
                    dataSource: invAllocateDataSource,
                    columns: allocateDetailColumns,
                    pageable: false,
                    hasFooter: true,
                    autoBind:false,
                    editable: false
                }, $scope);

                $scope.$on("kendoWidgetCreated", function(event, widget){
                    if(widget.options !== undefined && widget.options.widgetId === "invAllocatePopup"){
                        if(_.isFunction($scope.invAllocatePopup.initParam)){
                            $scope.invAllocatePopup.initParam($scope);
                            if($scope.url){
                                invAllocateUrl = $scope.url;
                            }

                            invAllocateDataSource = wmsDataSource({
                                url: invAllocateUrl,
                                aggregate: [
                                    { field: "orderedQty", aggregate: "sum" },
                                    { field: "allocatedQty", aggregate: "sum" },
                                    { field: "pickedQty", aggregate: "sum" }
                                ],
                                schema:{
                                    model:{
                                        id:"id",
                                        fields: {
                                            id: { type: "number", editable: false, nullable: true }
                                        }
                                    }
                                }
                            });
                            invAllocateDataSource.read();
                            widget.setDataSource(invAllocateDataSource);
                            widget.refresh();
                        }
                    }
                });
            }
        ]
    );
});