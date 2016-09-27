/**
 * Created by MLS on 15/3/31.
 */

define(['scripts/controller/controller', '../../../model/warehouse/in/receiptModel'], function (controller, receiptModel) {
    "use strict";
    controller.controller('warehouseInSoreturnReceiptController',
        ['$scope', '$rootScope', '$http', 'url','wmsDataSource','wmsLog','sync',
            function($scope, $rootScope, $http, $url, wmsDataSource, wmsLog, $sync) {
                var headerUrl = $url.warehouseInSoreturnReceiptUrl,
                    headerColumns = [
                        //WMS.UTILS.CommonColumns.checkboxColumn,
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { filterable: false, title: '单据编号', field: 'id', align: 'left', width: "100px"},
                        { filterable: false, title: '退货通知单号', field: 'asnId', align: 'left', width: "150px"},
                        { filterable: false, title: '参考单号', field: 'referNo', align: 'left', width: "150px"},
                        { filterable: false, title: '仓库', field: 'warehouseId', align: 'left', width: "100px"},
                        { filterable: false, title: '商家', field: 'stoterId', align: 'left', width: "100px"},
                        { filterable: false, title: '单据状态', field: 'statusCode', align: 'left', width: "100px"},
                        { filterable: false, title: '入库类型', field: 'receiptTypeCode', align: 'left', width: "100px"},
                        { filterable: false, title: '总数量', field: 'totalQty', align: 'left', width: "100px"},
                        { filterable: false, title: '总箱数', field: 'totalCartonQty', align: 'left', width: "100px"},
                        { filterable: false, title: '总托数', field: 'totalPalletQty', align: 'left', width: "100px"}
                    ],

                    headerDataSource = wmsDataSource({
                        url: headerUrl,
                        schema: {
                            model: receiptModel.header
                        }
                    });

                headerColumns = headerColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                headerColumns.splice(0,0,WMS.UTILS.CommonColumns.checkboxColumn);
                
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    widgetId:"header",
                    dataSource: headerDataSource,
                    toolbar: [{ name: "create", text: "新增"},{ name: "sub", text: "提交"}],
                    columns: headerColumns,
                    editable: {mode: "popup", template: kendo.template($("#soreturnReceiptHeaderEditor").html())},
                    customChange:function(grid){
                        $(".k-grid-sub").hide();
                        var selected = WMS.GRIDUTILS.getCustomSelectedData($scope.soreturnReceiptHeaderGrid);
                        if(selected.length>0){
                            var sub = 0,size = selected.length;
                            $.each(selected,function(){
                                if(this.statusCode === 'Initial'){
                                    sub ++;
                                }
                            });
                            if(sub === size){
                                $(".k-grid-sub").show();
                            }
                        }else{
                            $(".k-grid-sub").show();
                        }
                    }
                }, $scope);


                //明细信息
                var detailColumns = [
                    WMS.GRIDUTILS.CommonOptionButton("detail"),
                    { filterable: false, title: '退货通知单行号', field: 'detailLineNo', align: 'left',width:"120px;"},
                    { filterable: false, title: '批次号', field: 'lotkey', align: 'left',width:"120px"},
                    { filterable: false, title: 'SKU', field: '', align: 'left',width:"120px;"},
                    { filterable: false, title: '商品条码', field: '', align: 'left',width:"160px;"},
                    { filterable: false, title: 'SKU描述', field: '', align: 'left',width:"120px;"},
                    { filterable: false, title: '库存状态', field: 'inventoryStatusCode', align: 'left',width:"120px;"},
                    { filterable: false, title: '颜色', field: '', align: 'left',width:"120px;"},
                    { filterable: false, title: '尺寸', field: '', align: 'left',width:"120px;"},
                    { filterable: false, title: '货号', field: '', align: 'left',width:"120px;"},
                    { filterable: false, title: '型号', field: '', align: 'left',width:"120px;"},
                    { filterable: false, title: '货位名称', field: '', align: 'left',width:"120px;"},
                    { filterable: false, title: '已收数量', field: 'receivedQty', align: 'left',width:"120px"},
                    { filterable: false, title: '箱号', field: 'cartonNo', align: 'left',width:"120px"},
                    { filterable: false, title: '箱数', field: 'cartonQty', align: 'left',width:"120px"},
                    { filterable: false, title: '净重(kg)', field: 'netWeight', align: 'left',width:"120px"},
                    { filterable: false, title: '毛重(kg)', field: 'grossWeight', align: 'left',width:"120px"},
                    { filterable: false, title: '体积(cm³)', field: 'cube', align: 'left',width:"120px"},
                    { filterable: false, title: '收货日期', field: 'soreturnReceiptDate', align: 'left',width:"120px"}
                ];


                detailColumns = detailColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.soreturnReceiptDetailOptions = function (dataItem) {
                    return WMS.GRIDUTILS.getGridOptions({
                        widgetId:"detail",
                        dataSource: wmsDataSource({
                            url: headerUrl + "/" + dataItem.id + "/details",
                            schema: {
                                model: {
                                    id: "id",
                                    fields: {
                                        id: {type: "number", editable: false, nullable: true },
                                        createTime: {type: "number"},
                                        updateTime: {type: "number"}
                                    }
                                },
                                total: function (total) {
                                    return total.length > 0 ? total[0].total : 0;
                                }
                            },
                            otherData: {"receiptId": dataItem.id}
                        }),
                        toolbar: [
                            { name: "create", text: "新增"},
                            { name: "scan", text: "扫描"}
                        ],
                        editable: {
                            mode: "popup",
                            template: kendo.template($("#soreturnReceiptDetailEditor").html())
                        },
                        columns: detailColumns
                    }, $scope);
                };


                function getSelId(){
                    var selectedData=WMS.GRIDUTILS.getCustomSelectedData($scope.soreturnReceiptHeaderGrid);
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



                $scope.$on("kendoWidgetCreated", function(event, widget){
//                    console.log(widget);
                    if (widget.options !== undefined && widget.options.widgetId === 'detail') {
                        //扫描录入
                        $(".k-grid-scan").on('click',function(e){
                            $scope.scanPopup.refresh().open().center();
                            $scope.scanModel = {};
                            $scope.scanModel.headerId = event.targetScope.dataItem.id;
                        });
                    }
                    if (widget.options !== undefined && widget.options.widgetId === 'header') {
                        widget.bind("edit", function(e) {
                            $scope.editHeaderModel = e.model;
                        });
                        //提交操作
                        $(".k-grid-sub").on('click',function(e){
                            var id = getSelId();
                            if(!id){
                                return;
                            }
                            $sync(window.BASEPATH + "/soreturn/receipt/" + id + "/status", "PUT")
                                .then(function (xhr) {
                                    $scope.soreturnReceiptHeaderGrid.dataSource.read({});
                                },function (xhr) {
                                    $scope.soreturnReceiptHeaderGrid.dataSource.read({});
                                });

                        });
                    }
                });


                $scope.scanConfirm = function(){
//                    console.log($scope.scanModel);
                    $scope.scanPopup.close();
                };

                $scope.scanClose = function(){
                    $scope.scanPopup.close();
                };


            }]);

})