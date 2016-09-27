define(['scripts/controller/controller'], function (controller) {
    "use strict";
    controller.controller('warehouseOutDeliverController', ['$scope', '$http', 'wmsDataSource', 'url', 'sync', 'wmsLog',
        function ($scope, $http, wmsDataSource, $url, $sync, wmsLog) {
            var deliverHeaderUrl = "/dns";
            var devliverColumns = [
                    { filterable: false, title: '通知单号', field: 'id', align: 'left', width: "100px"} ,
                    { filterable: false, title: 'order', field: 'order', hidden: true, align: 'left'},
                    { filterable: false, title: 'invoice', field: 'invoice', hidden: true, align: 'left'},
                    { filterable: false, title: '数据来源', field: 'datasourceCode', align: 'left', width: "100px", template: WMS.UTILS.codeFormat('datasourceCode', 'DataSource')},
                    { filterable: false, title: '订单来源', field: 'fromtypeCode', align: 'left', width: "100px", template: WMS.UTILS.codeFormat('fromtypeCode', 'ShipmentFrom')},
                    { filterable: false, title: '仓库名称', field: 'warehouseId', align: 'left', width: "100px", template: WMS.UTILS.whFormat} ,
                    { filterable: false, title: '商家名称', field: 'storerId', align: 'left', width: "100px", template: WMS.UTILS.storerFormat} ,
                    { filterable: false, title: '店铺名称', field: 'shopName', align: 'left', width: "175px"} ,
                    { filterable: false, title: '分销商', field: 'distributorName', align: 'left', width: "100px"},
                    { filterable: false, title: '参考单号', field: 'referNo', align: 'left', width: "200px"},
                    { filterable: false, title: '交易单号', field: 'tradeNos', align: 'left', width: "100px"} ,
                    { filterable: false, title: '单据状态', field: 'statusCode', template: WMS.UTILS.codeFormat('statusCode', "TicketStatus"), align: 'left', width: "100px"} ,
                    { filterable: false, title: '单据状态Id', field: 'orderId', hidden: true, align: 'left'} ,
                    { filterable: false, title: 'ERP单号', field: 'fromErpNo', align: 'left', width: "120px;"},
                    { filterable: false, title: '下单时间', field: 'orderTime', template: WMS.UTILS.timestampFormat("orderTime", "yyyy-MM-dd HH:mm:ss"), align: 'left', width: "150px"},
                    { filterable: false, title: '付款时间', field: 'paymentTime', template: WMS.UTILS.timestampFormat("paymentTime", "yyyy-MM-dd HH:mm:ss"), align: 'left', width: "150px"},
                    { filterable: false, title: '期望发货时间', field: 'expectedDate', template: WMS.UTILS.timestampFormat("expectedDate", "yyyy-MM-dd HH:mm:ss"), align: 'left', width: "150px"},
                    { filterable: false, title: '审核人', field: 'auditUser', align: 'left', width: "100px"} ,
                    { filterable: false, title: '取消', field: 'isCancelled', template: WMS.UTILS.checkboxDisabledTmp("isCancelled"), align: 'left', width: "75px"} ,
                    { filterable: false, title: '物流公司', field: 'carrierNo', template: WMS.UTILS.carrierFormat, align: 'left', width: "100px"},
                    { filterable: false, title: '货到付款', field: 'isCod', template: WMS.UTILS.checkboxDisabledTmp("isCod"), align: 'left', width: "100px" } ,
                    { filterable: false, title: '邮费', field: 'postfee', hidden: true, align: 'left', width: "75px"} ,
                    { filterable: false, title: '邮费付款方式', field: 'postPayTypecode', template: WMS.UTILS.codeFormat("postPayTypecode", "PostPayTypeCode"), align: 'left', width: '100px'},
                    { filterable: false, title: '开发票', field: 'isNeedInvoice', template: WMS.UTILS.checkboxDisabledTmp("isNeedInvoice"), align: 'left', width: "200px"},
                    { filterable: false, title: '收货人', field: 'receiverName', align: 'left', width: "100px"} ,
                    { filterable: false, title: '省', field: 'stateName', align: 'left', width: "100px"} ,
                    { filterable: false, title: '城市', field: 'cityName', align: 'left', width: "100px"},
                    { filterable: false, title: '备注', field: 'order.orderMemo', align: 'left', width: "200px",
                        template:function(dataItem) {return WMS.UTILS.tooLongContentFormat(dataItem,'orderMemo');}
                    },
                    WMS.UTILS.CommonColumns.defaultColumns
                ],


                devliverDataSource = wmsDataSource({
                    url: deliverHeaderUrl,
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

            //操作日志
            $scope.logOptions = wmsLog.operationLog;

            devliverColumns = devliverColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
            devliverColumns.splice(0, 0, WMS.UTILS.CommonColumns.checkboxColumn);
            $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                dataSource: devliverDataSource,
                sortable: true,
                toolbar: [
                    { name: "sub", text: "提交", className: "btn-auth-submit"}
                ],
                columns: devliverColumns,
                filterable: true,
                widgetId: "header"
            }, $scope);

            $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
            $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

            //明细信息
            var detailColumns = [
                // WMS.GRIDUTILS.CommonOptionButton("detail"),
                { title: 'DN行号', field: 'detaiLlineNo', align: 'left', width: "120px;"},
                { title: '参考行号', field: 'referLineNo', align: 'left', width: "120px;"},
                { title: 'SKU编码', field: 'sku', align: 'left', width: "120px;"},
                { title: '商品条码', field: 'barcode', align: 'left', width: "160px;"},
                { title: '商品名称', field: 'itemName', align: 'left', width: "120px;"},
                { title: '数量', field: 'qty', align: 'left', width: "120px;"},
                { title: '型号', field: 'skuModel', align: 'left', width: "120px;"},
                { field: "inventoryStatusCode", title: "库存状态", template: WMS.UTILS.codeFormat("inventoryStatusCode", "InventoryStatus"), width: "120px" },
                { title: '单价', field: 'price', align: 'left', width: "120px"},
                { title: '实际单价', field: 'amount', align: 'left', width: "120px"},
                { title: '实付金额', field: 'payment', align: 'left', width: "120px"},
                { title: '折扣金额', field: 'discountFee', align: 'left', width: "120px"},
                { title: '优惠金额', field: 'adjustFee', align: 'left', width: "120px"}
            ];
            detailColumns = detailColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
            $scope.dnDetailOptions = function (dataItem) {
                return WMS.GRIDUTILS.getGridOptions({
                    moduleName: "detail",
                    dataSource: wmsDataSource({
                        url: deliverHeaderUrl + "/" + dataItem.id + "/details",
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
                        otherData: {"dnId": dataItem.id}
                    }),
                    // toolbar: [{ name: "create", text: "新增"}],
                    editable: {
                        mode: "popup",
                        window: {
                            width: "630px"
                        },
                        template: kendo.template($("#dnDetail-editor").html())
                    },
                    columns: detailColumns,
//                    dataBound: function(e) {
//                        var grid = this,
//                            trs = grid.tbody.find(">tr");
//                        if (dataItem.statusCode ==='Submitted') {
//                            grid.element.find(".k-grid-add").remove();
//                            _.each(trs, function(tr,i){
//                                $(tr).find(".k-button").remove();
//                            });
//                        }
//
//
//                    },
                    widgetId: "detail"
                }, $scope);
            };


            function getSelId() {
                var grid = $scope.dnHeaderGrid;
                var selectedData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                var ids = [];
                selectedData.forEach(function (value) {
                    ids.push(value.id);
                });

                var id = ids.join(",");
                return id;
            }

            //grid渲染结束后添加toolbar的事件绑定
            $scope.$on("kendoWidgetCreated", function (event, widget) {
                if (widget.options !== undefined && widget.options.widgetId === 'detail') {
                    widget.bind("edit", function (e) {
                        $scope.editModel = e.model;
                    });
                }
                if (widget.options !== undefined && widget.options.widgetId === 'header') {
                    //提交操作
                    $(".k-grid-sub").on('click', function (e) {
                        //TODO 1.校验是否已经提交
                        var ids = getSelId();
                        if (ids == '') {
                            kendo.ui.ExtAlertDialog.showError("请选择一条记录进行提交");
                            return;
                        }
                        var url = deliverHeaderUrl + "/submit/" + ids;
                        $sync(window.BASEPATH + url, "PUT")
                            .then(function (xhr) {
                                $scope.dnHeaderGrid.dataSource.read({});
                            }, function (xhr) {
                                $scope.dnHeaderGrid.dataSource.read({});
                            });

                    });
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
                    $scope.editModel.set("itemName", returnData.itemName);
                    $scope.editModel.set("boxsize", returnData.boxsize);
                    $scope.editModel.set("sku", returnData.sku);
                    $scope.editModel.set("skuId", returnData.id);
                };
            };


        }]);


});

