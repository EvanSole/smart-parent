define(['scripts/controller/controller',
    '../../model/log/ediLogModel'], function (controller, ediLogModel) {
    "use strict";

    controller.controller('reportEdiLogController',
        ['$scope', '$rootScope', '$http', 'url', 'wmsDataSource', '$filter',
            function ($scope, $rootScope, $http, $url, wmsDataSource, $filter) {
                var customOptButton =
                {
                    title: '操作',
                    width: "50px",
                    command: [
                        {
                            name: "showDetail",
                            className: "btn-auth-logistics",
                            template: "<a class='k-button k-button-custom-command' href='\\#' ng-click='selectSingleRow($event);showDetail(this);'>明细</a>",
                            text: "明细"
                        }
                    ]
                };
                var url = $url.ediLogUrl,
                    columns = [
                        customOptButton,
                        { title: '接口名称', field: 'interfaceName', align: 'left', width: "160px", template: WMS.UTILS.codeFormat("interfaceName", "InterfaceName") },
                        //{ title: '接口token', field: 'interfaceToken', align: 'left', width: "120px"},
                        { title: '订单ID', field: 'orderId', align: 'left', width: "80px"},
                        { title: '业务主键', field: 'bizKey', align: 'left', width: "80px"},
                        { title: '操作类型', field: 'operationType', align: 'left', width: "80px"},
                        { title: '成功标志', field: 'isResultSuc', align: 'left', width: "80px"},
                        { title: '输入数据', field: 'inMessage', align: 'left', width: "140px",
                            template: function (dataItem) {
                                return WMS.UTILS.tooLongContentFormat(dataItem, 'inMessage');
                            }},
                        { title: '处理结果', field: 'dealMessage', align: 'left', width: "140px",
                            template: function (dataItem) {
                                return WMS.UTILS.tooLongContentFormat(dataItem, 'dealMessage');
                            }},
                        { title: '消息ID', field: 'messageId', align: 'left', width: "140px"},
                        { title: '消息属性', field: 'messageProperty', align: 'left', width: "140px",
                            template: function (dataItem) {
                                return WMS.UTILS.tooLongContentFormat(dataItem, 'messageProperty');
                            }
                        },
                        //{ title: 'API调用者', field: 'createUser', align: 'left', width: "100px"},
                        { title: '调用时间', field: 'createTime', align: 'left', width: "150px", template: WMS.UTILS.timestampFormat("createTime")}
                    ],
                    DataSource = wmsDataSource({
                        url: url,
                        schema: {
                            model: ediLogModel.header
                        }
                    });
                //columns = columns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: DataSource,
                    exportable: true,
                    columns: columns,
                    selectable: "single row"
                }, $scope);
                //自定义单行选择
                $scope.selectSingleRow = function (e) {
                    var element = $(e.currentTarget);

                    //先移除选中行
                    element.closest('[kendo-grid]').find(".k-state-selected").each(function (index) {
                        $(this).removeClass("k-state-selected");
                    });
                    //再选中
                    element.closest("tr").addClass("k-state-selected");
                };

                // 初始化检索区数据
//                $scope.query = {
//                    startTime: $filter('date')(new Date(), 'yyyy/MM/dd 00:00:00'),
//                    endTime: $filter('date')(new Date(), 'yyyy/MM/dd 23:59:59')
//                };

                //显示明细数据
                $scope.showDetail = function (data) {
                    $scope.showDetailPopup.refresh().open().center();
                    $scope.ediLogDetailModel = {};
                    //$scope.ediLogDetailModel.id = data.dataItem.id;
                    //$scope.ediLogDetailModel.tenantId = data.dataItem.tenantId;
                    //$scope.ediLogDetailModel.interfaceName = data.dataItem.interfaceName;
                    //$scope.ediLogDetailModel.interfaceToken = data.dataItem.interfaceToken;
                    //$scope.ediLogDetailModel.warehouseId = data.dataItem.warehouseId;
                    //$scope.ediLogDetailModel.orderId = data.dataItem.orderId;
                    //$scope.ediLogDetailModel.operationType = data.dataItem.operationType;
                    //$scope.ediLogDetailModel.isResultSuc = data.dataItem.isResultSuc;
                    $scope.ediLogDetailModel.inMessage = data.dataItem.inMessage;
                    $scope.ediLogDetailModel.dealMessage = data.dataItem.dealMessage;
                    //$scope.ediLogDetailModel.bizKey = data.dataItem.bizKey;
                    $scope.ediLogDetailModel.messageId = data.dataItem.messageId;
                    $scope.ediLogDetailModel.messageProperty = data.dataItem.messageProperty;
                    //$scope.ediLogDetailModel.createTime = data.dataItem.createTime;
                    //$scope.ediLogDetailModel.createUser = data.dataItem.createUser;
                    //$scope.ediLogDetailModel.updateTime = data.dataItem.updateTime;
                    //$scope.ediLogDetailModel.updateUser = data.dataItem.updateUser;
                };
                //关闭明细
                $scope.ediLogDetailClose = function () {
                    $scope.ediLogDetailModel = {};
                    $scope.showDetailPopup.close();
                };

//                //导出Excel
//                $scope.exportExcel = function () {
//                    exportCurrent($scope.ediLogGrid, url,'接口日志.xls');
//                };
//
//                $scope.exportExcelAll = function () {
//                    exportCurrentAll($scope.ediLogGrid, url,'接口日志.xls');
//                };
            }
        ]
    )
    ;
})
;