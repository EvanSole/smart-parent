define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('tradeShopController',
        ['$scope', '$rootScope', '$http', 'url','wmsDataSource', 'sync', '$filter',
            function($scope, $rootScope, $http, url, wmsDataSource, $sync,$filter) {

                var  tradeShopColumns = [
                   WMS.GRIDUTILS.editOptionButton(),
                    {filterable: false, title: '下单账号Id', field: 'buyerUserId', align: 'left', width: "100px"},
                    {filterable: false, title: '下单账号', template: WMS.UTILS.orderUserFormat('buyerUserId'), field: 'buyerUserId', align: 'left', width: "100px"},
                    {filterable: false, title: '订单Id', field: 'shopOrderId', align: 'left', width: "100px"},
                    {filterable: false, title: '卖家Id', field: 'shopId', align: 'left', width: "100px"},
                    {filterable: false, title: '物流单号', field: 'shipExpressId', align: 'left', width: "100px"},
                    {filterable: false, title: '物流公司名称', field: 'shipExpressName', align: 'left', width: "150px"},
                    {filterable: false, title: '商品Id集合', field: 'itemIds', align: 'left', width: "150px"},
                    {filterable: false, title: '创建时间', field: 'created', align: 'left', width: "150px",template: WMS.UTILS.timestampFormat("created", "yyyy-MM-dd HH:mm:ss")}
                   ];

                var tradeShopDataSource = wmsDataSource({
                    url: window.BASEPATH + "/qc/trade",
                    schema: {
                        model: {
                            id:"id",
                            fields: {
                                id: { type: "number", editable: false, nullable: true },
                                buyerUserId: { type: "number" , nullable: true },
                                shopOrderId: { type: "string" , nullable: true },
                                shopId: { type: "number" , nullable: true },
                                shipExpressId: { type: "string" , nullable: true },
                                shipExpressName: { type: "string" , nullable: true },
                                itemIds: { type: "number" , nullable: true }
                            }
                        }
                    },
                    idPro:"id"
                });

                $scope.tradeShopGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: tradeShopDataSource,
                    columns: tradeShopColumns,
                    editable: {
                        mode: "popup",
                        window: {
                            width: "600px"
                        },
                        template: kendo.template($("#shopOrder-editor").html())
                    },
                    toolbar: [
                         { template: '<a class="k-button k-button-custom-command" ng-click="import($event,tradeShopGrid,dataItem)">导入</a>', className: "btn-auth-shipment-import"}
                    ]
                }, $scope);
        }]);
})