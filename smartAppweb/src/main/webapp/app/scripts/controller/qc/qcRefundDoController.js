/**
 * Created by xuelang
 */

define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('qcRefundDoController',
        ['$scope', '$rootScope', '$http', 'url','wmsDataSource', 'sync', '$filter','wmsPrint',
            function($scope, $rootScope, $http, $url, wmsDataSource, $sync, $filter,wmsPrint) {


                function initModel(){
                    $scope.qcRefundModel = {};
                    $scope.qcRefundModel.qcOrderId = "";
                    $scope.qcRefundModel.qcOrderNo = "";
                    $scope.qcRefundModel.expressCode = {value:"TTKDEX"};
                    $scope.qcRefundModel.data = null;
                    $scope.qcRefundModel.init = true;
                    $("#refundAddress").attr("disabled",false);
                    setTimeout(function () {
                        $("#qcOrderNo").focus();
                    }, 600);
                }

                initModel();

                /**
                 * 质检单enter事件
                 */
                $scope.qcOrderEnter = function () {
                    getPrintInfo();
                };

                function getPrintInfo(expressCode,refundAddress) {
                    if (expressCode) {
                        $sync($url.qcOrderWaybillPrint + "/" + $scope.qcRefundModel.qcOrderId, "PUT", {data:{expressCode:expressCode,refundAddress:refundAddress},wait: false}).then(function (resp) {
                            setPrint(resp);
                            print();
                            initModel();
                        }, function (ex) {
                            initModel();
                            return;
                        });
                    } else {
                        $sync($url.qcOrderWaybillPrint + "/" + $scope.qcRefundModel.qcOrderNo, "GET", {wait: false}).then(function (resp) {
                            setPrint(resp);
                        }, function (ex) {
                            initModel();
                        });
                    }
                }

                function setPrint(resp){
                    resp.data.qualityCheckOrderDetailDTO.goodsImage = "http://s22.mogucdn.com/"+resp.data.qualityCheckOrderDetailDTO.goodsImage;
                    $scope.qcRefundModel.data = resp.data;
                    $scope.qcRefundModel.refundAddress = resp.data.qualityCheckOrderRefundDTO.receiveProvince + resp.data.qualityCheckOrderRefundDTO.receiveCity + resp.data.qualityCheckOrderRefundDTO.receiveArea + resp.data.qualityCheckOrderRefundDTO.receiveAddress;
                    $scope.qcRefundModel.expressCode = {"value":$scope.qcRefundModel.data.qualityCheckOrderRefundDTO.expressCode};
                    $scope.qcRefundModel.init = false;
                    $scope.qcRefundModel.qcOrderId = resp.data.qualityCheckOrderRefundDTO.qcOrderId;
                    var refundExpressNo = resp.data.qualityCheckOrderRefundDTO.expressId;
                    if(refundExpressNo != ""){
                        $("#refundAddress").attr("disabled",true);
                    }
                }


                /**
                 * 面单打印
                 */
                $scope.printWaybill = function(){
                    if($scope.qcRefundModel.init){
                        kendo.ui.ExtAlertDialog.showError("未获取打印信息!");
                        return ;
                    }
                    var refund = $scope.qcRefundModel.data.qualityCheckOrderRefundDTO;
                    if(refund.expressId==null || refund.expressId==""){
                        if($scope.qcRefundModel.expressCode!=null && $scope.qcRefundModel.expressCode.value!=""){
                            getPrintInfo($scope.qcRefundModel.expressCode.value,$scope.qcRefundModel.refundAddress);
                        }else{
                            kendo.ui.ExtAlertDialog.showError("请选择物流公司!");
                            return ;
                        }
                    }else{
                        print();
                    }

                };

                function print(){
                    var printObj = {};
                    var result = $scope.qcRefundModel.data;
                    var refund = result.qualityCheckOrderRefundDTO;
                    var printInfo = $.parseJSON(refund.printInfo)

                    printObj.goodCode = "商品编码:"+result.qualityCheckOrderDetailDTO.goodsCode;
                    printObj.tradeNos = "订单号:"+result.qualityCheckOrderDTO.shopOrderId;
                    printObj.shopContact = result.sendName;
                    printObj.shopTel = result.sendPhone;
                    printObj.shopAddress = result.addressDetail;
                    printObj.cityName = result.city;//发件城市(中国邮政要求)
                    printObj.logisticAreaName = printInfo;//大头笔

                    printObj.receiverName = refund.receiveName;
                    printObj.mobile = refund.receivePhone;
                    printObj.address = refund.receiveAddress;
                    printObj.carrierReferNo = refund.expressId;
                    printObj.deliveryTime = '';//发件日期(中通要求)
                    var printFlag = wmsPrint.printExpress($scope.qcRefundModel.expressCode.value, printObj)
                }
            }]);



})