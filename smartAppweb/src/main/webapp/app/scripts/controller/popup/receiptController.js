/**
 * Created by xiagn on 15/4/1.
 */
define(['scripts/controller/controller'], function(controller, sku) {
    "use strict";
    controller.controller('popupReceiptController',
        ['$scope','$rootScope','sync', 'url','wmsDataSource',
            function($scope, $rootScope, $sync, $url, wmsDataSource) {
                var cond = "";
                var receiptUrl = $url.strategyReceiptUrl,
                    popupGridWidgetId = 'popup',
                    columns = [
                        { filterable: false, title: '策略代码', field: 'id', align: 'left', width: "120px"},
                        { filterable: false, title: '策略名称', field: 'strategyName', align: 'left', width: "120px"}
                    ],
                    dataSource = wmsDataSource({
                        url: receiptUrl
                    });

                $scope.gridOptions = WMS.GRIDUTILS.getGridOptions({
                    widgetId: popupGridWidgetId,
                    dataSource: dataSource,
                    columns: columns,
                    autoBind: true,
                    editable: false,
                    selectable: "row"
                }, $scope);


                $scope.$on("kendoWidgetCreated", function(event, widget){
//                    if (widget.options !== undefined && widget.options.widgetId === popupGridWidgetId) {
//                        if (cond !== "" && cond !== "/") {
//                            widget.dataSource.read();
//                            widget.refresh();
//                        }
//                    }
                });

                $scope.selectPopupData = function(){
                    var selectView = $scope.popupGrid.select();
                    var selectedData = $scope.popupGrid.dataItem(selectView);

                    if (_.isFunction($scope.receiptPopup.setReturnData)) {
                        $scope.receiptPopup.setReturnData(selectedData);
                    }
                    $scope.closeWindow();
                };

                $scope.closeWindow = function(){
                    $scope.receiptPopup.close();
                };
            }]);

})