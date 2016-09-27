define(['scripts/controller/controller',
    '../../model/log/operateLogModel'], function (controller, operateLogModel) {
    "use strict";

    controller.controller('reportOperateLogController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource', '$filter',
            function ($scope, $rootScope, $sync, $url, wmsDataSource, $filter) {

                var url = $url.operateLogUrl,
                    columns = [
                        { title: '商家', field: 'storerId', align: 'left', width: "100px", template: WMS.UTILS.storerFormat("storerId") },
                        { title: '单据类型', field: 'ordertypeCode', align: 'left', width: "80px", template: WMS.UTILS.codeFormat("ordertypeCode", "OrderType")},
                        { title: '单据编号', field: 'orderKey', align: 'left', width: "80px"},
                        { title: '操作类型', field: 'operationCode', align: 'left', width: "80px", template: WMS.UTILS.codeFormat("operationCode", "OrderOperations")},
                        { title: '操作状态', field: 'statusCode', align: 'left', width: "80px", template: WMS.UTILS.codeFormat("statusCode", "OrderOperationStatus")},
                        { title: '描述', field: 'description', align: 'left', width: "160px"},
                        { title: '创建人', field: 'createUser', align: 'left', width: "100px"},
                        { title: '创建时间', field: 'createTime', align: 'left', width: "100px", template: WMS.UTILS.timestampFormat("createTime")}
                    ],
                    DataSource = wmsDataSource({
                        url: url,
                        schema: {
                            model: operateLogModel.header
                        }
                    });
                //columns = columns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: DataSource,
                    exportable: true,
                    columns: columns,
                    selectable: "single row"
                }, $scope);

//                //导出Excel
//                $scope.exportExcel = function () {
//                    exportCurrent($scope.operateLogGrid, url,'单据日志.xls');
//                };
//
//                $scope.exportExcelAll = function () {
//                    exportCurrentAll($scope.operateLogGrid, url,'单据日志.xls');
//                };

                // 初始化检索区数据
//                $scope.query = {
//                    startTime: $filter('date')(new Date(), 'yyyy/MM/dd 00:00:00'),
//                    endTime: $filter('date')(new Date(), 'yyyy/MM/dd 23:59:59')
//                };

            }
        ]
    );
});