define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('warehouseInSoreturnAsnController',
        ['$scope','$rootScope','sync','wmsDataSource','wmsLog',
            function($scope, $rootScope, $sync, wmsDataSource,wmsLog) {
                var soreturnAsnUrl = "/soreturn/asns",
                    headerColumns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { title: '通知单号', field: 'id', align: 'left',width:"120px;"},
                        { title: '仓库', field: 'warehouseId', align: 'left',width:"120px;"},
                        { title: '商家', field: 'storerId', align: 'left',width:"120px;"},
                        { title: '数据来源', field: 'datasourceCode',template:WMS.UTILS.codeFormat('datasourceCode','DataSource'), align: 'left',width:"120px;"},
                        { title: '参考单号', field: 'referNo', align: 'left',width:"120px;"},
                        { title: '单据状态', field: 'ticketStatusCode',template:WMS.UTILS.codeFormat('ticketStatusCode','TicketStatus'), align: 'left',width:"120px;"},
                        { title: '收货状态', field: 'statusCode',template:WMS.UTILS.codeFormat('statusCode','ReceiptStatus'), align: 'left',width:"120px;"},
                        { title: '入库类型', field: 'receiptTypeCode', align: 'left',width:"120px;"},
                        { title: '承运商名字', field: 'carrierName', align: 'left',width:"120px;"},
                        { title: '承运商联系人', field: 'carrierContact', align: 'left',width:"130px;"},
                        { title: '承运商联系电话', field: 'carrierTelephone', align: 'left',width:"130px;"},
                        { title: '承运商地址', field: 'carrierAddress', align: 'left',width:"130px;"},
                        { title: '来源单号', field: 'fromTypeCode',template:WMS.UTILS.codeFormat('fromOrderNo','ReceiptFrom'), align: 'left',width:"120px;"},
                        { title: '总数量', field: 'totalQty', align: 'left',width:"120px;"},
                        { title: '总箱数', field: 'totalCartonQty', align: 'left',width:"120px;"},
                        { title: '总金额', field: 'totalAmount', align: 'left',width:"120px"},
                        { title: '供应商', field: 'vendorId', align: 'left',width:"120px;"},
                        { title: '总净重', field: 'totalNetWeight', align: 'left',width:"120px;"},
                        { title: '总毛重', field: 'totalGrossWeight', align: 'left',width:"120px"},
                        { title: '总体积', field: 'totalCube', align: 'left',width:"120px"},
                        WMS.UTILS.CommonColumns.defaultColumns
                    ],
                    headerDataSource = wmsDataSource({
                        url: soreturnAsnUrl,
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
                        }
                    });

                headerColumns = headerColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                headerColumns.splice(0,0,WMS.UTILS.CommonColumns.checkboxColumn);
                $scope.soreturnAsnGridOptions =WMS.GRIDUTILS.getGridOptions({
                    dataSource: headerDataSource,
                    toolbar: [{ name: "create", text: "新增"},{ name: "sub", text: "提交"},{ name: "cacel", text: "撤销"},{ name: "confirm", text: "确认"},{ name: "delivery", text: "自动收货"}],
                    columns: headerColumns,
                    editable: {
                        mode: "popup",
                        window:{
                            width:"600px"
                        },
                        template: kendo.template($("#asn-editor").html())
                    },
                    customChange:function(grid){
                        $(".k-grid-sub").hide();
                        $(".k-grid-cacel").hide();
                        $(".k-grid-delivery").hide();
                        $(".k-grid-confirm").hide();
                        var selected = WMS.GRIDUTILS.getCustomSelectedData($scope.warehouseAsnGrid);
                        if(selected.length>0){
                            var sub = 0,cacel = 0,delivery = 0,confirm = 0,size = selected.length;
                            $.each(selected,function(){
                                if(this.ticketStatusCode==='Initial'){
                                    sub ++;
                                }
                                if(this.ticketStatusCode==='Submitted'&& this.statusCode==='0' && this.datasourceCode==='Manual'){
                                    cacel ++;
                                }
                                if(this.ticketStatusCode==='Submitted'){
                                    confirm ++;
                                }
                                if(this.ticketStatusCode==='Submitted' && this.statusCode==='0') {
                                    delivery ++;
                                }
                            });
                            if(sub===size)
                                $(".k-grid-sub").show();
                            if(cacel===size)
                                $(".k-grid-cacel").show();
                            if(delivery===size)
                                $(".k-grid-delivery").show();
                            if(confirm===size)
                                $(".k-grid-confirm").show();
                        }else{
                            $(".k-grid-sub").show();
                            $(".k-grid-cacel").show();
                            $(".k-grid-delivery").show();
                            $(".k-grid-confirm").show();
                        }
                    }
                }, $scope);

                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;

                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

                //明细信息
                var detailColumns = [
                    WMS.GRIDUTILS.CommonOptionButton("detail"),
                    { title: '行号', field: 'detailLineNo', align: 'left',width:"120px;"},
                    { title: '参考单号', field: 'fromOrderNo', align: 'left',width:"120px;"},
                    { title: 'SKU编码', field: 'skuId', align: 'left',width:"120px;"},
                    { title: '商品条码', field: '', align: 'left',width:"160px;"},
                    { title: '商品名称', field: 'itemName', align: 'left',width:"120px;"},
                    { title: '颜色', field: '', align: 'left',width:"120px;"},
                    { title: '尺寸', field: '', align: 'left',width:"120px;"},
                    { title: '货号', field: '', align: 'left',width:"120px;"},
                    { title: '型号', field: '', align: 'left',width:"120px;"},
                    { title: '收货状态', field: 'statusCode', align: 'left',width:"120px;"},
                    { title: '期望数量', field: 'expectedQty', align: 'left',width:"120px;"},
                    { title: '已收数量', field: 'receivedQty', align: 'left',width:"120px"},
                    { title: '单价', field: 'adjustQty', align: 'left',width:"120px"},//字段需要修改
                    { title: '箱数', field: 'cartonQty', align: 'left',width:"120px"},
                    { title: '箱号', field: 'cartonNo', align: 'left',width:"120px"},
                    { title: '净重', field: 'netWeight', align: 'left',width:"120px"},
                    { title: '毛重', field: 'grossWeight', align: 'left',width:"120px"},
                    { title: '体积', field: 'cube', align: 'left',width:"120px"},
                    { title: '来源行号', field: 'fromLineNo', align: 'left',width:"120px"},
                    { title: '上次收货时间', field: 'lastReceiptTime', align: 'left',width:"120px"}
                ];

                detailColumns = detailColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.soreturnAsnDetailOptions = function(dataItem) {
                    return WMS.GRIDUTILS.getGridOptions({
                        moduleName : "detail",
                        dataSource: wmsDataSource({
                            url: soreturnAsnUrl+"/"+dataItem.id+"/details",
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
                            otherData:{"asnId":dataItem.id}
                        }),
                        toolbar: [{ name: "create", text: "新增"}],
                        editable: {
                            mode: "popup",
                            window:{
                                width:"600px"
                            },
                            template: kendo.template($("#asnDetail-editor").html())
                        },
                        columns: detailColumns
                    }, $scope);
                };




                function getSelId(){
                    var selectedData=WMS.GRIDUTILS.getCustomSelectedData($scope.soreturnAsnGrid);
                    var ids=[];
                    selectedData.forEach(function(value){
                        ids.push(value.id);
                    });
                    var id = ids.join(",");
//                    console.log(id);
                    return id;
                }


                //操作日志
                $scope.logOptions = wmsLog.operationLog;

                $scope.$on("kendoRendered", function(e) {
                    //提交操作
                    $(".k-grid-sub").on('click',function(e){
                        doStatus("Submitted");
                    });

                    //撤消操作
                    $(".k-grid-cacel").on('click',function(e){
                        doStatus("Initial");
                    });

                    //撤消操作
                    $(".k-grid-confirm").on('click',function(e){
                        doStatus("Confirmed");
                    });

                    //自动收货操作
                    $(".k-grid-delivery").on('click',function(e){
                        var id = getSelId();
                        if(!id){
                            return;
                        }
                        $sync(window.BASEPATH + "/asns/receipt/"+id, "PUT")
                            .then(function (xhr) {
                                $scope.warehouseAsnGrid.dataSource.read({});
                            },function (xhr) {
                                $scope.warehouseAsnGrid.dataSource.read({});
                            });
                    });

                    var doStatus = function(type){
                        var id = getSelId();
                        if(!id){
                            return;
                        }
                        $sync(window.BASEPATH + "/asns/status/"+type+"/"+id, "PUT")
                            .then(function (xhr) {
                                $scope.warehouseAsnGrid.dataSource.read({});
                            },function (xhr) {
                                $scope.warehouseAsnGrid.dataSource.read({});
                            });
                    };
                });

                $scope.windowOpen = function(){
                    $scope.skuPopup.refresh().open().center();
                    $scope.skuPopup.setReturnData = function(returnData){
                        if (_.isEmpty(returnData)) {
                            return;
                        }
                        $scope.editModel.set("skuSku", returnData.sku);
                        $scope.editModel.set("skuId", returnData.id);
                        $scope.editModel.set("skuItemName", returnData.itemName);
                        $scope.editModel.set("skuBarcode", returnData.barcode);
                        $scope.editModel.set("skuColorCode", returnData.colorCode);
                        $scope.editModel.set("skuSizeCode", returnData.sizeCode);
                        $scope.editModel.set("skuProductNo", returnData.productNo);
                        $scope.editModel.set("skuBoxsize", returnData.boxsize);
                        $scope.editModel.set("skuReplenishqty", returnData.replenishqty);
                    };
                };




            }]);





})