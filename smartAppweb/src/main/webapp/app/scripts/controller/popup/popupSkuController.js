/**
 * Created by xiagn on 15/4/1.
 */
define(['scripts/controller/controller',
    '../../model/data/skuModel'], function(controller, skuModel) {
    "use strict";
    controller.controller('popupSkuController',
        ['$scope','$rootScope','sync','url','wmsDataSource',
            function($scope, $rootScope, $sync, $url, wmsDataSource) {
                var goodsUrl = $url.dataGoodsUrl,
                    selectable = "row",
                    skuPopupGridWidgetId = "userPopup",
                    goodsColumns = [
                        { filterable: false, title: '商家', field: 'storerId', align: 'left', width: "160px", template: WMS.UTILS.storerFormat},
                        { filterable: false, title: '商品条码', field: 'barcode', align: 'left', width: "160px"},
                        { filterable: false, title: '商品名称', field: 'itemName', align: 'left', width: "120px"},
                        { filterable: false, title: '颜色', field: 'colorCode',template: WMS.UTILS.codeFormat("colorCode", "SKUColor"), align: 'left', width: "120px"},
                        { filterable: false, title: '尺码', field: 'sizeCode',template: WMS.UTILS.codeFormat("sizeCode", "SKUSize"), align: 'left', width: "120px"},
                        { filterable: false, title: '型号', field: 'model', align: 'left', width: "120px"}
                    ],
                    goodsInInventoryColumns = [
                        { filterable: false, title: '商品条码', field: 'skuBarcode', align: 'left', width: "160px"},
                        { filterable: false, title: '商品名称', field: 'skuItemName', align: 'left', width: "120px"},
                        { filterable: false, title: '颜色', field: 'skuColorCode',template: WMS.UTILS.codeFormat("skuColorCode", "SKUColor"), align: 'left', width: "120px"},
                        { filterable: false, title: '尺码', field: 'skuSizeCode',template: WMS.UTILS.codeFormat("skuSizeCode", "SKUSize"), align: 'left', width: "120px"},
                        { filterable: false, title: '型号', field: 'skuModel', align: 'left', width: "120px"}
                    ],
                    goodsInInventoryMoveColumns = [
                        { filterable: false, title: '商品条码', field: 'skuBarcode', align: 'left', width: "160px"},
                        { filterable: false, title: '商品名称', field: 'skuItemName', align: 'left', width: "120px"},
                        { filterable: false, title: '颜色', field: 'skuColorCode',template: WMS.UTILS.codeFormat("skuColorCode", "SKUColor"), align: 'left', width: "120px"},
                        { filterable: false, title: '尺码', field: 'skuSizeCode',template: WMS.UTILS.codeFormat("skuSizeCode", "SKUSize"), align: 'left', width: "120px"},
                        { filterable: false, title: '型号', field: 'skuModel', align: 'left', width: "120px"},
                        { filterable: false, title: '箱号', field: 'cartonNo', align: 'left', width: "120px"},
                        { filterable: false, title: '商品状态', field: 'inventoryStatusCode', align: 'left', width: "120px",template: WMS.UTILS.codeFormat("inventoryStatusCode", "InventoryStatus")},
                        { filterable: false, title: '在库库存', field: 'onhandQty', align: 'left', width: "120px"},
                        { filterable: false, title: '已分配量', field: 'allocatedQty', align: 'left', width: "120px"},
                        { filterable: false, title: '可用量', field: 'activeQty', align: 'left', width: "120px"},
                        { filterable: false, title: '已拣量', field: 'pickedQty', align: 'left', width: "120px"}
                    ];

                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    widgetId: skuPopupGridWidgetId,
                    dataSource: {},
                    columns: goodsColumns,
                    editable: false,
                    selectable: "row",
                    height: 280
                }, $scope);

                $scope.$on("kendoWidgetCreated", function(event, widget){
                    if (widget.options !== undefined && widget.options.widgetId === skuPopupGridWidgetId) {
                        if (_.isFunction($scope.skuPopup.initParam)) {
                            $scope.skuPopup.initParam($scope);
                            if ($scope.selectable) {
                                selectable = $scope.selectable;
                            }
                            if ($scope.url) {
                                goodsUrl = $scope.url;
                                if($scope.type === "move"){
                                    widget.setOptions({selectable: selectable,columns:goodsInInventoryMoveColumns});
                                }else if($scope.type === "goods"){
                                    widget.setOptions({selectable: selectable,columns:goodsColumns});
                                }else{
                                    widget.setOptions({selectable: selectable,columns:goodsInInventoryColumns});
                                }
                            }
                            if ($scope.param) {
                                goodsUrl = goodsUrl + "/" + $scope.param;
                            }

                            var goodsDataSource = wmsDataSource({
                                url: goodsUrl,
                                schema: {
                                    model: skuModel.header
                                }
                            });

                            widget.setDataSource(goodsDataSource);
                            widget.refresh();
                        }
                    }
                });

                $scope.selectSku = function(){
                    var selectView = $scope.skuPopupGrid.select();
                    if (selectable !== "row") {
                        var selectedDataArray = _.map(selectView, function(view) {
                            return $scope.skuPopupGrid.dataItem(view);
                        });
                        if (_.isFunction($scope.skuPopup.setReturnData)) {
                            $scope.skuPopup.setReturnData(selectedDataArray);
                        }
                    } else {
                        var selectedData = $scope.skuPopupGrid.dataItem(selectView);
                        if (_.isFunction($scope.skuPopup.setReturnData)) {
                            $scope.skuPopup.setReturnData(selectedData);
                        }
                    }

                    $scope.closeSkuWindow();
                };

                $scope.closeSkuWindow = function(){
                    $scope.query = {};
                    $scope.skuPopupGrid.dataSource.data([]);
                    $scope.skuPopup.close();
                };

            }]);

});