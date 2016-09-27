
define(['scripts/controller/controller',
    '../../../model/warehouse/out/poreturnModel'], function(controller, poreturnModel){
    "use strict";
    controller.controller('warehouseOutPoreturnController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource', 'wmsLog',
            function($scope, $rootScope, $sync, $url, wmsDataSource, wmsLog){
                var poreturnHeaderUrl = $url.warehouseOutPoreturnUrl,
                    poreturnHeaderColumns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        {
                            title: '采购退货单号', field: 'id', align:'left', width:"75px",
                            filterable: {cell: {
                                enabled: true,
                                delay: 1500
                            }}
                        },
                        {filterable: false, title: '退货原因', field:'reasonCode', template:WMS.UTILS.codeFormat('reasonCode', 'PORefundReason'),align: 'left', width: "120px"},
                        {filterable: false, title: '退货时间', field:'returnDate', align: 'left', width: "120px", template: WMS.UTILS.timestampFormat("returnDate")},
                        {filterable: false, title: '仓库名称', field:'warehouseId', align: 'left', width: "120px"},
                        {filterable: false, title: '商家名称', field:'storerId', align: 'left', width: "120px"},
                        {filterable: false, title: '供应商', field:'supplierId', align: 'left', width: "120px"},
                        {filterable: false, title: 'SKU品种数', field:'skuSpecies', align: 'left', width: "120px"},
                        {filterable: false, title: 'SKU总数', field:'skuTotal', align: 'left', width: "120px"},
                        {filterable: false, title: '单据状态', field:'statusCode',template:WMS.UTILS.codeFormat('statusCode', 'TicketStatus'), align: 'left', width: "120px"}
                    ],
                    poreturnDetailColumns = [
                        WMS.GRIDUTILS.CommonOptionButton("detail"),
                        {filterable: false, title: '采购退货明细单号', field: 'id', align:'left', width: "120px"},
                        {filterable: false, title: 'SKU编码', field: 'skuId', align:'left', width: "120px"},
                        {filterable: false, title: '商品名称', field: 'itemName', align:'left', width: "120px"},
                        {filterable: false, title: '商品条码', field: 'barcode', align:'left', width: "160px"},
                        {filterable: false, title: '型号', field: 'model', align:'left', width: "75px"},
                        {filterable: false, title: '货号', field: 'productNo', align:'left', width: "75px"},
                        {filterable: false, title: '颜色', field: 'colorCode', align:'left', width: "75px"},
                        {filterable: false, title: '尺码', field: 'sizeCode', align:'left', width: "75px"},
                        {filterable: false, title: '货区', field: 'zoneId', align:'left', width: "75px"},
                        {filterable: false, title: '货位', field: 'locationId', align:'left', width: "75px"},
                        {filterable: false, title: '托盘', field: 'palletNo', align:'left', width: "75px"}
                    ],
                    poreturnHeaderDataSource = wmsDataSource({
                        url: poreturnHeaderUrl,
                        schema: {
                            model: poreturnModel.poreturnHeader
                        }
                    });
                poreturnHeaderColumns = poreturnHeaderColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                poreturnDetailColumns = poreturnDetailColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: poreturnHeaderDataSource,
                    toolbar:[{ name: "create", text: "新增"}],
                    columns: poreturnHeaderColumns,
                    editable:{
                        mode: "popup",
                        window:{
                            width:"600px"
                        },
                        template: kendo.template($("#poreturn-editor").html())
                    },
                    widgetId:"poreturnHeader"
                }, $scope);

                $scope.poreturnDetailOptions = function(dataItem){
                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource:wmsDataSource({
                            url: poreturnHeaderUrl + "/" + dataItem.id + "/detail",
                            schema:{
                                model: poreturnModel.poreturnDetail
                            },
                            pageSize: 5
                        }),
                        toolbar: [{ name:"create", text:"新增"}],
                        editable:{
                            mode: "popup",
                            window: {
                                width:"600px"
                            },
                            template: kendo.template($("#poreturnDetail-editor").html())
                        },
                        columns: poreturnDetailColumns
                    }, $scope);
                };

                //操作日志
                $scope.logOptions = wmsLog.operationLog;

                $scope.search = function(){
                    var condition = {"id":$scope.id, "storerId":$scope.storerId, "warehouseId":$scope.warehouseId,
                         "supplierId":$scope.supplierId, "statusCode":$scope.statusCode};
                    $scope.poreturnHeaderGrid.dataSource.filter(condition);
                    $scope.poreturnHeaderGrid.refresh();
                };

                $scope.$on("kendoWidgetCreated", function(event, widget) {
//                    console.log(widget);
                    if (widget.options !== undefined && widget.options.widgetId === 'poreturnHeader') {
                        widget.bind("edit", function(e){
                            $scope.editHeaderModel = e.model;
                        });
                    }
                });

                $scope.windowVendorOpen = function(){
                    $scope.vendorPopup.refresh().open().center();
                    $scope.vendorPopup.initParam = function(subScope){
                        subScope.param = $scope.editHeaderModel.storerId;
                    };
                    $scope.vendorPopup.setReturnData = function(returnData){
                        if (_.isEmpty(returnData)) {
                            return;
                        }
                        $scope.editHeaderModel.set("supplierId", returnData.id);
                        $scope.editHeaderModel.set("supplierName", returnData.shortName);
                    };
                };

            }
        ]);
})