/**
 * Created by zw on 15/4/1.
 */
define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('popupCarrierController',
        ['$scope','$rootScope','sync', 'url','wmsDataSource',
            function($scope, $rootScope, $sync, $url, wmsDataSource) {

                //modified by zw 6.1 关闭方法定义放前面，如果下面代码return了，关闭事件不加载，页面就没法关闭了
                $scope.closeCarrierWindow = function(){
                    $scope.carrierPopup.close();
                };

                var cond = "";
//                if ($scope.carrierPopup !== undefined) {
//                    if (_.isFunction($scope.carrierPopup.initParam)) {
//                        $scope.carrierPopup.initParam($scope);
//                        if($scope.param===undefined){
//                            return;
//                        }
//                        cond = "/" + $scope.param;
//                    }
//                }
                var carrierUrl = $url.dataCarrierUrl,
                    carrierPopupGridWidgetId = 'carrierPopup',
                    carrierColumns = [
                        { filterable: false, title: '承运商简称', field: 'shortName', align: 'left', width: "120px"},
                        { filterable: false, title: '承运商代码', field: 'carrierCode', align: 'left', width: "120px"}
                    ],
                    carrierDataSource = wmsDataSource({
                        url: carrierUrl
                    });

                $scope.carrierGridOptions = WMS.GRIDUTILS.getGridOptions({
                    widgetId: carrierPopupGridWidgetId,
                    dataSource: carrierDataSource,
                    columns: carrierColumns,
                    autoBind: false,
                    editable: false,
                    selectable: "row"
                }, $scope);


                $scope.$on("kendoWidgetCreated", function(event, widget){
                    widget.dataSource.read();
                    widget.refresh();
//                    if (widget.options !== undefined && widget.options.widgetId === carrierPopupGridWidgetId) {
//                        if (cond !== "" && cond !== "/") {
//                            widget.dataSource.read();
//                            widget.refresh();
//                        }
//                    }
                });

                $scope.selectCarrier = function(){
                    var selectView = $scope.carrierPopupGrid.select();
                    var selectedData = $scope.carrierPopupGrid.dataItem(selectView);

                    if (_.isFunction($scope.carrierPopup.setReturnData)) {
                        $scope.carrierPopup.setReturnData(selectedData);
                    }
                    $scope.closeCarrierWindow();
                };


            }]);

})