/** jshint undef: true, unused: true
 global angular
 */
define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('warehouseOutRecheckController',
        ['$scope', '$rootScope', 'sync',
            function ($scope, $rootScope,$sync) {

                $scope.shipment = {};
                $scope.defaultShipment = {};
                $scope.logs = "abcdef";
                $scope.shipmentselects = [];
                $("#carrierReferNo").focus();

                $("#carrierReferNo").on("keydown", function (ev) {
                    if (ev.keyCode === 13) {
                        var shipment = $scope.shipment;
                        if (!shipment.carrierReferNo || shipment.carrierReferNo === '') {

                            return;
                        }


                        $sync(window.BASEPATH +"/review/check/" + shipment.carrierReferNo, "GET")
                            .then(function (data) {
                                if (data.result===null||data.result.headers===null) {
                                    remind();
                                    cleanMessage();
                                    $("#carrierReferNo").focus();
                                    //prependRemind(data.message);
                                    prependRemind(data.message);
                                } else {
                                    noRemind();
                                    var options = [];
                                    var defaultValue = {};
                                    for (var i = 0; i < data.result.headers.length; i++) {
                                        var option = {};
                                        option.key = data.result.headers[i].id;
                                        option.value = data.result.headers[i].id;
                                        if (data.result.headers[i].isDefault) {
                                            defaultValue = option;
                                        }
                                        options[i] = option;
                                    }
                                    //出货单查询
                                    if (defaultValue !== null) {
                                        searchShipment(defaultValue.value);

                                    }
                                  //  $scope.$apply(function() {
                                        $scope.shipmentselects = options;
                                        $scope.defaultShipment = defaultValue;
                                   // });
                                    $("#barCode").val("");
                                    $("#barCode").focus();
                                }
                            });
                    }
                });

                //出货单查询
                function searchShipment(defaultValue) {

                    $sync(window.BASEPATH +"/review/headerInfo/" + defaultValue, "GET")
                        .then(function (data) {
                            var skuColor = window.WMS.CODE_SELECT_DATA.SKUColor;
                            var skuSize = window.WMS.CODE_SELECT_DATA.SKUSize;
                            if (data.result.header.checkStatuscode === 'Finished') {
                                if (confirm("出库单[" + defaultValue + "]已复核，是否重新复核？")) {
                                    $("#barCode").val("");
                                    $("#barCode").focus();
                                    $("#receiverName").val(data.result.header.order.receiverName);
                                    $("#memo").val(data.result.header.memo);
                                    skuDataSource.data([]);
                                    var rows = data.result.details.rows;
                                    var result = [];
                                    for (var i = 0; i < rows.length; i++) {
                                        var dat = rows[i];
                                        $.extend(dat,rows[i].sku);
                                        if(!dat.sku){
                                            dat.sku='';
                                        }
//                                        console.log(skuColor);
//                                        console.log(dat.colorCode);
                                        if(dat.colorCode){
                                            $.each(skuColor,function(){
                                                if(this.value===dat.colorCode){
                                                    dat.colorCode = this.key;
                                                    return;
                                                }
                                            });
                                        }else{
                                            dat.colorCode='';
                                        }
                                        if(dat.sizeCode){
                                            $.each(skuColor,function(){
                                                if(this.value===dat.sizeCode){
                                                    dat.sizeCode = this.key;
                                                    return;
                                                }
                                            });
                                        }else{
                                            dat.sizeCode='';
                                        }
                                        result.push(dat);
                                    }
                                    skuDataSource.data(result);
                                } else {
                                    cleanMessage();
                                }
                            } else {
                                $("#barCode").val("");
                                $("#barCode").focus();
                                $("#receiverName").val(data.result.header.order.receiverName);
                                $("#memo").val(data.result.header.memo);
                                skuDataSource.data([]);
                                var rowss = data.result.details.rows;
                                var results = [];
                                for (var j = 0; j < rowss.length; j++) {
                                    var d = rowss[j];
                                    $.extend(d,rowss[j].sku);
                                    if(!d.sku){
                                        d.sku='';
                                    }
                                    if(d.colorCode){
                                        $.each(skuColor,function(){
                                            if(this.value===d.colorCode){
                                                d.colorCode = this.key;
                                                return;
                                            }
                                        });
                                    }else{
                                        d.colorCode='';
                                    }
                                    if(d.sizeCode){
                                        $.each(skuColor,function(){
                                            if(this.value===d.sizeCode){
                                                d.sizeCode = this.key;
                                                return;
                                            }
                                        });
                                    }else{
                                        d.sizeCode='';
                                    }
                                    results.push(d);
                                }
                                skuDataSource.data(results);
                            }
                        });
                }

                var skuDataSource = new kendo.data.DataSource({
                    data: []
                });

                $("#skuDiv").kendoGrid({
                    columns: [
                        { title: "出库单行号", field: "detailLineNo" },
                        { title: "条码", field: "barcode" },
                        { title: "SKU", field: "sku" },
                        { title: "名称", field: "itemName", width: "200" },
                        { title: "颜色", field: "colorCode" },
                        { title: "尺码", field: "sizeCode" },
                        { title: "订单数量", field: "orderedQty", width: "40" },
                        { title: "已扫数量", field: "scanNum", width: "40" }
                    ],
                    editable: true,
                    dataSource: skuDataSource
                });

                //编码的回车事件
                $("#barCode").on("keydown", function (ev) {
                    if (ev.keyCode === 13) {
                        var barCode = $.trim($("#barCode").val());
                        if (barCode === '') {
                            return;
                        }
                        var row = null;
                        var datas = skuDataSource.data();
                        var index = 0;
                        if (datas !== null && datas.length > 0) {
                            for (var i = 0; i < datas.length; i++) {
                                if (datas[i].barcodes[barCode]) {
                                    row = datas[i];
                                    index = i;
                                    break;
                                }
                            }
                        }

                        //修改扫描数量
                        if (row) {
                            var orderedQty = row.orderedQty;
                            var scanNum = row.scanNum;
                            if (orderedQty <= scanNum) {
                                kendo.ui.ExtAlertDialog.showError("已扫数量已经超过订单数量！");
                                $("#barCode").val("");
                                $("#barCode").focus();
                                remind();
                                prependRemind(getCutTime() + " 编码[" + barCode + "]已扫数量已经超过订单数量！");
                            } else {
                                noRemind();
                                scanNum += 1;
                            }

                            $("#barCode").val("");
                            row.scanNum = scanNum;
                            datas[index] = row;
                            skuDataSource.data(datas);
                            var flag = true;
                            //判断是否已经全部扫描
                            if (orderedQty <= scanNum) {
                                for (var j = 0; j < datas.length; j++) {
                                    var orderedQty2 = datas[j].orderedQty;
                                    var scanNum2 = datas[j].scanNum;
                                    if (orderedQty2 > scanNum2) {
                                        flag = false;
                                        break;
                                    }
                                }
                                //扫描完成修改复核状态
                                if (flag) {
                                    $sync(window.BASEPATH +"/shipment/review", "PUT",{ data: {shipmentId: $scope.defaultShipment.value, type: 1}})
                                        .then(function (data) {
                                            cleanMessage();
                                            prependRemind("<span style='background-color:#76c3f9;'>" + data.message + "</span>");
                                        },function(data){
                                            cleanMessage();
                                            prependRemind(data.message);
                                        });
                                }
                            }

                        } else {
                            remind();
                            kendo.ui.ExtAlertDialog.showError("编码[" + barCode + "]商品未找到！");
                            $("#barCode").val("");
                            $("#barCode").focus();
                            prependRemind(getCutTime() + "  编码[" + barCode + "]商品未找到！");
                        }
                    }
                });

                //提示信息
                function remind() {
                    $("#remind").css("background-color", "red");
                }

                //提示信息
                function noRemind() {
                    $("#remind").css("background-color", "");
                }

                //清空扫描数据
                function cleanMessage() {
                    $scope.shipment = {};
                    //$("input").val("");
                    $("#carrierReferNo").focus();
                    //商品数据
                   // $scope.$apply(function() {
                        $scope.shipmentselects = [];
                        $scope.defaultShipment = {};
                        skuDataSource.data([]);
                   // });

                }

                function getCutTime(){
                    var time = new Date();
                    var ymdhis = "";
                    ymdhis += time.getUTCFullYear() + "-";
                    ymdhis += (time.getUTCMonth() + 1) + "-";
                    ymdhis += time.getUTCDate();
                    ymdhis += " " + time.getHours() + ":";
                    ymdhis += time.getUTCMinutes() + ":";
                    ymdhis += time.getUTCSeconds();
                    return ymdhis;
                }

                function prependRemind(message) {
                    $("#logsDiv").prepend(message + "<br/>");
                }
            }]);
})