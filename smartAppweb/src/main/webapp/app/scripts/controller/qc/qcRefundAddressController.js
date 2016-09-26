define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('qcRefundAddressController',
        ['$scope', '$rootScope', '$http', 'url','wmsDataSource', 'sync', '$filter',
            function($scope, $rootScope, $http, url, wmsDataSource, $sync, $filter) {

                var  qcRefundAddressColumns = [
                    WMS.GRIDUTILS.editOptionButton(),
                    {filterable: false, title: 'Id', field: 'refundId', hidden: true, align: 'left', width: "50px"},
                    {filterable: false, title: '质检单号', field: 'qcOrderId', align: 'left', width: "100px"},
                    {filterable: false, title: '物流公司', field: 'expressCode', align: 'left', width: "100px"},
                    {filterable: false, title: '发货物流单号', field: 'expressId', align: 'left', width: "120px"},
                    {filterable: false, title: '省份', field: 'receiveProvince', align: 'left', width: "100px"},
                    {filterable: false, title: '城市', field: 'receiveCity', align: 'left', width: "150px"},
                    {filterable: false, title: '区域', field: 'receiveArea', align: 'left', width: "100px"},
                    {filterable: false, title: '街道', field: 'receiveStreet', align: 'left', width: "150px"},
                    {filterable: false, title: '详细地址', field: 'receiveAddress', align: 'left', width: "350px"},
                    {filterable: false, title: '邮编', field: 'receiveZip', align: 'left', width: "150px"},
                    {filterable: false, title: '收货人姓名', field: 'receiveName', align: 'left', width: "120px"},
                    {filterable: false, title: '收货人手机', field: 'receivePhone', align: 'left', width: "120px"}
                ];

                var qcRefundAddressDataSource = wmsDataSource({
                    url: window.BASEPATH + "/qc/refund/address",
                    schema: {
                        model: {
                            id:"refundId",
                            fields: {
                                id: { type: "number", editable: false, nullable: true },
                                qcOrderId: { type: "number" , nullable: true },
                                expressCode: { type: "string" , nullable: true },
                                expressId: { type: "string" , nullable: true },
                                receiveProvince: { type: "string" , nullable: true },
                                receiveCity: { type: "string" , nullable: true },
                                receiveStreet: { type: "string" , nullable: true },
                                receiveAddress: { type: "string" , nullable: true },
                                receiveZip: { type: "string" , nullable: true },
                                receiveName: { type: "string" , nullable: true },
                                receivePhone: { type: "string" , nullable: true }
                            }
                        }
                    },
                    idPro:"refundId"
                });

                $scope.qcRefundAddressGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: qcRefundAddressDataSource,
                    columns: qcRefundAddressColumns,
                    editable: {
                        mode: "popup",
                        window: {
                            width: "600px"
                        },
                        template: kendo.template($("#refundAddress-editor").html())
                    },
                    dataBound: function (e) {
                        var grid = this,
                            trs = grid.tbody.find(">tr");
                        _.each(trs, function (tr, i) {
                            var qcRefundAddress = grid.dataItem(tr);
                            if (qcRefundAddress.expressId !== "" || qcRefundAddress.expressCode !== "") {
                                $(tr).find(".k-button").not("[name=edit]").remove();
                            }
                            if(qcRefundAddress.receiveAddress.length > 60 || qcRefundAddress.receiveName.length > 10  || qcRefundAddress.receivePhone.length > 20 ) {
                                $(tr).css("background-color", "#CDC1C5");
                            }
                        });
                    },
                }, $scope);

        }]);
})