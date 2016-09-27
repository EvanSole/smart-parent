define(['scripts/controller/controller',
    '../../model/data/ewaybillRecModel'], function (controller, ewaybillRecModel) {
    "use strict";

    controller.controller('reportEwaybillRecController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource', '$filter',
            function ($scope, $rootScope, $sync, $url, wmsDataSource, $filter) {

                var url = $url.dataEwaybillRecUrl,
                    query = $scope.query = {
//                        startTime: $filter('date')(new Date(),'yyyy/MM/dd 00:00:00'),
//                        statusCode: "1"
                    },
                    columns = [
                        { title: '面单回收ID', field: 'id', hidden: true, align: 'left'},
                        { title: '出库单号', field: 'orderId', align: 'left', width: "120px" },
                        { title: '仓库', field: 'warehouseId', align: 'left', width: "120px", template: WMS.UTILS.whFormat },
                        { title: '物流公司编号', field: 'carrierNo', align: 'left', width: "120px"},
                        { title: '物流公司', field: 'carrierNo', template: WMS.UTILS.carrierFormat, align: 'left', width: "120px"},
                        { title: '电子面单号', field: 'ewaybillNo', align: 'left', width: "150px"},
                        { title: '单据状态', field: 'statusCode', align: 'left', width: "120px", template: WMS.UTILS.codeFormat("statusCode", "EwaybillRecStatus")},
                        { title: '备注', field: 'memo', align: 'left', width: "150px",
                            template: function (dataItem) {
                                return WMS.UTILS.tooLongContentFormat(dataItem, 'memo');
                            }}
                    ],
                    DataSource = wmsDataSource({
                        url: url,
                        filter: query,
                        schema: {
                            model: ewaybillRecModel.header
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
                        { template: '<a class="k-button k-button-custom-command" ng-click="ewayRecover()">回收</a>', className: "btn-auth-submit"},
                        { template: '<a class="k-button k-button-custom-command" ng-click="ewayCancel()">作废</a>', className: "btn-auth-submit"}
                    ],
                    dataBound: function (e) {
                        var grid = e.sender,
                            trs = grid.tbody.find(">tr");
                        _.each(trs, function (tr) {
                            var record = grid.dataItem(tr);
                            if (record.statusCode === "2" || record.statusCode === "3") {
                                $(tr).find('input[type=checkbox]').remove();
                            }
                        });
                    },
                    columns: columns
                }, $scope);

                //作废
                $scope.ewayCancel = function () {
                    var grid = $scope.reportEwaybillRecGrid;
                    var selectedData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                    var selectId = '';
                    selectedData.forEach(function (value) {
                        if (value.statusCode === "1") {
                            selectId += "," + value.id;
                        }
                    });
                    if (selectId.length == 0) {
                        kendo.ui.ExtAlertDialog.showError("请至少选择一条记录进行作废");
                        return;
                    }

                    $scope.showCancelPopup.refresh().open().center();
                    $scope.ewayCancelModel = {};
                    $scope.ewayCancelModel.id = selectId.substr(1, selectId.length - 1);
                    $scope.ewayCancelModel.memo = '';
                };
                //作废弹出页面保存
                $scope.ewayCancelSave = function () {
                    //kendo.ui.ExtAlertDialog.showError($scope.ewayCancelModel.id + "_" + $scope.ewayCancelModel.memo);
                    $sync(url + "/cancel", "POST", {data: {ids: $scope.ewayCancelModel.id, memo: $scope.ewayCancelModel.memo}})
                        .then(function (data) {
                            if (data.suc == true) {
                                kendo.ui.ExtAlertDialog.show({
                                    title: "提示",
                                    message: '全部作废成功',
                                    icon: 'k-ext-error' });
                                $scope.reportEwaybillRecGrid.dataSource.read({});
                            } else {
                                kendo.ui.ExtAlertDialog.showError(data.message);
                            }
                        }, function (xhr) {
                            $scope.reportEwaybillRecGrid.dataSource.read({});
                        });

                    $scope.ewayCancelModel = {};
                    $scope.showCancelPopup.close();
                };

                //作废弹出页面关闭
                $scope.ewayCancelClose = function () {
                    $scope.ewayCancelModel = {};
                    $scope.showCancelPopup.close();
                };


                //回收
                $scope.ewayRecover = function () {
                    var grid = $scope.reportEwaybillRecGrid;
                    var selectedData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                    var ids = [];
                    var reqList = [];
                    selectedData.forEach(function (value) {
                        if (value.statusCode === "1") {
                            reqList.push(value.toJSON());
                        }
                    });
                    if (reqList.length == 0) {
                        kendo.ui.ExtAlertDialog.showError("请至少选择一条记录进行回收");
                        return;
                    }
                    var id = ids.join(",");
                    $sync(url + "/processed", "POST", {data: {processList: reqList}})
                        .then(function (data) {
                            if (data.result.rows.length === 0) {
                                kendo.ui.ExtAlertDialog.showError("全部回收成功");
                            } else {
                                var importWindow = $scope.importWindow;

                                importWindow.setOptions({
                                    width: "630",
                                    title: "异常信息",
                                    modal: true,
                                    actions: ["Close"],
                                    content: {
                                        template: kendo.template($('#J_fileForm').html())
                                    },
                                    open: function () {
                                        $('.js_operationResult').hide();
                                    }
                                });
                                importWindow.refresh().center().open();

                                $('.js_operationResult').show();
                                var errLogData = _.map(data.result.rows, function (record) {
                                    return {message: record};
                                });
                                $("#reportEwaybillRecErrorGrid").kendoGrid({
                                    columns: [
                                        {
                                            field: "message",
                                            filterable: false,
                                            width: 220,
                                            title: '错误信息'
                                        }
                                    ],
                                    height: 150,
                                    dataSource: errLogData
                                });
                            }
                            $scope.reportEwaybillRecGrid.dataSource.read({});
                        }, function (xhr) {
                            $scope.reportEwaybillRecGrid.dataSource.read({});
                        });
                };
            }
        ]
    );
});