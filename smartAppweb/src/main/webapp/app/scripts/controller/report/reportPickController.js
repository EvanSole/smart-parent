define(['scripts/controller/controller'], function (controller) {
    "use strict";
    controller.controller('reportPickController', ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource',
        function ($scope, $rootScope, $sync, $url, wmsDataSource) {

            var shipmentPickUrl = "/shipment/report/pick" ,
                pickColumns = [
                    { title: '出库单号', field: 'shipmentId', align: 'left', width: "150px"},
                    { title: '波次单号', field: 'waveId', align: 'left', width: "150px"},
                    { title: 'ERP单号', field: 'fromErpNo', align: 'left', width: "150px"},
                    { title: '商品条码', field: 'barcode', align: 'left', width: "160px"},
                    { title: '商品名称', field: 'itemName', align: 'left', width: "150px"},
                    { title: '小车号', field: 'locationId', filterable: false, align: 'left', width: '150px', template: WMS.UTILS.locationFormat},
                    { title: '拣货货位', field: 'locationNo', filterable: false, align: 'left', width: '150px'},
                    { title: '拣货数量', field: 'pickedQty', footerTemplate: "#: sum #", align: 'left', width: "150px"},
//                    { title: '已出库数量', field: 'shipedQty', align: 'left', width: "150px"},
                    { title: '托盘编号', field: 'palletNo', align: 'left', width: "150px"},
                    { title: '拣货人', field: 'pickUser', align: 'left', width: "150px"},
                    { title: '拣货时间', field: 'pickTime', align: 'left', width: "160px", template: WMS.UTILS.timestampFormat("pickTime")}
                ];

            //pickColumns = pickColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);

            var pickDataSource = wmsDataSource({
                url: shipmentPickUrl,
                aggregate: [
                    { field: "pickedQty", aggregate: "sum" }
                ],
                schema: {
                    model: {
                        id: "id",
                        fields: {id: {type: "number", editable: false, nullable: true }}
                    }
                }
            });
            $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                hasFooter: true,
                dataSource: pickDataSource,
                exportable: true,
                columns: pickColumns,
                autoBind: true,
                editable: false
            }, $scope);
//            //导出Excel
//            $scope.exportExcel = function () {
//                exportCurrent($scope.reportPickGrid, window.BASEPATH + shipmentPickUrl,'捡货报表.xls');
//            };
//            $scope.exportExcelAll = function () {
//                exportCurrentAll($scope.reportPickGrid, window.BASEPATH + shipmentPickUrl,'捡货报表.xls');
//            };

        }
    ]);
})
