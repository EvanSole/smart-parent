/**
 * Created by xiagn on 15/4/1.
 */
define(['scripts/controller/controller'], function(controller, sku) {
    "use strict";
    controller.controller('popupShelveController',
        ['$scope','$rootScope','sync', 'url','wmsDataSource',
            function($scope, $rootScope, $sync, $url, wmsDataSource) {
                var cond = "";
                var url = $url.qcWhShelveUrl,
                    popupGridWidgetId = 'popup',
                  shelveColumns = [
                    {filterable: false, title: '货架编号', field: 'shelveNo', align: 'left', width: "100px"},
                    {filterable: false, title: '仓库', field: 'warehouseId', align: 'left', width: "100px"},
                    {filterable: false, title: '楼层', field: 'floor', align: 'left', width: "100px"},
                    {filterable: false, title: '库区', field: 'area', align: 'left', width: "100px"}
                    ],
                    dataSource = wmsDataSource({
                        url: url
                    });

                $scope.gridOptions = WMS.GRIDUTILS.getGridOptions({
                    widgetId: popupGridWidgetId,
                    dataSource: dataSource,
                    columns: shelveColumns,
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

                    if (_.isFunction($scope.shelvePopup.setReturnData)) {
                        $scope.shelvePopup.setReturnData(selectedData);
                    }
                    $scope.closeWindow();
                };

                $scope.closeWindow = function(){
                    $scope.shelvePopup.close();
                };
            }]);

})