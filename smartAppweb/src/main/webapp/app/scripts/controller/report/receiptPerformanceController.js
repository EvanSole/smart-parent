/**
 * Created by MLS on 15/3/31.
 */

define(['scripts/controller/controller', '../../model/warehouse/in/receiptModel'], function (controller, receiptModel) {
    "use strict";
    controller.controller('reportReceiptPerformanceController',
        ['$scope', '$rootScope', '$http', 'url', 'wmsDataSource', 'wmsLog', 'sync',
            function ($scope, $rootScope, $http, $url, wmsDataSource, wmsLog, $sync) {
                var headerUrl = $url.reportReceiptPerformanceUrl,
                    headerColumns = [
                        { filterable: false, title: '操作人', field: 'createUser', align: 'left', width: "200px"},
                        { filterable: false, title: '收货件数', field: 'receivedQty',align: 'left', width: "200px;"},
                        { filterable: false, title: '单据来源', field: 'fromTypeCode', template: WMS.UTILS.codeFormat('fromTypeCode', 'ReceiptFrom'), align: 'left', width: "120px;"}

                    ],

                    headerDataSource = wmsDataSource({
                        url: headerUrl,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "number", editable: false, nullable: true }
                                }
                            }
                        }
                    });
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
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