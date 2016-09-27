

define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('strategyPutawayController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource',
            function($scope, $rootScope, $sync, $url, wmsDataSource) {
                var putawayUrl = $url.strategyPutawayUrl,
                    putawayColumns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        {  title: '策略名称', field: 'strategyName', align: 'left', width: "100px"},
                        {  title: '默认策略', field: 'isDefault',template: WMS.UTILS.checkboxTmp("isDefault"), align:'left', width:"100px"},
                        {  title: '空货位优先', field: 'isRoomFirst',template: WMS.UTILS.checkboxTmp("isRoomFirst"),align:'left',width:"120px"},
                        {  title: '同品集中存放', field: 'isGroupbySku',template: WMS.UTILS.checkboxTmp("isGroupbySku"), align: 'left', width: "130px"},
                        {  title: '是否可用', field: 'isActive', template: WMS.UTILS.checkboxTmp("isActive"), align: 'left', width: "100px"},
                        {  title: '描述', field: 'description', align: 'left', width: "110px"}
                    ],

                    putawayDataSource = wmsDataSource({
                        url: putawayUrl,
                        schema: {model:{
                            id:"id",
                            fields: {
                                id: {type:"number", editable: false, nullable: true },
                                strategyName: { type: "string" },
                                isDefault: { type: "boolean" },
                                isRoomFirst: { type: "boolean" },
                                isGroupbySku: { type: "boolean" },
                                description: { type: "string" },
                                isActive: { type: "boolean" },
                                createUser:{type:"string"},
                                createTime:{type:"string"},
                                updateTime:{type:"string"},
                                updateUser:{type:"string"}
                            }
                        }
                        },callback: {
                            update: function (response, editData) {
                                $scope.putawayGridOptions.dataSource.read();
                            }
                        }
                    });
                putawayColumns = putawayColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.putawayGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: putawayDataSource,
                    toolbar: [{ name: "create", text: "新增"}],
                    columns: putawayColumns,
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
                            width:"600px"
                        },
                        template: kendo.template($("#putawayEditor").html())
                    }
                }, $scope);

                $scope.search = function() {
                    var condition = {"strategyName":$scope.strategyName};
                    $scope.lotGrid.dataSource.filter(condition);
                    $scope.lotGrid.refresh();
                };


                $scope.change = function(data){
                    var _this = data.dataItem;
                    if(_this.isDefault==true){
                        _this.isActive=true;
                    }else{
                        _this.isActive=false;
                    }
                }

            }]);

})