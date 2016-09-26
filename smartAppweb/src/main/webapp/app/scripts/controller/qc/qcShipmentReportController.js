/**
 * Created by zw on 16/4/7.
 */

define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('qcShipmentReportController',
        ['$scope', '$rootScope', '$http', 'url','wmsDataSource', 'sync', '$filter',
            function($scope, $rootScope, $http, url, wmsDataSource, $sync, $filter) {

                $scope.setDefaultTime = function(){
                    //赋值时间默认值
                    var today = new Date();
                    $scope.query = {};
                    $scope.query.startTime =  $filter("date")(new Date(), "yyyy/MM/dd 00:00:00");
                    $scope.query.endTime =  $filter("date")(today.setTime(today.getTime() + 1000*60*60*24), "yyyy/MM/dd 00:00:00");
                };

                $scope.setDefaultTime();
                var  columns = [
                    {filterable: false, title: '发货时间', field: 'refundShipTime', align: 'left', width: "220px", template: WMS.UTILS.timestampFormat("refundShipTime", "yyyy-MM-dd HH:mm:ss")},
                    {filterable: false, title: '退货单号', field: 'refundId', align: 'left', width: "100px"},
                    {filterable: false, title: '质检单号', field: 'qcOrderId', align: 'left', width: "100px"},
                    {filterable: false, title: '交易单号', field: 'shopOrderId', align: 'left', width: "120px"},
                    {filterable: false, title: '买家Id', field: 'buyerUserId', align: 'left', width: "100px"},
                    {filterable: false, title: '物流公司', field: 'expressCode', align: 'left', width: "100px"},
                    {filterable: false, title: '物流单号', field: 'expressId', align: 'left', width: "200px"},
                    {filterable: false, title: '卖家发货物流单号', field: 'SellerExpressId', align: 'left', width: "200px"},
                    {filterable: false, title: '店铺名称', field: 'shopName', align: 'left', width: "150px"},
                    {filterable: false, title: '收货人地址', field: 'receiveAddress', align: 'left', width: "300px"},
                    {filterable: false, title: '收货人', field: 'receiveName', align: 'left', width: "120px"},
                    {filterable: false, title: '收货人电话', field: 'receivePhone', align: 'left', width: "120px"}
                ];

                var dataSource = wmsDataSource({
                    url: url.shipmentReportUrl,
                    schema: {
                        model: {
                            id:"id",
                            fields: {
                                id: { type: "number", editable: false, nullable: true },
                                qcOrderId: { type: "number"},
                                shopOrderId: { type: "number"}
                            }
                        }
                    },
                    parseRequestData:function(data){
                        data.startTime = $scope.query.startTime;
                        data.endTime = $scope.query.endTime;
                        return data;
                    }
                });

                $scope.shipmentReportGridOptions = WMS.GRIDUTILS.getGridOptions({
                    widgetId: "header",
                    exportable: true,
                    dataSource: dataSource,
                    columns: columns,
                    idPro : "qcOrderId",
                    autoBind: true
                }, $scope);

                //设置时间快速选项
                $scope.setTime = function(type){
                    var now = new Date();
                    switch(type){
                        case "today":
                            break;
                        case "week":
                            now.setTime(now.getTime() - 1000*60*60*24*6)
                            break;
                        case "month":
                            now.setTime(now.getTime() - 1000*60*60*24*29)
                            break;
                    }
                    //7.结束时间，假设今天是28号。当设置今天、一个月、一周时，结束时间默认为29日0点，这样保证工作时长没有X.99的小数，且更精确。若用户将结束时间手工选择18号，则显示18号0点，查询结果不包含18号0点后的数据（即18号当天数据)
                    var today = new Date();
                    $scope.query.startTime =  $filter("date")(now, "yyyy/MM/dd 00:00:00");
                    $("#startTime").val($scope.query.startTime);
                    $scope.query.endTime =  $filter("date")(today.setTime(today.getTime() + 1000*60*60*24), "yyyy/MM/dd 00:00:00");
                    $("#endTime").val($scope.query.endTime);
                }
                //重置的时候，给日期默认值
                $(".btn-cancel").on("click",function(){
                    setTimeout(function(){
                        $scope.$apply(function(){
                            var today = new Date();
                            $scope.$$childHead.query.startTime =  $filter("date")(new Date(), "yyyy/MM/dd 00:00:00");
                            $scope.$$childHead.query.endTime =  $filter("date")(today.setTime(today.getTime() + 1000*60*60*24), "yyyy/MM/dd 00:00:00");
                        });
                    },20);
                });


                //绑定事件
                $scope.$on("kendoWidgetCreated", function (event, widget) {
                     //导出
                     $(".k-grid-export").on("click", function () {


                     });
                });
            }
        ]);
})