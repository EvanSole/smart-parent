define(['scripts/controller/controller'], function (controller) {
    "use strict";
    controller.controller('warehouseOutShipmentController',
        ['$scope', '$rootScope', 'sync', 'wmsDataSource', 'wmsLog', '$filter', 'wmsReportPrint', 'url',
            function ($scope, $rootScope, $sync, wmsDataSource, wmsLog, $filter, wmsReportPrint, $url) {

                $scope.order = {};
                $scope.invoice = {};
                $scope.selectData = [];

                $scope.clearLocationInfo = function () {
                    var currentDataItem = this.dataItem;
                    WMS.UTILS.setValueInModel(currentDataItem, "locationId", "");
                    WMS.UTILS.setValueInModel(currentDataItem, "zoneId", "");
                };
                $scope.validateLocationValue = function (e) {
                    var evt = e || event;
                    var dataItem = this.dataItem,
                        targetEl = $(evt.target);
                    if (targetEl.val() === "") {
                        $scope.clearLocationInfo.apply(this);
                        return;
                    }
                    var locationNo = targetEl.val();
                    var locationUrl = $url.dataLocationUrl + "/locationInfo?locationNo=" + locationNo;
                    $sync(locationUrl, "GET", {wait: false}).then(function (resp) {
                        var result = resp.result;
                        if (result === null) {
                            WMS.UTILS.setValueInModel(dataItem, "locationId", "");
                            WMS.UTILS.setValueInModel(dataItem, "zoneId", "");
                            targetEl.val("");
                            kendo.ui.ExtAlertDialog.showError("请输入正确的货位!");
                            return;
                        } else {
                            WMS.UTILS.setValueInModel(dataItem, "locationId", result.id);
                            WMS.UTILS.setValueInModel(dataItem, "zoneId", result.zoneId);
                        }
                    });
                };

                //新增按钮
                var commonOptButton = $.extend(true, {}, WMS.GRIDUTILS.CommonOptionButton());
                commonOptButton.command.push({ name: " updateLogistics", width: "200px", className: "btn-auth-logistics",
                    template: "<a class='k-button k-button-custom-command'  name='updateExpre' href='\\#' ng-click='updateLogistics(this);' >更新物流信息</a>"});

                var shipmentUrl = "/shipment",
                    shipmentBasicUrl = "/shipment/basic",
                    waveUrl = "/warehouse/out/wave",

                    headerColumns = [
                        commonOptButton,
                        { filterable: false, title: '数据来源', field: 'datasourceCode', align: 'left', width: "120px;", template: WMS.UTILS.codeFormat('datasourceCode', 'DataSource')},
                        { filterable: false, title: '订单来源', field: 'fromtypeCode', align: 'left', width: "100px", template: WMS.UTILS.codeFormat('fromtypeCode', 'ShipmentFrom')},
                        { filterable: false, title: '出库单号', field: 'id', align: 'left', width: "120px;"},
                        { filterable: false, title: '通知单号', field: 'dnId', align: 'left', width: "120px;"},
                        { filterable: false, title: '参考单号', field: 'referNo', align: 'left', width: "120px;"},
                        { filterable: false, title: 'ERP单号', field: 'fromErpNo', align: 'left', width: "120px;"},
                        { filterable: false, title: 'OMS单号', field: 'fromOmsNo', align: 'left', width: "120px;"},
                        { filterable: false, title: '交易单号', field: 'tradeNos', align: 'left', width: "120px;"},
                        { filterable: false, title: '单据状态', field: 'statusCode', template: WMS.UTILS.codeFormat("statusCode", "TicketStatus"), align: 'left', width: "120px"},
                        { filterable: false, title: '仓库名称', field: 'warehouseId', align: 'left', width: "120px;", template: WMS.UTILS.whFormat},
                        { filterable: false, title: '商家名称', field: 'storerId', align: 'left', width: "120px;", template: WMS.UTILS.storerFormat},
                        { filterable: false, title: '波次单号', field: 'waveId', align: 'left', width: "120px;"},
                        { filterable: false, title: '波次序号', field: 'waveSeq', align: 'left', width: "120px;"},
                        { filterable: false, title: '拣货货区', field: 'defaultZoneNo', align: 'left', width: "120px;", template: function (dataItem) {
                            return WMS.UTILS.tooLongContentFormat(dataItem, 'defaultZoneNo');
                        }},
                        { filterable: false, title: '拣货货位', field: 'defaultLocationNo', align: 'left', width: "120px;", template: function (dataItem) {
                            return WMS.UTILS.tooLongContentFormat(dataItem, 'defaultLocationNo');
                        }},
//            { filterable: false, title: '活动名称', field: 'promotionId', align: 'left', width: "120px;"},
                        { filterable: false, title: '店铺名称', field: 'shopName', align: 'left', width: "120px"},
//            { filterable: false, title: '分销商', field: 'distributorName', align: 'left', width: "120px"},
                        { filterable: false, title: '会员', field: 'buyerName', align: 'left', width: "120px"},
                        { filterable: false, title: '收货人', field: 'receiverName', align: 'left', width: "120px"},
                        { filterable: false, title: '总数量', field: 'totalQty', align: 'left', width: "120px"},
                        { filterable: false, title: 'SKU品种数', field: 'totalCategoryQty', align: 'left', width: "120px"},
                        { filterable: false, title: '申请退款', field: 'isRefunded', template: WMS.UTILS.checkboxDisabledTmp("isRefunded"), align: 'left', width: "120px"},
                        { filterable: false, title: 'OMS取消', field: 'isCancelled', template: WMS.UTILS.checkboxDisabledTmp("isCancelled"), align: 'left', width: "120px"},
                        { filterable: false, title: 'WMS拒单', field: 'isClosed', template: WMS.UTILS.checkboxDisabledTmp("isClosed"), align: 'left', width: "120px"},
                        { filterable: false, title: '分配状态', field: 'allocateStatuscode', template: WMS.UTILS.codeFormat("allocateStatuscode", "OrderOperationStatus"), align: 'left', width: "120px"},
                        { filterable: false, title: '拣货状态', field: 'pickStatuscode', template: WMS.UTILS.codeFormat("pickStatuscode", "OrderOperationStatus"), align: 'left', width: "120px"},
                        { filterable: false, title: '复核状态', field: 'checkStatuscode', template: WMS.UTILS.codeFormat("checkStatuscode", "OrderOperationStatus"), align: 'left', width: "120px"},
                        { filterable: false, title: '打包状态', field: 'packageStatuscode', template: WMS.UTILS.codeFormat("packageStatuscode", "OrderOperationStatus"), align: 'left', width: "120px"},
                        { filterable: false, title: '称重状态', field: 'weightStatuscode', template: WMS.UTILS.codeFormat("weightStatuscode", "OrderOperationStatus"), align: 'left', width: "120px"},
                        { filterable: false, title: '发货状态', field: 'deliveryStatuscode', template: WMS.UTILS.codeFormat("deliveryStatuscode", "OrderOperationStatus"), align: 'left', width: "120px"},
                        { filterable: false, title: '交接状态', field: 'handoverStatuscode', template: WMS.UTILS.codeFormat("handoverStatuscode", "OrderOperationStatus"), align: 'left', width: "120px"},
                        { filterable: false, title: '物流单打印', field: 'isPrintexpress', template: WMS.UTILS.checkboxDisabledTmp("isPrintexpress"), align: 'left', width: "120px" },
                        { filterable: false, title: '发货单打印', field: 'isPrintdelivery', template: WMS.UTILS.checkboxDisabledTmp("isPrintdelivery"), align: 'left', width: "120px" },
                        { filterable: false, title: '是否开发票', field: 'isNeedInvoice', template: WMS.UTILS.checkboxDisabledTmp("isNeedInvoice"), align: 'left', width: "120px"},
//            { filterable: false, title: '发票抬头', field: 'invoiceTitle', align: 'left', width: "120px"},
//            { filterable: false, title: '发票号', field: 'invoiceNo', align: 'left', width: "120px"},
                        { filterable: false, title: '优先发货', field: 'isUrgent', template: WMS.UTILS.checkboxDisabledTmp("isUrgent"), align: 'left', width: "120px"},
                        { filterable: false, title: '是否货到付款', field: 'isCod', template: WMS.UTILS.checkboxDisabledTmp("isCod"), align: 'left', width: "120px"},
                        { filterable: false, title: '订单日期', field: 'orderTime', template: WMS.UTILS.timestampFormat("orderTime", "yyyy-MM-dd HH:mm:ss"), align: 'left', width: "150px"},
                        { filterable: false, title: '实际发货时间', field: 'deliveryTime', template: WMS.UTILS.timestampFormat("deliveryTime", "yyyy-MM-dd HH:mm:ss"), align: 'left', width: "150px"},
                        { filterable: false, title: '支付时间', field: 'paymentTime', template: WMS.UTILS.timestampFormat("paymentTime", "yyyy-MM-dd HH:mm:ss"), align: 'left', width: "150px"},
//            { filterable: false, title: '格口', field: 'logisticAreaName', align: 'left', width: "120px"},
                        { filterable: false, title: '总净重', field: 'totalNetweight', align: 'left', width: "120px"},
                        { filterable: false, title: '总毛重', field: 'totalGrossweight', align: 'left', width: "120px"},
                        { filterable: false, title: '总数量', field: 'totalQty', align: 'left', width: "120px"},
                        { filterable: false, title: '称重重量', field: 'totalWeight', align: 'left', width: "120px"},
                        { filterable: false, title: 'SKU品种数', field: 'totalCategoryQty', align: 'left', width: "120px"},
                        { filterable: false, title: '应付金额', field: 'actualPayment', align: 'left', width: "120px"},
                        { filterable: false, title: '发票金额', field: 'invoiceTotal', align: 'left', width: "120px"},
                        { filterable: false, title: '收货地址', field: 'address', align: 'left', width: "120px", template: function (dataItem) {
                            return WMS.UTILS.tooLongContentFormat(dataItem, 'address');
                        }},
                        { filterable: false, title: '上传电子面单', field: 'isEwaybillFinished', template: WMS.UTILS.checkboxDisabledTmp("isEwaybillFinished"), align: 'left', width: "120px"},
                        { filterable: false, title: '物流单号', field: 'carrierReferNo', align: 'left', width: "120px"},
                        { filterable: false, title: '物流公司', field: 'carrierNo', template: WMS.UTILS.carrierFormat, align: 'left', width: "120px"},
                        { filterable: false, title: '拣货人', field: 'fpicker', align: 'left', width: "120px"},
                        { filterable: false, title: '备注', field: 'memo', align: 'left', width: "120px",
                            template: function (dataItem) {
                                return WMS.UTILS.tooLongContentFormat(dataItem, 'memo');
                            }
                        }

                    ],

                    headerDataSource = wmsDataSource({
                        url: shipmentUrl,
                        callback: {
                            update: function (response, editData) {
                                headerDataSource.read();
                            },
                            create: function (response, editData) {
                                headerDataSource.read();
                            },
                            destroy: function (response, editData) {
                                headerDataSource.read();
                            }
                        },

                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "number", editable: false, nullable: true },
                                    storerId: { type: "number" },
                                    isNeedInvoice: {type: "boolean", editable: true, nullable: true },
                                    isUrgent: {type: "boolean", editable: true, nullable: true },
                                    isCod: {type: "boolean", editable: true, nullable: true },
                                    isCancelled: {type: "boolean", editable: true, nullable: true },
                                    isClosed: {type: "boolean", editable: true, nullable: true },
                                    isRefunded: {type: "boolean", editable: true, nullable: true },
                                    isPrintsku: {type: "boolean", editable: true, nullable: true },
                                    isPrintexpress: {type: "boolean", editable: true, nullable: true },
                                    isPrintdelivery: {type: "boolean", editable: true, nullable: true },
                                    invoiceTypeCode: {type: "string", editable: true, nullable: true },
                                    isEwaybillFinished: {type: "string", editable: true, nullable: true },
                                    company: {type: "string", editable: true, nullable: true },
                                    fromtypeCode: {type: "string"},
                                    transportModeCode: {type: "string"},
                                    order: {type: ""},
                                    shopNo: {type: "string", defaultValue: ""}
                                }
                            },
                            total: function (total) {
                                return total.length > 0 ? total[0].total : 0;
                            }
                        },
                        otherData: {"order": $scope.order, "invoice": $scope.invoice}
                    });


                headerColumns = headerColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                headerColumns.splice(0, 0, WMS.UTILS.CommonColumns.checkboxColumn);
                $scope.shipmentGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: headerDataSource,
                    toolbar: [
                        { name: "create", text: "新增", className: "btn-auth-add"},
                        { name: "submit", text: "提交", className: "btn-auth-submit"},
                        { name: "batchDelete", text: "批量删除", className: "btn-auth-batchDelete"},
                        { name: "cacel", text: "撤消", className: "btn-auth-cancel"},
                        { name: "exceptionCallback", text: "异常反馈", className: "btn-auth-close"},
                        { text: "打印物流单", name: "printExpress", className: "btn-auth-express"},
                        { text: "打印发货单", name: "printDelivery", className: "btn-auth-printDelivery"},
                        { text: "获取物流单号", name: "fillCarrierReferNo", className: "btn-auth-batchfill"}
                    ],
                    columns: headerColumns,
                    editable: {
                        mode: "popup",
                        window: {
                            width: "630px"
                        },
                        template: kendo.template($("#shipment-editor").html())
                    },
                    moudleName: '出库单',
                    widgetId: "header",
                    edit: function (e) {
                        if (!(e.model.order && e.model.order.orderTime)) {
                            var value = $filter('date')(new Date(), 'yyyy/MM/dd 00:00:00');
                            $scope.order.orderTime = value;
                            $scope.order.paymentTime = value;
                            $("[name='order.orderTime']").val(value);
                            $("[name='order.paymentTime']").val(value);
                        }
                    },
                    dataBound: function (e) {
                        var grid = this,
                            trs = grid.tbody.find(">tr");
                        _.each(trs, function (tr, i) {
                            var record = grid.dataItem(tr);
                            if (record.statusCode !== "Initial" || record.isClosed == 1 || record.isCancelled == 1) {
                                $(tr).find(".k-button").not("[name=updateExpre]").remove();
                            }
                            //modify 已确认,已交接不能更新物流信息
                            if (record.statusCode === "Confirmed" || record.deliveryStatuscode === "Doing" || record.deliveryStatuscode === "Finished") {
                                $(tr).find("[name=updateExpre]").remove();
                            }

                        });
                    },
                    customChange: function (grid) {
                        $(".k-grid-submit").hide();
                        $(".k-grid-batchDelete").hide();
                        $(".k-grid-fillCarrierReferNo").hide();
                        $(".k-grid-printExpress").hide();
                        $(".k-grid-printDelivery").hide();
                        var selected = WMS.GRIDUTILS.getCustomSelectedData($scope.shipmentGrid);
                        if (selected.length > 0) {
                            var sub = 0, del = 0, fill = 0, printAvailable = 0, size = selected.length;
                            $.each(selected, function () {
                                if (this.statusCode === 'Initial') {
                                    sub++;
                                    del++;
                                }
                                fill++;
                                if (this.isCancelled == 1 || this.isClosed == 1) {
                                    sub--;
                                    fill--;
                                    del--;
                                }
                                if (this.datasourceCode == 'System') {
                                    del--;
                                }
                                if (this.statusCode === "Initial" || this.statusCode === "Confirmed" || this.deliveryStatuscode === "Doing" || this.deliveryStatuscode === "Finished") {
                                    fill--;
                                }
                                if ((this.waveId != null) && (this.waveSeq != null || this.waveSeq != '')) {
                                    printAvailable++;
                                }
                            });
                            if (printAvailable === size) {
                                $(".k-grid-printExpress").show();
                                $(".k-grid-printDelivery").show();
                            }
                            if (sub === size) {
                                $(".k-grid-submit").show();
                            }
                            if (del === size) {
                                $(".k-grid-batchDelete").show();
                            }
                            if (fill === size) {
                                $(".k-grid-fillCarrierReferNo").show();
                            }

                        } else {
                            $(".k-grid-submit").show();
                            $(".k-grid-batchDelete").show();
                            $(".k-grid-fillCarrierReferNo").show();
                            $(".k-grid-printExpress").show();
                            $(".k-grid-printDelivery").show();
                        }
                    }
                }, $scope);

                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;
                //基本信息
                $scope.shipmentBaseOptions = function (dataItem) {
                    $sync(shipmentBasicUrl + "/" + dataItem.id,
                        "GET").then(function (xhr) {
                            dataItem.basicInfo = xhr.result;
                        });
                };


                //出库单详细
                var detailColumns = [
                    WMS.GRIDUTILS.CommonOptionButton("detail"),
                    //{ field: "detaiLlineNo", title: "出库单行号", width: "120px" },
                    { field: "referLineNo", title: "参考行号", width: "120px" },
                    { field: "zoneTypeCode", title: "货区类型", template: WMS.UTILS.zoneTypeFormat, width: "120px"},
                    { field: 'zoneId', title: '货区', template: WMS.UTILS.zoneNoFormat, width: '120px'},
                    { field: "skuSku", title: "SKU编码", width: "120px" },
                    { field: "skuItemName", title: "商品名称", width: "120px" },
                    { field: "skuBarcode", title: "商品条码", width: "160px" },
                    { field: "skuColorCode", title: "商品颜色", template: WMS.UTILS.codeFormat("skuColorCode", "SKUColor"), width: "120px" },
                    { field: "skuSizeCode", title: "商品尺寸", template: WMS.UTILS.codeFormat("skuSizeCode", "SKUSize"), width: "120px" },
                    { field: "skuModel", title: "型号", width: "120px" },
                    { field: "skuProductNo", title: "商品货号", width: "120px" },
                    { field: "orderedQty", title: "期望数量", width: "120px" },
                    { field: "allocatedQty", title: "分配数量", width: "120px" },
                    { field: "pickedQty", title: "拣货数量", width: "120px" },
                    { field: "shippedQty", title: "出库数量", width: "120px" },
                    { field: "inventoryStatusCode", title: "库存状态", template: WMS.UTILS.codeFormat("inventoryStatusCode", "InventoryStatus"), width: "120px" },
                    { field: "amount", title: "实际单价", width: "120px" },
                    { field: "dnDetailId", title: "来源单号", width: "120px" },
                    { field: "grossweight", title: "毛重", width: "120px" },
                    { field: "netweight", title: "净重", width: "120px" },
                    { field: "cube", title: "体积", width: "120px" },
                    { field: "lotkey", title: "批次号", width: "120px" }
                ];

                $scope.shipmentDetailOptions = function (dataItem) {
                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource: wmsDataSource({
                            url: shipmentUrl + "/" + dataItem.id + "/detail",
                            callback: {
                                update: function (response, editData) {
                                    headerDataSource.read();
                                },
                                create: function (response, editData) {
                                    headerDataSource.read();
                                },
                                destroy: function (response, editData) {
                                    headerDataSource.read();
                                }
                            },
                            schema: {
                                model: {
                                    id: "id",
                                    fields: {
                                        id: {type: "number", editable: false, nullable: true },
                                        zoneId: {type: "string"},
                                        locationId: {type: "string"},
                                        locationNo: {type: "string"},
                                        inventoryStatusCode: {type: "string", defaultValue: "Good"}
                                    }
                                },
                                total: function (total) {
                                    return total.length > 0 ? total[0].total : 0;
                                }
                            },
                            otherData: {"shipmentId": dataItem.id}
                        }),
                        toolbar: [
                            { name: "create", text: "新增", className: "btn-auth-add-detail"}
                        ],
                        editable: {
                            mode: "popup",
                            window: {
                                width: "640px"
                            },
                            template: kendo.template($("#shipmentDetail-editor").html())
                        },
                        moudleName: '出库单详细',
                        columns: detailColumns,
                        widgetId: "detail",
                        edit: function (e) {
                            $scope.$$childTail.zoneId = e.model.zoneId;
                            $scope.$$childTail.locationId = e.model.locationId;
                        },
                        dataBound: function (e) {
                            var grid = this,
                                trs = grid.tbody.find(">tr");
                            if (dataItem.statusCode !== "Initial") {
                                grid.element.find(".k-grid-add").remove();
                                _.each(trs, function (tr, i) {
                                    $(tr).find(".k-button").remove();
                                });
                            }

                        },
                        save: function (e) {
                            var skuIdVal = $("#skuId").val();
                            var skuSkuVal = $("#skuSku").val();
                            if (skuIdVal === "" || skuSkuVal === "") {
                                kendo.ui.ExtAlertDialog.showError("请至少选择一个SKU商品信息!");
                                e.preventDefault();
                            }
                        }
                    }, $scope);
                };

                //分配结果列
                var allocateColumns = [
                    { title: '波次单号', field: 'waveId', align: 'left', width: "120px"},
                    { title: '出库单号', field: 'shipmentId', align: 'left', width: "120px"},
                    { title: '仓库名称', field: 'warehouseId', align: 'left', width: "120px;", template: WMS.UTILS.whFormat},
                    { title: '货位', field: 'locationNo', align: 'left', width: "120px"},
                    { title: '托盘号', field: 'palletNo', align: 'left', width: "120px"},
                    { title: '箱号', field: 'cartonNo', align: 'left', width: "120px"},
                    { title: '商品', field: 'skuItemName', align: 'left', width: "120px"},
                    { title: '分配数量', field: 'allocatedQty', align: 'left', width: "120px"},
                    { title: '拣货数量', field: 'pickedQty', align: 'left', width: "120px"},
                    { title: '创建人', field: 'createUser', align: 'left', width: "120px"},
                    { title: '创建时间', field: 'createTime', align: 'left', width: "120px", template: WMS.UTILS.timestampFormat("createTime")}
                ];


                //分配结果
                $scope.allocateOptios = function (dataItem) {
                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource: wmsDataSource({
                            url: waveUrl + "/" + dataItem.id + "/1/allocateResult",
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
                                width: "640px"
                            },
                            template: kendo.template($("#allocateDetail-editor").html())
                        },
                        columns: allocateColumns
                    }, $scope);
                }


                //操作日志
                $scope.logOptions = wmsLog.operationLog;

                //异常反馈
                $scope.refusedOrderConfirm = function () {
                    var ids = getCurrentIds();
                    var grid = $scope.shipmentGrid;
                    var statusCodeArr = [];
                    var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                    $(selectData).each(function (i, item) {
                        if ('Submitted' != item.statusCode) {
                            statusCodeArr.push(item.statusCode);
                        }
                    });
                    var statusCodes = statusCodeArr.join(",");
                    if (statusCodes) {
                        kendo.ui.ExtAlertDialog.showError("单据状态为已提交才能异常反馈");
                        $scope.shipmentGrid.dataSource.read({});
                        $scope.refusedOrderPopup.close();
                        return;
                    }

                    var url = shipmentUrl + "/close/" + ids;
                    $sync(window.BASEPATH + url, "PUT", {data: {"memo": $scope.shipmentModel.memo}})
                        .then(function (xhr) {
                            $scope.shipmentGrid.dataSource.read({});
                            $scope.refusedOrderPopup.close();
                        }, function (xhr) {
                            $scope.shipmentGrid.dataSource.read({});
                            $scope.refusedOrderPopup.close();
                        });
                };
                //关闭弹出层
                $scope.refusedOrderClose = function () {
                    $scope.refusedOrderPopup.close();
                };


                $scope.windowOpen = function (parentGrid) {
                    var parentId = parentGrid.$parent.dataItem.storerId;
                    $scope.skuPopup.initParam = function (subScope) {
                        subScope.param = parentId;
                    };
                    $scope.skuPopup.refresh().open().center();
                    $scope.skuPopup.setReturnData = function (returnData) {
                        if (_.isEmpty(returnData)) {
                            return;
                        }
                        $("#skuSku").val(returnData.sku);
                        $scope.editModel.set("skuSku", returnData.sku);
                        $scope.editModel.set("grossweight", returnData.grossweight);
                        $scope.editModel.set("netweight", returnData.netweight);
                        $scope.editModel.set("skuId", returnData.id);
                        $scope.editModel.set("cube", returnData.cube);
                        $scope.editModel.set("orderedQty", 1);
                    };
                };

                $scope.windowLocationOpen = function (parentGrid) {
                    $scope.locationPopup.refresh().open().center();
                    $scope.locationPopup.setReturnData = function (returnData) {
                        if (returnData) {
                            $("#locationNo").val(returnData.locationNo);
                            $scope.editModel.set("zoneId", returnData.zoneId);
                            $scope.editModel.set("zoneNo", returnData.zoneNo);
                            $scope.editModel.set("locationId", returnData.id);
                            $scope.$$childTail.zoneId = returnData.zoneId;
                            $scope.$$childTail.locationId = returnData.id;
                        } else {
                            $("#locationNo").val("");
                            $scope.editModel.set("zoneId", "");
                            $scope.editModel.set("zoneNo", "");
                            $scope.editModel.set("locationId", "");
                            $scope.$$childTail.zoneId = "";
                            $scope.$$childTail.locationId = "";
                        }
                    };
                };


                //弹出物流/电子面单信息确认框
                function checkExpress(carrierVal, ids, isNoCarriaNo) {
                    var url = "/report/reportTemplate/" + carrierVal;
                    $sync(window.BASEPATH + url, "GET")
                        .then(function (xhr) {
                            var data = xhr.result;
                            if (data.carrierEntity && data.carrierEntity.printTemplate!=null && data.carrierEntity.printTemplate!="") {
                                $("#reportCategoryCode").val(data.carrierEntity.carrierCode);
                                if ('1' == data.carrierEntity.isElec) {
                                    if (isNoCarriaNo) {
//                    $scope.wayBillConfirmClose();
                                        wmsReportPrint.printShipmentExpress(data.carrierEntity.carrierCode, data.carrierEntity.printTemplate, ids, "false", '');
                                    } else {
                                        kendo.ui.ExtAlertDialog.showError("电子面单没有物流单号不能打印");
                                        return;
                                    }
                                } else {
                                    $("#templateId").val(data.carrierEntity.printTemplate);
                                    $("#carrierCode").text(data.carrierEntity.shortName);//物流公司
                                    $("#carrierCodeHidden").val(data.carrierEntity.carrierCode);
                                    $("#printTemplate").text("物流单打印");//模板名称
                                    $scope.carrierConfirmPopup.refresh().open().center();
                                }

                            }
                        }, function (xhr) {
                        });

                }


                //获取当前选中的ID
                function getCurrentIds() {
                    var grid = $scope.shipmentGrid;
                    var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                    var ids = [];
                    selectData.forEach(function (data) {
                        ids.push(data.id);
                    });
                    var id = ids.join(",");
                    return id;
                }

                //判断多个商家是否能生成波次
                //                function isGenerateWave(){
//                    var grid = $scope.shipmentGrid;
//                    var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
//                    var storeIds = 0;
//                    var flag = true;
//                    selectData.forEach(function(data){
//                        if(0===storeIds){
//                            storeIds = data.storerId;
//                        }
//                        if(storeIds !== data.storerId){
////                            console.log(data.storerId+"----");
//                            kendo.ui.ExtAlertDialog.showError("不同商家下的出库单不能生成到同一波次下");
//                            $scope.shipmentGrid.dataSource.read({});
//                            flag = false;
//                        }
//                    });
//                    return flag;
//                }
                //是否是同一承运商,否则不能一起进行打印
                function isSameCarrier(carrierArry) {
                    if (carrierArry.length == 1) {
                        return true;
                    }
                    var carrier = carrierArry[0];
                    for (var i = 0; i < carrierArry.length; i++) {
                        if (carrierArry[i] != carrier) {
                            return false;
                        }
                    }
                    return true;
                }

                $scope.$on("kendoWidgetCreated", function (event, widget) {

                    if (widget.options !== undefined && widget.options.widgetId === 'detail') {
                        widget.bind("edit", function (e) {
                            $scope.editModel = e.model;
                        });
                    }
                    if (widget.options !== undefined && widget.options.widgetId === 'header') {
                        widget.bind("edit", function (e) {
                            if (e.model.storerId != 0) {//修改不能修改商家 added by zw 6.19
                            }
                            if (!e.model.order) {
                                e.model.order = {shopNo: "", isCod: ""};
                            }
                            if (!e.model.invoice) {
                                e.model.invoice = {invoiceTypeCode: ""};
                            }
                        });


                        $(".k-grid-submit").on('click', function (event, widget) {
                            var grid = $scope.shipmentGrid;
                            var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                            var ids = [];
                            var error = '';
                            selectData.forEach(function (data) {
                                if (data.statusCode !== null && data.statusCode !== 'Initial') {
                                    error = data.id + ",出库单状态不是未提交状态！";
                                    return;
                                }
                                if (data.isCancelled == 1 || data.isClosed == 1) {
                                    error = data.id + ",出库单已取消，不能提交！";
                                    return;
                                }
                                ids.push(data.id);
                            });
                            if (error !== "") {
                                kendo.ui.ExtAlertDialog.showError(error);
                                return;
                            }
                            if (ids.length === 0) {
                                kendo.ui.ExtAlertDialog.showError("请选择出库单");
                                return;
                            }
                            var url = shipmentUrl + "/submit/" + ids;
                            $sync(window.BASEPATH + url, "PUT")
                                .then(function (xhr) {
                                    $scope.shipmentGrid.dataSource.read({});

                                }, function (xhr) {
                                    $scope.shipmentGrid.dataSource.read({});
                                });
//
                        });


                        //打印物流单/电子面单
                        $(".k-grid-printExpress").on("click", function () {
                            var grid = $scope.shipmentGrid;
                            var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                            var expressArrs = [];
                            var ids = [];
                            var statusCodeArr = [];
                            var carrierArry = [];
                            var carrierVal;
                            var isNoCarriaNo = true;
                            if (selectData.length) {
                                carrierVal = selectData[0].carrierNo;
                                if (carrierVal == null) {
                                    kendo.ui.ExtAlertDialog.showError("没有承运商不能打印");
                                    return;
                                }
                                $(selectData).each(function (index, item) {
                                    ids.push(item.id);
                                    carrierArry.push(this.carrierNo);
                                    if (this.carrierReferNo == null || this.carrierReferNo == '') {
                                        isNoCarriaNo = false;
                                    }
                                    if (item.isPrintexpress == 1) {
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
                            //不同承运商不能打印
                            if (!isSameCarrier(carrierArry)) {
                                kendo.ui.ExtAlertDialog.showError("不同承运商不能一起打印");
                                return;
                            }

                            if (express.length) {
                                kendo.ui.ExtOkCancelDialog.show({
                                    title: "确认",
                                    message: "出库单为" + [express] + "的已打印物流单,继续打印吗?",
                                    icon: 'k-ext-question' }).then(function (resp) {
                                    if (resp.button === 'OK') {
                                        checkExpress(carrierVal, id, isNoCarriaNo);
                                    } else {
                                        return;
                                    }
                                });
                            } else {
                                checkExpress(carrierVal, id, isNoCarriaNo);
                            }


                        });

                        //打印发货单
                        $(".k-grid-printDelivery").on("click", function () {
                            var grid = $scope.shipmentGrid;
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
                                    message: "出库单为" + [delivers] + "的已打印发货单,继续打印吗?",
                                    icon: 'k-ext-question' }).then(function (resp) {
                                    if (resp.button === 'OK') {
                                        wmsReportPrint.printShipmentDelivery(ids);
                                    } else {
                                        return;
                                    }
                                });
                            } else {
                                wmsReportPrint.printShipmentDelivery(ids);
                            }

                        });


                        $(".k-grid-cacel").on('click', function (event, widget) {
                            var grid = $scope.shipmentGrid;
                            var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                            var ids = [];
                            var error = '';
                            selectData.forEach(function (data) {
                                if (data.statusCode == 'Initial') {
                                    error = data.id + ",出库单未提交不能撤消！";
                                    return;
                                }
                                if (data.checkStatuscode !== 'None' && data.checkStatuscode !== '') {
                                    error = data.id + ",出库单已复核不能撤消！";
                                    return;
                                }
                                if (data.packageStatuscode !== 'None' && data.packageStatuscode !== '') {
                                    error = data.id + ",出库单已打包不能撤消！";
                                    return;
                                }
                                if (data.weightStatuscode !== 'None' && data.weightStatuscode !== '') {
                                    error = data.id + ",出库单已称重不能撤消！";
                                    return;
                                }
                                if (data.handoverStatuscode !== 'None' && data.handoverStatuscode !== '') {
                                    error = data.id + ",出库单已交接不能撤消！";
                                    return;
                                }
                                if (data.deliveryStatuscode !== 'None' && data.deliveryStatuscode !== '') {
                                    error = data.id + ",出库单已发货不能撤消！";
                                    return;
                                }
                                if (data.waveId !== null && data.waveId > 0) {
                                    error = data.id + ",出库单已生成波次单不能撤消！";
                                    return;
                                }
                                if (data.isPrintdelivery == 1 ||
                                    data.isPrintexpress == 1 ||
                                    data.isPrintinvoice == 1 ||
                                    data.isPrintPicking == 1) {
                                    error = data.id + ",出库单已打印，不能撤消！";
                                    return;
                                }
                                ids.push(data.id);
                            });
                            if (error !== "") {
                                kendo.ui.ExtAlertDialog.showError(error);
                                return;
                            }
                            if (ids.length === 0) {
                                kendo.ui.ExtAlertDialog.showError("请选择出库单");
                                return;
                            }
                            var id = ids.join(",");
                            var url = shipmentUrl + "/cancel/" + id;
                            $sync(window.BASEPATH + url, "PUT")
                                .then(function (xhr) {
                                    $scope.shipmentGrid.dataSource.read({});

                                }, function (xhr) {
                                    $scope.shipmentGrid.dataSource.read({});
                                });
//
                        });
                        //生成波次
//                        $(".k-grid-generateWave").on("click", function () {
//                            var ids = getCurrentIds();
//                            if (ids == '') {
//                                kendo.ui.ExtAlertDialog.showError("请选择出库单");
//                                return;
//                            }
//                           if(!isGenerateWave()){
//                               return;
//                           }
//
//                            var url = shipmentUrl + "/shipment/wave/" + ids;
//                            $sync(window.BASEPATH + url, "POST")
//                                .then(function (xhr) {
//                                    $scope.shipmentGrid.dataSource.read({});
//                                }, function (xhr) {
//                                    $scope.shipmentGrid.dataSource.read({});
//                                });
//                        });

                        $(".k-grid-exceptionCallback").on("click", function () {
                            var grid = $scope.shipmentGrid;
                            var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                            var ids = [];
                            var error = '';
                            selectData.forEach(function (data) {
                                if (data.checkStatuscode !== 'None' && data.checkStatuscode !== '') {
                                    error = data.id + ",出库单已复核不能做此操作！";
                                    return;
                                }
                                if (data.packageStatuscode !== 'None' && data.packageStatuscode !== '') {
                                    error = data.id + ",出库单已打包不能做此操作！";
                                    return;
                                }
                                if (data.weightStatuscode !== 'None' && data.weightStatuscode !== '') {
                                    error = data.id + ",出库单已称重不能做此操作！";
                                    return;
                                }
                                if (data.handoverStatuscode !== 'None' && data.handoverStatuscode !== '') {
                                    error = data.id + ",出库单已交接不能做此操作！";
                                    return;
                                }
                                if (data.deliveryStatuscode !== 'None' && data.deliveryStatuscode !== '') {
                                    error = data.id + ",出库单已发货不能做此操作！";
                                    return;
                                }
                                if (data.isClosed == 1) {
                                    error = data.id + ",出库单已经是异常反馈状态！";
                                    return;
                                }
                                ids.push(data.id);
                            });
                            if (error !== '') {
                                kendo.ui.ExtAlertDialog.showError(error);
                                return;
                            }
                            if (ids.length === 0) {
                                kendo.ui.ExtAlertDialog.showError("请选择出库单");
                                return;
                            }
                            $scope.refusedOrderPopup.refresh().open().center();
                            $scope.shipmentModel = {};

                        });


                        //确认物流信息,下一步到打印页面
                        $scope.carrierInfoConfirm = function (dataItem) {
                            var expressType = $("#carrierCodeHidden").val();
                            var templateId = $("#templateId").val();
                            var carrierReferNo = $("#carrierReferNo").val();
                            if (dataItem == 'true') {//点击确定按钮时需要填写起始物流单号
                                if ($("input[name='carrierReferNo']").val() == '') {
                                    kendo.ui.ExtAlertDialog.showError("请填写起始物流单号");
                                    return;
                                }
                            }
                            var ids = getCurrentIds();
                            $scope.shipmentConfirmClose();
                            wmsReportPrint.printShipmentExpress(expressType, templateId, ids, dataItem, carrierReferNo);
                        };

//                        //确认面单信息,下一步到打印页面
//                        $scope.wayBillInfoConfirm = function(){
//                            var expressType = $("#reportCategoryCode").val();
//                            var templateId =  $("#wayBillTemplateId").val();
//                            var ids = getCurrentIds();
//                            var grid = $scope.shipmentGrid;
//                            wmsReportPrint.printExpressShipment(expressType,null,templateId,ids,null);
//                        };


//                //关闭弹出层
//                  $scope.wayBillConfirmClose = function(){
//                      $scope.wayBillConfirmPopup.close();
//                  };

                        $scope.shipmentConfirmClose = function () {
                            $scope.carrierConfirmPopup.close();
                        };


                        //批量删除
                        $(".k-grid-batchDelete").on("click", function () {
                            var grid = $scope.shipmentGrid;
                            var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                            var ids = [];
                            var error = '';
                            selectData.forEach(function (data) {
                                if (data.statusCode !== null && data.statusCode == 'Submitted') {
                                    error = data.id + ",出库单已提交不能删除！";
                                    return;
                                }
                                ids.push(data.id);
                            });
                            if (error !== "") {
                                kendo.ui.ExtAlertDialog.showError(error);
                                return;
                            }
                            if (ids.length === 0) {
                                kendo.ui.ExtAlertDialog.showError("请选择出库单");
                                return;
                            }
                            var url = shipmentUrl + "/batchDelete/" + ids;
                            $sync(window.BASEPATH + url, "DELETE")
                                .then(function (xhr) {
                                    $scope.shipmentGrid.dataSource.read({});
                                }, function (xhr) {
                                    $scope.shipmentGrid.dataSource.read({});
                                });
                        });


                        //填充单号
                        $(".k-grid-fillCarrierReferNo").on("click", function () {
                            var grid = $scope.shipmentGrid;
                            var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                            var ids = [];
                            var carrierArrys = [];
                            var error = '';
                            selectData.forEach(function (data) {
                                if (data.isCancelled == 1 || data.isClosed == 1) {
                                    error = data.id + ",出库单已取消或已拒单不能获取单号！";
                                    return;
                                }
                                if (data.statusCode !== null && data.statusCode != 'Submitted') {
                                    error = data.id + ",出库单未提交不能获取单号！";
                                    return;
                                }
                                if (data.allocateStatuscode != "Finished") {
                                    error = data.id + ",未分配，不能获取单号！";
                                    return;
                                }
                                if (data.deliveryStatuscode != "None") {
                                    error = data.id + ",已发货，不能获取单号！";
                                    return;
                                }
                                carrierArrys.push(data.carrierNo);
                                ids.push(data.id);
                            });
                            if (error !== "") {
                                kendo.ui.ExtAlertDialog.showError(error);
                                return;
                            }
                            var carriers = carrierArrys.join(",");
                            if (carriers.length == 0) {
                                kendo.ui.ExtAlertDialog.showError("没有承运商不能获取物流单号!");
                                return;
                            }
                            if (ids.length === 0) {
                                kendo.ui.ExtAlertDialog.showError("请选择出库单!");
                                return;
                            }
                            var url = shipmentUrl + "/batchfill/" + ids + "/" + carrierArrys;
                            $sync(window.BASEPATH + url, "PUT")
                                .then(function (xhr) {
                                    $scope.shipmentGrid.dataSource.read({});
                                }, function (xhr) {
                                    $scope.shipmentGrid.dataSource.read({});
                                });
                        });


                        //修改物流信息
                        $scope.updateLogistics = function (data) {
                            $scope.logusticsPopup.refresh().open().center();
                            $scope.logusticsModel = {};
                            $scope.logusticsModel.id = data.dataItem.id;
                            $scope.logusticsModel.carrierNo = data.dataItem.carrierNo;
                            $scope.logusticsModel.carrierReferNo = data.dataItem.carrierReferNo;
                            $("[name='logusticsModel.carrierNo']").children().scope().has_selected_carrierlogusticsModel_carrierNo = {key: "", value: data.dataItem.carrierNo};
                            $scope.logusticsModel.cartongroupCode = data.dataItem.cartongroupCode;
                            $scope.logusticsModel.totalWeight = data.dataItem.totalWeight;
                        };

                        //更新物流单确认
                        $scope.logisticsConfirm = function (e) {
                            var formValidator = $(e.target).parents(".k-edit-form-container").kendoValidator().data("kendoValidator");
                            if (!formValidator.validate()) {
                                return;
                            }
                            var params = {
                                "id": $scope.logusticsModel.id,
                                "carrierCode": $("[name='logusticsModel.carrierNo']").val(),
                                "carrierReferNo": $("[name='logusticsModel.carrierReferNo']").val(),
                                "totalWeight": $("[name='logusticsModel.totalWeight']").val(),
                                "cartongroupCode": $("[name='logusticsModel.cartongroupCode']").val()
                            };
                            //更新物流单信息
                            $sync(window.BASEPATH + "/shipment/logistics/" + $scope.logusticsModel.id, "POST", {data: params})
                                .then(function (xhr) {
                                    $scope.logusticsModel = {};
                                    $scope.logusticsPopup.close();
                                    $scope.shipmentGrid.dataSource.read();
                                }, function (xhr) {
                                    //$scope.logusticsModel = {};
                                    //$scope.logusticsPopup.close();
                                    $scope.shipmentGrid.dataSource.read();
                                });
                        };

                        //更新物流单取消
                        $scope.logisticsClose = function () {
                            $scope.logusticsModel = {};
                            $scope.logusticsPopup.close();
                        };

                        //更新物理单承运商change事件
                        $("[name='logusticsModel.carrierNo']").change(function () {
                            //清空运单号
                            $("[name='logusticsModel.carrierReferNo']").val("");
                        });
                    }
                });
            }]);


})