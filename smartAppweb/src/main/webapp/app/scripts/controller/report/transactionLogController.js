define(['scripts/controller/controller',
    '../../model/inventory/transactionLogModel'], function (controller, transactionLogModel) {
    "use strict";

    controller.controller('reportInvTransactionLogController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource', '$filter',
            function ($scope, $rootScope, $sync, $url, wmsDataSource, $filter) {

                var url = $url.transactionLogUrl,
                    columns = [
                        { title: '仓库', field: 'warehouseId', align: 'left', width: "120px", template: WMS.UTILS.whFormat},
                        { title: '商家', field: 'storerId', align: 'left', width: "120px", template: WMS.UTILS.storerFormat},
//                        { title: '商品编码', field: 'skuSku', align: 'left', width: "150px"},
                        { title: '商品条码', field: 'skuBarcode', align: 'left', width: "160px"},
                        { title: '商品名称', field: 'skuItemName', align: 'left', width: "100px"},
                        { title: '原库存状态', field: 'fromInvStatusCode', align: 'left', width: '120px', template: WMS.UTILS.codeFormat("fromInvStatusCode", "InventoryStatus")},
                        { title: '新库存状态', field: 'toInvStatusCode', align: 'left', width: '120px', template: WMS.UTILS.codeFormat("toInvStatusCode", "InventoryStatus")},
                        { title: '货号', field: 'skuProductNo', align: 'left', width: "120px"},
                        { title: '颜色', field: 'skuColorCode', align: 'left', width: "120px", template: WMS.UTILS.codeFormat('skuColorCode', 'SKUColor')},
                        { title: '尺码', field: 'skuSizeCode', align: 'left', width: "100px", template: WMS.UTILS.codeFormat('skuSizeCode', 'SKUSize')},
                        { title: '库存操作类型', field: 'typeCode', align: 'left', width: "150px", template: WMS.UTILS.codeFormat("typeCode", "Transaction")},
                        { title: '单据号', field: 'orderId', align: 'left', width: "100px"},
                        { title: '来源库区名称', field: 'fromZoneId', align: 'left', width: "150px", template: WMS.UTILS.zoneNoFormat("fromZoneId")},
                        { title: '目的库区名称', field: 'toZoneId', align: 'left', width: "150px", template: WMS.UTILS.zoneNoFormat("toZoneId")},
                        { title: '来源货位名称', field: 'fromLocationId', align: 'left', width: "150px", template: WMS.UTILS.locationFormat("fromLocationId")},
                        { title: '目的货位名称', field: 'toLocationId', align: 'left', width: "150px", template: WMS.UTILS.locationFormat("toLocationId")},
                        { title: '来源托盘号', field: 'fromPalletNo', align: 'left', width: "100px"},
                        { title: '目的托盘号', field: 'toPalletNo', align: 'left', width: "100px"},
//                        { title: '来源箱号', field: 'fromCartonNo', align: 'left', width: "100px"},
//                        { title: '目的箱号', field: 'toCartonNo', align: 'left', width: "100px"},
                        { title: '来源批次号', field: 'fromLotKey', align: 'left', width: "100px"},
                        { title: '目的批次号', field: 'toLotKey', align: 'left', width: "100px"},
                        { title: '原冻结状态', field: 'fromIsHold', align: 'left', width: "100px", template: WMS.UTILS.checkboxDisabledTmp('fromIsHold')},
                        { title: '新冻结状态', field: 'toIsHold', align: 'left', width: "100px", template: WMS.UTILS.checkboxDisabledTmp('toIsHold')},
                        { title: '原数量', field: 'fromQty', align: 'left', width: "100px"},
                        { title: '新数量', field: 'toQty', align: 'left', width: "100px"},
                        { title: '原成本价', field: 'fromPrice', align: 'left', width: "100px"},
                        { title: '新成本价', field: 'toPrice', align: 'left', width: "100px"},
                        { editor: WMS.UTILS.columnEditor.hidden, filterable: false, title: '创建人', field: 'createUser', align: 'left', width: "100px"} ,
                        { editor: WMS.UTILS.columnEditor.hidden, filterable: false, title: '创建时间', field: 'createTime', align: 'left', width: "150px", template: timestampFormat("createTime")}
                    ],
                    DataSource = wmsDataSource({
                        url: url,
                        schema: {
                            model: transactionLogModel.header
                        }
                    });
//                columns = columns.concat(WMS.UTILS.CommonColumns.defaultColumns);

                function timestampFormat(tempstamp, format) {
                    var dateFormat = "yyyy/MM/dd HH:mm:ss";
                    if (format === undefined) {
                        format = dateFormat;
                    }
                    return "<span ng-bind=\"dataItem." + tempstamp + "|date:'" + format + "'\"></span>";
                }

                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: DataSource,
                    exportable: true,
                    columns: columns
                }, $scope);

                //导出Excel
//                $scope.exportExcel = function () {
//                    exportCurrent($scope.reportTransactionLogGrid, url,'库存日志.xls');
//                };
//
//                $scope.exportExcelAll = function () {
//                    exportCurrentAll($scope.reportTransactionLogGrid, url,'库存日志.xls');
//                };
                // 初始化检索区数据
//                $scope.query = {
//                    startTime: $filter('date')(new Date(),'yyyy/MM/dd 00:00:00')
//                };
            }
        ]
    );
});