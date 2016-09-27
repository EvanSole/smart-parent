define(['scripts/controller/controller', 'scripts/model/strategy/outBoundModel'], function (controller, model) {
    "use strict";
    controller.controller('strategyOutboundController',
        ['$scope', '$rootScope', '$http', 'url','wmsDataSource', 'sync',
            function ($scope, $rootScope, $http, $url, wmsDataSource,$sync) {
//                $scope.outboundModel = null;
                var url = $url.strategyOutboundUrl,
                    columns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { title: '策略名称', field: 'strategyName', align: 'left', width: "100px"},
                        { title: '默认策略', field: 'isDefault',template:WMS.UTILS.checkboxTmp("isDefault"), align: 'left', width: "100px"},
                        { title: '是否可用', field: 'isActive',template:WMS.UTILS.checkboxTmp("isActive"), align: 'left', width: "100px"},
                        { title: '自动发货标记', field: 'deliveryTagCode',template:WMS.UTILS.codeFormat("deliveryTagCode","OutboundTag"),align: 'left', width: "100px"},
                        { title: '库存分配规则', field: 'allocateRuleCode',template:WMS.UTILS.codeFormat("allocateRuleCode","AllocateRule"), align: 'left', width: "200px" },
                        { title: '重量误差正范围', field: 'weightErrorMax', align: 'left', width: "100px"},
                        { title: '重量误差负范围', field: 'weightErrorMin', align: 'left', width: "100px"},
                        { title: '备注', field: 'description', align: 'left', width: "100px"}
                    ],
                    DataSource = wmsDataSource({
                        url: url,
                        schema: {
                            model: {
                                id:"id",
                                fields: {
                                    id: {type:"number", editable: false, nullable: true },
                                    isDefault:{type:"boolean",defaultValue:false},
                                    isActive:{type:"boolean"},
                                    saveFlag:{type:"boolean"},
                                    deliveryTagCode:{type:"string",defaultValue:"Handover"},
                                    allocateRuleCode:{type:"string"}
                                }
                            }
                        },callback: {
                            update: function (response, editData) {
                                $scope.mainGridOptions.dataSource.read();
                            }
                        }
                    });
                columns = columns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: DataSource,
                    toolbar: [
                        { name: "create", text: "新增"}
                    ],
                    columns: columns,
//                    save: function(e) {
//                        e.model.saveFlag=$scope.saveFlag;
//                        $scope.saveFlag = false;
//                    },
                    edit:function(e){
                    },
                    editable: {
                        mode: "popup",
                        window:{
                            width:"640px"
                        },
                        template: kendo.template($("#outBound-editor").html())
                    }
                }, $scope);




                $scope.search = function () {
                    var condition = {"id": $scope.cycId, "startTime": $scope.startTime,"endTime":$scope.endTime};
                    $scope.outBoundGrid.dataSource.filter(condition);
                    $scope.outBoundGrid.refresh();
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