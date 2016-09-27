define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('warehouseOutShipmentWaveController',
        ['$scope','$rootScope','sync','wmsDataSource','wmsLog','wmsReportPrint',
            function($scope, $rootScope, $sync, wmsDataSource,wmsLog,wmsReportPrint) {

                $scope.order = {};
                $scope.invoice = {};
                $scope.selectData = [];

                var shipmentUrl = "/warehouse/out/wave/shipments",
                    shipmentBasicUrl = "/shipment/basic",
                    waveUrl = "/warehouse/out/wave",

                    headerColumns = [
                        { filterable: false, title: '数据来源', field: 'datasourceCode', align: 'left',width:"120px;",template:WMS.UTILS.codeFormat('datasourceCode','DataSource')},
                        { filterable: false, title: '订单来源', field: 'fromtypeCode', align: 'left',width:"120px;",template:WMS.UTILS.codeFormat('fromtypeCode','ShipmentFrom')},
                        { filterable: false, title: '出库单号', field: 'id', align: 'left',width:"120px;"},
                        { filterable: false, title: '通知单号', field: 'dnId', align: 'left',width:"120px;"},
                        { filterable: false, title: '参考单号', field: 'referNo', align: 'left',width:"120px;"},
                        { filterable: false, title: 'ERP单号', field: 'fromErpNo', align: 'left',width:"120px;"},
                        { filterable: false, title: '交易单号', field: 'tradeNos', align: 'left',width:"120px;"},
                        { filterable: false, title: '仓库名称', field: 'warehouseId', align: 'left',width:"120px;", template: WMS.UTILS.whFormat},
                        { filterable: false, title: '商家名称', field: 'storerId', align: 'left',width:"120px;", template: WMS.UTILS.storerFormat},
                        { filterable: false, title: '波次单号', field: 'waveId', align: 'left',width:"120px;"},
                        { filterable: false, title: '波次序号', field: 'waveSeq', align: 'left',width:"120px;"},
                        { filterable: false, title: '拣货货区', field: 'defaultZoneNo', align: 'left',width:"120px;"},
                        { filterable: false, title: '拣货货位', field: 'defaultLocationNo', align: 'left',width:"120px;"},
                        { filterable: false, title: '活动名称', field: 'promotionId', align: 'left',width:"120px;"},
                        { filterable: false, title: '店铺名称', field: 'shopName', align: 'left',width:"120px"},
                        { filterable: false, title: '分销商', field: 'distributorName', align: 'left',width:"120px"},
                        { filterable: false, title: '会员', field: 'buyerName', align: 'left',width:"120px"},
                        { filterable: false, title: '收货人', field: 'receiverName', align: 'left',width:"120px"},
                        { filterable: false, title: 'OMS取消', field: 'isCancelled',template:WMS.UTILS.checkboxDisabledTmp("isCancelled"), align: 'left',width:"120px"},
                        { filterable: false, title: 'WMS拒单', field: 'isClosed',template:WMS.UTILS.checkboxDisabledTmp("isClosed"), align: 'left',width:"120px"},
                        { filterable: false, title: '单据状态', field: 'statusCode',template:WMS.UTILS.codeFormat("statusCode","TicketStatus"), align: 'left',width:"120px"},
                        { filterable: false, title: '分配状态', field: 'allocateStatuscode',template:WMS.UTILS.codeFormat("allocateStatuscode","OrderOperationStatus"), align: 'left',width:"120px"},
                        { filterable: false, title: '拣货状态', field: 'pickStatuscode',template:WMS.UTILS.codeFormat("pickStatuscode","OrderOperationStatus"), align: 'left',width:"120px"},
                        { filterable: false, title: '复核状态', field: 'checkStatuscode',template:WMS.UTILS.codeFormat("checkStatuscode","OrderOperationStatus"), align: 'left',width:"120px"},
                        { filterable: false, title: '打包状态', field: 'packageStatuscode',template:WMS.UTILS.codeFormat("packageStatuscode","OrderOperationStatus"), align: 'left',width:"120px"},
                        { filterable: false, title: '称重状态', field: 'weightStatuscode',template:WMS.UTILS.codeFormat("weightStatuscode","OrderOperationStatus"), align: 'left',width:"120px"},
                        { filterable: false, title: '发货状态', field: 'deliveryStatuscode',template:WMS.UTILS.codeFormat("deliveryStatuscode","OrderOperationStatus"), align: 'left',width:"120px"},
                        { filterable: false, title: '交接状态', field: 'handoverStatuscode',template:WMS.UTILS.codeFormat("handoverStatuscode","OrderOperationStatus"), align: 'left',width:"120px"},
                        { filterable: false, title: '是否开发票', field: 'isNeedInvoice',template:WMS.UTILS.checkboxDisabledTmp("isNeedInvoice"), align: 'left',width:"120px"},
                        { filterable: false, title: '发票抬头', field: 'invoiceTitle', align: 'left',width:"120px"},
                        { filterable: false, title: '发票号', field: 'invoiceNo', align: 'left',width:"120px"},
                        { filterable: false, title: '优先发货', field: 'isUrgent',template:WMS.UTILS.checkboxDisabledTmp("isUrgent"),align: 'left',width:"120px"},
                        { filterable: false, title: '是否货到付款', field: 'isCod',template:WMS.UTILS.checkboxDisabledTmp("isCod"), align: 'left',width:"120px"},
                        { filterable: false, title: '订单日期', field: 'orderTime',template:WMS.UTILS.timestampFormat("orderTime","yyyy-MM-dd"),align: 'left',width:"120px"},
                        { filterable: false, title: '支付时间', field: 'paymentTime',template:WMS.UTILS.timestampFormat("paymentTime","yyyy-MM-dd"), align: 'left',width:"120px"},
                        { filterable: false, title: '承运商', field: 'carrierCode',template:WMS.UTILS.codeFormat("carrierCode","Carrier"), align: 'left',width:"120px"},
                        { filterable: false, title: '物流单号', field: 'carrierReferNo', align: 'left',width:"120px"},
                        { filterable: false, title: '总数量', field: 'totalQty', align: 'left',width:"120px"},
                        { filterable: false, title: 'SKU品种数', field: 'totalCategoryQty', align: 'left',width:"120px"},
                        { title: '物流单打印', field: 'isPrintexpress',template:WMS.UTILS.checkboxDisabledTmp("isPrintexpress"),align: 'left',width:"120px" },
                        { title: '发货单打印', field: 'isPrintdelivery',template:WMS.UTILS.checkboxDisabledTmp("isPrintdelivery"),align: 'left',width:"120px" },
                        { title: '拣货单打印', field: 'isPrintPicking',template:WMS.UTILS.checkboxDisabledTmp("isPrintPicking"),align: 'left',width:"120px" }


                    ],

                    headerDataSource = wmsDataSource({
                        url: shipmentUrl,
                        schema: {
                            model: {
                                id:"id",
                                fields: {
                                    id: {type:"number", editable: false, nullable: true },
                                    isNeedInvoice: {type:"boolean", editable: true, nullable: true },
                                    isUrgent: {type:"boolean", editable: true, nullable: true },
                                    isCod: {type:"boolean", editable: true, nullable: true },
                                    isCancelled:{type:"boolean", editable: true, nullable: true },
                                    isClosed:{type:"boolean", editable: true, nullable: true },
                                    isPrintsku:{type:"boolean", editable: true, nullable: true },
                                    invoiceTypeCode:{type:"string", editable: true, nullable: true },
                                    company:{type:"string", editable: true, nullable: true },
                                    fromtypeCode:{type:"string"},
                                    order:{type:""},
                                    shopNo:{type:"string",defaultValue:""}
                                }
                            },
                            total: function(total) {
                                return total.length > 0 ? total[0].total : 0;
                            }
                        },
                        otherData:{"order":$scope.order,"invoice":$scope.invoice}
                    });


                headerColumns = headerColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                headerColumns.splice(0,0,WMS.UTILS.CommonColumns.checkboxColumn);
                $scope.shipmentGridOptions =WMS.GRIDUTILS.getGridOptions({
                    dataSource: headerDataSource,
                    toolbar: [
                        { name: "generateWave", text: "生成波次",className:"btn-auth-generateWave"},
                        { template:'<span style="margin-left: 5px;">当前选中<span id="statusBar">0</span>条数据,总数量为<span id="totalQty">0</span></span>'}
                    ],
                    columns: headerColumns,
                    editable: {
                        mode: "popup",
                        window:{
                            width:"600px"
                        },
                        template: kendo.template($("#shipment-editor").html())
                    },
                    moudleName:'出库单',
                    widgetId: "header",
                    edit: function(e){
                    },
                    autoBind:false,
                    customChange: function (grid) {
                        var selecteData = WMS.GRIDUTILS.getCustomSelectedData($scope.shipmentWaveGrid);
                        if(selecteData.length){
                            $("#statusBar").text(selecteData.length);
                            var  totalSum = 0;
                            $(selecteData).each(function(){
                                if(typeof(this.totalQty) == "number" && typeof(this.totalCategoryQty) == "number"){
                                    totalSum+=this.totalQty;
                                }else{
                                    $("#totalQty").text(0);
                                }
                            });
                            $("#totalQty").text(totalSum);

                        }else{
                            $("#statusBar").text(0);
                            $("#totalQty").text(0);
                        }

                    }

                }, $scope);

                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;
                //基本信息
                $scope.shipmentBaseOptions = function(dataItem){
                    $sync(shipmentBasicUrl+"/"+dataItem.id,
                        "GET").then(function (xhr) {
                            dataItem.basicInfo = xhr.result;
                        });
                };



                //出库单详细
                var  detailColumns = [
                    WMS.GRIDUTILS.CommonOptionButton("detail"),
                    { field: "referLineNo", title: "参考行号", width: "120px" },
                    { field: "zoneTypeCode", title: "货区类型",template:WMS.UTILS.codeFormat('zoneTypeCode','ZoneType'), width: "120px" },
                    { field: "skuSku", title: "SKU编码", width: "120px" },
                    { field: "skuItemName", title: "商品名称", width: "120px" },
                    { field: "skuModel", title: "型号", width: "120px" },
                    { field: "orderedQty", title: "期望数量", width: "120px" },
                    { field: "allocatedQty", title: "分配数量", width: "120px" },
                    { field: "pickedQty", title: "拣货数量", width: "120px" },
                    { field: "shippedQty", title: "出库数量", width: "120px" },
                    { field: "inventoryStatus", title: "库存状态",template:WMS.UTILS.codeFormat("inventoryStatus","InventoryStatus"), width: "120px" },
                    { field: "amount", title: "实际单价", width: "120px" },
                    { field: "dnDetailId", title: "来源单号", width: "120px" },
                    { field: "grossweight", title: "毛重", width: "120px" },
                    { field: "netweight", title: "净重", width: "120px" },
                    { field: "cube", title: "体积", width: "120px" },
                    { field: "lotkey", title: "批次号", width: "120px" },
                    { field: "lotattribute06", title: "唯一码", width: "120px" },
                    { field: "lotattribute07",template:WMS.UTILS.timestampFormat("lotattribute07","yyyy-MM-dd"), title: "生产日期", width: "120px" },
                    { field: "lotattribute08",template:WMS.UTILS.timestampFormat("lotattribute08","yyyy-MM-dd"), title: "到期日期", width: "120px" }
                ];

                $scope.shipmentDetailOptions = function(dataItem) {
                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource: wmsDataSource({
                            url:"/shipment/"+dataItem.id+"/detail",
                            schema: {
                                model: {
                                    id:"id",
                                    fields: {
                                        id: {type:"number", editable: false, nullable: true },
                                        zoneId:{type:"string"},
                                        locationId:{type:"string"},
                                        inventoryStatus:{type:"string",defaultValue:"Good"}
                                    }
                                },
                                total: function(total) {
                                    return total.length > 0 ? total[0].total : 0;
                                }
                            },
                            otherData:{"shipmentId":dataItem.id}
                        }),
                        toolbar: [{ name: "create", text: "新增"}],
                        editable: {
                            mode: "popup",
                            window:{
                                width:"600px"
                            },
                            template: kendo.template($("#shipmentDetail-editor").html())
                        },
                        columns: detailColumns,
                        widgetId:"detail",
                        dataBound: function(e) {
                            var grid = this,
                                trs = grid.tbody.find(">tr");
                            if (dataItem.statusCode !== "Initial") {
                                grid.element.find(".k-grid-add").remove();
                                _.each(trs, function(tr,i){
                                    $(tr).find(".k-button").remove();
                                });
                            }

                        }
                    }, $scope);
                };

                //分配结果列
                var allocateColumns = [
                    { title: '波次单号', field: 'waveId', align: 'left',width:"120px"},
                    { title: '出库单号', field: 'shipmentId', align: 'left',width:"120px"},
                    { title: '仓库名称', field: 'warehouseId', align: 'left',width:"120px;", template: WMS.UTILS.whFormat},
                    { title: '货位', field: 'locationNo',align: 'left',width:"120px"},
                    { title: '托盘号', field: 'palletNo', align: 'left',width:"120px"},
                    { title: '箱号', field: 'cartonNo',align: 'left',width:"120px"},
                    { title: '商品', field: 'skuItemName', align: 'left',width:"120px"},
                    { title: '分配数量', field: 'allocatedQty', align: 'left',width:"120px"},
                    { title: '拣货数量', field: 'pickedQty', align: 'left',width:"120px"},
                    { title: '操作员编号', field: 'loginName', align: 'left',width:"120px"},
                    { title: '操作员', field: 'userName', align: 'left',width:"120px"}
                ];

                allocateColumns = allocateColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);


                //分配结果
                $scope.allocateOptios = function(dataItem){
                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource: wmsDataSource({
                            url: waveUrl+"/"+dataItem.id+"/1/allocateResult",
                            schema: {
                                model: {
                                    id:"id",
                                    fields: {
                                        id: {type:"number", editable: false, nullable: true }
                                    }
                                },
                                total: function(total) {
                                    return total.length > 0 ? total[0].total : 0;
                                }
                            },
                            otherData:{"waveId":dataItem.id}
                        }),
                        editable: {
                            mode: "popup",
                            window:{
                                width:"600px"
                            },
                            template: kendo.template($("#allocateDetail-editor").html())
                        },
                        columns: allocateColumns
                    }, $scope);
                }


                //操作日志
                $scope.logOptions = wmsLog.operationLog;

                //异常反馈
                $scope.refusedOrderConfirm = function(){
                    var ids = getCurrentIds();
                    var url = shipmentUrl + "/close/" + ids;
                    $sync(window.BASEPATH + url, "PUT",{data:{"memo": $scope.shipmentModel.memo}})
                        .then(function (xhr) {
                            $scope.shipmentWaveGrid.dataSource.read({});
                            $scope.refusedOrderPopup.close();
                        }, function (xhr) {
                            $scope.shipmentWaveGrid.dataSource.read({});
                            $scope.refusedOrderPopup.close();
                        });
                };
                //关闭弹出层
                $scope.refusedOrderClose = function(){
                    $scope.refusedOrderPopup.close();
                };


                $scope.windowOpen = function(parentGrid){
                    var parentId = parentGrid.$parent.dataItem.storerId;
                    $scope.skuPopup.initParam = function (subScope) {
                        subScope.param = parentId;
                    };
                    $scope.skuPopup.refresh().open().center();
                    $scope.skuPopup.setReturnData = function(returnData){
                        console.log(returnData);
                        if (_.isEmpty(returnData)) {
                            return;
                        }
                        $("#skuSku").val(returnData.sku);
                        $scope.editModel.set("skuSku", returnData.sku);
                        $scope.editModel.set("grossweight", returnData.grossweight);
                        $scope.editModel.set("netweight", returnData.netweight);
                        $scope.editModel.set("skuId", returnData.id);
                        $scope.editModel.set("cube", returnData.cube);
                        $scope.editModel.set("orderedQty",0);
                    };
                };

                //获取当前选中的ID
                function getCurrentIds(){
                    var grid = $scope.shipmentWaveGrid;
                    var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                    var ids = [];
                    selectData.forEach(function(data){
                        ids.push(data.id);
                    });
                    var id = ids.join(",");
                    return id;
                }

                //判断多个商家是否能生成波次
                function isGenerateWave(){
                    var grid = $scope.shipmentWaveGrid;
                    var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                    var storeIds = 0;
                    var flag = true;
                    selectData.forEach(function(data){
                        if(0===storeIds){
                            storeIds = data.storerId;
                        }
                        if(storeIds !== data.storerId){
                            kendo.ui.ExtAlertDialog.showError("不同商家下的出库单不能生成到同一波次下");
                            $scope.shipmentWaveGrid.dataSource.read({});
                            flag = false;
                        }
                    });
                    return flag;
                }


                    $scope.$on("kendoWidgetCreated", function (event, widget) {

                    if (widget.options !== undefined && widget.options.widgetId === 'detail') {
                        widget.bind("edit", function (e) {
                            $scope.editModel = e.model;
                        });
                    }


                    if (widget.options !== undefined && widget.options.widgetId === 'header') {
                        widget.bind("edit", function (e) {
                            if(!e.model.order){
                                e.model.order = {shopNo:"",isCod:""};
                            }
                            if(!e.model.invoice){
                                e.model.invoice = {invoiceTypeCode:""};
                            }
                        });



                        //生成波次
                        $(".k-grid-generateWave").on("click", function () {
                            var ids = getCurrentIds();
                            if (ids == '') {
                                kendo.ui.ExtAlertDialog.showError("请选择出库单");
                                return;
                            }
                            //if(!isGenerateWave()){
                            //    return;
                            //}
                            //生成前预览生成信息
                            var totalQtySum = $("#totalQty").text();
                            var totalQtyCount = $("#statusBar").text();
                            kendo.ui.ExtOkCancelDialog.show({
                                title: "确认生成波次",
                                message:"当前选中的订单总数:"+totalQtyCount+",商品总数:"+ totalQtySum+"\n是否生成波次?",
                                icon: 'k-ext-question' }).then(function(resp){
                                if(resp.button==='OK'){
                                    var url = "/shipment/shipment/wave/" + ids;
                                    $sync(window.BASEPATH + url, "POST")
                                        .then(function (xhr) {
                                            if(xhr.result){
                                                var data = xhr.result;
                                                //生成波次后清零
                                                $("#statusBar").text(0);
                                                $("#totalQty").text(0);
                                                $("#checkAll")[0].checked = false;
                                                kendo.ui.ExtOkCancelDialog.show({
                                                    title: "确认",
                                                    message: "已生成" + [xhr.result.id] + "的波次单,是否打印发货单?",
                                                    icon: 'k-ext-question' }).then(function(resp){
                                                    if(resp.button==='OK'){
                                                        //调用波次打印-发货单打印
                                                        wmsReportPrint.printWaveDelivery(data.id);
                                                    }else{
                                                        $scope.shipmentWaveGrid.dataSource.read({});
                                                    }
                                                });
                                            }
                                            $scope.shipmentWaveGrid.dataSource.read({});
                                        }, function (xhr) {
                                            $scope.shipmentWaveGrid.dataSource.read({});
                                        });

                                }
//                                else{
//                                    $scope.shipmentWaveGrid.dataSource.read({});
//                                }
                            });




                        });


                    }
                });
            }]);



})