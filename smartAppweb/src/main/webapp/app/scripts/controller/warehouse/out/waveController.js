define(['scripts/controller/controller'], function (controller) {
    "use strict";
    controller.controller('warehouseOutWaveController',
        ['$scope', '$rootScope', 'wmsDataSource', 'wmsLog', 'wmsReportPrint', 'sync', '$filter',
            function ($scope, $rootScope, wmsDataSource, wmsLog, wmsReportPrint, $sync, $filter) {
                var waveUrl = "/warehouse/out/wave",
                    waveColumns = [
                        { filterable: false, title: '波次号', field: 'id', align: 'left', width: "120px"},
                        { filterable: false, title: '商家', field: 'storerId', template: WMS.UTILS.storerFormat, align: 'left', width: "120px"},
                        { filterable: false, title: '仓库', field: 'warehouseId', template: WMS.UTILS.whFormat, align: 'left', width: "120px"},
//                        { filterable: false, title: '活动名称', field: 'promotionName', align: 'left', width: "120px"},
//                        { filterable: false, title: '数据来源', field: 'datasourceCode', align: 'left',width:"120px"},
                        { filterable: false, title: '订单来源', field: 'fromTypeCode', template: WMS.UTILS.codeFormat("fromTypeCode", "ShipmentFrom"), align: 'left', width: "120px"},
//                        { filterable: false, title: '来源平台', field: 'platformCode',align: 'left',width:"120px"},
                        { filterable: false, title: '单据状态', field: 'statusCode', template: WMS.UTILS.codeFormat("statusCode", "TicketStatus"), align: 'left', width: "120px"},
                        { filterable: false, title: '店铺', field: 'shopId', template: WMS.UTILS.shopFormat, align: 'left', width: "120px"},
                        { filterable: false, title: '类型', field: 'typeCode', align: 'left', width: "120px"},
                        { filterable: false, title: '承运商', field: 'carrierNo', template: WMS.UTILS.carrierFormat, align: 'left', width: "120px"},
                        { filterable: false, title: '分销商', field: 'distributorId', align: 'left', width: "120px"},
                        { filterable: false, title: '线路', field: 'regionCode', align: 'left', width: "120px"},
                        { filterable: false, title: '货到付款', field: 'distributorId', template: WMS.UTILS.checkboxDisabledTmp("distributorId"), align: 'left', width: "120px"},
                        { filterable: false, title: '开发票', field: 'invoiceoptionCode', template: WMS.UTILS.checkboxDisabledTmp("invoiceoptionCode"), align: 'left', width: "120px"},
                        { filterable: false, title: '订单数', field: 'totalOrderQty', align: 'left', width: "120px"},
                        { filterable: false, title: 'SKU品种数', field: 'totalCategoryQty', align: 'left', width: "120px"},
                        { filterable: false, title: '商品总数', field: 'totalQty', align: 'left', width: "120px" },
                        { filterable: false, title: '拣货人', field: 'fpicker', align: 'left', width: "100px" },
                        { filterable: false, title: '周转箱号', field: 'bindboxno', align: 'left', width: "120px" },
                        { filterable: false, title: '物流单打印', field: 'isPrintexpress', template: WMS.UTILS.checkboxDisabledTmp("isPrintexpress"), align: 'left', width: "120px" },
                        { filterable: false, title: '发货单打印', field: 'isPrintdelivery', template: WMS.UTILS.checkboxDisabledTmp("isPrintdelivery"), align: 'left', width: "120px" },
                        { filterable: false, title: '拣货单打印', field: 'isPrintPicking', template: WMS.UTILS.checkboxDisabledTmp("isPrintPicking"), align: 'left', width: "120px" },
                        { filterable: false, title: '单件', field: 'orderstructCode', template: WMS.UTILS.codeFormat("orderstructCode", "OrderStructure"), align: 'left', width: "120px" },
                        WMS.UTILS.CommonColumns.defaultColumns
                    ],


                    dataSource = wmsDataSource({
                        url: waveUrl,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "number", editable: false, nullable: true }
                                }
                            },
                            total: function (total) {
                                return total.length > 0 ? total[0].total : 0;
                            }
                        }
                    });


                waveColumns = waveColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                waveColumns.splice(0, 0, WMS.UTILS.CommonColumns.checkboxColumn);
                $scope.waveGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: dataSource,
                    sortable: true,
                    toolbar: [
                        { template: '<a class="k-button k-button-custom-command" ng-click="submitWave()">提交</a>', className: "btn-auth-submit"},
                        { template: '<a class="k-button k-button-custom-command" ng-click="cancelWave()">撤销</a>', className: "btn-auth-cancel"},
                        { template: '<a class="k-button k-button-custom-command" ng-click="delWave()">删除</a>', className: "btn-auth-batchDelete"},
                        { template: '<a class="k-button k-button-custom-command" ng-click="printExpress()">打印物流单</a>', className: "btn-auth-printExpress"},
                        { template: '<a class="k-button k-button-custom-command" ng-click="printDelivery()">打印发货单</a>', className: "btn-auth-printDelivery"},
                        { template: '<a class="k-button k-button-custom-command" ng-click="printPick()">打印拣货单</a>', className: "btn-auth-printPick"}
                    ],
                    columns: waveColumns,
                    editable: {
                        mode: "popup"
//                        window: {
//                            width: "600px"
//                        },
//                        template: kendo.template($("#wave-editor").html())
                    },
                    filterable: true,
                    widgetId: "header"
                }, $scope);


                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;


                //明细信息(出库信息)
                var detailColumns = [
                    { filterable: false, title: '数据来源', field: 'datasourceCode', align: 'left', width: "120px", template: WMS.UTILS.codeFormat('datasourceCode', 'DataSource')},
                    { field: "id", title: "出库单号", width: "120px" },
                    { field: "waveSeq", title: "波次序号", width: "120px" },
                    { field: "promotionName", title: "活动名称", width: "120px" },
                    { field: "order.shopNo", title: "店铺名称", template: WMS.UTILS.shopFormat("order.shopNo"), width: "120px" },
                    { field: "statusCode", title: "单据状态", template: WMS.UTILS.codeFormat("statusCode", "TicketStatus"), width: "120px" },
                    { field: "isCancelled", title: "OMS取消", template: WMS.UTILS.checkboxDisabledTmp("isCancelled"), width: "120px" },
                    { field: "isClosed", title: "WMS拒单", template: WMS.UTILS.checkboxDisabledTmp("isClosed"), width: "120px" },
                    { title: '仓库名称', field: 'warehouseId', align: 'left', width: "120px;", template: WMS.UTILS.whFormat},
                    { title: '商家名称', field: 'storerId', align: 'left', width: "120px;", template: WMS.UTILS.storerFormat},
                    { title: '分配状态', field: 'allocateStatuscode', template: WMS.UTILS.codeFormat("allocateStatuscode", "OrderOperationStatus"), align: 'left', width: "120px"},
                    { title: '拣货状态', field: 'pickStatuscode', template: WMS.UTILS.codeFormat("pickStatuscode", "OrderOperationStatus"), align: 'left', width: "120px"},
                    { title: '复核状态', field: 'checkStatuscode', template: WMS.UTILS.codeFormat("checkStatuscode", "OrderOperationStatus"), align: 'left', width: "120px"},
                    { title: '打包状态', field: 'packageStatuscode', template: WMS.UTILS.codeFormat("packageStatuscode", "OrderOperationStatus"), align: 'left', width: "120px"},
                    { title: '称重状态', field: 'weightStatuscode', template: WMS.UTILS.codeFormat("weightStatuscode", "OrderOperationStatus"), align: 'left', width: "120px"},
                    { title: '发货状态', field: 'deliveryStatuscode', template: WMS.UTILS.codeFormat("deliveryStatuscode", "OrderOperationStatus"), align: 'left', width: "120px"},
                    { title: '交接状态', field: 'handoverStatuscode', template: WMS.UTILS.codeFormat("handoverStatuscode", "OrderOperationStatus"), align: 'left', width: "120px"},
                    { title: '订单日期', field: 'order.orderTime', template: WMS.UTILS.timestampFormat("order.orderTime", "yyyy-MM-dd HH:mm:ss"), align: 'left', width: "150px"},
                    { title: '支付时间', field: 'order.paymentTime', template: WMS.UTILS.timestampFormat("order.paymentTime", "yyyy-MM-dd HH:mm:ss"), align: 'left', width: "150px"},
                    { title: '承运商', field: 'carrierNo', template: WMS.UTILS.carrierFormat, align: 'left', width: "120px"},
//                    { title: '实际发货时间', field: 'deliveryTime',template:WMS.UTILS.timestampFormat("deliveryTime","yyyy-MM-dd"), align: 'left',width:"120px"},
                    { title: '重量', field: 'totalWeight', align: 'left', width: "120px"},
                    { title: 'SKU品种数', field: 'totalCategoryQty', align: 'left', width: "120px"},
                    { title: 'SKU总件数', field: 'totalQty', align: 'left', width: "120px"},
                    { title: '最小货位', field: 'defaultLocationNo', align: 'left', width: "120px"},
                    { title: '最小货区', field: 'defaultZoneNo', align: 'left', width: "120px"},
                    { title: '物流单号', field: 'carrierReferNo', align: 'left', width: "120px"},
                    { title: '物流单打印', field: 'isPrintexpress', template: WMS.UTILS.checkboxDisabledTmp("isPrintexpress"), align: 'left', width: "120px" },
                    { title: '发货单打印', field: 'isPrintdelivery', template: WMS.UTILS.checkboxDisabledTmp("isPrintdelivery"), align: 'left', width: "120px" },
                    { title: '拣货单打印', field: 'isPrintPicking', template: WMS.UTILS.checkboxDisabledTmp("isPrintPicking"), align: 'left', width: "120px" },
                    WMS.UTILS.CommonColumns.defaultColumns
                ];

                detailColumns = detailColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                detailColumns.splice(0, 0, WMS.UTILS.CommonColumns.checkboxColumn);

                $scope.waveDetailOptions = function (dataItem) {
                    var detailOptions = WMS.GRIDUTILS.getGridOptions({
                            moduleName: "detail",
                            dataSource: wmsDataSource({
                                url: waveUrl + "/" + dataItem.id + "/details",
                                parseRequestData: function (data, type) {
                                    if (type === "create") {
                                        return {shipmentIds: $scope.selectShipmentIdAry.join(",")};
                                    }
                                    return data;
                                },
                                schema: {
                                    model: {
                                        id: "id",
                                        fields: {
                                            id: {type: "number", editable: false, nullable: true },
                                            isCancelled: {type: "boolean"},
                                            isClosed: {type: "boolean"},
                                            isPrintexpress: {type: "boolean"},
                                            isPrintdelivery: {type: "boolean"},
                                            isPrintPicking: {type: "boolean"}

                                        }
                                    },
                                    total: function (total) {
                                        return total.length > 0 ? total[0].total : 0;
                                    }
                                },
                                otherData: {"waveId": dataItem.id}
                            }),
                            editable: {
                                mode: "popup",
                                window: {
                                    width: "600px"
                                }
                            },
                            columns: detailColumns
                        }, $scope),

                        toolbarOptions = [
                            { template: '<a class="k-button k-grid-custom-command" ng-click="addShipment()" href="\\#">新增</a> ', className: "btn-auth-add-shipment"},
                            { template: '<a class="k-button k-grid-custom-command" ng-click="delShipment(this)" href="\\#">删除</a>', className: "btn-auth-delete-shipment"}
                        ];
                    if (dataItem.statusCode === "Initial") {
                        detailOptions.toolbar = toolbarOptions;
                    }
                    return detailOptions;
                };


                //操作日志
                $scope.logOptions = wmsLog.operationLog;


                //商品汇总列
                var goodsInfoColumns = [
//                    WMS.GRIDUTILS.CommonOptionButton,
                    { field: "skuId", title: "SKU", width: "120px" },
                    { field: "skuItemName", title: "商品名称", width: "120px" },
                    { field: "skuBarcode", title: "商品条码", width: "150px" },
                    { field: "skuModel", title: "型号", width: "120px" },
                    { field: "orderedQty", title: "订单数量", width: "120px" },
                    { field: "allocatedQty", title: "分配数量", width: "120px" },
                    { field: "pickedQty", title: "拣货数量", width: "120px" },
                    { field: "shippedQty", title: "出库数量", width: "120px" }
                ];


                //商品汇总
                $scope.goodsInfoOptios = function (dataItem) {
                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource: wmsDataSource({
                            url: waveUrl + "/" + dataItem.id + "/waveSum",
                            schema: {
                                model: {
                                    id: "id",
                                    fields: {
                                        id: {type: "number", editable: false, nullable: true }
                                    }
                                },
                                total: function (total) {
                                    return total.length > 0 ? total[0].total : 0;
                                }
                            },
                            otherData: {"waveId": dataItem.id}
                        }),
                        editable: {
                            mode: "popup",
                            window: {
                                width: "600px"
                            },
                            template: kendo.template($("#waveDetail-editor").html())
                        },
                        columns: goodsInfoColumns
                    }, $scope);
                };


                //分配结果列
                var allocateColumns = [
                    { title: '波次单号', field: 'waveId', align: 'left', width: "120px"},
                    { title: '出库单号', field: 'shipmentId', align: 'left', width: "120px"},
                    { title: '仓库名称', field: 'warehouseId', align: 'left', width: "120px;", template: WMS.UTILS.whFormat},
                    { title: '货位', field: 'locationNo', align: 'left', width: "120px"},
                    { title: '商品', field: 'skuItemName', align: 'left', width: "120px"},
                    { title: "商品条码", field: "skuBarcode", width: "150px"},
                    { title: '托盘号', field: 'palletNo', align: 'left', width: "120px"},
                    { title: '箱号', field: 'cartonNo', align: 'left', width: "120px"},
                    { title: '分配数量', field: 'allocatedQty', align: 'left', width: "120px"},
                    { title: '拣货数量', field: 'pickedQty', align: 'left', width: "120px"},
                    { title: '创建人', field: 'createUser', align: 'left', width: "120px"},
                    { title: '创建时间', field: 'createTime', align: 'left', width: "160px", template: WMS.UTILS.timestampFormat("createTime")}
                ];


                //分配结果
                $scope.allocateOptios = function (dataItem) {
                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource: wmsDataSource({
                            url: waveUrl + "/" + dataItem.id + "/2/allocateResult",
                            schema: {
                                model: {
                                    id: "id",
                                    fields: {
                                        id: {type: "number", editable: false, nullable: true }
                                    }
                                },
                                total: function (total) {
                                    return total.length > 0 ? total[0].total : 0;
                                }
                            },
                            otherData: {"waveId": dataItem.id}
                        }),
                        editable: {
                            mode: "popup",
                            window: {
                                width: "600px"
                            },
                            template: kendo.template($("#waveDetail-editor").html())
                        },
                        columns: allocateColumns
                    }, $scope);
                };


                //获取当前选中的ID
                function getCurrentIds() {
                    var grid = $scope.waveGrid;
                    var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                    var ids = [];
                    selectData.forEach(function (data) {
                        ids.push(data.id);
                    });
                    var id = ids.join(",");
                    return id;
                }


                //弹出出库单信息
                $scope.addShipment = function () {
                    var addDetailScope = this,
                        waveItem = this.dataItem;
                    $scope.shipmentPopup.initParam = function (subScope) {
                        subScope.selectable = "multiple, row";
                        subScope.url = waveUrl + "/" + waveItem.id + "/shipment/details/";
                    };
                    $scope.shipmentPopup.setReturnData = function (returnData) {
                        if (_.isEmpty(returnData)) {
                            return;
                        }
//                        var selectShipmentIdAry = [];
//                         _.each(returnData, function(i,record){
//                             selectShipmentIdAry.push(i.id);
//                        });

                        var selectShipmentIdAry = _.map(returnData, function (record) {
                            return record.id;
                        });

                        $sync(waveUrl + "/" + waveItem.id + "/details/", "POST", {
                            data: {
                                shipmentIds: selectShipmentIdAry.join(",")
                            }
                        }).then(function (resp) {
                            _.each(returnData, function (record) {
                                addDetailScope.shipmentGrid.dataSource.add(record.toJSON());
                            });
                            addDetailScope.shipmentGrid.refresh();
                        }, function (resp) {
                            _.each(returnData, function (record) {
                                addDetailScope.shipmentGrid.dataSource.add(record.toJSON());
                            });
                            addDetailScope.shipmentGrid.refresh();
                        });
                    };
                    $scope.shipmentPopup.refresh().open().center();
                };

                /**
                 * 删除已和波次绑定的出库单,解绑
                 */
                $scope.delShipment = function (obj) {
                    var addDetailScope = this,
                        waveItem = this.dataItem;
                    var grid = obj.shipmentGrid;
                    var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                    var ids = [];
                    selectData.forEach(function (data) {
                        ids.push(data.id);
                    });
                    var selectShipmentIds = ids.join(",");
                    if (selectShipmentIds.length == 0) {
                        kendo.ui.ExtAlertDialog.showError("请选择要删除的出库单");
                        return;
                    }
                    $sync(waveUrl + "/" + waveItem.id + "/details/" + selectShipmentIds, "DELETE").then(function (resp) {
                        addDetailScope.shipmentGrid.dataSource.read();

                    });

                };


                //弹出物流/电子面单信息确认框
                function checkExpress(carrierVal) {
                    var url = "/report/reportTemplate/" + carrierVal;
                    $sync(window.BASEPATH + url, "GET")
                        .then(function (xhr) {
                            var data = xhr.result;
                            if (data.reportEntity && data.carrierEntity) {
                                $("#reportCategoryCode").val(data.reportEntity.reportCategoryCode);
                                if ('Express' == data.reportEntity.reportCategoryCode) {
                                    $("#templateId").val(data.reportEntity.id);
                                    $("#carrierNo").val(data.carrierEntity.carrierNo);//物流公司
                                    $("#carrierCode").text(data.carrierEntity.longName);//物流公司
                                    $("#printTemplate").text(data.reportEntity.reportName);//模板名称
                                    $scope.carrierConfirmPopup.refresh().open().center();
                                } else {
                                    $("#wayBillTemplateId").val(data.reportEntity.id);
                                    $("#wayBillCarrierCode").text(data.carrierEntity.longName);//物流公司
                                    $("#wayBillPrintTemplate").text(data.reportEntity.reportName);//模板名称
                                    $scope.wayBillConfirmPopup.refresh().open().center();
                                }

                            }
                        }, function (xhr) {
                            kendo.ui.ExtAlertDialog.showError(xhr.message);
                        });

                }


                //打印发货单
                $scope.$on("kendoWidgetCreated", function (event, widget) {
                    if (widget.options !== undefined && widget.options.widgetId === 'header') {
                        $scope.printDelivery = function () {
                            var grid = $scope.waveGrid;
                            var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                            var deliverArrs = [];
                            var statusCodeArr = [];
                            var ids = [];
                            $(selectData).each(function (index, item) {
                                ids.push(item.id);
                                if ('Submitted' != item.statusCode) {
                                    statusCodeArr.push(item.statusCode);
                                }
                                if (item.isPrintdelivery == 1) {
                                    deliverArrs.push(item.id);
                                }
                            });
                            var id = ids.join(",");
                            var codes = statusCodeArr.join(",");
                            var delivers = deliverArrs.join(",");
                            if (id == '') {
                                kendo.ui.ExtAlertDialog.showError("请选择要打印的数据");
                                return;
                            }
                            if (codes.length) {
                                kendo.ui.ExtAlertDialog.showError("单据状态为已提交才能进行打印");
                                return;
                            }
                            if (delivers.length) {
                                kendo.ui.ExtOkCancelDialog.show({
                                    title: "确认",
                                    message: "波次单为" + [delivers] + "的已打印发货单,继续打印吗?",
                                    icon: 'k-ext-question' }).then(function (resp) {
                                    if (resp.button === 'OK') {
                                        wmsReportPrint.printWaveDelivery(ids);
                                    } else {
                                        return;
                                    }
                                });
                            } else {
                                wmsReportPrint.printWaveDelivery(ids);
                            }
                        }


                        //打印电子面单
                        $(".k-grid-printWayBill").on("click", function () {
                            var ids = getCurrentIds();
                            var grid = $scope.waveGrid;
                            var statusCodeArr = [];
                            var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                            var carrierVal;
                            $(selectData).each(function (index, item) {
                                if ('Submitted' != item.statusCode) {
                                    statusCodeArr.push(item.statusCode);
                                }
                            })
                            var codes = statusCodeArr.join(",");
                            if (ids == '') {
                                kendo.ui.ExtAlertDialog.showError("请选择要打印的数据");
                                return;
                            } else if (codes.length) {
                                kendo.ui.ExtAlertDialog.showError("单据状态为已提交才能进行打印");
                                return;
                            } else {
                                carrierVal = selectData[0].carrierNo;
                                checkExpress(carrierVal);
                            }

                        });


                        //提交
                        $scope.submitWave = function () {
                            var ids = getCurrentIds();
                            var grid = $scope.waveGrid;
                            var statusCode = [];
                            var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                            selectData.forEach(function (data) {
                                if ('Submitted' == data.statusCode) {
                                    statusCode.push(data.id);
                                }
                            })
                            var statusCodes = statusCode.join(",");
                            if (ids == '') {
                                kendo.ui.ExtAlertDialog.showError("请选择要提交的数据");
                                return;
                            } else if (statusCodes != '') {
                                kendo.ui.ExtAlertDialog.showError(statusCodes + "的波次单号已提交,请勿重复提交");
                                return;
                            } else {
                                var url = "/warehouse/out/wave/" + ids + "/submit";
                                $sync(window.BASEPATH + url, "POST")
                                    .then(function (xhr) {
                                        $scope.waveGrid.dataSource.read({});
                                    }, function (xhr) {
                                    });
                            }
                        }


                        //撤销
                        $scope.cancelWave = function () {
                            var printStatus = [];
                            var ids = getCurrentIds();
                            if (ids == '') {
                                kendo.ui.ExtAlertDialog.showError("请选择要撤消的数据");
                                return;
                            } else {
                                var grid = $scope.waveGrid;
                                var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                                var idsArr = [];
                                selectData.forEach(function (data) {
                                    if ('Submitted' != data.statusCode) {
                                        idsArr.push(data.id);
                                    }
                                    if ('1' == data.isPrintPicking || '1' == data.isPrintdelivery || '1' == data.isPrintexpress) {
                                        printStatus.push(data.id);
                                    }

                                });
                                var idss = idsArr.join(",");
                                var printStaus = printStatus.join(",");
                                if (idss.length) {
                                    kendo.ui.ExtAlertDialog.showError("波次单号为" + [idss] + "的波次单不能撤销,单据状态是已提交才能撤销");
                                    return;
                                }
                                if (printStaus.length) {
                                    kendo.ui.ExtAlertDialog.showError("波次单号为" + [printStaus] + "的波次单不能撤销,已打印不能再撤销");
                                    return;
                                }
                                var url = "/warehouse/out/wave/" + ids + "/cancel";
                                $sync(window.BASEPATH + url, "POST")
                                    .then(function (xhr) {
                                        $scope.waveGrid.dataSource.read({});
                                    }, function (xhr) {
                                    });
                            }
                        }


                        //波次单删除
                        $scope.delWave = function () {
                            var ids = getCurrentIds();
                            if (ids == '') {
                                kendo.ui.ExtAlertDialog.showError("请选择要删除的数据");
                                return;
                            } else {
                                var grid = $scope.waveGrid;
                                var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                                var idsArr = [];
                                var waveIdArr = [];
                                selectData.forEach(function (data) {
                                    idsArr.push(data.id);
                                    if ('Initial' != data.statusCode && 'Cancelled' != data.statusCode) {
                                        waveIdArr.push(data.id);
                                    }

                                });
                                var idss = idsArr.join(",");
                                var waveIds = waveIdArr.join(",");
                                if (waveIds.length) {
                                    kendo.ui.ExtAlertDialog.showError("波次单号为" + idss + "的波次单不能删除,单据状态是未提交或者撤销的才能删除");
                                    return;
                                }
                                var detailUrl = waveUrl + "/" + idss + "/shipment";
                                $sync(window.BASEPATH + detailUrl, "GET")
                                    .then(function (dataItem) {
                                        $scope.waveGrid.dataSource.read({});
                                    }, function (xhr) {
                                    });
                            }
                        }


                        //物流公司联动物流模板
//                        $("#carrierCode").on("change",function(){
//                            var expressType = $("#carrierCode").val();
//                            if(expressType=='' || expressType==undefined){
//                                $("#printTemplate").empty();
//                                $("#printTemplate").append("<option value='0'>-请选择-</option>");
//                            }else{
//                                var url ="/report/template/bytype/list/";
//                                $sync(window.BASEPATH + url, "GET",{data:{reportCategoryCode:"Express",carrier:expressType}})
//                                    .then(function (xhr) {
//                                        var data = xhr.data.list;
//                                        $("#printTemplate").empty();
//                                        $(data).each(function(index,item){
//                                            $("#printTemplate").append("<option value='"+item.value+"'>"+item.key+"</option>");
//                                        });
//                                    }, function (xhr) {
//                                    });
//                            }
//                        });


                        //打印拣货单
                        $scope.printPick = function () {
                            var grid = $scope.waveGrid;
                            var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                            var pickArrs = [];
                            var ids = [];
                            var statusCodeArr = [];
                            $(selectData).each(function (index, item) {
                                ids.push(item.id);
                                if (item.isPrintPicking == 1) {
                                    pickArrs.push(item.id);
                                }
                                if ('Submitted' != item.statusCode) {
                                    statusCodeArr.push(item.statusCode);
                                }
                            });
                            var codes = statusCodeArr.join(",");
                            if (codes.length) {
                                kendo.ui.ExtAlertDialog.showError("单据状态为已提交才能进行打印");
                                return;
                            }
                            var id = ids.join(",");
                            var pickings = pickArrs.join(",");
                            if (id == '') {
                                kendo.ui.ExtAlertDialog.showError("请选择要打印的数据");
                                return;
                            }
                            if (pickings.length) {
                                kendo.ui.ExtOkCancelDialog.show({
                                    title: "确认",
                                    message: "波次单为" + [pickings] + "的已打印拣货单,继续打印吗?",
                                    icon: 'k-ext-question' }).then(function (resp) {
                                    if (resp.button === 'OK') {
                                        wmsReportPrint.printWavePicking(ids);
                                    } else {
                                        return;
                                    }
                                });
                            } else {
                                wmsReportPrint.printWavePicking(ids);
                            }

                        }


                        //打印物流单
                        $scope.printExpress = function () {
                            var grid = $scope.waveGrid;
                            var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                            var expressArrs = [];
                            var ids = [];
                            var statusCodeArr = [];
                            var carrierVal;
                            if (selectData.length) {
                                carrierVal = selectData[0].carrierNo;
                                $(selectData).each(function (index, item) {
                                    ids.push(item.id);
                                    if ("1" == item.isPrintexpress) {
                                        expressArrs.push(item.id);
                                    }
                                    if ('Submitted' != item.statusCode) {
                                        statusCodeArr.push(item.statusCode);
                                    }

                                });
                            }
                            var id = ids.join(",");
                            var codes = statusCodeArr.join(",");
                            var express = expressArrs.join(",");
                            if (id == '') {
                                kendo.ui.ExtAlertDialog.showError("请选择要打印的数据");
                                return;
                            }
                            if (codes.length) {
                                kendo.ui.ExtAlertDialog.showError("单据状态为已提交才能进行打印");
                                return;
                            }
                            if (express.length) {
                                kendo.ui.ExtOkCancelDialog.show({
                                    title: "确认",
                                    message: "波次单为" + [express] + "的已打印物流单,继续打印吗?",
                                    icon: 'k-ext-question' }).then(function (resp) {
                                    if (resp.button === 'OK') {
                                        checkExpress(carrierVal);
                                    } else {
                                        return;
                                    }
                                });
                            } else {
                                checkExpress(carrierVal);
                            }
                        }


                        //确认物流信息,下一步到打印页面
                        $scope.carrierInfoConfirm = function (dataItem) {
                            var expressType = $("#carrierNo").val();
                            var templateId = $("#templateId").val();
                            var carrierReferNo = $("#carrierReferNo").val();
                            if (dataItem == 'true') {//点击确定按钮时需要填写起始物流单号
                                if ($("input[name='carrierReferNo']").val() == '') {
                                    kendo.ui.ExtAlertDialog.showError("请填写起始物流单号");
                                    return;
                                }
                            }
                            var ids = getCurrentIds();
                            var grid = $scope.waveGrid;
                            $scope.carrierConfirmClose();

                            //获取物流公司编号
                            var selData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                            if (selData.length == 0) {
                                kendo.ui.ExtAlertDialog.showError("承运商设置有误");
                                return;
                            }

                            var carrierNo = selData[0].carrierNo;
                            $sync(window.BASEPATH + "/carrier/carrierNo/" + carrierNo, "GET")
                                .then(function (result) {
                                    if (result.suc && result.result != null && result.result.isCloudStack == 1) {
                                        //carrierNo编号,YTO,YTO2
                                        //carrierCode编码,YTO
                                        wmsReportPrint.printWaveExpress_CaiNiao(result.result.carrierCode, templateId, grid, ids, dataItem, carrierReferNo);
                                    } else {
                                        wmsReportPrint.printWaveExpress(expressType, templateId, grid, ids, dataItem, carrierReferNo);
                                    }
                                }
                            )

                        };


                        //确认面单信息,下一步到打印页面
                        $scope.wayBillInfoConfirm = function () {
                            var expressType = $("#reportCategoryCode").val();
                            var templateId = $("#wayBillTemplateId").val();
                            var ids = getCurrentIds();
                            var grid = $scope.waveGrid;
                            $scope.wayBillConfirmClose();
                            wmsReportPrint.printWaveWayBill(expressType, templateId, grid, ids);
                        };

                    }


                    //关闭弹出层
                    $scope.wayBillConfirmClose = function () {
                        $scope.wayBillConfirmPopup.close();
                    };

                    $scope.carrierConfirmClose = function () {
                        $scope.carrierConfirmPopup.close();
                    };

                    $scope.shipmentConfirmClose = function () {
                        $scope.shipmentPopup.close();
                    };

                });

            }]);
})