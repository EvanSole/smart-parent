/**
 * Created by zw on 16/4/7.
 */

define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('qcWhShelveController',
        ['$scope', '$rootScope', '$http', 'url','wmsDataSource', 'sync', '$filter',
            function($scope, $rootScope, $http, url, wmsDataSource, $sync, $filter) {
                console.log("welcome qcWhShelveController");

                var  shelveColumns = [
                    WMS.GRIDUTILS.CommonOptionButton(),
                    {filterable: false, title: '货架编号', field: 'shelveNo', align: 'left', width: "100px"},
                    {filterable: false, title: '仓库', field: 'warehouseId', align: 'left', width: "100px"},
                    {filterable: false, title: '楼层', field: 'floor', align: 'left', width: "100px"},
                    {filterable: false, title: '库区', field: 'area', align: 'left', width: "100px"},
                    //{filterable: false, title: '创建人', field: 'created', align: 'left', width: "150px"},
                    {filterable: false, title: '创建时间', field: 'created', align: 'left', width: "100px", template: WMS.UTILS.timestampFormat("created", "yyyy-MM-dd HH:mm:ss")}
                ];

                var shelveDataSource = wmsDataSource({
                    url: url.qcWhShelveUrl,
                    schema: {
                        model: {
                            id:"shelveId",
                            fields: {
                                id: { type: "number", editable: false, nullable: true },
                                shelveNo: { type: "string"},
                                warehouseId: { type: "number"},
                                floor: { type: "string"},
                                area: { type: "string"}
                            }
                        }
                    },
                    idPro : "shelveId"
                });

                $scope.shelveGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: shelveDataSource,
                    columns: shelveColumns,
                    toolbar: [
                        { name: "create", text: "新增", className:'btn-auth-add'}
                        //{ name: "import", text: "导入", className:'btn-auth-import'},
                        //{ name: "batchDelete", text: "批量删除", className:'btn-auth-delete'}
                    ],
                    editable: {
                        mode: "popup",
                        window: {
                            width: "360px"
                        },
                        template: kendo.template($("#shelve-editor").html())
                    },
                    autoBind: true
                }, $scope);





            }]);





})