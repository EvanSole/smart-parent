define(['app'], function (app) {
    'use strict';
    app.factory('wmsReportPrint', ['sync', 'url', 'wmsPrint', function ($sync, url, wmsPrint) {
        var wmsReportPrint = function () {
        };
        var httpImgPathPrefix = window.BASEPATH + "/resources/print/";
        var ImgPathPrefix = window.BASEPATH + "/resources/app/print/";

        /****************************************打印流程配置信息*************************************************/
        //打印类型
        var typeObj = {
            "Express": "isPrintexpress", "Delivery": "isPrintdelivery", "Picking": "isPrintPicking"
            //   ,"Invoice":"isPrintinvoice"
        }

        //打印类型和处理函数关系
        var typeFunc = {"wave.Delivery": this.printWaveDelivery, "wave.Picking": this.printWavePicking}
        //打印流程配置 按照数组的顺序处理
        var printProcessTypes = [
            {en: 'Express', cn: '物流单'},
            {en: 'Picking', cn: "拣货单"},
            {en: 'Delivery', cn: "发货单"}
        ];
        /****************************************打印流程配置信息*************************************************/

        /**
         * 设置表格的打印状态字段 被updatePrintState调用
         * @param waveIds
         * @param type
         * @param dataType
         */
        function setGridState(waveIds, type, dataType) {
            var field = typeObj[type];
            var selData = grid.getSelecteds();
            for (var i = 0; i < selData.length; i++) {
                var data = selData[i];
                data[field] = '1';
                grid.updateRow(data);
            }
            //同步更新发货单表格
            if (dataType == 'wave') {
                if (window["frmrightChild"]["searchHandler"] != undefined) {
                    window["frmrightChild"].searchHandler();
                }
            }
        }

        /**
         * 根据path返回不同的路径 如果是http的就返回html
         * @param path
         * @returns {*}
         */
        function imgFileTypeHandle(path) {
            var retPath = path;
            if (isHttpUrl(path)) {
                retPath = "<img border='0' src='" + path + "'/>"
            }

            return retPath;
        }

        function isHttpUrl(url) {
            var flag = false;
            if (url.indexOf("http") != -1) {
                flag = true;
            }

            return flag;
        }

        function checkPrintData(data) {
            if (data.length == 0) {
                kendo.ui.ExtAlertDialog.showError("没有要打印的数据");
                return false;
            }
            return true;
        }


        /**
         * 获取快递公司
         * @returns {*}
         */
        function getExpress(grid) {
            var selData = WMS.GRIDUTILS.getCustomSelectedData(grid);
            if (selData.length == 0) {
                return;
            }
            return selData[0].carrierNo;
        }

        /**
         * 获取Ids
         * @returns {*}
         */
        function getIds(grid) {
            var selData = WMS.GRIDUTILS.getCustomSelectedData(grid);
            if (selData.length == 0) {
                return ""
            } else {
                var rtn = "";
                for (var i = 0; i < selData.length; i++) {
                    if (rtn == "") {
                        rtn = selData[i].id;
                    } else {
                        rtn += "," + selData[i].id;
                    }
                }
                return rtn;
            }
        }


        //后台校验快递单号
        function checkExpressNo(expressType, expressNo, ids, func) {
            //var selData = WMS.GRIDUTILS.getCustomSelectedData(grid);
            var selData = ids.split(",");
            var url = '/shipment/expressNo/check';
            $sync(window.BASEPATH + url, "GET", {
                data: {
                    expressNo: expressNo,
                    expressType: expressType,
                    printNum: selData.length
                }
            })
                .then(function (result) {
                    if (result.suc == true) {
                        func(true);
                    } else if (result.suc == false) {
                        kendo.ui.ExtAlertDialog.showError(result.message);
                    }
                }), function (xhr) {
            };

        }

        /**
         * 更新打印状态 并调用设置grid状态的方法setGridState
         * @param type
         * @param dataType
         */
        function updatePrintState(type, dataType, ids, func) {
            if (dataType == 'wave') {
                var url = '/warehouse/out/wave/report/' + ids;
                $sync(window.BASEPATH + url, "PUT", {data: {type: type, field: typeObj[type]}})
                    .then(function (xhr) {
                        if (xhr.suc == true) {
                            if (func == undefined) {
                                func = '';
                            } else {
                                func();
                            }

                        } else if (xhr.suc == false) {
                            kendo.ui.ExtAlertDialog.showError(xhr.message);
                        }

                    });

            } else {
                var url = '/shipment/report/' + ids;
                $sync(window.BASEPATH + url, "PUT", {data: {type: type, field: typeObj[type]}})
                    .then(function (xhr) {
                        if (xhr.suc == true) {
                            if (func == undefined) {
                                func = '';
                            } else {
                                func(true);
                            }

                        } else if (xhr.suc == false) {
                            kendo.ui.ExtAlertDialog.showError(xhr.message);
                        }
                    }, function (xhr) {
                    });

            }
        }


        //获取当前环境所配置的打印机
        wmsReportPrint.prototype.getCurrentMachines = function () {
            return wmsPrint.getCurrentMachines();
        };

        //获取默认打印机
        wmsReportPrint.prototype.getDefaultMachine = function () {
            return wmsPrint.getDefaultMachine();
        };


        //打印发货单(按波次)
        wmsReportPrint.prototype.printWaveDelivery = function (ids) {
            var url = "/shipment/wave/report/Delivery/" + ids;
            $sync(window.BASEPATH + url, "GET")
                .then(function (xhr) {
                    if (checkPrintData(xhr)) {
                        //打印
                        var printFlag = wmsPrint.printData(xhr.result.rows, wmsPrint.PrintType.Delivery);
                        if (printFlag == true || (printFlag && printFlag.suc == true)) {
                            //更新状态
                            updatePrintState(wmsPrint.PrintType.Delivery, 'wave', ids)
                        }
                    }
                }, function (xhr) {
                    kendo.ui.ExtAlertDialog.showError(xhr);
                });

        };
        /**
         * 打印货位单（根据货区）
         * @param ids
         */
        wmsReportPrint.prototype.printLocationByZoneIds = function (ids) {
            var url = "/location/print/Location/zone/" + ids;
            $sync(window.BASEPATH + url, "GET")
                .then(function (xhr) {
                    if (checkPrintData(xhr)) {
                        wmsPrint.printData(xhr.result.rows, wmsPrint.PrintType.Location);
                    }
                }, function (xhr) {
                    kendo.ui.ExtAlertDialog.showError(xhr);
                });
        }

        /**
         * 打印货位单（根据货位id）
         * @param ids
         */
        wmsReportPrint.prototype.printLocationByLocationIds = function (ids) {
            var url = "/location/print/Location/" + ids;
            $sync(window.BASEPATH + url, "GET")
                .then(function (xhr) {
                    if (checkPrintData(xhr)) {
                        wmsPrint.printData(xhr.result.rows, wmsPrint.PrintType.Location);
                    }
                }, function (xhr) {
                    kendo.ui.ExtAlertDialog.showError(xhr);
                });
        }

        /**
         * 打印商品条码
         * @param ids
         * @param printCount 打印份数
         */
        wmsReportPrint.prototype.printSkuBarcodeByIds = function (ids, printCount) {
            var url = "/goods/ids/" + ids;
            $sync(window.BASEPATH + url, "GET")
                .then(function (xhr) {
                    if (checkPrintData(xhr)) {
                        var mm = xhr.result.rows;
                        var result = [];
                        if (printCount == 1) {
                            wmsPrint.printSkuBarcode(mm);
                        } else {
                            $.each(mm, function () {
                                //组织数据,实现AABB打印
                                for (var i = 0; i < printCount; i++) {
                                    result.push(this);
                                }
                            });
                            wmsPrint.printSkuBarcode(result);
                        }

                    }
                }, function (xhr) {
                    kendo.ui.ExtAlertDialog.showError(xhr);
                });
        }

        /**
         * 打印入库单条码
         * @param ids
         */
        wmsReportPrint.prototype.printReceiptByIds = function (ids) {
            var url = "/receipt/ids/" + ids;
            $sync(window.BASEPATH + url, "GET")
                .then(function (xhr) {
                    if (checkPrintData(xhr)) {
                        wmsPrint.printData(xhr.result.rows, wmsPrint.PrintType.Receipt);
                    }
                }, function (xhr) {
                    kendo.ui.ExtAlertDialog.showError(xhr);
                });
        }
//
//        /**
//         * 打印拣货单(按波次)
//         */
        wmsReportPrint.prototype.printWavePicking = function (ids) {
            var url = "/shipment/wave/report/Picking/" + ids;
            $sync(window.BASEPATH + url, "GET")
                .then(function (xhr) {
                    if (checkPrintData(xhr)) {
                        //打印
                        var printFlag = wmsPrint.printData(xhr.result.rows, wmsPrint.PrintType.Picking);
                        if (printFlag == true || (printFlag && printFlag.suc == true)) {
                            //更新状态
                            updatePrintState(wmsPrint.PrintType.Picking, 'wave', ids)
                        }
                    }
                }, function (xhr) {

                })
        }


        /**
         * 打印物流单(按波次)
         */
        wmsReportPrint.prototype.printWaveExpress = function (expressType, templateId, grid, ids, dataItem, expressNo) {
            if (dataItem == "false") {//跳过
                var url = "/shipment/wave/report/Express/" + ids;
                $sync(window.BASEPATH + url, "GET", {data: {clearUpdate: "1"}})
                    .then(function (xhr) {
                        if (checkPrintData(xhr.result)) {
                            var printFlag = printExec(xhr.result.rows, 'Express', obj);
                            if (printFlag == true || (printFlag && printFlag.suc == true)) {
                                //更新状态
                                updatePrintState('Express', 'wave', ids, function () {
                                    kendo.ui.ExtAlertDialog.show({title: "正确", message: '打印成功'});
                                });


                            }
                        }
                    });
            } else if (dataItem == "true") {//确定
                //check单号
                checkExpressNo(expressType, expressNo, ids, function () {
                    //更新状态
                    updatePrintState('Express', 'wave', ids, function () {
                        $sync(window.BASEPATH + '/warehouse/out/wave/expressAndNo', "PUT", {
                            data: {
                                waveIds: ids,
                                expressNo: expressNo,
                                expressType: expressType
                            }
                        }).then(function (result) {
                            if (result.suc == true) {
                                //查询打印数据
                                var url = "/shipment/wave/report/Express/" + ids;
                                $sync(window.BASEPATH + url, "GET", {data: {clearUpdate: "1"}})
                                    .then(function (innerResult) {
                                        if (checkPrintData(innerResult.result)) {
                                            var printFlag = printExec(innerResult.result.rows, 'Express', obj);
                                            if (printFlag) {
                                                kendo.ui.ExtAlertDialog.show({title: "正确", message: '打印成功'});
                                            }
                                        }

                                    })

                            } else {
                                kendo.ui.ExtAlertDialog.showError("更新物流单以及物流公司失败");
                            }
                        })

                    });


                });

            }

        }

        /**
         * 打印物流单(按波次)-菜鸟控件
         * @param expressType 承运商编码 carrierCode
         * @param templateId 打印模板ID
         * @param grid    网格控件
         * @param ids 波次单ID
         * @param dataItem 数据项
         * @param expressNo 物流单号
         */
        wmsReportPrint.prototype.printWaveExpress_CaiNiao = function (expressType, templateId, grid, ids, dataItem, expressNo) {
            if (dataItem == "false") {//跳过
                var url = "/shipment/wave/report/Express/" + ids;
                $sync(window.BASEPATH + url, "GET", {data: {clearUpdate: "1"}})
                    .then(function (xhr) {
                        if (checkPrintData(xhr.result)) {
                            var printFlag = wmsPrint.printExpress(expressType, xhr.result.rows, templateId);
                            if (printFlag == true || (printFlag && printFlag.suc == true)) {
                                //更新状态
                                updatePrintState('Express', 'wave', ids, function () {
                                    kendo.ui.ExtAlertDialog.show({title: "正确", message: '打印成功'});
                                });
                            }
                        }
                    })
            } else if (dataItem == "true") {//确定
                //check单号
                checkExpressNo(expressType, expressNo, ids, function () {
                    //更新状态
                    updatePrintState('Express', 'wave', ids, function () {
                        $sync(window.BASEPATH + '/warehouse/out/wave/expressAndNo', "PUT", {
                            data: {
                                waveIds: ids,
                                expressNo: expressNo,
                                expressType: expressType
                            }
                        }).then(function (result) {
                            if (result.suc == true) {
                                //获取打印数据
                                var url = "/shipment/wave/report/Express/" + ids;
                                $sync(window.BASEPATH + url, "GET", {data: {clearUpdate: "1"}})
                                    .then(function (innerResult) {
                                        if (checkPrintData(innerResult.result)) {
                                            var printFlag = wmsPrint.printExpress(expressType, innerResult.result.rows, templateId);
                                            if (printFlag && printFlag.suc) {
                                                kendo.ui.ExtAlertDialog.show({title: "正确", message: '打印成功'});
                                            }
                                        }

                                    })

                            } else {
                                kendo.ui.ExtAlertDialog.showError("更新物流单以及物流公司失败");
                            }
                        })
                    });
                });

            }

        }


        /**
         * 打印物流单(按出库单)
         * @param expressType 承运商编码 carrierCode
         * @param templateId 打印模板ID
         * @param ids 出库单ID
         * @param dataItem 数据项
         * @param expressNo 物流单号
         */
        wmsReportPrint.prototype.printShipmentExpress = function (expressType, templateId, ids, dataItem, expressNo) {
            if (dataItem == "false") {//跳过
                var url = "/shipment/report/Express/" + ids;
                $sync(window.BASEPATH + url, "GET", {data: {clearUpdate: "1"}})
                    .then(function (xhr) {
                        if (checkPrintData(xhr.result)) {
                            $sync(window.BASEPATH + "/carrier/carrierNo/" + expressType, "GET")
                                .then(function (result) {
                                        var printFlag;
                                        if (result.suc && result.result != null && result.result.isCloudStack == 1) {
                                            printFlag = wmsPrint.printExpress(expressType, xhr.result.rows, templateId);
                                        } else {
                                            printFlag = wmsPrint.printDataByTemplateId(xhr.result.rows, 'Express', templateId);
                                        }
                                        //電子面單printFlag==true
                                        //非電子面單printFlag.suc==true
                                        if (printFlag == true || (printFlag && printFlag.suc == true)) {
                                            //更新状态
                                            updatePrintState('Express', 'shipment', ids, function () {
                                                kendo.ui.ExtAlertDialog.show({title: "正确", message: '打印成功'});
                                            });
                                        }
                                    }
                                )
                        }
                    })
            } else if (dataItem == "true") {//确定
                //check单号
                checkExpressNo(expressType, expressNo, ids, function () {
                    //先更新单号
                    updatePrintState('Express', 'shipment', ids, function () {
                        $sync(window.BASEPATH + '/shipment/expressAndNo', "PUT", {
                            data: {
                                shipmentId: ids,
                                expressNo: expressNo,
                                expressType: expressType
                            }
                        }).then(function (updateResult) {
                            if (updateResult.suc == true) {
                                //获取打印数据
                                var url = "/shipment/report/Express/" + ids;
                                $sync(window.BASEPATH + url, "GET", {data: {clearUpdate: "1"}})
                                    .then(function (result) {
                                        if (checkPrintData(result.result)) {
                                            //判断承运商是否启用电子面单
                                            $sync(window.BASEPATH + "/carrier/carrierNo/" + expressType, "GET")
                                                .then(function (innerResult) {
                                                    var printFlag;
                                                    if (innerResult.suc && innerResult.result != null && innerResult.result.isCloudStack == 1) {
                                                        printFlag = wmsPrint.printExpress(expressType, result.result.rows, templateId);
                                                    } else {
                                                        printFlag = wmsPrint.printDataByTemplateId(result.result.rows, 'Express', templateId);
                                                    }
                                                    if (printFlag && printFlag.suc) {
                                                        kendo.ui.ExtAlertDialog.show({
                                                            title: "正确",
                                                            message: '打印成功'
                                                        });
                                                    }
                                                })
                                        }

                                    })

                            } else {
                                kendo.ui.ExtAlertDialog.showError("更新物流单以及物流公司失败");
                            }
                        })

                    });
                });

            }

        }


        //打印发货单(按出库单)
        wmsReportPrint.prototype.printShipmentDelivery = function (ids) {
            var url = "/shipment/report/Delivery/" + ids;
            $sync(window.BASEPATH + url, "GET")
                .then(function (xhr) {
                    if (checkPrintData(xhr)) {
                        //打印
                        var printFlag = wmsPrint.printData(xhr.result.rows, wmsPrint.PrintType.Delivery);
                        if (printFlag == true || (printFlag && printFlag.suc == true)) {
                            //更新状态
                            updatePrintState(wmsPrint.PrintType.Delivery, 'shipment', ids)
                        }
                    }
                }, function (xhr) {
                    kendo.ui.ExtAlertDialog.showError(xhr);
                });

        };


        //打印电子面单
        wmsReportPrint.prototype.printWaveWayBill = function (expressType, templateId, grid, ids) {
            var url = "/shipment/wave/report/waybill/" + ids;
            $sync(window.BASEPATH + url, "GET")
                .then(function (result) {
                    if (checkPrintData(result.result)) {
                        var printFlag = wmsPrint.printDataByTemplateId(result.result.rows, 'Express', templateId);
                        //電子面單printFlag==true
                        //非電子面單printFlag.suc==true
                        if (printFlag == true || ( printFlag && printFlag.suc == true)) {
                            //更新状态
                            updatePrintState('Express', 'wave', ids, function () {
                                kendo.ui.ExtAlertDialog.show({title: "成功", message: '打印成功'});
                            });
                        }
                    }

                })

        }

        //按出库单打印电子面单
        wmsReportPrint.prototype.printExpressShipment = function (expressType, templateId, ids, printer, func) {
            var url = "/shipment/report/Express/" + ids;
            $sync(window.BASEPATH + url, "GET")
                .then(function (result) {
                    if (checkPrintData(result.result)) {
                        //承运商
                        var carrierNo = result.result.rows[0].carrierNo;
                        $sync(window.BASEPATH + "/carrier/carrierNo/" + carrierNo, "GET")
                            .then(function (innerResult) {
                                    var printFlag;
                                    if (innerResult.suc && innerResult.result != null && innerResult.result.isCloudStack == 1) {
                                        printFlag = wmsPrint.printExpress(innerResult.result.carrierCode, result.result.rows, templateId, printer);
                                    } else {
                                        printFlag = wmsPrint.printDataByTemplateId(result.result.rows, 'Express', templateId, 1, printer);
                                    }
                                    //電子面單printFlag==true
                                    //非電子面單printFlag.suc==true
                                    if (printFlag == true || (printFlag && printFlag.suc == true)) {
                                        //更新状态
                                        updatePrintState('Express', 'shipment', ids, func);
                                    }
                                    else {
                                        func();
                                    }
                                }
                            )
                    }

                }, function () {
                    func();
                })

        }


        //打印交接单 tempType = Associate
        wmsReportPrint.prototype.printAssociateShipment = function (tempType, data, printCount) {
            if (checkPrintData(data)) {
                var printFlag = false;
                printFlag = wmsPrint.printData(data, wmsPrint.PrintType.Associate, printCount);
                if (printFlag.suc) {
                    kendo.ui.ExtAlertDialog.show({title: "成功", message: '打印成功'});
                }
            }
        }

        /**
         * 打印到货通知单
         * @param ids
         */
        wmsReportPrint.prototype.printAsnByIds = function (ids) {
            var url = "/asns/print/" + ids;
            $sync(window.BASEPATH + url, "GET")
                .then(function (xhr) {
                    if (checkPrintData(xhr)) {
                        wmsPrint.printData(xhr.result.rows, wmsPrint.PrintType.Asn);
                    }
                }, function (xhr) {
                    kendo.ui.ExtAlertDialog.showError(xhr);
                });
        }
        
        
        /**
         * 打印质检单id
         * @param ids
         */
        wmsReportPrint.prototype.printQcOrderId = function (ids) {
            checkPrintData(ids);
            wmsPrint.printData(ids, wmsPrint.PrintType.Barcode);
        }
        
        
        
        return new wmsReportPrint();
    }
    ])
    ;
})
;

