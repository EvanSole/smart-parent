

define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('dataCarrierController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource',
            function($scope, $rootScope, $sync, $url, wmsDataSource) {

                var commonOptButton = $.extend(true, {}, WMS.GRIDUTILS.CommonOptionButton());
                commonOptButton.command.push({ name: " searchBalance", width: "200px",className:"btn-auth-balance",
                    template: "<a class='k-button k-button-custom-command'  name='searchBalance_a' href='\\#' ng-click='searchBalance(this);' >查询余额</a>"});

                var carrierUrl = $url.dataCarrierUrl,
                    carrierColumns = [
                        commonOptButton,
                        {  title: '承运商编号', field: 'carrierNo', align: 'left', width: "120px"},
                        {  title: '承运商简称', field: 'shortName', align:'left', width:"120px"},
                        {  title: '承运商全称', field: 'longName',align:'left',width:"360px"},
                        {  title: '承运商代码', field: 'carrierCode', align: 'left', width: "120px"},
                        {  title: '国家', field: 'country', align: 'left', width: "130px"},
                        {  title: '省区', field: 'state', align: 'left', width: "130px"},
                        {  title: '城市', field: 'city', align: 'left', width: "110px"},
                        {  title: '县区', field: 'district', align: 'left', width: "110px"},
                        {  title: '信用额度', field: 'creditLimit', align: 'left', width: "110px"},
                        {  title: '是否默认', field: 'isDefault',template: WMS.UTILS.checkboxDisabledTmp("isDefault"), align:'left', width:"120px"}
                    ],

                    carrierDataSource = wmsDataSource({
                        url: carrierUrl,
                        schema: {model:{
                            id:"id",
                            fields: {
                                id: {type:"number", editable: false, nullable: true },
                                shortName: { type: "string" },
                                longName: { type: "string" },
                                carrierCode: { type: "string" },
                                country: { type: "string" },
                                state: { type: "string" },
                                city: { type: "string" },
                                creditLimit: { type: "string" },
                                isActive: { type: "boolean", defaultValue:true },
                                isDefault: { type: "boolean" },
                                isElec: { type: "boolean" },
                                isCloudStack: { type: "boolean" },
                                createUser:{type:"string"},
                                createTime:{type:"string"},
                                updateTime:{type:"string"},
                                updateUser:{type:"string"}
                            }
                        }
                        }
                    });
                carrierColumns = carrierColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.carrierGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: carrierDataSource,
                    toolbar: [{ name: "create", text: "新增", className:"btn-auth-add"}],
                    columns: carrierColumns,
                    editable: {mode: "popup", window:{
                        width:"610px"
                    },

                        template: kendo.template($("#carrierEditor").html())}
                }, $scope);


                var balanceSource = new kendo.data.DataSource({
                    data: []
                });
                $scope.searchBalance = function (obj){
                    $sync(window.BASEPATH + "/carrier/balance/"+obj.dataItem.carrierCode, "GET")
                        .then(function (data) {
                            $("#balanceDiv").kendoGrid({
                                columns: [
                                    { title: "地址", field: "address" },
                                    { title: "剩余数量", field: "qty" }
                                ],
                                editable: false,
                                dataSource: data.result.rows
                            });
                            $scope.balancePopup.refresh().open().center();
                        });
                };

                $scope.balanceClose = function(){
                    $scope.balancePopup.refresh().close();
                };

            }]);

})