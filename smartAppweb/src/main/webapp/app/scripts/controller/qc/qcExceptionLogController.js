/**
 * Created by zw on 16/4/7.
 */

define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('qcExceptionLogController',
        ['$scope', '$rootScope', '$http', 'url','wmsDataSource', 'sync', '$filter', 'sync',
            function($scope, $rootScope, $http, url, wmsDataSource, $sync, $filter, sync) {

                var  columns = [
                    WMS.UTILS.CommonColumns.checkboxColumn,
                    {filterable: false, title: '异常数据表ID', field: 'orderNo', align: 'left', width: "150px" },
                    {filterable: false, title: '数据来源', field: 'dataSource', align: 'left', width: "150px", template: WMS.UTILS.statesFormat('dataSource', 'ExceptionLogDataSource')},
                    {filterable: false, title: '操作类型', field: 'operation', align: 'left', width: "150px", template: WMS.UTILS.statesFormat('operation', 'BussessLogTypeEnum')},
                    {filterable: false, title: '数量', field: 'qty', align: 'left', width: "100px"},
                    {filterable: false, title: '异常信息', field: 'exceptionMessage', align: 'left', width: "200px"},
                    {filterable: false, title: '问题单状态', field: 'status', align: 'left', width: "150px", template: WMS.UTILS.statesFormat('status', 'ExceptionLogStatus')},
                    {filterable: false, title: '备注', field: 'memo', align: 'left', width: "200px" },
                    {filterable: false, title: '操作人', field: 'optUserName', align: 'left', width: "150px"},
                    {filterable: false, title: '创建时间', field: 'created', align: 'left', width: "150px", template: WMS.UTILS.timestampFormat("created", "yyyy-MM-dd HH:mm:ss")},
                    {filterable: false, title: '更新时间', field: 'updated', align: 'left', width: "150px", template: WMS.UTILS.timestampFormat("updated", "yyyy-MM-dd HH:mm:ss")}
                    //{filterable: false, title: '作业效率(件/小时)', field: 'efficiency', align: 'left', width: "100px"}
                ];

                var dataSource = wmsDataSource({
                    url: url.exceptionLogUrl,
                    schema: {
                        model: {
                            id:"id",
                            fields: {
                                
                            }
                        }
                    }
                });

                $scope.exceptionLogGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: dataSource,
                    columns: columns,
                    toolbar: [
                        { name: "create", text: "新增", className:'btn-auth-add'},
                        { template: '<a class="k-button k-button-icontext k-grid-commit" ng-click="commitExceptionLog()">提交</a>', className: "btn-auth-commit"}
                    ],
                    editable: {
                        mode: "popup",
                        
                        template: kendo.template($("#exceptionLogEditor").html())
                    },
                    autoBind: true
                }, $scope);

                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

                
                //提交问题单
                $scope.commitExceptionLog = function(){
                    //发送处罚接口 zw 2016-06-17
                    var selectData = WMS.GRIDUTILS.getCustomSelectedData($scope.exceptionLogGrid);
                    var ids = [];
                    selectData.forEach(function (data) {
                        ids.push(data.id);
                    });
                    var id = ids.join(",");
                    if (id.length === 0) {
                        kendo.ui.ExtAlertDialog.showError("请选择一条问题单信息!");
                        return;
                    }
                    sync(url.exceptionLogUrl + "/status/" + ids , "GET")
                        .then(function (data) {
                            //刷新页面
                            $scope.exceptionLogGrid.dataSource.read({});
                        }, function () {
                            $scope.exceptionLogGrid.dataSource.read({});
                        });
                }
            }]);
})