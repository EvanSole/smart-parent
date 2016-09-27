define(['scripts/controller/controller', '../../../model/warehouse/in/asnModel'], function (controller, asnModel) {
    "use strict";
    controller.controller('warehouseInAsnController',
        ['$scope', '$rootScope', 'sync', 'wmsDataSource', 'wmsLog', '$q', '$filter', 'wmsReportPrint',
            function ($scope, $rootScope, $sync, wmsDataSource, wmsLog, $q, $filter, wmsReportPrint) {
                var ansHeaderUrl = "/asns",
                    headerColumns = [
                        { title: '操作', command: [
                            { name: "edit", template: "<a  class='k-button k-button-icontext k-grid-edit' href='\\#'><span class='k-icon k-edit'></span>编辑</a>",
                                className: "btn-auth-edit",
                                text: { edit: "编辑", cancel: "取消", update: "更新" } },
                            WMS.GRIDUTILS.deleteButton

                        ],
                            width: "100px"
                        },
                        { filterable: false, title: '通知单号', field: 'id', align: 'left', width: "120px;"},
                        { filterable: false, title: '仓库', field: 'warehouseId', align: 'left', width: "120px;", template: WMS.UTILS.whFormat},
                        { filterable: false, title: '商家', field: 'storerId', align: 'left', width: "120px;", template: WMS.UTILS.storerFormat},
                        { filterable: false, title: '供应商', field: 'vendorId', align: 'left', width: "120px;", template: WMS.UTILS.vendorFormat},
                        { filterable: false, title: '参考单号', field: 'referNo', align: 'left', width: "120px;"},
                        { filterable: false, title: '数据来源', field: 'datasourceCode', template: WMS.UTILS.codeFormat('datasourceCode', 'DataSource'), align: 'left', width: "120px;"},
                        { filterable: false, title: 'OMS单号', field: 'fromOmsNo', align: 'left', width: "120px;"},
                        { filterable: false, title: '单据状态', field: 'ticketStatusCode', template: WMS.UTILS.codeFormat('ticketStatusCode', 'TicketStatus'), align: 'left', width: "120px;"},
                        { filterable: false, title: '收货状态', field: 'statusCode', template: WMS.UTILS.codeFormat('statusCode', 'ReceiptStatus'), align: 'left', width: "120px;"},
                        { filterable: false, title: '单据来源', field: 'fromTypeCode', template: WMS.UTILS.codeFormat('fromTypeCode', 'ReceiptFrom'), align: 'left', width: "120px;"},
                        //放开质检
                        { filterable: false, title: '质检状态', field: 'qcStatusCode', template: WMS.UTILS.codeFormat('qcStatusCode', 'OrderOperationStatus'), align: 'left', width: "120px;"},
                        { filterable: false, title: '预期总箱数', field: 'totalCartonQty', align: 'left', width: "120px;"},
                        { filterable: false, title: '预期总数量', field: 'totalQty', align: 'left', width: "120px;"},
                        { filterable: false, title: '实收数量', field: 'totalQtyReal', align: 'left', width: "120px;"},
                        { filterable: false, title: '总品项数', field: 'totalCategoryQty', align: 'left', width: "120px;"},
                        { filterable: false, title: '总金额', field: 'totalAmount', align: 'left', width: "120px;"},
                        { filterable: false, title: '联系人', field: 'vendorContact', align: 'left', width: "120px;"},
                        { filterable: false, title: '预计到货时间', template: WMS.UTILS.timestampFormat("expectedDate"), field: 'expectedDate', align: 'left', width: "150px;"},
                        { filterable: false, title: '物流公司', field: 'carrierName', align: 'left', width: "120px;"},
                        { filterable: false, title: '物流单号', field: 'carrierReferNo', align: 'left', width: "120px;"},
                        { filterable: false, title: 'ERP单号', field: 'fromErpNo', align: 'left', width: "120px;"},
                        { filterable: false, title: '交易单号', field: 'fromOrderNo', align: 'left', width: "120px;"},
                        { filterable: false, title: '退货原因', field: 'userdef01', align: 'left', width: "120px;"},
                        { filterable: false, title: '备注', field: 'memo', align: 'left', width: "120px;", template: function (dataItem) {
                            return WMS.UTILS.tooLongContentFormat(dataItem, 'memo');
                        }},
                        WMS.UTILS.CommonColumns.defaultColumns
                    ],
                    headerDataSource = wmsDataSource({
                        url: ansHeaderUrl,
                        schema: {
                            model: asnModel.header
                        }
                    });

                var receiptColumns = [
                    { filterable: false, title: '商品条码', field: 'barcode', align: 'left', width: "160px;"},
                    { filterable: false, title: '商品名称', field: 'itemName', align: 'left', width: "130px;"},
                    { filterable: false, title: '颜色', field: 'skuColor', template: WMS.UTILS.codeFormat('skuColor', 'SKUColor'), align: 'left', width: "100px;"},
                    { filterable: false, title: '尺码', field: 'skuSize', template: WMS.UTILS.codeFormat('skuSize', 'SKUSize'), align: 'left', width: "100px;"},
                    { filterable: false, title: '货号', field: 'skuProductNo', align: 'left', width: "100px;"},
                    { filterable: false, title: '型号', field: 'skuModel', align: 'left', width: "100px;"},
                    { filterable: false, title: '容器号', field: 'locationNo', align: 'left', width: "100px;"},
                    { filterable: false, title: '商品状态', field: 'inventoryStatusCode', template: WMS.UTILS.codeFormat('inventoryStatusCode', 'InventoryStatus'), align: 'left', width: "100px;"},
                    { filterable: false, title: '箱号', field: 'cartonNo', align: 'left', width: "100px;"},
                    { filterable: false, title: '实收数量', field: 'qty', align: 'left', width: "100px;"},
                    { filterable: false, title: '收货人', field: 'receiptName', align: 'left', width: "100px;"},
                    { filterable: false, title: '收货时间', field: 'receiptDate', align: 'left', width: "140px;"},
                    WMS.UTILS.CommonColumns.defaultColumns
                ];
                headerColumns = headerColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                headerColumns.splice(0, 0, WMS.UTILS.CommonColumns.checkboxColumn);
                $scope.asnGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: headerDataSource,
                    toolbar: [
                        { name: "create", text: "新增", className: "btn-auth-add"},
                        { name: "sub", text: "提交", className: "btn-auth-batchSubmit"},
                        { name: "cacel", text: "撤销", className: "btn-auth-batchInitial"},
                        { name: "confirm", text: "收货完成", className: "btn-auth-batchComfirm"},
//                        { name: "delivery", text: "自动收货"},
                        //放开质检
                        { name: "createQc", text: "创建质检单",className:"btn-auth-qc"},
                        {template: '<a class="k-button k-grid-print" ng-click="print()" href="\\#">打印</a>', className: "btn-auth-print"},
                        { name: "delete", text: "批量删除", className: "btn-auth-batchDelete"},
                        //{template: '<a class="k-button k-grid-scan" ng-click="openScan()" href="\\#">扫描收货</a>', className: "btn-auth-scan"}
                        {template: '<a class="k-button k-grid-scan" ng-click="createReceipt()" href="\\#">创建入库单</a>', className: "btn-auth-scan"}
                    ],
                    columns: headerColumns,
                    editable: {
                        mode: "popup",
                        window: {
                            width: "660px"
                        },
                        template: kendo.template($("#asn-editor").html())
                    },
                    widgetId: "header",
                    dataBound: function (e) {
                        var grid = this,
                            trs = grid.tbody.find(">tr");
                        _.each(trs, function (tr, i) {
                            var record = grid.dataItem(tr);
                            if (record.datasourceCode === 'System' || record.ticketStatusCode === 'Submitted' || record.ticketStatusCode === 'Confirmed' || record.ticketStatusCode === 'Closed') {
                                $(tr).find(".k-button").remove();
                            }
                        });
                    },
//                    height: 450,
                    customChange: function (grid) {
                        $(".k-grid-sub").hide();
                        $(".k-grid-cacel").hide();
                        $(".k-grid-delivery").hide();
                        $(".k-grid-confirm").hide();
                        $(".k-grid-scan").hide();
//                        //放开质检
                        $(".k-grid-createQc").hide();
                        $(".k-grid-delete").hide();
                        var selected = WMS.GRIDUTILS.getCustomSelectedData($scope.asnGrid);
                        if (selected.length > 0) {
                            var sub = 0, cacel = 0, delivery = 0, confirm = 0, qc = 0, scan = 0, del = 0, size = selected.length;
                            $.each(selected, function () {
                                if (this.ticketStatusCode === 'Initial') {
                                    sub++;
                                    del++;
                                }
                                if (this.ticketStatusCode === 'Submitted' && this.statusCode === '0' && this.datasourceCode === 'Manual') {
                                    cacel++;
                                }
                                if (this.ticketStatusCode === 'Submitted'&&this.qcStatusCode !== 'Doing') {
                                    confirm++;
                                }
                                if (this.ticketStatusCode === 'Submitted') {
                                    scan++;
                                }
                                if (this.ticketStatusCode === 'Submitted' && this.statusCode === '0') {
                                    delivery++;
                                }
                                //放开质检
//                                if (this.qcStatusCode === 'Doing') {
//                                    qc++;
//                                }
                                //未提交的并且质检状态是未操作
                                if (this.ticketStatusCode === 'Submitted'&&(this.qcStatusCode==='None'||this.qcStatusCode==='Finished')) {
                                    qc++;
                                }
                            });
                            if (sub === size)
                                $(".k-grid-sub").show();
                            if (cacel === size)
                                $(".k-grid-cacel").show();
                            if (delivery === size)
                                $(".k-grid-delivery").show();
                            if (confirm === size)
                                $(".k-grid-confirm").show();
                            if (scan === size)
                                $(".k-grid-scan").show();
                            //放开质检
                            if (qc === size)
                                $(".k-grid-createQc").show();
                            if (del === size) {
                                $(".k-grid-delete").show();
                            }
                        } else {
                            $(".k-grid-sub").show();
                            $(".k-grid-cacel").show();
                            $(".k-grid-delivery").show();
                            $(".k-grid-confirm").show();
                            //放开质检
                            $(".k-grid-createQc").show();
                            $(".k-grid-scan").show();
                            $(".k-grid-delete").show();
                        }
                    }
                }, $scope);

                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;

                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;


                //明细信息


//                detailColumns = detailColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.asnDetailOptions = function (dataItem) {
                    var editQty;
                    var detailGridOptions = WMS.GRIDUTILS.getGridOptions({
                        widgetId: "detail",
                        height: 200,
                        dataBound: function (e) {
                            var grid = this,
                                trs = grid.tbody.find(">tr");
                            _.each(trs, function (tr, i) {
                                var record = grid.dataItem(tr);
                                if (record.statusCode === 'Submitted' || record.statusCode === 'Cancelled') {
                                    $(tr).find(".k-button").remove();
                                }
                            });
                        },
                        dataSource: wmsDataSource({
                            url: ansHeaderUrl + "/" + dataItem.id + "/details",
                            callback: {
                                update: function (response, editData) {
                                    dataItem.set("totalQty", dataItem.get("totalQty") - editQty + editData.expectedQty);
                                    $scope.asnGrid.expandRow($('tr[data-uid=' + dataItem.get('uid') + ']'));
                                    //$scope.asnGrid.dataSource.read();
                                },
                                create: function (response, editData) {
                                    dataItem.set("totalQty", parseInt(dataItem.get("totalQty")) + parseInt(editData.expectedQty));
                                    dataItem.set("totalCategoryQty", dataItem.get("totalCategoryQty") + 1);
                                    $scope.asnGrid.expandRow($('tr[data-uid=' + dataItem.get('uid') + ']'));
                                },
                                destroy: function (response, editData) {
                                    dataItem.set("totalQty", dataItem.get("totalQty") - editData.expectedQty);
                                    dataItem.set("totalCategoryQty", editData.totalCategoryQty);
                                    $scope.asnGrid.expandRow($('tr[data-uid=' + dataItem.get('uid') + ']'));
                                    //$scope.asnGrid.dataSource.read();
                                }
                            },
                            schema: {
                                model: {
                                    id: "id",
                                    fields: {
                                        id: {type: "number", editable: false, nullable: true },
                                        cube: {type: "number"},
                                        netWeight: {type: "number"},
                                        grossWeight: {type: "number"},
                                        lastReceiptTime: {type: "string"},
                                        cartonQty: {type: "number"}
                                    }
                                },
                                total: function (total) {
                                    return total.length > 0 ? total[0].total : 0;
                                }
                            },
                            parseRequestData: function (data, method) {
                                if (method === "create" || method === "update") {
                                    data.sku = data.skuSku;
                                }
                                return data;
                            },
                            otherData: {"asnId": dataItem.id}
                        }),

                        editable: {
                            mode: "popup",
                            window: {
                                width: "660px"
                            },
                            template: kendo.template($("#asnDetail-editor").html())
                        },
                        edit: function (e) {
                            if (!e.model.isNew()) {
                                editQty = e.model.expectedQty;
                            }
                        }
                    }, $scope);

                    var detailColumns = [];
                    if (dataItem.ticketStatusCode === 'Initial') {
                        detailGridOptions.toolbar = [
                            { name: "create", text: "新增", className: "btn-auth-add-detail"}
                        ];

                        detailColumns = [
                            WMS.GRIDUTILS.CommonOptionButton("detail"),
//                    { filterable: false, title: '行号', field: 'detailLineNo', align: 'left', width: "10px;"},
                            { filterable: false, title: 'SKU', field: 'skuSku', align: 'left', width: "120px;"},
                            { filterable: false, title: '商品条码', field: 'skuBarcode', align: 'left', width: "160px;"},
                            { filterable: false, title: '商品名称', field: 'skuItemName', align: 'left', width: "120px;"},
                            { filterable: false, title: '颜色', field: 'skuColorCode', template: WMS.UTILS.codeFormat('skuColorCode', 'SKUColor'), align: 'left', width: "120px;"},
                            { filterable: false, title: '尺码', field: 'skuSizeCode', template: WMS.UTILS.codeFormat('skuSizeCode', 'SKUSize'), align: 'left', width: "120px;"},
                            { filterable: false, title: '货号', field: 'skuProductNo', align: 'left', width: "120px;"},
                            { filterable: false, title: '型号', field: 'skuModel', align: 'left', width: "120px;"},
                            { filterable: false, title: '净重(kg)', field: 'netWeight', align: 'left', width: "120px;"},
                            { filterable: false, title: '毛重(kg)', field: 'grossWeight', align: 'left', width: "120px;"},
                            { filterable: false, title: '体积(cm3)', field: 'cube', align: 'left', width: "120px;"},
                            { filterable: false, title: '收货状态', field: 'statusCode', template: WMS.UTILS.codeFormat('statusCode', 'ReceiptStatus'), align: 'left', width: "120px;"},
                            { filterable: false, title: '预期总数量', field: 'expectedQty', align: 'left', width: "120px;"},
                            { filterable: false, title: '实收数量', field: 'receivedQty', align: 'left', width: "100px"},
                            { filterable: false, title: '正品数量', field: 'qualifiedQty', align: 'left', width: "100px"},
                            { filterable: false, title: '残品数量', field: 'unQualifiedQty', align: 'left', width: "100px"},
                            { filterable: false, title: '上次收货时间', field: 'lastReceiptTime', align: 'left', width: "150px", template: WMS.UTILS.timestampFormat("lastReceiptTime")},
                            { filterable: false, title: '备注', field: 'description', align: 'left', width: "100px"},
                            { filterable: false, title: '批次号', field: 'lotKey', align: 'left', width: "120px"}
                        ];

                    } else {
                        detailColumns = [
                            { filterable: false, title: 'SKU', field: 'skuSku', align: 'left', width: "120px;"},
                            { filterable: false, title: '商品条码', field: 'skuBarcode', align: 'left', width: "160px;"},
                            { filterable: false, title: '商品名称', field: 'skuItemName', align: 'left', width: "120px;"},
                            { filterable: false, title: '颜色', field: 'skuColorCode', template: WMS.UTILS.codeFormat('skuColorCode', 'SKUColor'), align: 'left', width: "120px;"},
                            { filterable: false, title: '尺码', field: 'skuSizeCode', template: WMS.UTILS.codeFormat('skuSizeCode', 'SKUSize'), align: 'left', width: "120px;"},
                            { filterable: false, title: '货号', field: 'skuProductNo', align: 'left', width: "120px;"},
                            { filterable: false, title: '型号', field: 'skuModel', align: 'left', width: "120px;"},
                            { filterable: false, title: '净重(kg)', field: 'netWeight', align: 'left', width: "120px;"},
                            { filterable: false, title: '毛重(kg)', field: 'grossWeight', align: 'left', width: "120px;"},
                            { filterable: false, title: '体积(cm3)', field: 'cube', align: 'left', width: "120px;"},
                            { filterable: false, title: '收货状态', field: 'statusCode', template: WMS.UTILS.codeFormat('statusCode', 'ReceiptStatus'), align: 'left', width: "120px;"},
                            { filterable: false, title: '预期总数量', field: 'expectedQty', align: 'left', width: "120px;"},
                            { filterable: false, title: '实收数量', field: 'receivedQty', align: 'left', width: "100px"},
                            { filterable: false, title: '正品数量', field: 'qualifiedQty', align: 'left', width: "100px"},
                            { filterable: false, title: '残品数量', field: 'unQualifiedQty', align: 'left', width: "100px"},
                            { filterable: false, title: '上次收货时间', field: 'lastReceiptTime', align: 'left', width: "150px", template: WMS.UTILS.timestampFormat("lastReceiptTime")},
                            { filterable: false, title: '备注', field: 'description', align: 'left', width: "100px"},
                            { filterable: false, title: '批次号', field: 'lotKey', align: 'left', width: "120px"}
                        ];
                    }
                    detailColumns = detailColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                    detailGridOptions.columns = detailColumns;
                    return detailGridOptions;
                };


                $scope.asnReceiptDetailOptions = function (dataItem) {
                    var headerColumns = [
                        //到货通知单号、ｅｒｐ单号、关联单号、单据类型、商品条码、颜色、尺码、货号、型号、状态、实收数量、收货人、收货时间、商家、容器编码；
                        { filterable: false, title: '到货通知单号', field: 'id', align: 'left', width: "125px"},
                        { filterable: false, title: 'ERP单号', field: 'fromErpNo', align: 'left', width: "120px;"},
                        { filterable: false, title: '关联单号', field: 'fromRelateNo', align: 'left', width: "150px"},
                        { filterable: false, title: '单据来源', field: 'fromTypeCode', template: WMS.UTILS.codeFormat('fromTypeCode', 'ReceiptFrom'), align: 'left', width: "120px;"},
                        { filterable: false, title: '数据来源', field: 'datasourceCode', template: WMS.UTILS.codeFormat('datasourceCode', 'DataSource'), align: 'left', width: "120px;"},
                        { field: 'skuItemName', title: '商品名称', filterable: false, align: 'left', width: '100px'},
                        { filterable: false, title: '商品条码', field: 'skuBarcode', align: 'left', width: "160px"},
                        { filterable: false, title: '颜色', field: 'skuColorCode', align: 'left', width: "120px;", template: WMS.UTILS.codeFormat('skuColorCode', 'SKUColor')},
                        { filterable: false, title: '尺码', field: 'skuSizeCode', align: 'left', width: "120px;"},
                        { filterable: false, title: '货号', field: 'skuProductNo', align: 'left', width: "120px;"},
                        { filterable: false, title: '型号', field: 'skuModel', align: 'left', width: "120px;"},
                        { filterable: false, title: '商品状态', field: 'inventoryStatusCode', template: WMS.UTILS.codeFormat('inventoryStatusCode', 'InventoryStatus'), align: 'left', width: "120px;"},
                        { filterable: false, title: '实收数量', field: 'receivedQty', align: 'left', width: "120px"},
                        { filterable: false, title: '收货人', field: 'createUser', align: 'left', width: "120px"},
                        { filterable: false, title: '收货时间', field: 'receiptTime', align: 'left', width: "150px",template: WMS.UTILS.timestampFormat("receiptTime")},
                        { filterable: false, title: '商家', field: 'storerId', align: 'left', width: "120px", template: WMS.UTILS.storerFormat},
                        { filterable: false, title: '容器号', field: 'locationId', align: 'left', width: "120px",template: WMS.UTILS.locationFormat},
                        { filterable: false, title: '批次号', field: 'lotKey', align: 'left', width: "120px"},
                        { filterable: false, title: '生产日期', field: 'productionTime', align: 'left', width: "150px",template: WMS.UTILS.timestampFormat("productionTime")},
                        { filterable: false, title: '过期日期', field: 'expiredTime', align: 'left', width: "150px",template: WMS.UTILS.timestampFormat("expiredTime")}
                        //WMS.UTILS.CommonColumns.defaultColumns
                    ],

                        headerDataSource = wmsDataSource({
                            url: window.BASEPATH + "/asns/operation?id=" + dataItem.id,
                            schema: {

                                 }
                        });
                    //headerColumns = headerColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                    var asnReceiptDetailOptions = WMS.GRIDUTILS.getGridOptions({
                        hasFooter: true,
                        widgetId: "asnReceiptDetail",
                        dataSource: headerDataSource,
                        columns: headerColumns,
                        dataBound: function (e) {
                        }
                    }, $scope);
                    $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                    $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

                    return asnReceiptDetailOptions;
                };


                function getSelId() {
                    var selectedData = WMS.GRIDUTILS.getCustomSelectedData($scope.asnGrid);
                    var ids = [];
                    selectedData.forEach(function (value) {
                        ids.push(value.id);
                    });
                    var id = ids.join(",");

                    return id;
                }

                function getReceiptStatusCode() {
                    var selectedData = WMS.GRIDUTILS.getCustomSelectedData($scope.asnGrid);
                    var receiptStatusCodes = [];
                    selectedData.forEach(function (value) {
                        receiptStatusCodes.push(value.statusCode);
                    });
                    var receiptStatusCode = receiptStatusCodes.join(",");

                    return receiptStatusCode;
                }




                //操作日志
                $scope.logOptions = wmsLog.operationLog;

                $scope.$on("kendoRendered", function (e) {

                });

                $scope.receiptGridOptions = WMS.GRIDUTILS.getGridOptions({
                    hasFooter: true,
                    pageable: false,
                    dataSource: {},
                    columns: receiptColumns,
                    widgetId: "receipt"
                }, $scope);

                $scope.$on("kendoWidgetCreated", function (event, widget) {
                    if (widget.options !== undefined && widget.options. widgetId === 'detail') {
                        widget.bind("edit", function (e) {
                            $scope.editModel = e.model;
                        });
                    }
                    if (widget.options !== undefined && widget.options.widgetId === 'receipt') {
                        $scope.receiptGird = widget;
                    }
                    if (widget.options !== undefined && widget.options.widgetId === 'header') {
                        widget.bind("edit", function (e) {
                            $scope.editHeaderModel = e.model;
                            if (e.model.storerId != 0) {//修改不能修改商家 added by zw 6.19
                            }
                        });
                        //提交操作
                        $(".k-grid-sub").on('click', function (e) {
                            //放开质检
                            var selectedData = WMS.GRIDUTILS.getCustomSelectedData($scope.asnGrid);
                            for(var i=0;i<selectedData.length;i++){
                                //如果生成了质检单 没有关闭不允许提交
//                                if(selectedData[i].qcStatusCode==='Doing'){
//                                    //kendo.ui.ExtAlertDialog.showError("没有创建质检单不允许提交！");
//                                    kendo.ui.ExtAlertDialog.showError("质检单状态为操作中不允许提交！");
//                                    return;
//                                }
                            }
                            doStatus("Submitted");
                        });

                        //撤消操作
                        $(".k-grid-cacel").on('click', function (e) {
                            doStatus("Initial");
                        });

                        //确认操作
                        $(".k-grid-confirm").on('click', function (e) {
                            doStatus("Confirmed");
                        });

                        //生成质检操作
                        $(".k-grid-createQc").on('click', function (e) {
                            doStatus("CreateQc");
                        });

                        //自动收货操作
                        $(".k-grid-delivery").on('click', function (e) {
                            var id = getSelId();
                            if (!id) {
                                return;
                            }
                            $sync(window.BASEPATH + "/asns/receipt/" + id, "PUT")
                                .then(function (xhr) {
                                    $scope.asnGrid.dataSource.read({});
                                }, function (xhr) {
                                    $scope.asnGrid.dataSource.read({});
                                });
                        });

                        //删除操作
                        $(".k-grid-delete").on('click', function (e) {
                            doStatus("delete");
                        });

                        var doStatus = function (type) {
                            var id = getSelId();
                            if (!id) {
                                kendo.ui.ExtAlertDialog.showError("请选择一条数据");
                                return;
                            }
                            if (type === "CreateQc") {//创建质检单
                                if(id.toString().indexOf(",") === -1){//只允许选择一个到货通知单
                                    $sync(ansHeaderUrl + "/qc/" + id, "POST")
                                        .then(function (xhr) {
                                            $scope.asnGrid.dataSource.read({});
                                        }, function (xhr) {
                                            $scope.asnGrid.dataSource.read({});
                                        });
                                }else{
                                    kendo.ui.ExtAlertDialog.showError("只能选择一条到货通知单！");
                                }
                            } else if (type === "delete") {//批量删除
                                $.when(kendo.ui.ExtOkCancelDialog.show({
                                        title: "确认",
                                        message: "是否确定删除数据",
                                        icon: 'k-ext-question' })
                                ).then(function (resp) {
                                        if (resp.button === 'OK') {
                                            $sync(ansHeaderUrl + "/batch/" + id, "DELETE")
                                                .then(function (xhr) {
                                                    $scope.asnGrid.dataSource.read({});
                                                }, function (xhr) {
                                                    $scope.asnGrid.dataSource.read({});
                                                });
                                        }
                                    });
                            } else if (type === "Confirmed") {//其他修改状态的操作
                                var receiptStatusCode = getReceiptStatusCode();
                                var receiptStatusCodes = receiptStatusCode.split(",");
                                var isConfirm = false;
                                $.each(receiptStatusCodes, function (index, ele) {
                                    if (ele == 0 || ele == 3) {
                                        isConfirm = true;
                                    }
                                });
                                if (isConfirm) {
                                    $.when(kendo.ui.ExtOkCancelDialog.show({
                                            title: "确认",
                                            message: "单据未收货完成，是否要关闭单据？",
                                            icon: 'k-ext-question' })
                                    ).then(function (resp) {
                                            if (resp.button === 'OK') {
                                                $sync(window.BASEPATH + "/asns/status/" + type + "/" + id, "PUT")
                                                    .then(function (xhr) {
                                                        $scope.asnGrid.dataSource.read({});
                                                    }, function (xhr) {
                                                        $scope.asnGrid.dataSource.read({});
                                                    });
                                            }
                                        });


                                } else {
                                    $sync(window.BASEPATH + "/asns/status/" + type + "/" + id, "PUT")
                                        .then(function (xhr) {
                                            $scope.asnGrid.dataSource.read({});
                                        }, function (xhr) {
                                            $scope.asnGrid.dataSource.read({});
                                        });
                                }
                            } else {
                                $sync(window.BASEPATH + "/asns/status/" + type + "/" + id, "PUT")
                                    .then(function (xhr) {
                                        $scope.asnGrid.dataSource.read({});
                                    }, function (xhr) {
                                        $scope.asnGrid.dataSource.read({});
                                    });
                            }

                        };
                    }
                });

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
                        WMS.UTILS.setValueInModel($scope.editModel, "itemName", returnData.itemName);
                        WMS.UTILS.setValueInModel($scope.editModel, "skuBarcode", returnData.barcode);
                        WMS.UTILS.setValueInModel($scope.editModel, "skuId", returnData.id);
                        WMS.UTILS.setValueInModel($scope.editModel, "boxsize", returnData.boxsize);
                    };
                };

                $scope.windowVendorOpen = function () {
                    $scope.vendorPopup.refresh().open().center();
                    $scope.vendorPopup.initParam = function (subScope) {
                        subScope.param = $scope.editHeaderModel.storerId;
                    };
                    $scope.vendorPopup.setReturnData = function (returnData) {
                        if (_.isEmpty(returnData)) {
                            return;
                        }
                        $scope.editHeaderModel.set("vendorAddress", returnData.address);
                        $scope.editHeaderModel.set("vendorTelephone", returnData.telephone);
                        $scope.editHeaderModel.set("vendorReferNo", returnData.supplierNo);
                        $scope.editHeaderModel.set("vendorContact", returnData.contact);
                        $scope.editHeaderModel.set("vendorId", returnData.id);
                        $scope.editHeaderModel.set("vendorName", returnData.shortName);
                    };
                };


                $scope.windowCarrierOpen = function () {
                    $scope.carrierPopup.refresh().open().center();
                    $scope.carrierPopup.initParam = function (subScope) {
                        subScope.param = $scope.editHeaderModel.storerId;
                    };
                    $scope.carrierPopup.setReturnData = function (returnData) {
                        if (_.isEmpty(returnData)) {
                            return;
                        }
                        $scope.editHeaderModel.set("carrierName", returnData.shortName);
                        $scope.editHeaderModel.set("carrierContact", returnData.contact);
                        $scope.editHeaderModel.set("carrierTelephone", returnData.telephone);
                        $scope.editHeaderModel.set("carrierAddress", returnData.address);
                    };
                };


                $scope.print = function () {
                    console.log("print...");
                    var asnGrid = this.asnGrid;
                    var selectView = WMS.GRIDUTILS.getCustomSelectedData(asnGrid);
                    var selectedDataArray = _.map(selectView, function (view) {
                        return view.id;
                    });
                    var selectDataIds = selectedDataArray.join(",");
                    if (selectDataIds === "") {
                        kendo.ui.ExtAlertDialog.showError("请选择要打印的数据");
                        return;
                    }
                    wmsReportPrint.printAsnByIds(selectDataIds);
                };
                $scope.al = function () {
                    $("#scanModelLocationNo").focus();
                };

//7.30版本
                $scope.openScan = function () {
                    //扫描收货
                    //1.收货GRID初始化
                    $("#fag").change(function () {
                        $("#unQualifiedReason").removeAttr("disabled");
                    });
                    var receiptGrid = $scope.receiptGird;
                    var locationId;
                    var ds = new kendo.data.DataSource({
                        data: []
                    });
                    receiptGrid.setDataSource(ds);
                    // 到货通知单信息取得
                    var selectView = WMS.GRIDUTILS.getCustomSelectedData(this.asnGrid);
                    if (selectView.length > 0) {
                        var asnEntity = selectView[0];
                        $sync(window.BASEPATH + "/asns/sku/" + asnEntity.id, "GET", {data: null})
                            .then(function (xhr) {
                                $scope.skuArr = xhr.result.skuArr;
                                $scope.totalCategoryQty = xhr.result.surplusItems;
                                $scope.receiptNum = xhr.result.surplusTotal;
                                $scope.scanPopup.refresh().open().maximize();

                            });
                    } else {
                        kendo.ui.ExtAlertDialog.showError("请选择到货通知单");
                        return;
                    }
                    // 页面其他信息初始化
                    // 默认正品选中，残品原因不可用
                    $("#quality").prop('checked', true);
                    $("#unQualifiedReason").val("").attr("disabled", true);
                    // 默认数量为1
                    $scope.scanModel = {
                        qty: 1
                    };
                    // 实收为0
                    $scope.receiveCategoryQty = $scope.receiveQty = 0;
                    var barcodeArray = [];

                    // 页面事件绑定

                    // 货位回车跳转商品条码
                    $("#scanModelLocationNo").off("keydown").on("keydown", function (event) {
                        if (event.which === 13) {
                            if (!$scope.scanModel.locationNo) {
                                kendo.ui.ExtAlertDialog.showError("请输入容器！", $("#scanModelLocationNo"));
                                return;
                            }
                            var locationParam = {
                                "asnId": asnEntity.id,
                                "locationNo": $scope.scanModel.locationNo,
                                "createUser": $scope.user.userName
                            };
                            $sync(window.BASEPATH + "/asns/location", "GET", {data: locationParam})
                                .then(function (xhr) {
                                    $("#scanModelBarcode").focus();
                                }, function () {
                                    $("#scanModelLocationNo").select();
                                    setTimeout(function () {
                                        $("#scanModelLocationNo").focus();
                                    }, 500);
                                });
                            $("#scanModelBarcode").focus();
                            event.preventDefault();
                        }
                    });

                    $("#scanModelcarton").off("keydown").on("keydown", function (event) {
                        if (event.which === 13) {
                            $("#scanModelBarcode").select();
                            setTimeout(function () {
                                $("#scanModelBarcode").focus();
                            }, 500);
                            event.preventDefault();
                        }
                    });

                    var setLotSelectProperty = function(v1, v2, v3) {
                        $scope.isByProduction = v1;
                        $("#lotSelectDiv").attr("disabled",v2);
                        $("#lotSelectDiv").css('display',v3);
                        $("#productionTimeDiv").attr("disabled",v2);
                        $("#productionTimeDiv").css('display',v3);

                    }
                    setLotSelectProperty(0, true, 'none', 0);
                    var changeBarcode = function() {
                        var sku = _.find($scope.skuArr, {
                            barcode: $scope.scanModel.barcode
                        });
                        if (sku) {
//                            $scope.$apply(function () {
                            $scope.scanModel.skuName = sku.itemName;
                            $scope.scanModel.skuImage = sku.imageUrl;
                            $scope.scanModel.description = asnEntity.memo;
                            $scope.lotstrategyid = sku.lotstrategyid;
                            $scope.validdays = sku.validdays;
                            $scope.currentBarcode = sku.barcode;

                        } else {
                            setLotSelectProperty(0, true, 'none');
                            $scope.currentBarcode = '';
                            $scope.lotstrategyid = null;
                        }
                    }
                    $scope.isByProduction = 0;
                    // 根据barcode获得商品详细信息
                    $("#scanModelBarcode").off("change").on("change", function () {
                        changeBarcode();
                        submitEl = $("#scanModelBarcode");
                    });

                    $scope.lotSelect = 'production';

                    // 根据权限监控商品条码或数量
                    var submitEl = $("#scanModelBarcode");
                    if ($rootScope.user.isMutiScan === 1) {
                        submitEl.off("keydown").on("keydown", function (event) {
                            if (event.which === 13) {
                                if (!$scope.scanModel.barcode) {
                                    kendo.ui.ExtAlertDialog.showError("请输入商品条码！", $("#scanModelBarcode"));
                                    return;
                                }
                                changeBarcode();
                                $scope.isCheckedLotStra = 1;
                                var skuParam = {
                                    "asnId": asnEntity.id,
                                    "barcode": $scope.scanModel.barcode,
                                    "locationNo": $scope.scanModel.locationNo,
                                    "storerId": asnEntity.storerId,
                                    "createUser": $scope.user.userName,
                                    "inventoryStatus": $('input[name="authentic_rad"]:checked').val()
                                };
                                $sync(window.BASEPATH + "/asns/sku", "GET", {data: skuParam})
                                    .then(function (xhr) {
                                        if ($scope.lotstrategyid != null && $scope.lotstrategyid > 0) {
                                            $sync(window.BASEPATH + "/strategy/lot/" + $scope.lotstrategyid, "GET")
                                                .then(function (xhr) {
                                                    var obj = xhr.result.isByProductionTime;
                                                    if (obj == 1) {
                                                        setLotSelectProperty(1, false, 'block');
                                                        $("#productionTime").select();
                                                        setTimeout(function () {
                                                            $("#productionTime").focus();
                                                        }, 500);
                                                    } else {
                                                        setLotSelectProperty(0, true, 'none');
                                                        $("#scanModelQty").select();
                                                        setTimeout(function () {
                                                            $("#scanModelQty").focus();
                                                        }, 500);
                                                    }

                                                }, function () {
                                                    setLotSelectProperty(0, true, 'none');
                                                    $("#scanModelQty").select();
                                                    setTimeout(function () {
                                                        $("#scanModelQty").focus();
                                                    }, 500);
                                                });
                                        } else {
                                            setLotSelectProperty(0, true, 'none');
                                            $("#scanModelQty").select();
                                            setTimeout(function () {
                                                $("#scanModelQty").focus();
                                            }, 500);
                                        }
                                    }, function () {
                                        $("#scanModelBarcode").select();
                                        setTimeout(function () {
                                            $("#scanModelBarcode").focus();
                                        }, 500);
                                    });
                                event.preventDefault();
                            }
                        });
                        submitEl = $("#scanModelQty");
                    }
                    $("#productionTime").off("keydown").on("keydown", function (event) {
                        var _productionTime = $("#productionTime").val();
                        var _lotSelect = $("#lotSelect").find("option:selected").text();
                        if (event.which === 13) {
                            if (_productionTime == null || _productionTime == '') {
                                kendo.ui.ExtAlertDialog.showError("请选择" + _lotSelect, $("#productionTime"));
                                return;
                            } else {
                                if ($rootScope.user.isMutiScan === 1) {
                                    if ($scope.isByProduction === 1) {
                                        $("#scanModelQty").select();
                                        setTimeout(function () {
                                            $("#scanModelQty").focus();
                                        }, 500);
                                    } else {
                                        $("#scanModelQty").select();
                                        setTimeout(function () {
                                            $("#scanModelQty").focus();
                                        }, 500);
                                    }
                                } else if ($rootScope.user.isMutiScan === 0) {
                                    $scope.receiveSku(asnEntity, barcodeArray);
                                    event.preventDefault();
                                }
                            }
                            event.preventDefault();
                        }
                    });
                    if ($rootScope.user.isMutiScan === 0) {
                        $("#scanModelQty").attr("readonly", "readonly");
                        $("#scanModelBarcode").off("keydown").on("keydown", function (event) {
                            if (event.which === 13) {
                                $scope.receiveSku(asnEntity, barcodeArray);
                                event.preventDefault();
                            }
                        });
                    }

                    submitEl.off("keydown").on("keydown", function (event) {
                        if (event.which === 13) {
                            if ($scope.scanModel.qty > 1000) {
                                kendo.ui.ExtAlertDialog.showError("收货数量不能超过1000！", $("#scanModelQty"));
                                return;
                            }
                            changeBarcode();
                            if ((!$scope.preBarcode || $scope.preBarcode === '' || $scope.currentBarcode !== $scope.preBarcode) && $scope.isCheckedLotStra === 0) {
                                if ($scope.lotstrategyid != null && $scope.lotstrategyid > 0) {
                                    $sync(window.BASEPATH + "/strategy/lot/" + $scope.lotstrategyid, "GET")
                                        .then(function (xhr) {
                                            var obj = xhr.result.isByProductionTime;
                                            if (obj == 1) {
                                                setLotSelectProperty(1, false, 'block');
                                                $("#productionTime").select();
                                                setTimeout(function () {
                                                    $("#productionTime").focus();
                                                }, 500);
                                            } else {
                                                setLotSelectProperty(0, true, 'none');
                                                $scope.receiveSku(asnEntity, barcodeArray);
                                            }

                                        }, function () {
                                            setLotSelectProperty(0, true, 'none');
                                            $scope.receiveSku(asnEntity, barcodeArray);
                                        });
                                } else {
                                    setLotSelectProperty(0, true, 'none');
                                    $scope.receiveSku(asnEntity, barcodeArray);
                                }
                                $scope.isCheckedLotStra = 0;
                                $scope.preBarcode = $scope.currentBarcode;
                                event.preventDefault();
                            } else {
                                $scope.isCheckedLotStra = 0;
                                $scope.receiveSku(asnEntity, barcodeArray);
                                event.preventDefault();
                            }
                        }
//                        $("#scanModelBarcode").focus();
                    });
                    // 监控其他页面快捷键
                    $("body").off("keydown").on("keydown", function (event) {
                        // 按F1切换货位
                        if (event.which === 112) {
                            $("#scanModelLocationNo").val("").focus();
                        }
                        // 按F3切换到正品
                        if (event.which === 114) {
                            $("#quality").prop('checked', true);
                            $("#unQualifiedReason").val("").attr("disabled", true);
                            $("#scanModelBarcode").focus();
                        }
                        // 按F4切换到次品
                        if (event.which === 115) {
                            $("#fag").prop('checked', true);
                            $("#unQualifiedReason").removeAttr("disabled");
                            $("#unQualifiedReason").focus();
                        }
                        // F4次品被选中时，开启原因选择快捷键
                        if ($("#fag:checked").length > 0) {
                            // 小键盘数字键
                            if (event.ctrlKey && event.which >= 97 && event.which <= 103 && $("#unQualifiedReason").is(":focus")) {
//                          $scope.scanModel.unQualifiedReason = event.which - 96;
                                $("#unQualifiedReason").val(event.which - 96);
                                $("#scanModelBarcode").focus();
                                event.preventDefault();
                            }
                            // 数字键
                            if (event.ctrlKey && event.which >= 49 && event.which <= 55 && $("#unQualifiedReason").is(":focus")) {
//                          $scope.scanModel.unQualifiedReason = event.which - 48;
                                $("#unQualifiedReason").val(event.which - 48);
                                $("#scanModelBarcode").focus();
                                event.preventDefault();
                            }
                        }
                    });
                };

                $scope.createReceipt = function (){
                var id = getSelId();
                if (!id) {
                    kendo.ui.ExtAlertDialog.showError("请选择一条数据");
                    return;
                }
                    $sync(ansHeaderUrl + "/receipt/" + id, "POST")
                        .then(function (xhr) {
                            $scope.asnGrid.dataSource.read({});
                        }, function (xhr) {
                            $scope.asnGrid.dataSource.read({});
                        });
                }
                $scope.receiveSku = function (asnEntity, barcodeArray) {
                    var unQualifiedReason = $('input[name="authentic_rad"]:checked').val() === "Good" ? "" : $("#unQualifiedReason").val();
                    if ($("#fag:checked").length > 0) {
                        if (!$("#unQualifiedReason").val()) {
                            kendo.ui.ExtAlertDialog.showError("请输入次品原因！", $("#unQualifiedReason"));
                            return;
                        }
                    }
                    if (!$scope.scanModel.qty) {
                        kendo.ui.ExtAlertDialog.showError("请输入数量！", $("#scanModelQty"));
                        return;
                    }
                    if (!$scope.scanModel.locationNo) {
                        kendo.ui.ExtAlertDialog.showError("请输入容器！", $("#scanModelLocationNo"));
                        return;
                    }
                    if (!$scope.scanModel.barcode) {
                        kendo.ui.ExtAlertDialog.showError("请输入商品条码！", $("#scanModelBarcode"));
                        return;
                    }

                    var productionTime = 0;
                    if ($scope.isByProduction === 1) {
                        var _lotSelect = $("#lotSelect").find("option:selected").text();
                        var _productionTime = $("#productionTime").val().trim();
                        var re = /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/;
                        if (!re.test(_productionTime)) {
                            kendo.ui.ExtAlertDialog.showError(_lotSelect+" 日期格式错误", $("#productionTime"));
                            return;
                        }

                        var _productionTime = $("#productionTime").val().trim();

                        if (_productionTime == null || _productionTime == '') {
                            kendo.ui.ExtAlertDialog.showError("请选择" + _lotSelect, $("#productionTime"));
                            return;
                        }

                        var expiry = $("#lotSelect").val();
                        if (expiry === 'expiry') {
                            var productionDate = new Date(_productionTime);
                            productionDate.setDate(productionDate.getDate() - $scope.validdays);
                            productionTime = productionDate.getTime();
                        } else {
                            productionTime = _productionTime;
                        }

                        if (productionTime == null || productionTime==0) {
                            kendo.ui.ExtAlertDialog.showError(_lotSelect+" 日期格式错误", $("#productionTime"));
                            return;
                        }
                    } else {
                        productionTime = 0;
                    }

                    if ($scope.scanModel.qty <= 0) {
                        kendo.ui.ExtAlertDialog.showError("收货数量不能为负数", $("#scanModelBarcode"));
                        return;
                    }
                    var params = {
                        "asnId": asnEntity.id,
                        "inventoryStatus": $('input[name="authentic_rad"]:checked').val(),
                        "locationNo": $scope.scanModel.locationNo,
                        "cartonNo": $scope.scanModel.cartonNo,
                        "barcode": $scope.scanModel.barcode,
                        "qty": $scope.scanModel.qty,
                        "description": $scope.scanModel.description,
                        "unQualifiedReason": unQualifiedReason,
                        "storerId": asnEntity.storerId,
                        "productionTime": productionTime
                    };
                    //扫描收货
                    $sync(window.BASEPATH + "/asns/receipt", "POST", {data: params})
                        .then(function (xhr) {
                            var sku = xhr.result;
                            if (!_.contains(barcodeArray, params.barcode)) {
                                barcodeArray.push(params.barcode);
                            }
                            $scope.receiveCategoryQty = barcodeArray.length;
                            $scope.receiveQty += params.qty;
                            $scope.receiptGrid.dataSource.add({barcode: params.barcode, itemName: sku.itemName,
                                skuColor: sku.colorCode, skuSize: sku.sizeCode, skuProductNo: sku.productNo,
                                skuModel: sku.model, locationNo: params.locationNo, inventoryStatusCode: $('input[name="authentic_rad"]:checked').val(),
                                cartonNo: $scope.scanModel.cartonNo, qty: params.qty, receiptName: $scope.user.userName, receiptDate: $filter('date')(new Date(), 'yyyy/MM/dd HH:mm:ss')});
                            // 默认正品选中，残品原因不可用
                            $("#quality").prop('checked', true);
                            $("#unQualifiedReason").val("").attr("disabled", true);
                            $scope.asnGrid.dataSource.read();
                            $scope.scanModel.qty = 1;
                            $("#scanModelBarcode").select();
                            setTimeout(function () {
                                $("#scanModelBarcode").focus();
                            }, 500);
                        });
                };


                $scope.$on('errorOK', function () {
                    $scope.scanModel.qty = 1;
                    $("#scanModelBarcode").select();
                    setTimeout(function () {
                        $("#scanModelBarcode").focus();
                    }, 500);
                });
            }]);


})