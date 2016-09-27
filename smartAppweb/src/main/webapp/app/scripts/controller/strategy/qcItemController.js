define(['scripts/controller/controller'], function (controller) {
    "use strict";
    controller.controller('strategyQcItemController',
        ['$scope', '$rootScope', '$http', 'url', 'wmsDataSource',
            function ($scope, $rootScope, $http, $url, wmsDataSource) {
                var url = $url.strategyQcItemUrl,
                    columns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { filterable: false, title: '质检项名称', field: 'name', align: 'left', width: "100px"},
                        { filterable: false, title: '排序', field: 'sort', align: 'left', width: "100px"}
                    ],
                    DataSource = wmsDataSource({
                        url: url,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "number", editable: false, nullable: true }
                                }
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
                        template: kendo.template($("#qc-editor").html())
                    }
                }, $scope);
            }]);
})