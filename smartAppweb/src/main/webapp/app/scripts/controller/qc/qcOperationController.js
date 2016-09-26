/**
 * Created by zw on 15/4/20.
 */

define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('qcOperationController',
        ['$scope', '$rootScope', '$http', 'url', 'wmsDataSource', 'sync', '$filter',
            function($scope, $rootScope, $http, $url, wmsDataSource, $sync, $filter) {
                var operationMap = {};
                var operations;
                $scope.qcOperation = function(_this) {
                    if ($("#qcOrderId").val() == null || $("#qcOrderId").val().length == 0) {
                        kendo.ui.ExtAlertDialog.showError("请输入质检单号/物流单号");
                        return;
                    }
                    setQcOperationsNull();
                    var conditions = {
                        "qcOrderId": $("#qcOrderId").val()
                    };

                    $sync(window.BASEPATH + "/qc/order/qcOperation/" + $("#qcOrderId").val(), "GET")
                        .then(function (xhr) {

                            var packInResult = xhr.data;
                            $scope.qcOperation.img = 'http://s22.mogucdn.com'+ packInResult.qualityCheckOrderDetail.goodsImage;
                            $scope.qcOperation.qcOrderId = packInResult.qualityCheckOrder.qcOrderId;
                            $scope.qcOperation.type = packInResult.qualityCheckOrder.type;
                            $scope.qcOperation.goodsName = packInResult.qualityCheckOrderDetail.goodsName;
                            $scope.qcOperation.goodsDesc = packInResult.qualityCheckOrderDetail.goodsDesc;
                            $scope.qcOperation.expressId = packInResult.qualityCheckOrder.expressId;
                            $scope.qcOperation.goodsCode = packInResult.qualityCheckOrderDetail.goodsCode;
                            $scope.qcOperation.goodsPrice = packInResult.qualityCheckOrderDetail.goodsPrice;
                            $scope.qcOperation.shopName = packInResult.qualityCheckOrder.sellerUserName;


                            $scope.qcOperation.goodsDetailUrl = packInResult.qualityCheckOrderDetail.goodsLink;
                            operations = packInResult.optionMap;
                            $scope.qcOperation.inspectionRemark = packInResult.qualityCheckOrderDetail.inspectionRemark;
                            $scope.qcOperation.qcType = packInResult.qualityCheckOrder.qcType;

                            operationMap = {};
//
                            $("#operation_items").css('display','block');



                            $("#qcOrderId").val('');
                            setTimeout(function () {
                                $("#qcOrderId").focus();
                            }, 200);
                        }, function (data) {
                            $("#operation_items").css('display','none');
                            setQcOperationsNull()
                            $("#qcOrderId").val('');
                            setTimeout(function () {
                                $("#qcOrderId").focus();
                            }, 500);
                        });
                }

                $scope.changeOptionType = function(obj) {
                    var operationTypes = {};

                    _.map(operations, function(key, value) {
                        if (key.optionType == obj) {
                            operationTypes[value] = key;
                        }
                        return value;});
                    $scope.qcOperation.operations = operationTypes;
                    var optionKeys = _.map($scope.qcOperation.operations, function(key, value) {return key});


                    $("#qcOrderId").val('');
                    setTimeout(function () {
                        var activateTable = $("#"+optionKeys[0].optionId + "_tabStrip");
                        $("#tabStrip").kendoTabStrip().data("kendoTabStrip");
                        $("#tabStrip").kendoTabStrip().data("kendoTabStrip").activateTab(activateTable);
                    }, 200);

                    setTimeout(function () {
                        JSON.parse(JSON.stringify(operationMap), function(key, value) {
                            if (key != null && key != '') {
                                $('#'+key+"_subOption").css("background", '#0000CD');
                                $('#'+key+"_subOption").css("color", '#FFFFFF');
                                $('#'+key+"_subOption").attr("value", '2');
                            }
                        });
                    }, 500);
                }

                $scope.clickTab = function(_this) {
                    $("#"+_this.item.optionId + "_tabStrip").show();
                    $scope.percentDivChecked = true;
                    $scope.moveChecked = true;
                    var activateTable = $("#"+_this.item.optionId + "_tabStrip");
                    $("#tabStrip").kendoTabStrip().data("kendoTabStrip").activateTab(activateTable);
                }

                $scope.changeQcResult = function(obj) {
                    if (obj == '2') {
                        $("#qcLevelDiv").show();
                        $("#qcLevelRemarkDiv").show();
                    } else {
                        $scope.qcOperation.goodsLevel = 1;
                        $("#qcLevelDiv").hide();
                        $("#qcLevelRemarkDiv").hide();
                    }
                }

                $scope.changeColor = function(_this) {
                    if($('#'+_this.subItem.optionId+"_subOption").attr("value")=='1') {
                        $('#'+_this.subItem.optionId+"_subOption").css("background", '#0000CD');
                        $('#'+_this.subItem.optionId+"_subOption").css("color", '#FFFFFF');
                        $('#'+_this.subItem.optionId+"_subOption").attr("value", '2');
                        operationMap[_this.subItem.optionId] = _this.subItem.parentOptionId;
                    } else {

                        $('#'+_this.subItem.optionId+"_subOption").css("background", '#DBDBDB');
                        $('#'+_this.subItem.optionId+"_subOption").css("color", '#666');
                        $('#'+_this.subItem.optionId+"_subOption").attr("value", '1');
                        delete operationMap[_this.subItem.optionId];
                    }
                }



                $scope.confirmForOperation = function() {

                    if(!$scope.qcOperation.qcResult || $scope.qcOperation.qcResult == '') {
                        kendo.ui.ExtAlertDialog.showError("请选择质检结果!");
                        return;
                    }

                    if (!$scope.qcOperation.qcOrderId || $scope.qcOperation.qcOrderId == '') {
                        kendo.ui.ExtAlertDialog.showError("请输入质检单号/物流单号");
                        return;
                    }

                    if ($scope.qcOperation.qcResult === '2') {
                        if ($scope.qcOperation.goodsLevel === '1' || $scope.qcOperation.goodsLevel === '') {
                            kendo.ui.ExtAlertDialog.showError("请选择商品等级!");
                            return;
                        }
                    }

                    var resultMap = {
                        qcOrderId: $scope.qcOperation.qcOrderId,
                        goodsLevel: $scope.qcOperation.goodsLevel,
                        qcRemark: $scope.qcOperation.qcRemark,
                        qcResult: $scope.qcOperation.qcResult,
                        qcOptions: operationMap,
                        otherRemark: $scope.qcOperation.otherRemark,
                        optionType: $scope.qcOperation.optionType
                    };

                    $sync(window.BASEPATH + "/qc/order/qcOperation/saveOperationResultWithoutFile", "POST", {data: resultMap})
                        .then(function (data) {
                            $("#operation_items").css('display','none');
                            setTimeout(function () {
                                $("#qcOrderId").focus();
                            }, 500);
                            setQcOperationsNull()
                        }, function () {
                            setTimeout(function () {
                                $("#qcOrderId").focus();
                            }, 500);
                    });

                    $("#operation_items").css('display','none');
                    setQcOperationsNull();
                }

                $scope.cancelOperationForReason = function(closeStatus) {

                    if (!$scope.qcOperation.qcOrderId || $scope.qcOperation.qcOrderId == '') {
                        kendo.ui.ExtAlertDialog.showError("请输入质检单号/物流单号");
                        return;
                    }

                    var resultMap = {
                        qcOrderId: $scope.qcOperation.qcOrderId,
                        closeStatus: closeStatus
                    };
                    $sync(window.BASEPATH + "/qc/order/qcOperation/closeOperationByReason", "POST",{data:resultMap})
                        .then(function (data) {
                            $("#operation_items").css('display','none');
                            setQcOperationsNull();
                        }, function () {
                            setQcOperationsNull();
                        });
                    setQcOperationsNull();
                }


                function setQcOperationsNull() {
                    $scope.qcOperation.img = '';
                    $scope.qcOperation.qcOrderId = '';
                    $scope.qcOperation.type = '';
                    $scope.qcOperation.goodsName = '';
                    $scope.qcOperation.goodsDesc = '';
                    $scope.qcOperation.expressId = '';
                    $scope.qcOperation.goodsDesc = '';
                    $scope.qcOperation.goodsCode = '';
                    $scope.qcOperation.goodsPrice = '';
                    $scope.qcOperation.shopName = '';

                    $scope.qcOperation.goodsLevel = '';
                    $scope.qcOperation.goodsDetialUrl = '';
                    $scope.qcOperation.operations = '';
                    $scope.qcOperation.qcResult = '';
                    $scope.qcOperation.goodsDesc = '';
                    $scope.qcOperation.qcRemark = '';
                    $scope.qcOperation.otherRemark = '';
                    $scope.qcOperation.qdType = '';
                    $("#qcLevelDiv").hide();
                    $("#qcLevelRemarkDiv").hide();
                    operationMap = {};
                }

    }]);

})