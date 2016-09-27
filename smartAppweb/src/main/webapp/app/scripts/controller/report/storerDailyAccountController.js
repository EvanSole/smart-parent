define(['scripts/controller/controller',
    '../../model/inventory/storerDailyAccountModel'], function (controller, storerDailyAccountModel) {
    "use strict";

    controller.controller('reportStorerDailyAccountController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource', '$filter',
            function ($scope, $rootScope, $sync, $url, wmsDataSource, $filter) {
                $scope.getdate = function() {
                    var dates = new Date();
                    dates.setDate(dates.getDate() - 6);
                    return dates;
                }
                var url = $url.inventoryLogUrl,

                    query = $scope.query = {
                        startTime: $filter('date')($scope.getdate(),'yyyy/MM/dd 00:00:00'),
                        endTime: $filter('date')(new Date(),'yyyy/MM/dd 23:59:59'),
                        storerId:''
                    },
                    columns = [
                        { title: '日期', field: 'reportDate', align: 'left', width: "120px", hidden:true },
                        { title: '项目', field: 'storerId', align: 'left', width: "120px", template: WMS.UTILS.storerFormat('storerId'), groupFooterTemplate: "<h5><b>汇总</b></h5>"},
                        { title: '采购入库',
                            align: 'center',
                            columns: [
                                { title: '正品', field: 'poGoodQty', align: 'left', width: "100px", aggregates: ["sum"], groupFooterTemplate: "#= sum #" },
                                { title: '次品', field: 'poBadQty', align: 'left', width: "100px", aggregates: ["sum"], groupFooterTemplate: "#= sum #" }
                            ]
                        },  { title: '退货入库',
                            align: 'center',
                            columns: [
                                { title: '正品', field: 'soReturnGoodQty', align: 'left', width: "100px", aggregates: ["sum"], groupFooterTemplate: "#= sum #" },
                                { title: '次品', field: 'soReturnBadQty', align: 'left', width: "100px", aggregates: ["sum"], groupFooterTemplate: "#= sum #" }
                            ]
                        }, { title: '订单发货',
                            align: 'center',
                            columns: [
                                { title: '正品', field: 'soGoodQty', align: 'left', width: "100px", aggregates: ["sum"], groupFooterTemplate: "#= sum #" },
                                { title: '次品', field: 'soBadQty', align: 'left', width: "100px", aggregates: ["sum"], groupFooterTemplate: "#= sum #" }
                            ]
                        }, { title: '采购退货',
                            align: 'center',
                            columns: [
                                { title: '正品', field: 'poReturnGoodQty', align: 'left', width: "100px", aggregates: ["sum"], groupFooterTemplate: "#= sum #" },
                                { title: '次品', field: 'poReturnBadQty', align: 'left', width: "100px", aggregates: ["sum"], groupFooterTemplate: "#= sum #" }
                            ]
                        }, { title: '调整',
                            align: 'center',
                            columns: [
                                { title: '正品', field: 'adjustGoodQty', align: 'left', width: "100px", aggregates: ["sum"], groupFooterTemplate: "#= sum #" },
                                { title: '次品', field: 'adjustBadQty', align: 'left', width: "100px", aggregates: ["sum"], groupFooterTemplate: "#= sum #" }
                            ]
                        }, { title: '项目库存',
                             align: 'center',
                            columns: [
                                { title: '正品', field: 'inventoryGoodQty', align: 'left', width: "100px", aggregates: ["sum"], groupFooterTemplate: "#= sum #" },
                                { title: '次品', field: 'inventoryBadQty', align: 'left', width: "100px", aggregates: ["sum"], groupFooterTemplate: "#= sum #" }
                            ]
                        }
                    ],
                    DataSource = wmsDataSource({
                        url: url + '/storerDailyReport',

                        schema: {
                            model: storerDailyAccountModel.header
                        },
                        parseRequestData:function(data,str){
                            if(str == "search"){
                                if($scope.$$childHead.query != undefined) {
                                    if ($scope.$$childHead.query.startTime != undefined && $scope.$$childHead.query.startTime != "") {
                                        data.startTime = $scope.$$childHead.query.startTime;
                                    }
                                    if ($scope.$$childHead.query.endTime != undefined  && $scope.$$childHead.query.endTime != "") {
                                        data.endTime = $scope.$$childHead.query.endTime;
                                    }
                                }
                            }
                            return data;
                        },
                        group: {
                            field: "reportDate", aggregates: [
                                { field: "poGoodQty", aggregate: "sum"},
                                { field: "poBadQty", aggregate: "sum"},
                                { field: "soReturnGoodQty", aggregate: "sum"},
                                { field: "soReturnBadQty", aggregate: "sum"},
                                { field: "soGoodQty", aggregate: "sum"},
                                { field: "soBadQty", aggregate: "sum"},
                                { field: "poReturnGoodQty", aggregate: "sum"},
                                { field: "poReturnBadQty", aggregate: "sum"},
                                { field: "adjustGoodQty", aggregate: "sum"},
                                { field: "adjustBadQty", aggregate: "sum"},
                                { field: "inventoryGoodQty", aggregate: "sum"},
                                { field: "inventoryBadQty", aggregate: "sum"}
                            ]
                        }
                    });
//                columns = columns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
//                    exportable: true,
                    dataSource: DataSource,
                    columns: columns
                }, $scope);


                $scope.checkSearchClient = function(query) {
                    var startTime = new Date(query.startTime);
                    var endTime = new Date(query.endTime);

                    if (endTime < startTime) {
                        kendo.ui.ExtAlertDialog.showError("结束时间必须大于开始时间!");
                        return false;
                    }

                    var nowDate = new Date();
                    startTime.setDate(startTime.getDate() + 31);

                    if (startTime < nowDate) {
                        kendo.ui.ExtAlertDialog.showError("只能查看30天以内的日报!");
                        return false;
                    }
                    return true;
                }
            }
        ]
    );
});