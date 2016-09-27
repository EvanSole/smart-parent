

define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('strategyReceiptController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource',
            function($scope, $rootScope, $sync, $url, wmsDataSource) {
                var receiptUrl = $url.strategyReceiptUrl,
                    receiptStrategyColumns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { title: '策略名称', field: 'strategyName', align: 'left', width: "120px"},
                        { title: '默认策略', field: 'isDefault',template: WMS.UTILS.checkboxTmp("isDefault"),align:'left', width:"120px"},
                        { title: '是否可用', field: 'isActive', template: WMS.UTILS.checkboxTmp("isActive"), align: 'left', width: "100px"},
                        { title: '允许盲收', field: 'isAllowBlind',template: WMS.UTILS.checkboxTmp("isAllowBlind"),align:'left',width:"130px"},
                        { title: '允许超收', field: 'isAllowOver',template: WMS.UTILS.checkboxTmp("isAllowOver"), align: 'left', width: "130px"},
                        { title: '超收比例', field: 'allowScale', align: 'left', width: "120px"},
//                        { title: '需要质检', field: 'isNeedIqc',template: WMS.UTILS.checkboxTmp("isNeedIqc"), align: 'left', width: "120px"},
                        { title: '启用箱管理', field: 'isManageCartonNo',template: WMS.UTILS.checkboxTmp("isManageCartonNo"), align: 'left', width: "120px"}

                    ],

                    receiptDataSource = wmsDataSource({
                        url: receiptUrl,
                        schema: {
                            model:{
                                id:"id",
                                fields: {
                                    id: {type:"number", editable: false, nullable: true },
                                    strategyName: { type: "string"},
                                    isDefault: { type: "boolean" },
                                    isAllowBlind: { type: "boolean" },
                                    isAllowOver: { type: "boolean" },
                                    allowScale: { type: "string" },
//                                    isNeedIqc: { type: "boolean" },
                                    isActive: { type: "boolean" },
                                    isManageCartonNo: { type: "boolean" },
                                    description:{type:"string"},
                                    createUser:{type:"string"},
                                    createTime:{type:"string"},
                                    updateTime:{type:"string"},
                                    updateUser:{type:"string"}
                                }
                            }
                        },
                        callback: {
                            update: function (response, editData) {
                                $scope.receiptGridOptions.dataSource.read();//刷新detailGrid
                            }
                        }
                    });
                receiptStrategyColumns = receiptStrategyColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.receiptGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: receiptDataSource,
                    toolbar: [{ name: "create", text: "新增"}],
                    columns: receiptStrategyColumns,
                    edit:function(e){
                        $scope.$apply(function(){
                            $scope.isDefault = e.model.isDefault;
                        });
                        $scope.$apply(function(){
                            $scope.isActive = e.model.isActive;
                        });
                    },
                    editable: {
                        mode: "popup",
                        window:{
                            width:"620px"
                        },
                        template: kendo.template($("#receiptEditor").html())
                    }

                }, $scope);

                $scope.search = function() {
                    var condition = {"strategyName":$scope.strategyName};
                    $scope.receiptGrid.dataSource.filter(condition);
                    $scope.receiptGrid.refresh();
                };

                $scope.change = function(data){
                    var _this = data.dataItem;
                    _this.dirty = true;//告诉FF浏览器，这条数据修改了，要请求后台
                    if(_this.isDefault){
                        _this.set("isActive", true);
                    }else{
                        _this.set("isActive", false);
                    }
                };

            }]);

})