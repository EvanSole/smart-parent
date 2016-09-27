define(['scripts/controller/controller',
'../../model/data/skuModel'], function(controller, skuModel) {
    "use strict";
    controller.controller('dataGoodsController',
        ['$scope','$rootScope','sync', 'url','wmsDataSource', 'wmsReportPrint',
            function($scope, $rootScope, $sync, $url, wmsDataSource, wmsReportPrint) {
                $scope.order = {};
                $scope.invoice = {};
                $scope.selectData = [];
                var goodsUrl = $url.dataGoodsUrl,
                    skuUrl  = $url.dataGoodSkuBarcodesUrl,
                    addSkuUrl = $url.dataGoodSkuBarcodeUrl,
                    goodsColumns = [
                        WMS.UTILS.CommonColumns.checkboxColumn,
                        { title: '操作', command:[
                            { name: "read",template: "<a  class='k-button k-grid-edit btn-auth-read' href='\\#' ng-click='read()'><span class='k-icon k-edit'></span>查看</a>",
                                className:"btn-auth-read",
                                text: { edit: "编辑", cancel: "取消", update: "更新" } },
                            { name: "edit",template: "<a  class='k-button k-button-icontext k-grid-edit btn-auth-edit' ng-hide='dataItem.editHide' href='\\#'><span class='k-icon k-edit'></span>编辑</a>",
                                className:"btn-auth-edit",
                                text: { edit: "编辑", cancel: "取消", update: "更新" } },
                            WMS.GRIDUTILS.deleteButton

                        ],
                            width:"200px"
                        },
                        { filterable: false, title: '商家名称', field: 'storerName', align: 'left', width: "120px", template: WMS.UTILS.storerFormat},
                        { filterable: false, title: '供应商', field: 'supplierId', align: 'left', width: "120px", template: function(obj){
                             if (obj.supplierId == 0) {return ''} else { return WMS.UTILS.vendorFormat("supplierId")}} },
                        { filterable: false, title: '商品名称', field: 'itemName', align: 'left', width: "120px"},
                        //{ filterable: false, title: '图片', field: 'imageUrl', align: 'left', width: "120px", template:"<img src='#=imageUrl#' width='100px' height='100px' />"},
                        { filterable: false, title: '图片URL', field: 'imageUrl', align: 'left', width: "120px"},
                        { filterable: false, title: 'SKU', field: 'sku', align: 'left', width: "120px"},
                        { filterable: false, title: '商品条码', field: 'barcode', align: 'left', width: "160px"},
                        /*{ filterable: false, title: '类别', field: 'categoryid', align: 'left', width: "120px"},*/
                        {filterable: false, title: '类别', field: 'categoryid', align: 'left', width: "100px",template:WMS.UTILS.commodityTypeFormat("categoryid")},
                        { filterable: false, title: '品牌', field: 'brandCode', align: 'left', width: "120px"},
                        { filterable: false, title: '颜色', field: 'colorCode', template: WMS.UTILS.codeFormat('colorCode', 'SKUColor'),align: 'left', width: "120px"},
                        { filterable: false, title: '尺码', field: 'sizeCode',template: WMS.UTILS.codeFormat('sizeCode', 'SKUSize'), align: 'left', width: "120px"},
                        { filterable: false, title: '重要尺寸', field: 'importantSize', align: 'left', width: "120px"},
                        { filterable: false, title: '型号', field: 'model', align: 'left', width: "120px"},
                        { filterable: false, title: '箱规', field: 'boxsize', align: 'left', width: "120px"},
                        { filterable: false, title: '货号', field: 'productNo', align: 'left', width: "120px"}
                        //{ filterable: false, title: '是否可用', field: 'isActive', align: 'left',  width:"150px",template: WMS.UTILS.checkboxDisabledTmp("isActive")}

                    ],
                    skuColumns = [
                        { title: '操作',
                            command:[{name:"delete", text:"删除", className:"btn-auth-delete"}],
                            width:"200px"
                        },
                        { filterable: false, title: '条码', field: 'barcode', align: 'left', width: "120px"},
                        { filterable: false, title: '换算', field: 'ratio', align: 'left', width: "120px"},
                        { filterable: false, title: '备注', field: 'memo', align: 'left', width: "120px"}

                    ],
                    goodsDataSource = wmsDataSource({
                        url: goodsUrl,
                        schema: {
                            model: skuModel.header
                        }
                    });
                goodsColumns = goodsColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                skuColumns = skuColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    widgetId: "header",
                    dataSource: goodsDataSource,
                    toolbar: [{ name: "create", text: "新增", className:"btn-auth-add"},
                        {template:'<a class="k-button k-grid-print" ng-click="print()" href="\\#">打印</a>', className:"btn-auth-print"},
                        {template:'<span style="margin-left: 10px;">打印份数</span><input type="number" min="1" style="width: 30px;height: 20px;border-bottom-width: 2px;padding-bottom: 3px;border-right-width: 2px;margin-left: 5px;" name="printCount" id="printCount" value="1" />'}
                    ],
                    columns: goodsColumns,
                    editable: {
                        mode: "popup",
                        window: {
                            width: "640px"
                        },
                        template: kendo.template($("#form-add").html())
                    },
                    edit: function(e) {
                        if($scope.isReadonly){
                            $(".k-edit-buttons").remove();
                            $scope.isReadonly = false;//避免查看后，修改时保存按钮也丢失了 added by zw 2015-07-28
                        }
                    },
                    dataBound: function(e) {
                        var grid = this,
                            trs = grid.tbody.find(">tr");
                        _.each(trs, function(tr,i){
                            var record = grid.dataItem(tr);
                            if (record.datasourceCode==='System') {
                                //$(tr).find(".k-button").remove(); modified by zw 2015-07-22 系统创建的商品，可以查看
                               // $(tr).find(".k-button-icontext").remove();
                                record.editHide = true;
                                record.deleteHide = true;
                            }
                        });
                    }
                }, $scope);

                $scope.$on("kendoWidgetCreated", function (event, widget) {
                    if (widget.options !== undefined && widget.options.widgetId === 'header') {
                        widget.bind("edit", function (e) {
                            $scope.editModel = e.model;
                        });
                    }
                });


                //收货策略
                $scope.windowReceiptOpen = function () {
                    $scope.receiptPopup.refresh().open().center();
                    $scope.receiptPopup.setReturnData = function (returnData) {
                        if (_.isEmpty(returnData)) {
                            return;
                        }
                        $scope.editModel.set("receiptstrategyid", returnData.id);
                        $scope.editModel.set("receiptName", returnData.strategyName);
                    };
                };

                //收货策略
                $scope.windowQcOpen = function () {
                    $scope.qcPopup.refresh().open().center();
                    $scope.qcPopup.setReturnData = function (returnData) {
                        if (_.isEmpty(returnData)) {
                            return;
                        }
                        $scope.editModel.set("qcStrategyId", returnData.id);
                        $scope.editModel.set("qcName", returnData.strategyName);
                    };
                };

                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

                $scope.print = function(){
                    console.log("print...");
                    var printCount = $("#printCount").val();
                    var goodsGrid = this.goodsGrid;
                    var selectView = WMS.GRIDUTILS.getCustomSelectedData(goodsGrid);
                    var selectedDataArray = _.map(selectView, function(view) {
                        return view.id;
                    });
                    var selectDataIds = selectedDataArray.join(",");
                    if(selectDataIds === ""){
                        kendo.ui.ExtAlertDialog.showError("请选择要打印的数据");
                        return;
                    }
                    wmsReportPrint.printSkuBarcodeByIds(selectDataIds,printCount);


                };


                $scope.read = function(){
                    $scope.isReadonly = true;
                };
            }]);

})