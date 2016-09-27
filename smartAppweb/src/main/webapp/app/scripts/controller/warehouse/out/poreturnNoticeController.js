
define(['scripts/controller/controller',
    '../../../model/warehouse/out/poreturnNoticeModel'], function(controller, poreturnNoticeModel){
    "use strict";
    controller.controller('warehouseOutPoreturnNoticeController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource',
            function($scope, $rootScope, $sync, $url, wmsDataSource){
                var poreturnNoticeHeaderUrl = $url.warehouseOutPoreturnNoticeUrl,
                    poreturnNoticeHeaderColumns = [
                        WMS.GRIDUTILS.deleteOptionButton,
                        {title: '采购退货通知单号', field: 'id', align:'left', width:'200px',
                            filterable: {cell: {
                            enabled: true,
                            delay: 1500
                        }}},
                        {filterable: false, title: '单据状态', field:'ticketStatusCode',template:WMS.UTILS.codeFormat('ticketStatusCode', 'TicketStatus'), align: 'left', width: "120px"},
                        {filterable: false, title: '参考单号', field:'referNo', align: 'left', width: "120px"},
                        {filterable: false, title: '退货原因', field:'reasonCode', align: 'left', width: "120px"},
                        {filterable: false, title: '仓库', field:'warehouseId', align: 'left', width: "120px"},
                        {filterable: false, title: '供应商', field:'supplierId', align: 'left', width: "120px"}
                    ],

                    poreturnNoticeDetailColumns = [
                        {title: '采购退货通知明细单号', field: 'id', align:'left', width:'200px',
                            filterable: {cell: {
                                enabled: true,
                                delay: 1500
                            }}},
                        {filterable: false, title: '商品SKU', field: 'sku', align:'left', width: "120px"},
                        {filterable: false, title: '商品名称', field: 'itemName', align:'left', width: "120px"},
                        {filterable: false, title: '商品条码', field: 'barcode', align:'left', width: "160px"},
                        {filterable: false, title: '商品货号', field: 'productNo', align:'left', width: "75px"},
                        {filterable: false, title: '款式型号', field: 'model', align:'left', width: "75px"},
                        {filterable: false, title: '颜色', field: 'colorCode', align:'left', width: "75px"},
                        {filterable: false, title: '尺码', field: 'sizeCode', align:'left', width: "75px"},
                        {filterable: false, title: '期望数量', field: 'desiredNum', align:'left', width: "75px"},
                        {filterable: false, title: '实际退货', field: 'actualReturn', align:'left', width: "75px"}
                    ],

                    poreturnNoticeDataSource = wmsDataSource({
                        url:poreturnNoticeHeaderUrl,
                        schema:{
                            model: poreturnNoticeModel.poreturnNoticeHeader
                        }
                    });
                poreturnNoticeHeaderColumns = poreturnNoticeHeaderColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                poreturnNoticeDetailColumns = poreturnNoticeDetailColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: poreturnNoticeDataSource,
                    columns:poreturnNoticeHeaderColumns,
                    detailInit: function(e){
                        $("<div/>").appendTo(e.detailCell).kendoGrid(WMS.GRIDUTILS.getGridOptions({
                            dataSource:wmsDataSource({
                                url: poreturnNoticeHeaderUrl + "/" + e.data.id + "/details",
                                schema:{
                                    model: poreturnNoticeModel.poreturnNoticeDetail
                                },
                                pageSize : 5
                            }),

                            columns:poreturnNoticeDetailColumns
                        }, $scope));
                    }
                }, $scope);

                $scope.search = function(){
                    var condition = {"id":$scope.id, "referNo":$scope.referNo, "supplierId":$scope.supplierId,
                         "statusCode":$scope.statusCode, "warehouseId":$scope.warehouseId};
                    $scope.poreturnNoticeHeaderGrid.dataSource.filter(condition);
                    $scope.poreturnNoticeHeaderGrid.refresh();
                };
            }
        ]
    );
    }
)