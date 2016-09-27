define(['scripts/controller/controller'], function (controller) {
    "use strict";
    controller.controller('warehouseOutScanController',
        ['$scope', '$rootScope', '$http', '$location', 'sync', 'wmsReportPrint',
            function ($scope, $rootScope, $http, $location, $sync, wmsReportPrint) {
                $scope.$on("kendoWidgetCreated", function (event, widget) {
                    if ($scope.scanPopup) {

                        $scope.scanPopup.setOptions({
                            content: {
                                iframe: false,
                                template: kendo.template($("#scanEditor").html())
                            },
                            actions: [],
                            close: function (e) {
                                $location.path('/warehouse/warehouse/out');
                            }
                        });
                        $scope.scanPopup.refresh().open().maximize();
                        if ($("#dialog").length === 0) {
                            setTimeout(function () {
                                $("#dialog").kendoWindow({
                                    actions: [],
                                    animation: false,
                                    modal: true,
                                    visible: false,
                                    title: "填充物流单号"
                                });
                            }, 300);
                        } else {
                            $("#dialog").kendoWindow({
                                actions: [],
                                animation: false,
                                modal: true,
                                visible: false,
                                title: "填充物流单号"
                            });
                        }
                        setTimeout(function () {
                            $("#referNo").focus();
                        }, 600);
                    }
                });
                $scope.printer = '';
                try {
                    if (navigator.userAgent.indexOf("Mac") < 0) {
                        $scope.allPrinter = wmsReportPrint.getCurrentMachines();
                        var defPrinter = wmsReportPrint.getDefaultMachine();
                        if (defPrinter) {
                            $scope.printer = {key: defPrinter, value: defPrinter};
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
                initFocus();
                $scope.model = {};
                var shipmentData = [];
                var shipmentMap = {};

                var skuDataSource = new kendo.data.DataSource({
                    data: []
                });
                $("#skuDiv").kendoGrid({
                    columns: [
                        {title: "出库单号", field: "shipmentId"},
                        {title: "商品条码", field: "sku.barcode"},
                        {title: "商品名称", field: "sku.itemName"},
                        {title: "发货数量", field: "orderedQty", width: "200"},
                        {title: "复核数量", field: "checkQty"},
                        {title: "未复核数量", field: "noCheckQty"}
                    ],
                    height: 220,
                    editable: false,
                    dataSource: skuDataSource
                });


                var shipmentDataSource = new kendo.data.DataSource({
                    data: []
                });
                $("#shipmentDiv").kendoGrid({
                    columns: [
                        {title: "商品条码", field: "barcode"},
                        {title: "商品名称", field: "itemName"},
                        {title: "包装数量", field: "num"},
                        {title: "出库单号", field: "shipmentId"},
                        {title: "快递公司", field: "carrierNo"},
                        {title: "快递单号", field: "carrierReferNo"},
                        {
                            title: '操作', command: [
                            {name: "edit", template: "<a class='k-button k-button-icontext k-grid-edit'>补打物流单</a>"}
                        ],
                            width: "100px"
                        }
                    ],
                    editable: false,
                    dataSource: shipmentDataSource,
                    dataBound: function (e) {
                        var grid = this,
                            trs = grid.tbody.find(">tr");
                        _.each(trs, function (tr, i) {
                            var record = grid.dataItem(tr);
                            $(tr).find(".k-button").on("click", rePrint);
                            if (record.printState !== 1) {
                                $(tr).find(".k-button").remove();
                            }
                        });
                    }
                });

                //补打物流单
                function rePrint() {
                    var data = $scope.model.printData;
                    var printer = false;
                    if ($scope.printer != '') {
                        printer = $scope.printer.value;
                    }
                    wmsReportPrint.printExpressShipment(data.templateType, data.templateId, data.shipmentId, printer, function () {
                    });
                }

                //单号回车绑定
                $scope.referNoEnter = function () {
                    var model = $scope.model;
                    if (!model.referNo || model.referNo === '') {
                        return;
                    }
                    model.flag = false;//是否可以提交
                    $sync(window.BASEPATH + "/review/refer/" + model.referNo, "GET", {wait: false})
                        .then(function (data) {
                            clearAll(model.referNo);
                            $scope.model.type = data.result.type;
                            skuDataSource.data(data.result.data);
                            $scope.model.waveId = data.result.data[0].waveId;
                            $scope.model.trolleyNo = data.result.data[0].trolleyNo;
                            //$("#barCode").focus();
                            nextSetFocus("barCode");

                        }, function (data) {
                            clearAll();
                            initFocus();
                        });
                };

                //商品条码回车绑定
                $scope.barCodeEnter = function () {
                    var model = $scope.model;
                    if (!model.barCode || model.barCode === '') {
                        return;
                    }
                    var datas = skuDataSource.data();
                    var index = 0;
                    var row = null;
                    if (datas !== null && datas.length > 0) {
                        for (var i = 0; i < datas.length; i++) {
                            if (datas[i].barcodes[model.barCode] && datas[i].noCheckQty > 0) {
                                row = datas[i];
                                index = i;
                                break;
                            }
                        }
                    }
                    if (row) {
                        var orderedQty = row.orderedQty;
                        row.checkQty += 1;
                        row.noCheckQty = orderedQty - row.checkQty;
                        datas[index] = row;
                        if (row.noCheckQty == 0) {
                            var mm = datas.remove(row);
                        }
                        skuDataSource.data(datas);

                        if (row.noCheckQty > 0) {
                            checkSelect(index);
                        }
                        if (model.type === 'SingleSKU' && row.isCancelled === '1') {
                            $sync(window.BASEPATH + "/review/check/" + row.shipmentId, "PUT", {wait: false});
                            $.when(kendo.ui.ExtAlertDialog.showError("出库单[" + row.shipmentId + "]已取消，复核失败！")).done(function () {
                                if (isEnd()) {
                                    clearAll();
                                } else {
                                    model.barCode = "";
                                    $("#barCode").val("");
                                    nextSetFocus("barCode");
                                }
                            });
                            return;
                        }
                    } else {
                        var inputBarCode = $("#barCode").val();
                        model.barCode = "";
                        var megs = "已扫数量已经超过订单数量，或者商品不存在！";
                        $.when(kendo.ui.ExtAlertDialog.showError(megs)).done(function () {
                            var palletNo = $scope.model.referNo;
                            var shipmentId = $scope.model.referNo;
                            var remark = "";
                            if (model.type === 'SingleSKU') {
                                shipmentId = $scope.model.waveId;
                                remark = "波次单号：" + $scope.model.waveId;
                            } else {
                                palletNo = "";
                            }
                            //记录问题单
                            $sync(window.BASEPATH + "/exceptionLog/save", "POST", {
                                data: {
                                    barcode: inputBarCode,
                                    datasourceCode: "Manual",
                                    memo: remark,
                                    operationCode: "PC_Verify",
                                    orderNo: shipmentId,
                                    palletNo: palletNo,
                                    qty: 1,
                                    exceptionMessage: megs
                                }
                            });

                            $scope.$apply(function () {
                                model.barCode = "";
                            });
                            nextSetFocus("barCode");
                        });
                        return;
                    }

                    if (model.type === 'SingleSKU') {
                        $("#carrierNo").val(row.carrierNo);
                        $("#shipmentId").val(row.shipmentId);
                        shipmentData = [];
                        shipmentMap.barcode = row.sku.barcode;
                        shipmentMap.itemName = row.sku.itemName;
                        shipmentMap.num = 1;
                        shipmentMap.shipmentId = row.shipmentId;
                        //shipmentMap.carrierNo = data.result.carrierReferNo;
                        //$("#remark").val(data.result.orderMemo);
                        shipmentMap.carrierNo = row.carrierNo;
                        shipmentMap.carrierReferNo = row.carrierReferNo;
                        $("#remark").html(row.remark);
                        $("#shopName").html(row.shopName);
                        shipmentData.push(shipmentMap);
                        $("#skuImg").attr("src", row.sku.imageUrl);
                        shipmentDataSource.data(shipmentData);
                        model.totalGrossweight = row.totalGrossweight;
                        model.shipmentId = row.shipmentId;
                        model.flag = true;
                        //$("#cartongroupCode").focus();

                        nextSetFocus("cartongroupCode");
                        //设置背景颜色
                        rowSelectBgColor(row.sku.barcode, row.noCheckQty);

                        $scope.model.barCode = "";

                    } else {
                        shipmentData = shipmentDataSource.data();
                        shipmentMap = null;
                        var shipmentIndex = 0;
                        if (shipmentData && shipmentData.length > 0) {
                            $.each(shipmentData, function (index) {
                                if (model.barCode === this.barcode) {
                                    shipmentMap = this;
                                    shipmentIndex = index;
                                }
                            });
                        } else {
                            shipmentData = [];
                        }
                        if (!shipmentMap) {
                            $("#carrierNo").val(row.carrierNo);
                            $("#shipmentId").val(row.shipmentId);
                            if (model.shipmentId) {
                                shipmentMap = {};
                                shipmentMap.barcode = row.sku.barcode;
                                shipmentMap.itemName = row.sku.itemName;
                                shipmentMap.num = 1;
                                shipmentMap.shipmentId = row.shipmentId;
                                shipmentMap.carrierNo = row.carrierNo;
                                shipmentMap.carrierReferNo = row.carrierReferNo;
                                shipmentData.push(shipmentMap);
                                shipmentDataSource.data(shipmentData);
                                //检查是否复核完成
                                validateNoCheckQty(model);
                                //设置背景颜色
                                rowSelectBgColor(row.sku.barcode, row.noCheckQty);
                            } else {
                                shipmentMap = {};
                                shipmentMap.barcode = row.sku.barcode;
                                shipmentMap.itemName = row.sku.itemName;
                                shipmentMap.num = 1;
                                shipmentMap.shipmentId = row.shipmentId;
                                shipmentMap.carrierNo = row.carrierNo;
                                shipmentMap.carrierReferNo = row.carrierReferNo;
                                $("#remark").html(row.remark);
                                $("#shopName").html(row.shopName);
                                model.totalGrossweight = row.totalGrossweight;
                                //shipmentMap.carrierNo = data.result.carrierReferNo;
                                //$("#remark").val(data.result.orderMemo);
                                shipmentData.push(shipmentMap);
                                shipmentDataSource.data(shipmentData);
                                $("#skuImg").attr("src", row.sku.imageUrl);
                                model.shipmentId = row.shipmentId;
                                //检查是否复核完成
                                validateNoCheckQty(model);
                                //设置背景颜色
                                rowSelectBgColor(row.sku.barcode, row.noCheckQty);
                            }
                        } else {
                            shipmentMap.num += 1;
                            shipmentData[shipmentIndex] = shipmentMap;
                            shipmentDataSource.data(shipmentData);
                            //检查是否复核完成
                            validateNoCheckQty(model);
                            //设置背景颜色
                            rowSelectBgColor(row.sku.barcode, row.noCheckQty);
                        }
                        $scope.$apply(function () {
                            $scope.model.barCode = "";
                        });
                    }


                };


                //箱型回车绑定
                $scope.cartongroupCodeEnter = function () {
                    var model = $scope.model;
                    if (!model.cartongroupCode || model.cartongroupCode === '') {
                        return;
                    }
                    nextSetFocus("weight");
                };

                //称重回车绑定
                $scope.weightEnter = function () {
                    var model = $scope.model;
                    if (!model.weight || model.weight === '' || isNaN(model.weight)) {
                        $("#weight").select();
                        return;
                    }
                    if (!model.cartongroupCode || model.cartongroupCode === '') {
                        nextSetFocus("cartongroupCode");
                        return;
                    }
                    if (!model.flag) {
                        console.log("model.flag:" + model);
                        nextSetFocus("barCode");
                        return;
                    }
                    if (model.weight > 1000) {
                        $("#weight").select();
                        return;
                    }
                    if (model.weight > 1) {
                        $sync(window.BASEPATH + "/review/range", "POST", {
                            data: {
                                first: model.weight,
                                second: model.totalGrossweight
                            }
                        })
                            .then(function (data) {
                                doCheck(model);
                            }, function (data) {
                                $("#weight").select();
                            });
                    } else {
                        doCheck(model);
                    }

                };


                //称重复核
                function doCheck(model) {
                    try {
                        $sync(window.BASEPATH + "/review/shipment/" + $scope.model.shipmentId, "POST", {
                            data: {
                                weight: model.weight,
                                cartongroupCode: model.cartongroupCode
                            }
                        }).then(function (data) {
                            //复合成功做打印信息
                            var result = data.result;
                            var printer = false;
                            if ($scope.printer != '') {
                                printer = $scope.printer.value;
                            }
                            $scope.model.printData = {
                                "templateType": result.templateType,
                                "templateId": result.templateId,
                                "shipmentId": result.shipmentId
                            };
                            setPrintButton(data.result.shipment);
                            try {
                                wmsReportPrint.printExpressShipment(result.templateType, result.templateId, result.shipmentId, printer, function () {
                                    var isElec = result.isElec;
                                    if (isElec != 1) {//不是电子面单的
                                        $("#logisticsNo").val("");
                                        $("#dialog").data("kendoWindow").open().center();
                                        setTimeout(function () {
                                            $("#logisticsNo").focus();
                                        }, 500);
                                    } else {
                                        clearByEnd(data.result.shipment);
                                        setTimeout(function () {
                                            $("#referNo").focus();
                                        }, 600);
                                    }
                                });
                            } catch (e) {
                                console.log(e);
                                var isElec = result.isElec;
                                if (isElec != 1) {//不是电子面单的
                                    $("#logisticsNo").val("");
                                    $("#dialog").data("kendoWindow").open().center();
                                    setTimeout(function () {
                                        $("#logisticsNo").focus();
                                    }, 500);
                                } else {
                                    clearByEnd(data.result.shipment);
                                    setTimeout(function () {
                                        $("#referNo").focus();
                                    }, 600);
                                }
                            }

                        }, function (data) {
                            if (data) {
                                clearByEnd();
                                setTimeout(function () {
                                    $("#referNo").focus();
                                }, 600);
                            } else {
                                kendo.ui.ExtAlertDialog.showError("网络原因,手工处理!");
                            }

                        });
                    } catch (e) {
                        console.log(e);
                    }
                }


                //物流单号回车绑定
                $scope.logisticsNoEnter = function () {
                    var shipmentId = $("#shipmentId").val();
                    var carrierNo = $("#carrierNo").val();
                    var logisticsNo = $("#logisticsNo").val();

                    if (!shipmentId || shipmentId == '') {
                        return;
                    }
                    if (!carrierNo || carrierNo == '') {
                        return;
                    }
                    if (!logisticsNo || logisticsNo == '') {
                        return;
                    }

                    $sync(window.BASEPATH + "/shipment/expressNo", "PUT", {
                        data: {
                            shipmentId: shipmentId,
                            carrierNo: carrierNo,
                            carrierReferNo: logisticsNo
                        }
                    }).then(function (data) {
                        clearByEnd();
                        setTimeout(function () {
                            $("#referNo").focus();
                        }, 500);
                        //更新物流单
                        $("#dialog").data("kendoWindow").close();
                    });
                };


                function initFocus() {
                    nextSetFocus("referNo");
                }

                //检查未复核数，如果全部复核,下移焦点
                function validateNoCheckQty(model) {
                    var allDatas = skuDataSource.data();
                    var flag = true;
                    $.each(allDatas, function () {
                        if (this.noCheckQty > 0) {
                            flag = false;
                            return;
                        }
                    });
                    if (flag) {
                        model.flag = true;
                        nextSetFocus("cartongroupCode");
                    } else {
                        nextSetFocus("barCode");
                    }
                }


                function nextSetFocus(fieldFlag) {
                    if (fieldFlag === "referNo") {
                        $("#barCode").attr({"disabled": "disabled"});
                        $("#barCode").css("background-color", "#E4DFDF");
                        $("#cartongroupCode").attr({"disabled": "disabled"});
                        $("#cartongroupCode").css("background-color", "#E4DFDF");
                        $("#weight").attr({"disabled": "disabled"});
                        $("#weight").css("background-color", "#E4DFDF");
                        $("#referNo").removeAttr("disabled");
                        $("#referNo").css("background-color", "");
                        setTimeout(function () {
                            $("#referNo").focus();
                        }, 500);
                    }
                    if (fieldFlag === "barCode") {
                        $("#referNo").attr({"disabled": "disabled"});
                        $("#referNo").css("background-color", "#E4DFDF");
                        $("#cartongroupCode").attr({"disabled": "disabled"});
                        $("#cartongroupCode").css("background-color", "#E4DFDF");
                        $("#weight").attr({"disabled": "disabled"});
                        $("#weight").css("background-color", "#E4DFDF");
                        $("#barCode").removeAttr("disabled");
                        $("#barCode").css("background-color", "");
                        setTimeout(function () {
                            $("#barCode").focus();
                        }, 500);
                    }
                    if (fieldFlag === "cartongroupCode") {
                        $("#barCode").attr({"disabled": "disabled"});
                        $("#barCode").css("background-color", "#E4DFDF");
                        $("#referNo").attr({"disabled": "disabled"});
                        $("#referNo").css("background-color", "#E4DFDF");
                        $("#weight").attr({"disabled": "disabled"});
                        $("#weight").css("background-color", "#E4DFDF");
                        $("#cartongroupCode").removeAttr("disabled");
                        $("#cartongroupCode").css("background-color", "");
                        setTimeout(function () {
                            $("#cartongroupCode").focus();
                        }, 500);
                    }
                    if (fieldFlag === "weight") {
                        $("#barCode").attr({"disabled": "disabled"});
                        $("#barCode").css("background-color", "#E4DFDF");
                        $("#cartongroupCode").attr({"disabled": "disabled"});
                        $("#cartongroupCode").css("background-color", "#E4DFDF");
                        $("#referNo").attr({"disabled": "disabled"});
                        $("#referNo").css("background-color", "#E4DFDF");
                        $("#weight").removeAttr("disabled");
                        $("#weight").css("background-color", "");
                        setTimeout(function () {
                            $("#weight").focus();
                        }, 500);
                    }
                }

                function checkSelect(index) {
                    $.each($("#skuDiv").find(".k-grid-content tr"), function (curIn) {
                        if (index === curIn) {
                            $(this).addClass("k-state-selected");
                            return;
                        }
                    });
                }

                function removeSelect() {
                    $.each($("#skuDiv").find(".k-grid-content tr"), function (curIn) {
                        $(this).addClass("k-state-selected");
                    });
                }

                //设置背景颜色,如果全部复刻完成，背景设置问绿色，否则选择随机色
                function rowSelectBgColor(barcodeScan, noCheckQty) {
                    if (noCheckQty > 0) {
                        rowSelectBgColorDoing(barcodeScan);
                    } else {
                        rowSelectBgColorEnd(barcodeScan);
                    }
                }

                function rowSelectBgColorDoing(barcodeScan) {
                    var colorArray = ["#CDC9A5", "#CDC1C5", "#CDB7B5", "#CDAF95", "#CD9B1D", "#CD8C95", "#CD7054", "#CD96CD", "#B2DFEE", "#9370DB"];
                    var colorIndex = Math.floor(Math.random() * 10); //可均衡获取0到9的随机整数
                    $.each($("#shipmentDiv").find(".k-grid-content tr"), function (curIn) {
                        var text = $(this).children().eq(0).text();
                        if (barcodeScan === text) {
                            $(this).addClass("k-state-selected");
                            $(this).css("background-color", colorArray[colorIndex]);
                        }
                    });
                }

                function rowSelectBgColorEnd(barcodeScan) {
                    $.each($("#shipmentDiv").find(".k-grid-content tr"), function (curIn) {
                        var text = $(this).children().eq(0).text();
                        if (barcodeScan === text) {
                            $(this).addClass("k-state-selected");
                            $(this).css("background-color", "#98FB98");
                        }
                    });
                }


                function clearByEnd(shipment) {
                    if ($scope.model.type === 'SingleSKU') {
                        var allDatas = skuDataSource.data();
                        var theFlag = true;
                        $.each(allDatas, function () {
                            if (this.noCheckQty > 0) {
                                theFlag = false;
                                return;
                            }
                        });
                        if (theFlag) {
                            clearAllRedo(shipment);
                        } else {
                            clearInput(shipment);
                        }
                    } else {
                        clearAll();
                    }
                }


                function clearAll(referNo) {
                    // $scope.$apply();
                    $scope.safeApply(function () {
                        $scope.model = {};
                        if (referNo) {
                            $scope.model.referNo = referNo;
                        }
                        skuDataSource.data([]);
                        shipmentDataSource.data([]);
                        $("#remark").html("");
                        $("#shopName").html("");
                        $("#skuImg").attr("src", "/app/images/saomiao.png");
                        //$("#referNo").focus();
                        nextSetFocus("referNo");
                    });
                }

                //最后一个被复合后。保留最后一次的记录
                function clearAllRedo(shipment) {
                    $scope.safeApply(function () {
                        var printData = $scope.model.printData;
                        $scope.model = {};
                        $scope.model.printData = printData;
                        skuDataSource.data([]);
                        var datas = [];
                        if (shipment) {
                            datas = shipmentDataSource.data();
                            $.each(datas, function () {
                                this.printState = 1;
                                this.carrierNo = shipment.carrierReferNo;
                            });
                        }
                        shipmentDataSource.data(datas);
                        $("#remark").html("");
                        $("#shopName").html("");
                        $("#skuImg").attr("src", "/app/images/saomiao.png");
                        //$("#referNo").focus();
                        nextSetFocus("referNo");
                    });

                }

                function setPrintButton(shipment) {
                    var datas = [];
                    if (shipment) {
                        datas = shipmentDataSource.data();
                        $.each(datas, function () {
                            this.printState = 1;
                            this.carrierReferNo = shipment.carrierReferNo;
                        });
                    }
                    shipmentDataSource.data(datas);
                }

                function clearInput(shipment) {
                    $scope.model.barCode = "";
                    $scope.model.cartongroupCode = "";
                    $scope.model.weight = "";
                    setPrintButton(shipment);
                    //shipmentDataSource.data([]);
                    $("#remark").html("");
                    $("#shopName").html("");
                    $("#skuImg").attr("src", "");
                    //$("#barCode").focus();
                    nextSetFocus("barCode");
                }

                function isEnd() {
                    var allDatas = skuDataSource.data();
                    var flag = true;
                    $.each(allDatas, function () {
                        if (this.noCheckQty > 0) {
                            flag = false;
                        }
                    });
                    return flag;
                }

                $scope.addProblem12 = function () {

                };

                $scope.addProblem1 = function () {

                };

                $scope.addProblem = function (index) {
                    if ($scope.model.referNo && $scope.model.type) {
                        kendo.ui.ExtOkCancelDialog.show({
                            title: "确认",
                            message: "车牌中还有商品数据,必须整车完成后再退出.拣货车是否已经无实物并退出？",
                            icon: 'k-ext-question'
                        }).then(function (resp) {
                            if (resp.button === 'OK') {
                                var skuDatas = skuDataSource.data(), rowData = [];
                                if (skuDatas === "" || skuDatas.length == 0) {
                                    kendo.ui.ExtAlertDialog.showError("没有需要记录的问题单信息!");
                                    return;
                                }
                                if (skuDatas !== null && skuDatas.length > 0) {
                                    for (var i = 0; i < skuDatas.length; i++) {
                                        if (skuDatas[i].noCheckQty > 0) {
                                            var skuMap = {};
                                            skuMap.barcode = skuDatas[i].sku.barcode;
                                            skuMap.qty = skuDatas[i].noCheckQty;
                                            skuMap.exceptionMessage = "商品复核数量不足";
                                            skuMap.orderNo = skuDatas[i].shipmentId;
                                            skuMap.palletNo = $scope.model.trolleyNo;
                                            skuMap.datasourceCode = "System";
                                            skuMap.operationCode = "PC_Verify";
                                            rowData.push(skuMap);
                                        }
                                    }
                                }
//                              $sync(window.BASEPATH + "/exceptionLog/save", "POST",{data: {palletNo:$scope.model.trolleyNo,exceptionMessage:exceptionMessage,datasourceCode:"Manual",operationCode:"PC_Verify",orderNo:id}})
                                $sync(window.BASEPATH + "/exceptionLog/batchsave", "POST", {data: rowData})
                                    .then(function (data) {
                                        if (index && index == 1) {
                                            $scope.scanPopup.close();
                                        } else {
                                            clearAll();
                                        }
                                    }, function (data) {
                                        if (index && index == 1) {
                                            $scope.scanPopup.close();
                                        } else {
                                            clearAll();
                                        }
                                    });
                            } else {
                                if (index && index == 1) {
                                    $scope.scanPopup.close();
                                }
                            }
                        });
                    } else {
                        if (index && index == 1) {
                            $scope.scanPopup.close();
                        }
                    }
                };


                $scope.safeApply = function (fn) {
                    var phase = null;
                    try {
                        phase = this.$root.$$phase;
                    } catch (e) {
                        console.log(e);
                    }
                    if (phase == '$apply' || phase == '$digest') {
                        if (fn && (typeof(fn) === 'function')) {
                            fn();
                        }
                    } else {
                        this.$apply(fn);
                    }
                };

            }]);

})