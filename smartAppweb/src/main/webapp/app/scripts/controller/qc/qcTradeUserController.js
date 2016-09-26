/**
 * Created by zw on 16/4/7.
 */

define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('qcTradeUserController',
        ['$scope', '$rootScope', '$http', 'url','wmsDataSource', 'sync', '$filter',
            function($scope, $rootScope, $http, url, wmsDataSource, $sync, $filter) {

                var  tradeUserColumns = [
                    WMS.GRIDUTILS.CommonOptionButton(),
                    {filterable: false, title: '下单账号Id', field: 'buyerUserId', align: 'left', width: "100px"},
                    {filterable: false, title: '下单账号Code', field: 'buyerUserCode', align: 'left', width: "100px"}
                ];

                var dataSource = wmsDataSource({
                    url: url.qcTradeUserUrl,
                    schema: {
                        model: {
                            id:"id",
                            fields: {
                                id: { type: "number", editable: false, nullable: true },
                                buyerUserId: { type: "number"},
                                buyerUserCode: { type: "string"}
                            }
                        }
                    }
                });

                $scope.tradeUserGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: dataSource,
                    columns: tradeUserColumns,
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
                        template: kendo.template($("#tradeUser-editor").html())
                    },
                    autoBind: true
                }, $scope);





            }]);





})