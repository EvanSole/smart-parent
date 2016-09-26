define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('qcReportSummaryController',
        ['$scope', '$rootScope', '$http', 'url','wmsDataSource', 'sync', '$filter',
            function($scope, $rootScope, $http, url, wmsDataSource, $sync, $filter) {
//                $scope.getdate = function() {
//                    var dates = new Date();
//                    dates.setDate(dates.getDate() - 6);
//                    return dates;
//                }
//
//                var query = $scope.query = {
//                        beginCreated: $filter('date')($scope.getdate(),'yyyy/MM/dd 00:00:00'),
//                        endCreated: $filter('date')(new Date(),'yyyy/MM/dd 23:59:59')
//                    },
                var  qcReportSummaryColumns = [
//                    WMS.UTILS.CommonColumns.checkboxColumn,
                    {filterable: false, title: '店铺主营类目', field: 'shopTagValue', align: 'left', width: "100px"},
                    {filterable: false, title: '抽检总数', field: 'qcCount', align: 'left', width: "100px"},
                    {filterable: false, title: '实际到货数量', field: 'receiveCount', align: 'left', width: "150px"},
                    {filterable: false, title: '未到货数量', field: 'unReceiveCount', align: 'left', width: "100px"},
                    {filterable: false, title: '已质检数量', field: 'qualityCount', align: 'left', width: "100px"},
                    {filterable: false, title: '抽检合格数', field: 'qcQualifiedCount', align: 'left', width: "150px"},
                    {filterable: false, title: '抽检不合格数', field: 'qcUnqualifiedCount', align: 'left', width: "150px"},
                    {filterable: false, title: '抽检合格百分比', field: 'qcQualifiedPercent', align: 'left', width: "150px", template: function(obj){ return obj.qcQualifiedPercent+'%'}},
                    {filterable: false, title: '抽检不合格百分比', field: 'qcUnqualifiedPercent', align: 'left', width: "150px", template: function(obj){ return obj.qcUnqualifiedPercent+'%'}},
                    {filterable: false, title: '标识问题', field: 'identificationProblem', align: 'left', width: "100px"},
                    {filterable: false, title: '工艺问题(纺织品)', field: 'processClothesProblem', align: 'left', width: "150px"},
                    {filterable: false, title: '工艺问题(鞋类)', field: 'processShoesProblem', align: 'left', width: "150px"},
                    {filterable: false, title: '理化性能问题', field: 'physicalProblem', align: 'left', width: "150px"},
                    {filterable: false, title: '整烫问题', field: 'ironingProblem', align: 'left', width: "120px"},
                    {filterable: false, title: '描述问题', field: 'describeProblem', align: 'left', width: "120px"}
                ];

                var qcReportSummaryDataSource = wmsDataSource({
                    url: window.BASEPATH + "/qc/report/queryQcReportSummary",
                    schema: {
                        model: {
                            id:"goodsCategoryName",
                            fields: {
                                id: { type: "string", editable: false, nullable: true }
                            }
                        }
                    }
                });

                $scope.qcReportSummaryGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: qcReportSummaryDataSource,
                    columns: qcReportSummaryColumns,
                    exportable: true,
                    widgetId:"qcRefundWidget"
                }, $scope);
        }]);
})