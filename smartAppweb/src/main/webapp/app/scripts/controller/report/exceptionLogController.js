define(['scripts/controller/controller',
    '../../model/data/exceptionLogModel'], function (controller, exceptionLogModel) {
    "use strict";

    controller.controller('reportExceptionLogController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource', '$filter',
            function ($scope, $rootScope, $sync, $url, wmsDataSource, $filter) {

                var url = $url.dataExceptionLogUrl,
                    query = $scope.query = {
//                        startTime: $filter('date')(new Date(),'yyyy/MM/dd 00:00:00'),
//                        statusCode: "1"
                    },
                    columns = [
                        { title: '问题单号', field: 'id', hidden: true, align: 'left'},
                        { title: '数据来源', field: 'datasourceCode', align: 'left', width: "120px", template: WMS.UTILS.codeFormat("datasourceCode", "DataSource")},
                        { title: '操作类型', field: 'operationCode', align: 'left', width: "120px", template: WMS.UTILS.codeFormat("operationCode", "ExceptionLogType")},
                        { title: '当前状态', field: 'statusCode', align: 'left', width: "150px", template: WMS.UTILS.codeFormat("statusCode", "ExceptionLogStatus")},
                        { title: '单据号', field: 'orderNo', align: 'left', width: "120px"},
                        { field: 'warehouseId', title: '仓库', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.whFormat},
                        { title: '货位', field: 'locationNo', align: 'left', width: "120px"},
                        { title: '中转车号', field: 'palletNo', align: 'left', width: "120px"},
                        { title: '条码', field: 'barcode', align: 'left', width: "120px"},
                        { title: '数量', field: 'qty', align: 'left', width: "120px"},
                        { title: '异常信息', field: 'exceptionMessage', align: 'left', width: "260px", template: function (dataItem) {
                            return WMS.UTILS.tooLongContentFormat(dataItem, 'exceptionMessage');
                        }},
//                        { title: '设备号', field: 'deviceNo', align: 'left', width: "120px"},
                        { title: '备注', field: 'memo', align: 'left', width: "120px", template: function (dataItem) {
                            return WMS.UTILS.tooLongContentFormat(dataItem, 'memo');
                        } }
                    ],
                    DataSource = wmsDataSource({
                        url: url,
                        filter: query,
                        schema: {
                            model: exceptionLogModel.header
                        }
                    });
                columns = columns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                columns.splice(0, 0, WMS.UTILS.CommonColumns.checkboxColumn);

                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: DataSource,
                    exportable: true,
                    toolbar: [
                        { template: '<a class="k-button k-button-custom-command" ng-click="exceptionSubmit()">提交</a>', className: "btn-auth-submit"}
                    ],
                    dataBound: function (e) {
                        var grid = e.sender,
                            trs = grid.tbody.find(">tr");
                        _.each(trs, function (tr) {
                            var record = grid.dataItem(tr);
                            if (record.statusCode === "2") {
                                $(tr).find('input[type=checkbox]').remove();
                            }
                        });
                    },
                    columns: columns
                }, $scope);

                $scope.exceptionSubmit= function () {
                    var grid = $scope.reportExceptionLogGrid;
                    var selectedData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                    var ids = [];
                    selectedData.forEach(function (value) {
                        if (value.statusCode === "1") {
                            ids.push(value.id);
                        }
                    });
                    if (ids == '') {
                        kendo.ui.ExtAlertDialog.showError("请至少选择一条记录进行提交");
                        return;
                    }
                    var id = ids.join(",");
                    $sync(url + "/processed", "POST", {data: {ids: id}})
                        .then(function (xhr) {
                            $scope.reportExceptionLogGrid.dataSource.read({});
                        }, function (xhr) {
                            $scope.reportExceptionLogGrid.dataSource.read({});
                        });
                }

                // 初始化检索区数据
//                $scope.query = {
//                    startTime: $filter('date')(new Date(),'yyyy/MM/dd 00:00:00'),
//                    statusCode: "1"
//                };
                //导出Excel
//                $scope.exportExcel = function () {
//                    exportCurrent($scope.reportExceptionLogGrid, url,'问题单.xls');
//                };
//
//                $scope.exportExcelAll = function () {
//                    exportCurrentAll($scope.reportExceptionLogGrid, url,'问题单.xls');
//                };

            }
        ]
    );
});