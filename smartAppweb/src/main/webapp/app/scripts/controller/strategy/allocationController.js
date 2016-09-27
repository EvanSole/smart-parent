define(['scripts/controller/controller', 'scripts/model/strategy/allocationModel'], function (controller, model) {
    "use strict";
    controller.controller('strategyAllocationController',
        ['$scope', '$rootScope', '$http', 'url','wmsDataSource',
            function ($scope, $rootScope, $http, $url, wmsDataSource) {
                var url = $url.strategyAllocationUrl,
                    columns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { title: '策略名称', field: 'strategyName', align: 'left', width: "100px"},
                        { field: 'isActive', title: '是否可用', template: WMS.UTILS.checkboxTmp("isActive"), filterable: true, width: '150px'},
                        { field: 'isDefault', title: '是否默认', template: WMS.UTILS.checkboxTmp("isDefault"), filterable: true, align: 'left', width: '150px'},
                        { field: 'cartonFirst', title: '整箱优先', template: WMS.UTILS.checkboxTmp("cartonFirst"), filterable: true, align: 'left', width: '150px'},
                        { title: '排序字段代码', field: 'fieldCode', align: 'left', width: "100px", template:WMS.UTILS.codeFormat("fieldCode","AllocateField")},
                        { title: '排序方向代码', field: 'directionCode', align: 'left', width: "100px" ,template:WMS.UTILS.codeFormat("directionCode","AllocateDirection")},
                        { title: '描述', field: 'description', align: 'left', width: "100px"}
                    ],
                    DataSource = wmsDataSource({
                        url: url,
                        schema: {
                            model: model.entity
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
                    editable: {
                        mode: "popup",
                        window:{
                            width:"620px"
                        },
                        template: kendo.template($("#allocationGrid-template").html())
                    }
                },$scope);

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