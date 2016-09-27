define(['scripts/controller/controller','../../../model/warehouse/out/associateModel'], function(controller,associateModel) {
    "use strict";
    controller.controller('warehouseOutAssociateController',['$scope','$rootScope','$location','$state','sync','url','wmsDataSource','wmsReportPrint',
            function($scope, $rootScope,$location,$state, $sync, $url, wmsDataSource,wmsReportPrint) {


                //交接编号，自动生成
                vehicleNoInit();

                var associateUrl = $url.associateUrlShipmentUrl,
                    associateColumns = [
                        { title: '交接单号', field: 'vehicleno', align: 'left', width: "200px"},
                        { title: '承运商', field: 'carrierNo', align: 'left', width: "200px"},
                        { title: '物流(包裹)单号', field: 'carrierReferNo', align: 'left', width: "200px"},
                        { title: '出库单号', field: 'id', align: 'left', width: "200px"},
                        { title: '交接时间', field: 'updateTime', align: 'left', width: "150px",template:WMS.UTILS.timestampFormat("updateTime","yyyy-MM-dd HH:mm:ss")}
                    ]
                  ;
                //初始化dataSource为空
                var associateDataSource = new kendo.data.DataSource({
                    data: []
                });

                $scope.mainGridOptions = {
                    dataSource: associateDataSource,
                    toolbar: [
                        {className:"btn-auth-print",
                            template: '<kendo-button class="k-primary" disabled="disabled" ng-click="print()">打印</kendo-button>' +
                            '<lable style="margin-left: 10px;">打印份数:</lable>' +
                            '<input type="number" style="width: 30px;height: 20px;border-bottom-width: 2px;padding-bottom: 3px;border-right-width: 2px;margin-left: 5px;" name="printCount" id="printCount" value="3" />'+
                            '<lable style="margin-left: 10px;">包裹单数:&nbsp;</lable><strong id="shipmentTotal" style="margin-left: 20px;font-size: 25px;">0</strong>'
                             }
                    ],
                    columns: associateColumns,
                    autoBind: true,
                    editable: false
                };

                //运单号的回车事件
                $("#carrierReferNo").on("keydown", function (ev) {
                    if (ev.keyCode === 13) {
                        var carrierNo = $.trim($("#carrierNo").val());
                        if (carrierNo === '') {
                            kendo.ui.ExtAlertDialog.showError("请选择承运商!");
                            $("#carrierReferNo").val("");
                            return;
                        }
                        var carrierReferNo = $.trim($("#carrierReferNo").val());
                        if (carrierReferNo === '') {
                            return;
                        }
                        $sync(window.BASEPATH + "/shipment/review", "PUT",{data: {type: "4", carrierReferNo: $("#carrierReferNo").val(), vehicleno: $("#vehicleno").val(), carrierCode: $("#carrierNo").val()}})
                            .then(function (data) {
                                prependRemind("<span style='background-color:#76c3f9;'>" + data.message + "</span>");
                                $("#carrierReferNo").val("");
                                $("#carrierReferNo").focus();
                                $(".k-primary").attr("disabled",false);
                                $("#carrierNo").attr("disabled",true);
                                $("#carrierNo").css("background-color", "#E4DFDF");
                                //获取数据填充DataSource
                                var datas = associateDataSource.data();
                                if (datas) {
                                    $.each(data.result,function(){
                                        datas.push(this);
                                    });
                                }else{
                                    datas = data.result;
                                }
                                associateDataSource.data(datas);
                                $("#shipmentTotal").html(associateDataSource.data().length);

                            },function(data){
                                prependRemind("<span style='background-color:#FD6552;'>" + data.message + "</span>");
                                $("#carrierReferNo").val("");
                                $("#carrierReferNo").focus();
                            });
                       }
                });

                $("#carrierNo").change(function(){
                    var carrierNoVal = $("#carrierNo").val();
                    if(carrierNoVal!=""){
                        $("#carrierReferNo").val("");
                        $("#carrierReferNo").focus();
                    }
                });

                //添加提示信息
                function prependRemind(message) {
                    $("#logsDiv").prepend(message + "<br/>");
                }

                //交接编号，自动生成
                function vehicleNoInit(){
                    $("#carrierReferNo").focus();
                    $sync(window.BASEPATH + "/shipment/associate", "GET")
                        .then(function(data){
                            var associate = data.result;
                            $("#vehicleno").val(associate.vehicleno);
                            $("#vehicleno").css("background-color", "#E4DFDF");
                            $("#carrierReferNo").val("");
                        },function(data){
                            console.log("获取交接编号失败!")
                        });
                }


                //交接单打印
                $scope.print = function() {
                    var vehicle_no = $.trim($("#vehicleno").val());
                    if (vehicle_no === '') {
                        kendo.ui.ExtAlertDialog.showError("交接单号不能为空!");
                        return;
                    }
                    if(associateDataSource ===''){
                        kendo.ui.ExtAlertDialog.showError("没有打印数据!");
                        return;
                    }
                    var printCount = $("#printCount").val();
                    $sync(associateUrl + "/print/"+$("#vehicleno").val(), "GET")
                        .then(function(data){
                            $("#carrierNo").val("");
                            $("#carrierNo").focus();
                            //交接打印
                            wmsReportPrint.printAssociateShipment("Associate",data.result,printCount);
                            //刷新界面
                            $state.reload();

                        },function(){
                            kendo.ui.ExtAlertDialog.showError("打印交接单失败!");
                            $("#carrierNo").val("");
                            $("#carrierNo").focus();
                            return;
                    });
                };
            }
    ]);
})