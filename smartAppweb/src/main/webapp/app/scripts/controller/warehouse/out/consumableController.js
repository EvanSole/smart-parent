define(['scripts/controller/controller'], function (controller) {
    "use strict";
    controller.controller('warehouseOutConsumableController',
        ['$scope', '$rootScope', 'sync', 'wmsDataSource', 'wmsLog', '$filter', 'wmsReportPrint', 'url',
            function ($scope, $rootScope, $sync, wmsDataSource, wmsLog, $filter, wmsReportPrint, $url) {

                $scope.order = {};
                $scope.invoice = {};
                $scope.selectData = [];
                $scope.query = {};

                $scope.clearLocationInfo = function(){
                    var currentDataItem = this.dataItem;
                    WMS.UTILS.setValueInModel(currentDataItem, "locationId", "");
                    WMS.UTILS.setValueInModel(currentDataItem, "zoneId", "");
                };
                $scope.validateLocationValue = function(e){
                    var evt = e || event;
                    var dataItem = this.dataItem,
                        targetEl = $(evt.target);
                    if(targetEl.val() === ""){
                        $scope.clearLocationInfo.apply(this);
                        return;
                    }
                    var locationNo = targetEl.val();
                    var locationUrl = $url.dataLocationUrl + "/locationInfo?locationNo=" + locationNo;
                    $sync(locationUrl, "GET", {wait:false}).then(function(resp){
                        var result = resp.result;
                        if(result === null){
                            WMS.UTILS.setValueInModel(dataItem, "locationId", "");
                            WMS.UTILS.setValueInModel(dataItem, "zoneId", "");
                            targetEl.val("");
                            kendo.ui.ExtAlertDialog.showError("请输入正确的货位!");
                            return;
                        }else{
                            WMS.UTILS.setValueInModel(dataItem, "locationId", result.id);
                            WMS.UTILS.setValueInModel(dataItem, "zoneId", result.zoneId);
                        }
                    });
                };

                 var consumabletUrl = "/shipment",
                    shipmentBasicUrl = "/shipment/basic",
                    waveUrl = "/warehouse/out/wave",

                    headerColumns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { filterable: false, title: '数据来源', field: 'datasourceCode', align: 'left', width: "120px;", template: WMS.UTILS.codeFormat('datasourceCode', 'DataSource')},
                        { filterable: false, title: '订单来源', field: 'fromtypeCode', align: 'left', width: "100px",template: WMS.UTILS.codeFormat('fromtypeCode', 'AllShipmentFrom')},
                        { filterable: false, title: '出库单号', field: 'id', align: 'left', width: "120px;"},
                        { filterable: false, title: '单据状态', field: 'statusCode', template: WMS.UTILS.codeFormat("statusCode", "TicketStatus"), align: 'left', width: "120px"},
                        { filterable: false, title: '总数量', field: 'totalQty', align: 'left', width: "120px"},
                        { filterable: false, title: 'SKU品种数', field: 'totalCategoryQty', align: 'left', width: "120px"},
                        { filterable: false, title: '仓库名称', field: 'warehouseId', align: 'left', width: "120px;", template: WMS.UTILS.whFormat},
                        { filterable: false, title: '商家名称', field: 'storerId', align: 'left', width: "120px;", template: WMS.UTILS.storerFormat},
                        { filterable: false, title: '发货状态', field: 'deliveryStatuscode', template: WMS.UTILS.codeFormat("deliveryStatuscode", "OrderOperationStatus"), align: 'left', width: "120px"},
                        { filterable: false, title: '实际发货时间', field: 'deliveryTime', template: WMS.UTILS.timestampFormat("deliveryTime", "yyyy-MM-dd HH:mm:ss"), align: 'left', width: "150px"},
                        { filterable: false, title: '备注', field: 'memo', align: 'left', width: "120px",
                            template: function (dataItem) {return WMS.UTILS.tooLongContentFormat(dataItem, 'memo');}
                        }

                    ],

                    headerDataSource = wmsDataSource({
                        url: consumabletUrl,
                        readParams:{fromtypeCode:"Other"},
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
                                    storerId:  { type: "number" },
                                    isNeedInvoice: {type: "boolean", editable: true, nullable: true },
                                    isUrgent: {type: "boolean", editable: true, nullable: true },
                                    isCod: {type: "boolean", editable: true, nullable: true },
                                    isCancelled: {type: "boolean", editable: true, nullable: true },
                                    isClosed: {type: "boolean", editable: true, nullable: true },
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
                        { name: "create", text: "新增",className:"btn-auth-add"},
                        { name: "submit", text: "提交",className:"btn-auth-submit"},
                        { name: "repeal", text: "撤消",className:"btn-auth-cancel"},
                        { name: "confirm", text: "确认",className:"btn-auth-confirm"},
                        { name: "batchDelete", text: "批量删除",className:"btn-auth-batchDelete"}
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
                        if(!(e.model.order && e.model.order.orderTime)){
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
                            if (record.statusCode !== "Initial" || record.isClosed==1 || record.isCancelled==1) {
                                $(tr).find(".k-button").remove();
                            }

                        });
                    },
                    customChange: function (grid) {
                        $(".k-grid-submit").hide();
                        $(".k-grid-repeal").hide();
                        $(".k-grid-confirm").hide();
                        $(".k-grid-batchDelete").hide();
                        var selected = WMS.GRIDUTILS.getCustomSelectedData($scope.shipmentGrid);
                        if (selected.length > 0) {
                            var sub = 0, del = 0,fill= 0,confirm=0,cancel= 0,size = selected.length;
                            $.each(selected, function () {
                                if (this.statusCode === 'Submitted') {
                                    confirm++;
                                    cancel++;
                                }
                                if (this.statusCode === 'Initial') {
                                    sub++;
                                    del++;
                                    confirm--;
                                    cancel--;
                                }

                                fill++;
                                if(this.isCancelled == 1 || this.isClosed==1){
                                    sub--;
                                    fill--;
                                    del--;
                                    confirm--;
                                    cancel--;
                                }
                                if(this.datasourceCode == 'System'){
                                    del--;
                                }
                                if(this.statusCode === "Initial" || this.statusCode === "Confirmed"){
                                    fill--;
                                }

                            });
                            if(cancel === size){
                                $(".k-grid-repeal").show();
                            }
                            if(confirm === size){
                                $(".k-grid-confirm").show();
                            }
                            if (sub === size) {
                                $(".k-grid-submit").show();
                            }
                            if (del === size) {
                                $(".k-grid-batchDelete").show();
                            }

                        } else {
                            $(".k-grid-submit").show();
                            $(".k-grid-repeal").show();
                            $(".k-grid-confirm").show();
                            $(".k-grid-batchDelete").show();
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
                    { field: 'zoneId', title: '库区',template:WMS.UTILS.zoneNoFormat,width:'120px'},
                    { field: 'locationId', title: '货位编号',template:WMS.UTILS.locationFormat,width:'120px'},
                    { field: "skuItemName", title: "商品名称", width: "120px" },
                    { field: "skuBarcode", title: "商品条码", width: "160px" },
                    { field: "skuColorCode", title: "商品颜色",template: WMS.UTILS.codeFormat("skuColorCode", "SKUColor"), width: "120px" },
                    { field: "skuSizeCode", title: "商品尺寸",template: WMS.UTILS.codeFormat("skuSizeCode", "SKUSize"), width: "120px" },
                    { field: "skuModel", title: "型号", width: "120px" },
                    { field: "skuProductNo", title: "货号", width: "120px" },
                    { field: "orderedQty", title: "出库数量", width: "120px" },
                     { field: "inventoryStatusCode", title: "库存状态", template: WMS.UTILS.codeFormat("inventoryStatusCode", "InventoryStatus"), width: "120px" },
                    { field: "amount", title: "实际单价", width: "120px" },
                    { field: "grossweight", title: "毛重", width: "120px" },
                    { field: "netweight", title: "净重", width: "120px" },
                    { field: "cube", title: "体积", width: "120px" }
                ];

                $scope.shipmentDetailOptions = function (dataItem) {
                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource: wmsDataSource({
                            url: consumabletUrl + "/" + dataItem.id + "/detail",
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
                            { name: "create", text: "新增",className:"btn-auth-add-detail"},
                            { template: '<a class="k-button k-button-custom-command" ng-click="import($event,detailGrid,dataItem)">导入</a>',
                                className: "btn-auth-shipment-import"}

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
                        edit:function(e){
                            $scope.$$childTail.zoneId = e.model.zoneId;
                            $scope.$$childTail.locationId = e.model.locationId;
                        },
                        dataBound: function (e) {
                            var grid = this,
                                trs = grid.tbody.find(">tr");
                            if (dataItem.statusCode !== "Initial") {
                                grid.element.find(".k-grid-add").remove();
                                grid.element.find(".k-button").remove();
                                _.each(trs, function (tr, i) {
                                    $(tr).find(".k-button").remove();
                                });
                            }

                        },
                        save: function(e) {
                            var skuIdVal = $("#skuId").val();
                            var skuSkuVal = $("#skuSku").val();
                            if (skuIdVal === ""  || skuSkuVal === "") {
                                kendo.ui.ExtAlertDialog.showError("请至少选择一个SKU商品信息!");
                                e.preventDefault();
                            }
                        }
                    }, $scope);
                };




                //操作日志
                $scope.logOptions = wmsLog.operationLog;


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
                        if(returnData){
                            $("#locationNo").val(returnData.locationNo);
                            $scope.editModel.set("zoneId",returnData.zoneId);
                            $scope.editModel.set("zoneNo",returnData.zoneNo);
                            $scope.editModel.set("locationId",returnData.id);
                            $scope.$$childTail.zoneId = returnData.zoneId;
                            $scope.$$childTail.locationId = returnData.id;
                        }else{
                            $("#locationNo").val("");
                            $scope.editModel.set("zoneId","");
                            $scope.editModel.set("zoneNo","");
                            $scope.editModel.set("locationId","");
                            $scope.$$childTail.zoneId = "";
                            $scope.$$childTail.locationId = "";
                        }
                    };
                };




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



                $scope.$on("kendoWidgetCreated", function (event, widget) {

                    if (widget.options !== undefined && widget.options.widgetId === 'detail') {
                        widget.bind("edit", function (e) {
                            $scope.editModel = e.model;
                        });
                    }
                    if (widget.options !== undefined && widget.options.widgetId === 'header') {
                        widget.bind("edit", function (e) {
                            if(e.model.storerId != 0 ){//修改不能修改商家 added by zw 6.19
                            }
                            if (!e.model.order) {
                                e.model.order = {shopNo: "", isCod: ""};
                            }
                            if (!e.model.invoice) {
                                e.model.invoice = {invoiceTypeCode: ""};
                            }
                        });

                        /**
                         * 耗材确认
                         */
                        $(".k-grid-confirm").on('click', function () {
                            var grid = $scope.shipmentGrid;
                            var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                            var ids = [];
                            var error = '';
                            selectData.forEach(function (data) {
                                if (data.statusCode !== null && data.statusCode !== 'Submitted') {
                                    error = data.id + ",出库单状态不是已提交状态！";
                                    return;
                                }
                                if (data.isCancelled == 1 || data.isClosed==1) {
                                    error = data.id + ",出库单已取消，不能确认！";
                                    return;
                                }
                                ids.push(data.id);
                            });
                            if (ids.length === 0) {
                                kendo.ui.ExtAlertDialog.showError("请选择出库单");
                                return;
                            }
                            if (error !== "") {
                                kendo.ui.ExtAlertDialog.showError(error);
                                return;
                            }
                            var url = consumabletUrl + "/consumable/confirm/" + ids;
                            $sync(window.BASEPATH + url, "PUT")
                                .then(function (xhr) {
                                    $scope.shipmentGrid.dataSource.read({});

                                }, function (xhr) {
                                    $scope.shipmentGrid.dataSource.read({});
                                });

                        });

                        /**
                         * 耗材撤销
                         */
                        $(".k-grid-repeal").on('click', function (event, widget) {
                            var grid = $scope.shipmentGrid;
                            var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                            var ids = [];
                            var error = '';
                            selectData.forEach(function (data) {
                                if (data.statusCode == 'Initial') {
                                    error = data.id + ",出库单未提交不能撤消！";
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
                            var url = consumabletUrl + "/consumable/cancel/" + id;
                            $sync(window.BASEPATH + url, "PUT")
                                .then(function (xhr) {
                                    $scope.shipmentGrid.dataSource.read({});

                                }, function (xhr) {
                                    $scope.shipmentGrid.dataSource.read({});
                                });
//
                        });




                        /**
                         * 耗材提交
                         */
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
                                if (data.isCancelled == 1 || data.isClosed==1) {
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
                            var url = consumabletUrl + "/consumable/submit/" + ids;
                            $sync(window.BASEPATH + url, "PUT")
                                .then(function (xhr) {
                                    $scope.shipmentGrid.dataSource.read({});

                                }, function (xhr) {
                                    $scope.shipmentGrid.dataSource.read({});
                                });
//
                        });


                        $scope.shipmentConfirmClose = function(){
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
                            var url = consumabletUrl + "/batchDelete/" + ids;
                            $sync(window.BASEPATH + url, "DELETE")
                                .then(function (xhr) {
                                    $scope.shipmentGrid.dataSource.read({});
                                }, function (xhr) {
                                    $scope.shipmentGrid.dataSource.read({});
                                });
                        });

                    }
                });
            }]);



})