define(['scripts/controller/controller'], function(controller){
    "use strict";

    controller.controller('reportIntegrationLocationAnalysisController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource', '$filter',
            function($scope, $rootScope, $sync, $url, wmsDataSource, $filter){
                var url = $url.locationAnalysisUrl,
                    columns = [
                        { title: '货区', field: 'zoneNo', align: 'left', width: "120px" },
                        { title: '在库SKU数', field: 'countSKU', footerTemplate: "#: sum #", align: 'left', width: "120px" },
                        { title: '在库商品数', field: 'sumQty', footerTemplate: "#: sum #", align: 'left', width: "120px" },
                        { title: '已用货位数', field: 'usedLocation', footerTemplate: "#: sum #", align: 'left', width: "120px" },
                        { title: '空货位数', field: 'emptyLocation', footerTemplate: "#: sum #", align: 'left', width: "120px" },
                        { title: '货位总数', field: 'totalLocation', footerTemplate: "#: sum #", align: 'left', width: "120px" },
                        { title: '货位使用率（%）', field: 'locationUtilization', align: 'left', width: "120px" },
                        { title: '货位空仓率（%）', field: 'emptyLocationRates', align: 'left', width: "120px" }
                    ],
                    areaColumns = [
                        { title: '区域', field: 'area', align: 'left', width: "120px",
                            template: "<a class='k-button k-button-custom-command'  name='showLocationChannel' href='\\#' ng-click='showLocationChannel(this);' ><span ng-bind='dataItem.area'></span></a>"},
                        { title: '在库SKU数', field: 'countSKU', align: 'left', width: "120px" },
                        { title: '在库商品数', field: 'sumQty', align: 'left', width: "120px" },
                        { title: '已用货位数', field: 'usedLocation', align: 'left', width: "120px" },
                        { title: '空货位数', field: 'emptyLocation', align: 'left', width: "120px" },
                        { title: '货位总数', field: 'totalLocation', align: 'left', width: "120px" },
                        { title: '货位使用率（%）', field: 'locationUtilization', align: 'left', width: "130px" },
                        { title: '货位空仓率（%）', field: 'emptyLocationRates', align: 'left', width: "130px" }
                    ],
                    channelColumns = [
                        { title: '巷道', field: 'channel', align: 'left', width: "120px" },
                        { title: '在库SKU数', field: 'countSKU', align: 'left', width: "120px" },
                        { title: '在库商品数', field: 'sumQty', align: 'left', width: "120px" },
                        { title: '已用货位数', field: 'usedLocation', align: 'left', width: "120px" },
                        { title: '空货位数', field: 'emptyLocation', align: 'left', width: "120px" },
                        { title: '货位总数', field: 'totalLocation', align: 'left', width: "120px" },
                        { title: '货位使用率（%）', field: 'locationUtilization', align: 'left', width: "120px" },
                        { title: '货位空仓率（%）', field: 'emptyLocationRates', align: 'left', width: "120px" }
                    ],
                    DataSource = wmsDataSource({
                        url: url,
                        aggregate:[
                            { field: "countSKU", aggregate: "sum" },
                            { field: "sumQty", aggregate: "sum" },
                            { field: "totalLocation", aggregate: "sum" },
                            { field: "usedLocation", aggregate: "sum" },
                            { field: "emptyLocation", aggregate: "sum" }
                        ],
                        schema: {
                            model:{
                                id: "id",
                                fields: {
                                    id: {type: "number", editable: false, nullable: true },
                                    zoneId: {type: "number"},
                                    zoneNo: {type: "string"},
                                    countSKU: {type: "number"},
                                    sumQty: {type: "number"},
                                    totalLocation: {type: "number"},
                                    usedLocation: {type: "number"},
                                    emptyLocation: {type: "number"},
                                    locationUtilization: {type: "number"},
                                    emptyLocationRates: {type: "number"}
                                }
                            }
                        }
                    });

                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    hasFooter: true,
                    exportable: true,
                    dataSource: DataSource,
                    pageable:false,
                    columns: columns
                }, $scope);

                $scope.locationAreaOptions = function(dataItem){
                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource:wmsDataSource({
                            url: url + "/zone/" + dataItem.zoneId,
                            parseRequestData:function(data,str){
                                if(str == "search"){
                                    if($scope.$$childHead.query != undefined) {
                                        if ($scope.$$childHead.query.storerId != undefined) {
                                            data.storerId = $scope.$$childHead.query.storerId;
                                        }
                                    }
                                }
                                return data;
                            },
                            schema:{
                                model:{
                                    id: "id",
                                    fields: {
                                        id: {type: "number", editable: false, nullable: true }
                                    }
                                }
                            }
                        }),
                        columns: areaColumns,
                        pageable:false
                    });
                };

                $scope.showLocationChannel = function(data){
                    var area = data.dataItem.area;
                    var zoneId = data.dataItem.zoneId;

                    $scope.locationChannelPopup.refresh().open().center();
                    $("#locationChannelPopupGrid").kendoGrid({
                        columns: channelColumns,
                        pageable: false,
                        dataSource: wmsDataSource({
                            url: url + "/zone/" + zoneId + "/area/" + area,
                            parseRequestData:function(data,str){
                                if(str == "search"){
                                    if($scope.$$childHead.query != undefined) {
                                        if ($scope.$$childHead.query.storerId != undefined) {
                                            data.storerId = $scope.$$childHead.query.storerId;
                                        }
                                    }
                                }
                                return data;
                            },
                            schema: {
                                model: {
                                    id: "id",
                                    fields: {
                                        id: { type: "number", editable: false, nullable: true }
                                    }
                                }
                            }
                        })
                    });
                };


            }
        ]);
})