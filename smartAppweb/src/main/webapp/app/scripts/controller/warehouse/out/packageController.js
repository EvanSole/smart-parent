define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('warehouseOutPackageController',
        ['$scope','$rootScope','$http','sync',
            function($scope, $rootScope, $http,$sync) {
                $scope.logsDiv = "";
                $scope.dataMessage = {};
                $("#cartongroupCode").focus();
                $("#cartongroupCode").on('keydown', function (ev) {
                    if (ev.keyCode === 13) {
                        $('#carrierReferNo').focus();
                    }
                });

                //运单号的回车事件
                $("#carrierReferNo").on("keydown", function (ev) {
                    if (ev.keyCode === 13) {
                        var cartongroupCode = $.trim($scope.dataMessage.cartongroupCode);
                        if (cartongroupCode === '') {
                            alert("请输入箱型！");
                            $("#cartongroupCode").focus();
                            return;
                        }
                        var carrierReferNo = $.trim($scope.dataMessage.carrierReferNo);
                        if (carrierReferNo === '') {
                            return;
                        }
                        $sync(window.BASEPATH +"/shipment/review", "PUT",{data: {carrierReferNo: carrierReferNo, cartongroupCode: cartongroupCode, type: 2}})
                            .then(function (data) {
//                                console.log('suc');
                                prependRemind("<span style='background-color:#76c3f9;'>" + data.message + "</span>");
                                //$("input").val("");
                                $scope.dataMessage = {};
                                $("#cartongroupCode").focus();
                            },function(data){
                                prependRemind(data.message);
                                //$("#carrierReferNo").val("");
                                $scope.dataMessage.carrierReferNo = "";
                                $("#carrierReferNo").focus();
                            });
                    }
                });

                //添加提示信息
                function prependRemind(message) {
                   // $scope.logsDiv+="\n"+message;
                    $("#logsDiv").prepend(message + "<br/>");
                }
            }]);

})