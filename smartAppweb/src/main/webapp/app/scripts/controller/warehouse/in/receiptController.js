
define(['scripts/controller/controller', '../../../model/warehouse/in/receiptModel'], function (controller, receiptModel) {
    "use strict";
    controller.controller('warehouseInReceiptController',
        ['$scope', '$rootScope', '$http', 'url', 'FileUploader', 'wmsDataSource', 'wmsLog', 'sync', 'wmsReportPrint', '$filter',
            function ($scope, $rootScope, $http, $url, FileUploader, wmsDataSource, wmsLog, $sync, wmsReportPrint, $filter) {

                var headerUrl = $url.warehouseInReceiptUrl,
                    headerColumns = [
                        //WMS.UTILS.CommonColumns.checkboxColumn,
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { filterable: false, title: '入库单号', field: 'id', align: 'left', width: "125px"},
                        { filterable: false, title: '参考单号', field: 'referNo', align: 'left', width: "125px"},
                        { filterable: false, title: '到货通知单号', field: 'asnId', align: 'left', width: "150px"},
                        { filterable: false, title: '供应商', field: 'supplierId', align: 'left', width: "150px", template: WMS.UTILS.vendorFormat('supplierId')},
                        { filterable: false, title: '仓库', field: 'warehouseId', align: 'left', width: "100px", template: WMS.UTILS.whFormat},
                        { filterable: false, title: '商家', field: 'tenantId', align: 'left', width: "100px", template: WMS.UTILS.storerFormat},
                        { filterable: false, title: '入库方式', field: 'receiptTypeCode', template: WMS.UTILS.codeFormat('receiptTypeCode', 'ReceiptType'), align: 'left', width: "100px"},
                        { filterable: false, title: '单据来源', field: 'fromTypeCode', template: WMS.UTILS.codeFormat('fromTypeCode', 'ReceiptFrom'), align: 'left', width: "100px"},
                        { filterable: false, title: '单据状态', field: 'statusCode', template: WMS.UTILS.codeFormat('statusCode', 'TicketStatus'), align: 'left', width: "100px"},
                        { filterable: false, title: 'ERP单号', field: 'fromErpNo', align: 'left', width: "120px;"},
                        { filterable: false, title: '总数量', field: 'totalQty', align: 'left', width: "100px"},
                        { filterable: false, title: '总箱数', field: 'totalCartonQty', align: 'left', width: "100px"},
                        { filterable: false, title: '总托数', field: 'totalPalletQty', align: 'left', width: "100px"}
                    ], receiptColumns = [
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
                    ],

                    headerDataSource = wmsDataSource({
                        url: headerUrl,
                        callback: {
                            update: function (response, editData) {
                                $scope.receiptHeaderGrid.dataSource.read();

                            },
                            destroy: function (response, editData) {
                                $scope.receiptHeaderGrid.dataSource.read();
                            }
                        },
                        schema: {
                            model: receiptModel.header
                        }
                    });

                headerColumns = headerColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                headerColumns.splice(0, 0, WMS.UTILS.CommonColumns.checkboxColumn);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    widgetId: "header",
                    dataSource: headerDataSource,
                    toolbar: [
                        { name: "create", text: "新增", className: "btn-auth-add"},
                        { name: "submit", text: "提交", className: "btn-auth-submit"},
                        { name: "sub", text: "确认", className: "btn-auth-confirm"},
                        { name: "repeal", text: "撤销", className: "btn-auth-repeal"},
                        { name: "delete", text: "批量删除", className: "btn-auth-batchDelete"},
                        { name: "print", text: "打印", className: "btn-auth-print"}
                    ],
                    columns: headerColumns,
                    editable: {
                        mode: "popup",
                        window: {
                            width: "640px"
                        },
                        template: kendo.template($("#receiptHeaderEditor").html())
                    },
                    //height: 400,
                    dataBound: function (e) {
                        var grid = this,
                            trs = grid.tbody.find(">tr");
                        _.each(trs, function (tr, i) {
                            var record = grid.dataItem(tr);
                            if (record.statusCode !== 'Initial') {
                                $(tr).find(".k-button").remove();
                            }
                        });
                    },
                    customChange: function (grid) {
                        //$(".k-grid-print").show();
                        $(".k-grid-sub").hide();
                        $(".k-grid-submit").hide();
                        $(".k-grid-delete").hide();
                        $(".k-grid-repeal").hide();
                        var selected = WMS.GRIDUTILS.getCustomSelectedData($scope.receiptHeaderGrid);
                        if (selected.length > 0) {
                            var sub = 0, submit = 0, del = 0, size = selected.length;
                            $.each(selected, function () {
                                if (this.statusCode === 'Initial') {
                                    del++;
                                    submit++;
                                }
                                if (this.statusCode === 'Submitted' && this.receiptTypeCode !== 'CheckByQc') {
                                    sub++;
                                }
                            });
                            if (submit === size) {
                                $(".k-grid-submit").show();
                                $(".k-grid-delete").show();
                            }
                            if (sub === size) {
                                $(".k-grid-sub").show();
                                $(".k-grid-repeal").show();
                            }
                        } else {
                            $(".k-grid-sub").show();
                            $(".k-grid-delete").show();
                            $(".k-grid-submit").show();
                            $(".k-grid-repeal").show();
                        }
                    }
                }, $scope);

                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

                $scope.receiptGridOptions = WMS.GRIDUTILS.getGridOptions({
                    hasFooter: true,
                    pageable: false,
                    dataSource: {},
                    columns: receiptColumns,
                    widgetId: "receipt"
                }, $scope);

                //12-23版本 新入库扫描
                $scope.openScan = function (dataItem) {
                    $scope.isOverReceipt = false;//初始设置超收提权为false
                    if(dataItem.asnId===null||dataItem.asnId===""||!dataItem){
                        $scope.openScanOld(dataItem);
                        return;
                    }

                    //扫描收货
                    //1.收货GRID初始化
                    $("#fag").change(function () {
                        $("#unQualifiedReason").removeAttr("disabled");
                    });
                    var receiptGrid = $scope.receiptGrid;
                    var locationId;
                    var ds = new kendo.data.DataSource({
                        data: []
                    });
                    receiptGrid.setDataSource(ds);
                    // 入库单信息取得
//                    var selectView = WMS.GRIDUTILS.getCustomSelectedData(this.receiptHeaderGrid);
//                    if (selectView.length > 0) {
//                        var asnEntity = selectView[0];
                        $sync(window.BASEPATH + "/asns/sku/" + dataItem.asnId, "GET", {data: null})
                            .then(function (xhr) {
                                $scope.skuArr = xhr.result.skuArr;
                                $scope.totalCategoryQty = xhr.result.surplusItems;
                                $scope.receiptNum = xhr.result.surplusTotal;
                                $scope.scanPopup.refresh().open().maximize();
                                $("#scanModelLocationNo").select();
                                setTimeout(function () {
                                    $("#scanModelLocationNo").focus();
                                }, 500);
                            });
//                    } else {
//                        kendo.ui.ExtAlertDialog.showError("请选择到入库单！");
//                        return;
//                    }
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
                                "asnId": dataItem.id,
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

                    var setLotSelectProperty = function (v1, v2, v3) {
                        $scope.isByProduction = v1;
                        $("#lotSelectDiv").attr("disabled", v2);
                        $("#lotSelectDiv").css('display', v3);
                        $("#productionTimeDiv").attr("disabled", v2);
                        $("#productionTimeDiv").css('display', v3);

                    }
                    setLotSelectProperty(0, true, 'none', 0);
                    var changeBarcode = function () {
                        var sku = _.find($scope.skuArr, {
                            barcode: $scope.scanModel.barcode
                        });
                        if (sku) {
//                            $scope.$apply(function () {
                            $scope.scanModel.skuName = sku.itemName;
                            $scope.scanModel.skuImage = sku.imageUrl;
                            $scope.scanModel.description = dataItem.memo;
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
                                    "asnId": dataItem.asnId,
                                    "barcode": $scope.scanModel.barcode,
                                    "locationNo": $scope.scanModel.locationNo,
                                    "storerId": dataItem.storerId,
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
                                    $scope.receiveSku(dataItem, barcodeArray);
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
                                $scope.receiveSku(dataItem, barcodeArray);
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
                                                $scope.receiveSku(dataItem, barcodeArray);
                                            }

                                        }, function () {
                                            setLotSelectProperty(0, true, 'none');
                                            $scope.receiveSku(dataItem, barcodeArray);
                                        });
                                } else {
                                    setLotSelectProperty(0, true, 'none');
                                    $scope.receiveSku(dataItem, barcodeArray);
                                }
                                $scope.isCheckedLotStra = 0;
                                $scope.preBarcode = $scope.currentBarcode;
                                event.preventDefault();
                            } else {
                                $scope.isCheckedLotStra = 0;
                                $scope.receiveSku(dataItem, barcodeArray);
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


                $scope.receiveSku = function (receiptEntity, barcodeArray) {
                    $scope.isReceiveSku = true;
                    $scope.receiptId = receiptEntity.id;
                    $scope.storerId = receiptEntity.storerId;
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
                            kendo.ui.ExtAlertDialog.showError(_lotSelect + " 日期格式错误", $("#productionTime"));
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

                        if (productionTime == null || productionTime == 0) {
                            kendo.ui.ExtAlertDialog.showError(_lotSelect + " 日期格式错误", $("#productionTime"));
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
                        "asnId": receiptEntity.asnId,
                        "inventoryStatus": $('input[name="authentic_rad"]:checked').val(),
                        "locationNo": $scope.scanModel.locationNo,
                        "cartonNo": $scope.scanModel.cartonNo,
                        "barcode": $scope.scanModel.barcode,
                        "qty": $scope.scanModel.qty,
                        "description": $scope.scanModel.description,
                        "unQualifiedReason": unQualifiedReason,
                        "storerId": receiptEntity.storerId,
                        "productionTime": productionTime,
                        "isOverReceipt": $scope.isOverReceipt
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
                            $scope.receiptHeaderGrid.dataSource.read();
                            $scope.scanModel.qty = 1;
                            $("#scanModelBarcode").select();
                            setTimeout(function () {
                                $("#scanModelBarcode").focus();
                            }, 500);
                        });


                };

                //验证超收提权密码
                $scope.validateOverReceipt = function(){
                    $scope.isValidateOverReceipt = true;
                    var params = {
                        "orderTypeCode"     :   "Receipt",
                        "overReceiptValue"  :   $("#overReceiptValue").val(),
                        "sysKey"            :   "overReceipt",//硬代码，如果上线可能要改，或者数据库按照这个配
                        "id"                :   $scope.receiptId,
                        "storerId"          :   $scope.storerId
                    };
                    $sync(window.BASEPATH + "/receipt/overReceipt", "POST", {data: params}).then(function(xhr){
                        $scope.isOverReceipt = true;//超收标记，true
                        $scope.overReceiptPopup.close();//关闭提权弹出框
                        //焦点切换到数量
                        $("#scanModelQty").select();
                        setTimeout(function () {
                            $("#scanModelQty").focus();
                        }, 2500);
                    }, function(xhr){//提权密码错误

                    });
                }

                //confirm消息监听
                $scope.$on('confirmOK', function () {
                    if($scope.isReceiveSku === true){//扫描收货的监听
                        /***********提权操作 BEGIN***********/
                        $scope.overReceiptPopup.refresh().open().center();
                        $scope.overReceipt = {};
                        setTimeout(function () {
                            $("#overReceiptValue").focus();
                        }, 500);
                        $scope.isReceiveSku = false;
                        /***********提权操作   END***********/
                    }else if($scope.isValidateOverReceipt === true){
                        $scope.isValidateOverReceipt = false;
                    }else{//超收部分未超过超收比例是否确认提交收货
                        var id = getSelId();
                        var url = "";
                        var method = "";
                        if (!id) {
                            kendo.ui.ExtAlertDialog.showError("请选择一条数据");
                            return;
                        }
                        url = window.BASEPATH + "/receipt/" + id + "/status/false";
                        method = "PUT";
                        $sync(url, method)
                            .then(function (xhr) {
                                $scope.receiptHeaderGrid.dataSource.read({});
                            }, function (xhr) {
                                $scope.receiptHeaderGrid.dataSource.read({});
                            });
                    }
                });

                //明细信息
                var detailColumns = [
                    WMS.GRIDUTILS.CommonOptionButton("detail"),
//                    { filterable: false, title: '到货通知单行号', field: 'detailLineNo', align: 'left',width:"150px;"},
//                    { filterable: false, title: '批次号', field: 'lotKey', align: 'left',width:"120px"},
                    { filterable: false, title: 'SKU', field: 'skuSku', align: 'left', width: "120px;"},
                    { filterable: false, title: '商品条码', field: 'skuBarcode', align: 'left', width: "160px;"},
                    { filterable: false, title: '商品名称', field: 'skuItemName', align: 'left', width: "120px;"},
                    { filterable: false, title: '库存状态', field: 'inventoryStatusCode', template: WMS.UTILS.codeFormat('inventoryStatusCode', 'InventoryStatus'), align: 'left', width: "120px;"},
                    { filterable: false, title: '颜色', field: 'skuColorCode', template: WMS.UTILS.codeFormat('skuColorCode', 'SKUColor'), align: 'left', width: "120px;"},
                    { filterable: false, title: '尺寸', field: 'skuSizeCode', template: WMS.UTILS.codeFormat('skuSizeCode', 'SKUSize'), align: 'left', width: "120px;"},
                    { filterable: false, title: '货号', field: 'skuProductNo', align: 'left', width: "120px;"},
                    { filterable: false, title: '型号', field: 'skuModel', align: 'left', width: "120px;"},
                    { filterable: false, title: '货位', field: 'locationNo', align: 'left', width: "120px;", template: WMS.UTILS.locationFormat},
                    { filterable: false, title: '已收数量', field: 'receivedQty', align: 'left', width: "120px"},
                    { filterable: false, title: '箱号', field: 'cartonNo', align: 'left', width: "120px"},
                    { filterable: false, title: '托盘号', field: 'palletNo', align: 'left', width: "120px"},
                    { filterable: false, title: '净重(g)', field: 'netWeight', align: 'left', width: "120px"},
                    { filterable: false, title: '毛重(g)', field: 'grossWeight', align: 'left', width: "120px"},
                    { filterable: false, title: '体积(cm³)', field: 'cube', align: 'left', width: "120px"},
                    { filterable: false, title: '收货时间', field: 'receiptTime', align: 'left', width: "150px", template: WMS.UTILS.timestampFormat("receiptTime")},
                    { filterable: false, title: '批次号', field: 'lotKey', align: 'left', width: "120px"},
                    { filterable: false, title: '生产日期', field: 'productionTime', align: 'left', width: "150px", template: WMS.UTILS.timestampFormat("productionTime")},
                    { filterable: false, title: '过期日期', field: 'expiredTime', align: 'left', width: "150px", template: WMS.UTILS.timestampFormat("expiredTime")}
                ];
                detailColumns = detailColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.receiptDetailOptions = function (dataItem) {
                    var toolbar = [];
                    if (dataItem.statusCode !== 'Submitted') {
                        toolbar = [
                            { name: "create", text: "新增", className: "btn-auth-add-detail"},
                            { template: '<a class="k-button k-button-custom-command" ng-click="openScan(dataItem)">扫描</a>',
                                className: "btn-auth-scan-detail"},
                            { template: '<a class="k-button k-button-custom-command" ng-click="import($event,receiptHeaderGrid,dataItem)">导入</a>',
                                className: "btn-auth-scan-import"}
                        ];
                    }
                    var editQty;
                    return WMS.GRIDUTILS.getGridOptions({
                        widgetId: "detail",
                        dataSource: wmsDataSource({
                            url: headerUrl + "/" + dataItem.id + "/details",
                            callback: {
                                update: function (response, editData) {
                                    dataItem.set("totalQty", dataItem.get("totalQty") - editQty + editData.receivedQty);
                                    $scope.receiptHeaderGrid.expandRow($('tr[data-uid=' + dataItem.get('uid') + ']'));
                                    $scope.receiptHeaderGrid.dataSource.read();

                                },
                                create: function (response, editData) {
                                    dataItem.set("totalQty", dataItem.get("totalQty") + editData.receivedQty);
                                    $scope.receiptHeaderGrid.expandRow($('tr[data-uid=' + dataItem.get('uid') + ']'));
                                    $scope.receiptHeaderGrid.dataSource.read();
                                },
                                destroy: function (response, editData) {
                                    dataItem.set("totalQty", dataItem.get("totalQty") - editData.receivedQty);
                                    $scope.receiptHeaderGrid.expandRow($('tr[data-uid=' + dataItem.get('uid') + ']'));
                                    $scope.receiptHeaderGrid.dataSource.read();
                                }
                            },
                            schema: {
                                model: {
                                    id: "id",
                                    fields: {
                                        id: {type: "number", editable: false, nullable: true },
                                        inventoryStatusCode: {type: "String", defaultValue: "Good"}
                                    }
                                },
                                total: function (total) {
                                    return total.length > 0 ? total[0].total : 0;
                                }
                            },
                            otherData: {"receiptId": dataItem.id}
                        }),
                        toolbar: toolbar,
                        editable: {
                            mode: "popup",
                            window: {
                                width: "640px"
                            },
                            template: kendo.template($("#receiptDetailEditor").html())
                        },
                        columns: detailColumns,
                        edit: function (e) {//给库存状态赋初始值
                            //e.model.set("inventoryStatusCode", "Good") ;
                            editQty = e.model.receivedQty;
                        },
                        dataBound: function (e) {
                            var grid = this,
                                datas = grid.dataSource.data(),
                                trs = grid.tbody.find(">tr");
                            if (dataItem.statusCode !== 'Initial') {
                                grid.element.find(".k-button").remove();
                                _.each(trs, function (tr) {
                                    $(tr).find(".k-button").remove();
                                });
                            }
                        }
                    }, $scope);
                };

                function getSelId() {
                    var selectedData = WMS.GRIDUTILS.getCustomSelectedData($scope.receiptHeaderGrid);
                    var ids = [];
                    selectedData.forEach(function (value) {
                        ids.push(value.id);
                    });
                    var id = ids.join(",");
//                    console.log(id);
                    return id;
                }

                //操作日志
                $scope.logOptions = wmsLog.operationLog;

                $scope.$on("kendoRendered", function (e) {

                });


                $scope.$on("kendoWidgetCreated", function (event, widget) {
//                    console.log(widget);
                    if (widget.options !== undefined && widget.options.widgetId === 'detail') {
                        $scope.receiptDetailGrid = widget;
                        widget.bind("edit", function (e) {
                            $scope.editModel = e.model;
                        });
                    }
                    if (widget.options !== undefined && widget.options.widgetId === 'header') {
                        widget.bind("edit", function (e) {
                            $scope.editHeaderModel = e.model;
                            if (e.model.storerId != 0) {//修改不能修改商家 added by zw 6.19

                            }
                            if (e.model.totalQty == null || e.model.totalQty <= 0) {//还没收货，到货通知单可以修改
                                $("#asnId").bind("click", $scope.windowAsnOpen);
                                $("#asnId").removeClass("inputDisbled");
                            }
                            if (e.model.asnId != undefined && e.model.asnId != null) {//(如果是新增， e.model.asnId=undefined)选择了到货通知单，供应商，单据来源不可用
                                $("#supplierId").attr("disabled", true);
                                $("#supplierId").addClass("inputDisbled");
                                $("#fromTypeCode").attr("disabled", true);
                                $("#fromTypeCode").addClass("inputDisbled");
                                $("#referNo").attr("readonly", "readonly");
                                $("#referNo").addClass("inputDisbled");
                            }
                        });
                        //确认操作
                        $(".k-grid-sub").on('click', function (e) {
                            doRequest("sub");
                        });

                        //提交操作
                        $(".k-grid-submit").on('click', function (e) {
                            doRequest("submit");
                        });

                        //撤销操作
                        $(".k-grid-repeal").on('click', function (e) {
                            doRequest("cancel");
                        });

                        //删除操作
                        $(".k-grid-delete").on('click', function (e) {
                            doRequest("delete");
                        });

                        //请求后台controller
                        var doRequest = function (type) {
                            var id = getSelId();
                            var url = "";
                            var method = "";
                            if (!id) {
                                kendo.ui.ExtAlertDialog.showError("请选择一条数据");
                                return;
                            }
                            if (type === "sub") {//确认
                                url = window.BASEPATH + "/receipt/" + id + "/status/true";
                                method = "PUT";
                            } else if (type === "delete") {//批量删除
                                url = headerUrl + "/batch/" + id;
                                method = "DELETE";
                            } else if (type === "submit") {//批量提交
                                url = window.BASEPATH + "/receipt/" + id + "/otherstatus/Submitted";
                                method = "PUT";
                            } else if (type === "cancel") {//批量撤销
                                url = window.BASEPATH + "/receipt/" + id + "/otherstatus/Initial";
                                method = "PUT";
                            }
                            $sync(url, method)
                                .then(function (xhr) {
                                    $scope.receiptHeaderGrid.dataSource.read({});
                                });
                        };

                        //删除操作
                        $(".k-grid-print").on('click', function (e) {
                            $scope.print();
                        });

                    }
                });

                $scope.print = function () {
                    var receiptHeaderGrid = this.receiptHeaderGrid;
                    var selectView = WMS.GRIDUTILS.getCustomSelectedData(receiptHeaderGrid);
                    var selectedDataArray = _.map(selectView, function (view) {
                        return view.id;
                    });
                    var selectDataIds = selectedDataArray.join(",");
                    if (selectDataIds === "") {
                        kendo.ui.ExtAlertDialog.showError("请选择要打印的数据");
                        return;
                    }
                    wmsReportPrint.printReceiptByIds(selectDataIds);
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
                        WMS.UTILS.setValueInModel($scope.editModel, "skuSku", returnData.skuSku);
                        $scope.editModel.set("skuItemName", returnData.itemName);
                        $scope.editModel.set("sku", returnData.sku);
                        $scope.editModel.set("skuId", returnData.id);
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
                        $scope.editHeaderModel.set("supplierId", returnData.id);
                        $scope.editHeaderModel.set("supplierShortName", returnData.shortName);
                    };
                };


                $scope.windowAsnOpen = function () {
                    $scope.asnPopup.refresh().open().center();
                    $scope.asnPopup.initParam = function (subScope) {
                        subScope.param = $scope.editHeaderModel.storerId;
                    };
                    $scope.asnPopup.setReturnData = function (returnData) {
                        if (_.isEmpty(returnData)) {
                            $scope.editHeaderModel.set("referNo", "");
                            $scope.editHeaderModel.set("supplierId", "");
                            $scope.editHeaderModel.set("fromTypeCode", "");
                            return;
                        }
                        $("#referNo").attr("readonly", "readonly");
                        $("#referNo").addClass("inputDisbled");
                        $("#supplierId").data("kendoDropDownList").enable(false);
                        $("#fromTypeCode").parent().attr("disabled", true);//select设置禁用样式的方法，将父div禁用
                        $("#fromTypeCode").attr("disabled", true);
                        $("#fromTypeCode").addClass("inputDisbled");
                        $scope.editHeaderModel.set("referNo", returnData.referNo);
                        $scope.editHeaderModel.set("supplierId", returnData.vendorId);
                        $scope.editHeaderModel.set("fromTypeCode", returnData.fromTypeCode);
                        WMS.UTILS.setValueInModel($scope.editHeaderModel, "asnId", returnData.id);
                    };
                };

                //  旧的入库单扫描
                $scope.openScanOld = function (dataItem) {
                    $scope.scanPopupOld.setOptions({
                        activate: function () {
                            // 光标要直接显示在【货位】字段
                            $("#scanModelOldLocationNo").focus();
                            $("#scanModelOldInventoryStatus").change(function(){
                              $("#scanModelOldLocationNo").focus();
                            });
                            // 扫描完货位，敲回车，光标跳转到条码。
                            $("#scanModelLocationNo").off("keydown").on("keydown", function (event) {
                                if (event.which === 13) {
                                    //
                                    if($scope.scanModelOld.locationNo!=""){
                                        var params = {
                                            "receiptId": dataItem.id,
                                            "inventoryStatus": $scope.scanModelOld.inventoryStatus,
                                            "locationNo": $scope.scanModelOld.locationNo,
                                            "skuId":dataItem.skuId
                                        };
                                        $sync(window.BASEPATH + "/receipt/check", "GET", {data: params, wait:false})
                                            .then(function (xhr) {
                                                $("#scanModelOldBarcode").focus();
                                            },function(){
                                                $("#scanModelOldLocationNo").select();
                                                setTimeout(function () {
                                                    $("#scanModelOldLocationNo").focus();
                                                }, 500);
                                            });
                                    }
                                    $("#scanModelOldBarcode").focus();
                                    event.preventDefault();
                                }
                            });

                            var setLotSelectProperty = function(v1, v2, v3, v4) {
                                $scope.isByProduction = v1;
                                $("#oldLotSelectDiv").attr("disabled",v2);
                                $("#oldLotSelectDiv").css('display',v3);
//                                $("#productionTimeDiv").attr("disabled",v2);
//                                $("#productionTimeDiv").css('display',v3);
                                $scope.validdays = v4;
                            }
                            setLotSelectProperty(0, true, 'none', 0);
                            $scope.lotSelect = 'production';
                            var changeBarcode = function(event) {
                                var barcode = $scope.scanModelOld.barcode;
                                if (barcode != null && barcode.length > 0) {
                                    $sync(window.BASEPATH + "/goods/barcode/" + barcode + "/storer/" + dataItem.storerId, "GET", {wait:true})
                                            .then(function (xhr) {
                                                if (xhr.result == null) {
                                                    kendo.ui.ExtAlertDialog.showError("请输入正确的商品条码！", $("#scanModelOldBarcode"));
                                                    setLotSelectProperty(0, true, 'none', 0);
                                                    return;
                                                }
                                                if (xhr.result.lotStrategyHeaderEntity == null) {
                                                    setLotSelectProperty(0, true, 'none', 0);
                                                    $scope.scanConfirm(event);
                                                    return;
                                                }
                                                var obj = xhr.result.lotStrategyHeaderEntity.isByProductionTime;
                                                if (obj == 1) {
                                                    setLotSelectProperty(1, false, 'block', xhr.result.validdays);
                                                } else {
                                                    setLotSelectProperty(0, true, 'none', 0);
                                                }
                                                if ($rootScope.user.isMutiScan == 0) {
                                                    if ($scope.isByProduction === 1) {
                                                        $("#oldProductionTime").select();
                                                        setTimeout(function () {
                                                            $("#oldProductionTime").focus();
                                                        }, 500);
                                                    } else {
                                                        $scope.scanConfirm(event);
                                                    }
                                                } else {
                                                    $("#scanModelOldQty").focus();
                                                }
                                            }, function () {
                                                setLotSelectProperty(0, true, 'none', 0);
                                            });
                                }
                            }
                            $scope.isByProduction = 0;

                            $("#scanModelOldBarcode").off("change").on("change", function (event) {
                                changeBarcode(event);
                            });

                            // 扫完条码后，光标要跳转到数量。
                            $("#scanModelOldBarcode").off("keydown").on("keydown", function (event) {
                                if (event.which === 13) {
                                    changeBarcode(event);

                                    event.preventDefault();
                                }
                            });
                            // 手工输入数量后，敲回车，光标要跳转到【条码】同时清空数量，条码和箱号
                            $("#scanModelOldQty").off("keydown").on("keydown", function (event) {
                                if (event.which === 13) {
                                    if ($scope.isByProduction === 1) {
                                        $("#oldProductionTime").select();
                                        setTimeout(function () {
                                            $("#oldProductionTime").focus();
                                        }, 500);
                                    } else {
                                        $scope.scanConfirm(event);
                                    }

//                                    $("#scanModelBarcode").focus();
                                    event.preventDefault();
                                }
                            });

                            $("#oldProductionTime").off("keydown").on("keydown", function (event) {
                                if (event.which === 13) {
                                    $scope.scanConfirm(event);
                                    event.preventDefault();
                                }
                            });

                            // 输入箱号后，敲回车，光标仍然要跳转到【商品条码】字段，同时清空【箱号】字段
                            $("#scanModelOldCartonNo").off("keydown").on("keydown", function (event) {
                                if (event.which === 13) {
                                    $("#scanModelOldBarcode").focus();
                                    event.preventDefault();
                                }
                            });
                            // 人工将光标切换到【货位】时，要清空原有的货位、商品、箱号信息
                            $("#scanModelOldLocationNo").off("mousedown").on("mousedown", function (event) {
                                $("#scanModelOldLocationNo").val("");
                                $("#scanModelOldCartonNo").val("");
                                $("#scanModelOldBarcode").val("");
                                if ($rootScope.user.isMutiScan != 0) {
                                    $("#scanModelOldQty").val("");
                                }

                            });
                            // 人工将光标切换到【货位】时，要清空原有的货位、商品、箱号信息
                            $("#scanModelOldInventoryStatus").off("mousedown").on("mousedown", function (event) {
                                $("#scanModelOldLocationNo").val("");
                                $("#scanModelOldCartonNo").val("");
                                $("#scanModelOldBarcode").val("");
                                if ($rootScope.user.isMutiScan != 0) {
                                    $("#scanModelQty").val("");
                                }
                            });
                        }
                    });
                    $scope.scanPopupOld.refresh().open().center();

                    $scope.scanModelOld = {};
                    $scope.scanModelOld.headerId = dataItem.id;
                    $scope.scanModelOld.asnId = dataItem.asnId;
                    $scope.scanModelOld.storerId = dataItem.storerId;
                    //设置默认值
                    $scope.scanModelOld.inventoryStatus = {"key": "正品", "value": "Good"};
                    $scope.scanModelOld.lotSelect = 'production';
                    if ($rootScope.user.isMutiScan == 0) {
                        $("#qty").hide();
                        $scope.scanModelOld.qty = 1;
                    }

                };


                $scope.scanConfirm = function (e) {
                    var formValidator = $(e.target).parents(".k-edit-form-container").kendoValidator({ validateOnBlur: false }).data("kendoValidator");
                    if (!formValidator.validate()) {
                        return;
                    }

                    var productionTime = 0;
                    if ($scope.isByProduction === 1) {
                        var _lotSelect = $("#oldLotSelect").find("option:selected").text();
                        var _productionTime = $("#oldProductionTime").val().trim();
                        var re = /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/;
                        if (!re.test(_productionTime)) {
                            kendo.ui.ExtAlertDialog.showError(_lotSelect+" 日期格式错误", $("#oldProductionTime"));
                            return;
                        }

                        if (_productionTime == null || _productionTime == '') {
                            kendo.ui.ExtAlertDialog.showError("请选择" + _lotSelect, $("#oldProductionTime"));
                            return;
                        }

                        var expiry = $("#oldLotSelect").val();
                        if (expiry === 'expiry') {
                            var productionDate = new Date(_productionTime);
                            productionDate.setDate(productionDate.getDate() - $scope.validdays);
                            productionTime = productionDate.getTime();
                        } else {
                            productionTime = _productionTime;
                        }

                        if (productionTime == null || productionTime==0) {
                            kendo.ui.ExtAlertDialog.showError(_lotSelect+" 日期格式错误", $("#oldProductionTime"));
                            return;
                        }
                    } else {
                        productionTime = 0;
                    }

                    var inventoryStatus = "";
                    if ($scope.scanModelOld.inventoryStatus) {
                        inventoryStatus = $scope.scanModelOld.inventoryStatus.value;
                    }
                    var params = {
                        "asnId": $scope.scanModelOld.asnId,
                        "inventoryStatus": inventoryStatus,
                        "locationNo": $scope.scanModelOld.locationNo,
                        "cartonNo": $scope.scanModelOld.cartonNo,
                        "barcode": $scope.scanModelOld.barcode,
                        "qty": $scope.scanModelOld.qty,
                        "storerId": $scope.scanModelOld.storerId,
                        "productionTime": productionTime
                    };
                    //扫描收货
                    $sync(window.BASEPATH + "/receipt/" + $scope.scanModelOld.headerId + "/scanningReceipt", "POST", {data: params})
                        .then(function (xhr) {
                            var headerId = $scope.scanModelOld.headerId;
                            var asnId = $scope.scanModelOld.asnId;
                            var storerId = $scope.scanModelOld.storerId;

                            //清空页面信息
                            $scope.scanModelOld.cartonNo = "";
                            $scope.scanModelOld.barcode = "";
                            $scope.scanModelOld.qty = "";
                            //恢复初始信息
                            $scope.scanModelOld.headerId = headerId;
                            $scope.scanModelOld.asnId = asnId;
                            $scope.scanModelOld.storerId = storerId;
                            $scope.scanModelOld.inventoryStatus = {"key": "正品", "value": "Good"};
                            if ($rootScope.user.isMutiScan == 0) {
                                $scope.scanModelOld.qty = 1;
                            }
                            //刷新headerGrid
                            //$scope.receiptHeaderGrid.dataSource.read();
                            //刷新detailGrid
                            $.when($scope.receiptDetailGrid.dataSource.read()).done(function () {
                                // 录入非良品时，光标到货位
                                if (params.inventoryStatus !== "Good") {
                                    $scope.scanModelOld.locationNo = "";
                                    $("#scanModelOldLocationNo").val("");
                                    $("#scanModelOldLocationNo").focus();
                                } else {
                                    // 光标到商品条码
                                    $("#scanModelOldBarcode").focus();
                                }
                            });
                        }, function(){
                            $("#scanModelOldBarcode").select();
                            setTimeout(function () {
                                $("#scanModelOldBarcode").focus();
                            }, 500);
                        });
                };

                $scope.scanClose = function () {
                    $scope.isValidateOverReceipt = false;
                    $scope.scanModelOld = {};
                    $scope.scanPopupOld.close();
                };


                ////添加导入信息
                $scope.import = function (ev, grid, data) {
                    ev.preventDefault();
                    var targetScope = grid.$angular_scope,
                        importWindow = grid.$angular_scope.importWindow;
                    targetScope.fileName = '';
                    var uploader = targetScope.uploader = new FileUploader({
                        url: window.BASEPATH + "/receipt/import?headerId=" + data.id,
                        alias: 'file',
                        removeAfterUpload: true
                    });
                    uploader.onAfterAddingFile = function (item) {
                        targetScope.fileName = item.file.name;
                        $('.js_operationResult').hide();
                    };
                    uploader.onSuccessItem = function (fileItem, response, status, headers) {
                        console.info('onSuccessItem', fileItem, response, status, headers);
                        if (response.suc) {
                            grid.dataSource.read();
                            importWindow.close();
                            kendo.ui.ExtAlertDialog.showError("导入成功");
                        } else {
                            if (typeof(response.result) == 'object') {
                                $('.js_operationResult').show();
                                var errLogData = _.map(response.result, function (record) {
                                    for (var key in record) {
                                        if (record.hasOwnProperty(key)) {
                                            return {id: key, message: record[key]};
                                        }
                                    }
                                });
                                $("#importListGrid").kendoGrid({
                                    columns: [
                                        {
                                            field: "id",
                                            filterable: false,
                                            width: 30,
                                            attributes: {style: 'text-align: center;'},
                                            title: 'ID'
                                        },
                                        {
                                            field: "message",
                                            filterable: false,
                                            width: 70,
                                            title: '错误信息'
                                        }
                                    ],
                                    height: 150,
                                    dataSource: errLogData
                                });
                            }
                        }
                    };
                    uploader.onErrorItem = function (fileItem, response, status, headers) {
                        kendo.ui.ExtAlertDialog.showError("导入失败");
                    };
                    // 打开文件导入window
                    importWindow.setOptions({
                        width: "830",
                        title: "入库明细导入",
                        modal: true,
                        actions: ["Close"],
                        content: {
                            template: kendo.template($('#J_fileForm').html())
                        },
                        open: function () {
                            $('.js_operationResult').hide();
                        }
                    });
                    importWindow.refresh().center().open();

                    targetScope.uploadFile = function () {
                        $.when(kendo.ui.ExtOkCancelDialog.show({
                                title: "确认/取消",
                                message: "确定导入？",
                                icon: "k-ext-question" })
                        ).done(function (response) {
                                if (response.button === "OK") {
                                    uploader.uploadAll();
                                }
                            });
                    };
                };

                //根据货区(zoneId) 查询货位 zw
//                $scope.getLocationData = function(){
//                    var zoneId = $("#zoneNo").val();
//                    $sync(window.BASEPATH + "/location/allLocations/" + zoneId, "GET")
//                        .then(function (xhr) {
//                            $scope.cascadeLocationData = xhr.result;
//                        });
//                };


            }]);

})