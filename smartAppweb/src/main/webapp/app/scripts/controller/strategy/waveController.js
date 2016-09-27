define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('strategyWaveController',
        ['$scope','$rootScope','$http', 'url','wmsDataSource',
            function($scope, $rootScope, $http, $url, wmsDataSource) {

                var strategyWaveUrl = $url.strategyWaveUrl,
                    waveGridName = "波次策略",
                    strategyWaveColumns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { filterable: false, title: '策略名称', field: 'strategyName', align: 'left', width: "100px"},
                        { filterable: false, title: '可用', field: 'isActive', template:WMS.UTILS.checkboxTmp("isActive"), align: 'left', width: "80px"},
                        { filterable: false, title: '默认策略', field: 'isDefault', template:WMS.UTILS.checkboxTmp("isDefault"), align: 'left', width: "100px"},
                        { filterable: false, title: '一单多品订单数', field: 'multiSize', align: 'left', width: "130px"},
                        { filterable: false, title: '一单一品订单数', field: 'singleSize', align: 'left', width: "130px"},
                        { filterable: false, title: '活动订单数', field: 'promotionSize', align: 'left', width: "110px"},
                        { filterable: false, title: '余单生成波次', field: 'isAllowLess', align: 'left', width: "120px"},
                        { filterable: false, title: '最大订单品数', field: 'maxLine', align: 'left', width: "120px"},
                        { filterable: false, title: '分拣架行数', field: 'rackRow', align: 'left', width: "120px"}

                    ],
                    strategyWaveDataSource = wmsDataSource({
                        url: strategyWaveUrl,
                        schema: {
                            model: {
                                id:"id",
                                fields: {
                                    id: {type:"number", editable: false, nullable: true },
                                    isDefault: { type: "boolean"},
                                    isActive: { type: "boolean"},
                                    strategyName: { type: "string", validation: { // validation rules
                                        required: true // the field is required
                                    } }
                                }
                            }
                        },callback: {
                            update: function (response, editData) {
                                $scope.waveStrategyGridOptions.dataSource.read();
                            }
                        }
                    });

                strategyWaveColumns = strategyWaveColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);

                $scope.waveStrategyGridOptions = WMS.GRIDUTILS.getGridOptions({
                    moduleName: waveGridName,
                    dataSource: strategyWaveDataSource,
                    toolbar: [{ name: "create", text: "新增"}],
                    columns: strategyWaveColumns,
                    edit:function(e){
                    },

                    editable: {
                        mode: "popup",
                        window:{
                            width:"500px"
                        },
                        template: kendo.template($("#waveEditor").html())
                    }
                }, $scope);


                $scope.change = function(data){
                    var _this = data.dataItem;
                    if(_this.isDefault==true){
                        _this.set("isActive", true);
                    }else{
                        _this.set("isActive", false);
                    }
                };
            }]);

})