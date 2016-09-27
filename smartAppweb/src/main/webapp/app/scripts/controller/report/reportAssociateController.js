define(['scripts/controller/controller', '../../model/warehouse/out/associateModel'], function (controller, associateModel) {
    "use strict";
    controller.controller('reportOutAssociateController', ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource', 'wmsReportPrint',
        function ($scope, $rootScope, $sync, $url, wmsDataSource, wmsReportPrint) {

            var associateUrl = "/shipment/associate" ,
                associateColumns = [
                    { title: '承运商', field: 'carrierNo', align: 'left', width: "150px", template: WMS.UTILS.carrierFormat("carrierNo")},
                    { title: '运单号', field: 'carrierReferNo', align: 'left', width: "150px"},
                    { title: '交接单号', field: 'vehicleno', align: 'left', width: "150px"},
                    { title: '出库单号', field: 'id', align: 'left', width: "150px"},
//                    { title: '交接时间', field: 'updateTime', align: 'left', width: "150px",template:WMS.UTILS.timestampFormat("updateTime","yyyy-MM-dd HH:mm:ss")},
                    { title: '实际发货时间', field: 'deliveryTime', align: 'left', width: "150px", template: WMS.UTILS.timestampFormat("deliveryTime", "yyyy-MM-dd HH:mm:ss")}
                ];

            var associateDataSource = wmsDataSource({
                url: associateUrl + "/report",
                schema: {
                    model: associateModel.associateEntity
                }
            });

            $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
            $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

            $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                dataSource: associateDataSource,
                exportable: true,
                toolbar: [
                    {className: "btn-auth-print",
                        template: '<kendo-button class="k-primary" ng-click="print()">打印</kendo-button>' }
                ],
                columns: associateColumns,
                autoBind: true,
                editable: false,
                selectable: "row"
            }, $scope);


            //交接单打印
            $scope.print = function () {
                var selectView = $scope.reportAssociateGrid.select();
                var selectData = $scope.reportAssociateGrid.dataItem(selectView);
                if (!selectData) {
                    kendo.ui.ExtAlertDialog.showError("请选择一条数据");
                    return;
                }
                $sync(associateUrl + "/print/" + selectData.vehicleno, "GET")
                    .then(function (data) {
                        //交接打印
                        wmsReportPrint.printAssociateShipment("Associate", data.result, 1);
                    });
            };
        }
    ]);
});
