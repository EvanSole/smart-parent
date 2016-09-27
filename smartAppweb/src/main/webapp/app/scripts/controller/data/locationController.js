

define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('dataLocationController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource',
            function($scope, $rootScope, $sync, $url, wmsDataSource) {
                var receiptUrl = $url.dataLocationUrl,
                    codeHeaderColumns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        {  title: '仓库', field: 'warehouseId', align: 'left', width: "100px",template:WMS.UTILS.whFormat},
                        {  title: '货位编号', field: 'locationNo', align:'left', width:"100px"},
                        {  title: '货架类型', field: 'typeCode',align:'left',width:"100px"},
                        // title: '优先级', field: 'typeCode', align: 'left', width: "100px"},//此字段没找到
                        {  title: '描述', field: 'description', align: 'left', width: "130px"},
                        //title: '可售', field: 'isActive', align: 'left', width: "130px"},//此字段没找到
                        {  title: '可用', field: 'isActive', align: 'left', width: "110px"},
                        {  title: '是否占用', field: 'isUsed', align: 'left', width: "110px",template: WMS.UTILS.checkboxDisabledTmp("isUsed")}
                    ],

                    putawayDataSource = wmsDataSource({
                        url: receiptUrl,
                        schema: {model:{
                            id:"id",
                            fields: {
                                id: {type:"number", editable: false, nullable: true },
                                warehouseId: { type: "string" },
                                locationNo: { type: "string" },
                                typeCode: { type: "string" },
                                description: { type: "string" },
                                isActive: { type: "string" },
                                createUser:{type:"string"},
                                createTime:{type:"string"},
                                updateTime:{type:"string"},
                                updateUser:{type:"string"}
                            }
                        }
                        }
                    });
                codeHeaderColumns = codeHeaderColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.locationGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: putawayDataSource,
                    toolbar: [{ name: "create", text: "新增", className:"btn-auth-add"}],
                    columns: codeHeaderColumns

                }, $scope);



                $scope.search = function() {
                    var condition = {"listName":$scope.listName, "description":$scope.description};
                    $scope.codeHeaderGrid.dataSource.filter(condition);
                    $scope.codeHeaderGrid.refresh();
                };


            }]);

})