define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('qcOrderShelveController',
        ['$scope', '$rootScope', '$http', 'url','wmsDataSource', 'sync',
            function($scope, $rootScope, $http, url, wmsDataSource, $sync) {

                console.log("welcome qcOrderShelveController");

                var  qcOrderColumns = [
//                    WMS.UTILS.CommonColumns.checkboxColumn,
                    {filterable: false, title: '质检单类型', field: 'type', align: 'left', width: "100px", template: WMS.UTILS.statesFormat('type', 'QcOrderTypeEnum')},
                    {filterable: false, title: '质检单号', field: 'qcOrderId', align: 'left', width: "100px"},
                    {filterable: false, title: '单据状态', field: 'processStatus', align: 'left', width: "100px",template: WMS.UTILS.statesFormat('processStatus', 'QcOrderProcessStatusEnum')},
                    {filterable: false, title: '质检状态', field: 'closeStatus', align: 'left', width: "100px", template: WMS.UTILS.statesFormat('closeStatus', 'QcOrderCloseStatusEnum')},
                    {filterable: false, title: '商家名称', field: 'sellerUserName', align: 'left', width: "150px"},
                    {filterable: false, title: '交易单号', field: 'shopOrderId', align: 'left', width: "100px"},
                    {filterable: false, title: '商品类目', field: 'goodsCategoryName', align: 'left', width: "100px"},
                    {filterable: false, title: '商品编码', field: 'goodsCode', align: 'left', width: "100px"},
                    {filterable: false, title: '商品名称', field: 'goodsName', align: 'left', width: "100px"},
                    {filterable: false, title: '货位', field: 'shelveNo', align: 'left', width: "120px", template: function(obj){
                    return "<input type='text' id='shelveNo_"+ obj.uid +"' ng-click='openNewWindowSet(this)' readonly='readonly' value='"+obj.shelveNo+"' style='width: 90px;'/>"}},
                    {filterable: false, title: '更新人', field: 'assignee', align: 'left', width: "100px"},
                    {filterable: false, title: '更新时间', field: 'updated', align: 'left', width: "150px",template: WMS.UTILS.timestampFormat("created", "yyyy-MM-dd HH:mm:ss")}
                ];

                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

                var qcOrderDataSource = wmsDataSource({
                    url: url.qcOrderQueryUrl + "/query/list/shelve",
                    schema: {
                        model: {
                            id:"qcOrderId",
                            fields: {
                                id: { type: "number", editable: false, nullable: true }
                            }
                        },
                        total: function (total) {
                            return total.length > 0 ? total[0].total : 0;
                        }
                    }
                });

                $scope.qcOrderShelveGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: qcOrderDataSource,
                    columns: qcOrderColumns,
                    toolbar:[
                        {template: '<kendo-button class="k-primary" ng-click="qcShevleSave()">保存更改</kendo-button>', className:"btn-auth-save"}
//                        {template: '<kendo-button class="k-primary" ng-click="qcShevleImport()">导入上架文件</kendo-button>', className:"btn-auth-import"}
                     ],
                    autoBind: true
                }, $scope);



                $scope.qcShevleSave = function() {
                    var condition = {};
                    $scope.qcOrderShelveGrid.dataSource.data().forEach(function(item){
//                        condition[item.qcOrderId] = $("#shelveNo_" +item.uid).val();
                        var value = $("#shelveNo_" +item.uid).val();
                        var key = item.qcOrderId;
                        if (value == null || value.length == 0) {

                        } else {
                            condition[key] = value;
                        }
                    });

                    if (Object.keys(condition).length <= 0) {
                        kendo.ui.ExtAlertDialog.showError("没有可保存修改的纪录");
                        return;
                    }
                    $sync(window.BASEPATH + "/qc/base/shelve/shelveQuality", "PUT", {data: condition})
                        .then(function (xhr) {
                            $scope.qcOrderShelveGrid.dataSource.read();
                        }, function (data) {
                            kendo.ui.ExtAlertDialog.showError("!");
                        });
                }

                $scope.openNewWindowSet = function(_this) {

                    $scope.shelvePopup.refresh().open().center();
                    $scope.shelvePopup.setReturnData = function (returnData) {
                        if (_.isEmpty(returnData)) {
                            return;
                        }
                        $("#shelveNo_" +_this.dataItem.uid).val(returnData.shelveNo);
                    };

                }

        }]);
})