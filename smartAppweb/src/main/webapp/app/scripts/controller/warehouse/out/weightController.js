define(['scripts/controller/controller'], function (controller) {
    "use strict";
    controller.controller('warehouseOutWeightController',
        ['$scope', '$rootScope', '$http', 'sync',
            function ($scope, $rootScope, $http, $sync) {
                $scope.logsDiv = "";
                $scope.dataMessage = {};
                $("#carrierReferNo").focus();
                //运单号的回车事件
                $("#carrierReferNo").on('keydown', function (ev) {
                    if (ev.keyCode === 13) {
                        var carrierReferNo = $.trim($("#carrierReferNo").val());
                        if (carrierReferNo === '') {
                            return;
                        }
                        $sync(window.BASEPATH + "/shipment/header", "GET",{data: {type: "carrierReferNo", carrierReferNo: carrierReferNo}})
                            .then(function (data) {
                                if (data.result && data.result.header) {
                                    if (data.result.header.weightStatuscode === 'Finished') {
                                        if (confirm("包裹单号[" + carrierReferNo + "]已称重，是否重新称重？")) {
                                            //判断是否已称重
                                            $("#shipmentId").val(data.result.header.id);
                                            $("#totalGrossweight").val(data.result.header.totalGrossweight);
                                            $("#totalWeight").val(data.result.header.totalWeight);
                                            $("#totalWeight").select();
                                            $("#totalWeight").focus();

                                        } else {
                                            $("input").val("");
                                        }
                                    } else {
                                        $("#shipmentId").val(data.result.header.id);
                                        $("#totalGrossweight").val(data.result.header.totalGrossweight);
                                        $("#totalWeight").val(data.result.header.totalWeight);
                                        $("#totalWeight").select();
                                        $("#totalWeight").focus();
                                    }
                                }
                            },function(data){
                                prependRemind(data.message);
                                $("input").val("");
                                $("#carrierReferNo").focus();
                            });
                    }
                });

                //称重
                $("#totalWeight").on('keydown', function (ev) {
                    if (ev.keyCode === 13) {
                        var totalWeight = $("#totalWeight").val();
                        var totalGrossweight = $("#totalGrossweight").val();
                        $sync(window.BASEPATH + "/review/range", "POST",{data: {first: totalWeight, second: totalGrossweight}})
                            .then(function (data) {
                                    doWeigh(totalWeight);
                            },function(data){
                                if (confirm("重量超出误差范围，是否继续？")) {
                                    doWeigh(totalWeight);
                                } else {
                                    $("#totalWeight").select();
                                }
                            });
                    }

                });

                //添加提示信息
                function prependRemind(message) {
                    $("#logsDiv").prepend(message + "<br/>");
                }


                function doWeigh(totalWeight) {

                    $sync(window.BASEPATH + "/shipment/review", "PUT",{data: {shipmentId: $("#shipmentId").val(), totalWeight: totalWeight, type: 3}})
                        .then(function (data) {
                            if (data.suc) {
                                prependRemind("<span style='background-color:#76c3f9;'>" + data.message + "</span>");
                                $("input").val("");
                                $("#carrierReferNo").focus();
                            } else {
                                prependRemind(data.message);
                                $("input").val("");
                                $("#carrierReferNo").focus();
                            }
                        });

                }
            }]);

})