/**
 * Created by xiagn on 15/4/2.
 */
define(['scripts/controller/controller',
    '../../model/strategy/replenishModel'
], function(controller, replenishModel) {
    "use strict";
    controller.controller('strategyReplenishController',
        ['$scope','$rootScope','sync', 'url', 'wmsDataSource',
            function($scope, $rootScope, $sync, $url, wmsDataSource) {
                var strategyReplenishUrl = $url.strategyReplenishUrl,
                    replenishGridName = "补货策略",
                    strategyReplenishColumns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { field: 'strategyName', title: '策略名称', filterable: true, align:'left', width: '150px'},
                        { field: 'isActive', title: '是否可用', template: WMS.UTILS.checkboxTmp("isActive"), filterable: true, width: '150px'},
                        { field: 'isDefault', title: '是否默认', template: WMS.UTILS.checkboxTmp("isDefault"), filterable: true, align:'left', width: '150px'},
                        { field: 'isByAllocation', title: '配货缺货时触发', template: WMS.UTILS.checkboxTmp("isByAllocation"), filterable: true, align:'left', width: '150px'},
                        { field: 'isByLowerLimit', title: '库存预警触发', template: WMS.UTILS.checkboxTmp("isByLowerLimit"), filterable: true, align:'left', width: '150px'},
                        { field: 'description', title: '备注', filterable: false, align:'left', width: '150px'}
                    ],
                    strategyReplenishDataSource = wmsDataSource({
                        url: strategyReplenishUrl,
                        schema: {
                            model: replenishModel.header
                        },callback: {
                            update: function (response, editData) {
                                $scope.mainGridOptions.dataSource.read();
                            }
                        }
                    });

                strategyReplenishColumns = strategyReplenishColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);

                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    moduleName: replenishGridName,
                    dataSource: strategyReplenishDataSource,
                    toolbar: [{ name: "create", text: "新增"}],
                    columns: strategyReplenishColumns,
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
                            width:"500px"
                        },
                        template: kendo.template($("#replenishEditor").html())
                    }
                }, $scope);

                $scope.change = function(data){
                    var _this = data.dataItem;
                    if(_this.isDefault==true){
                        _this.isActive=true;
                    }else{
                        _this.isActive=false;
                    }
                }

            }]);
});
