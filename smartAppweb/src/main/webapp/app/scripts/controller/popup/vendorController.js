/**
 * Created by xiagn on 15/4/1.
 */
define(['scripts/controller/controller'], function(controller, sku) {
    "use strict";
    controller.controller('popupVendorController',
        ['$scope','$rootScope','sync', 'url','wmsDataSource',
            function($scope, $rootScope, $sync, $url, wmsDataSource) {

                //modified by zw 6.1 关闭方法定义放前面，如果下面代码return了，关闭事件不加载，页面就没法关闭了
                $scope.closeVendorWindow = function(){
                    $scope.vendorPopup.close();
                };

                var cond = "";
                if ($scope.vendorPopup !== undefined) {
                    if (_.isFunction($scope.vendorPopup.initParam)) {
                        $scope.vendorPopup.initParam($scope);
                        if($scope.param===undefined){
                            return;
                        }
                        cond = "/" + $scope.param;
                    }
                }
                var supplierUrl = "/index/supplier" + cond,
                    vendorPopupGridWidgetId = 'vendorPopup',
                    supplierColumns = [
                        { filterable: false, title: '代码', field: 'supplierNo', align: 'left', width: "120px"},
                        { filterable: false, title: '名称', field: 'shortName', align: 'left', width: "120px"}
                    ],
                    supplierDataSource = wmsDataSource({
                        url: supplierUrl
                    });

                $scope.vendorGridOptions = WMS.GRIDUTILS.getGridOptions({
                    widgetId: vendorPopupGridWidgetId,
                    dataSource: supplierDataSource,
                    columns: supplierColumns,
                    editable: false,
                    selectable: "row"
                }, $scope);


                $scope.$on("kendoWidgetCreated", function(event, widget){
                    if (widget.options !== undefined && widget.options.widgetId === vendorPopupGridWidgetId) {
                        if (cond !== "" && cond !== "/") {
                            widget.dataSource.read();
                            widget.refresh();
                        }
                    }
                });

                $scope.selectVendor = function(){
                    var selectView = $scope.vendorPopupGrid.select();
                    var selectedData = $scope.vendorPopupGrid.dataItem(selectView);

                    if (_.isFunction($scope.vendorPopup.setReturnData)) {
                        $scope.vendorPopup.setReturnData(selectedData);
                    }
                    $scope.closeVendorWindow();
                };


            }]);

})