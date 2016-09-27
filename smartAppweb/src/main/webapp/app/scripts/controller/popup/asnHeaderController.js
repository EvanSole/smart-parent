/**
 * Created by xiagn on 15/4/1.
 */
define(['scripts/controller/controller'], function(controller, sku) {
    "use strict";
    controller.controller('popupAsnController',
        ['$scope','$rootScope','sync', 'url','wmsDataSource',
            function($scope, $rootScope, $sync, $url, wmsDataSource) {

                //modified by zw 6.1 关闭方法定义放前面，如果下面代码return了，关闭事件不加载，页面就没法关闭了
                $scope.closeVendorWindow = function(){
                    $scope.asnPopup.close();
                };

                var cond = "";
                if ($scope.asnPopup !== undefined) {
                    if (_.isFunction($scope.asnPopup.initParam)) {
                        $scope.asnPopup.initParam($scope);
                        if($scope.param==null||$scope.param==""){
                            return;
                        }
                        cond = "/" + $scope.param;
                    }
                }
                var asnUrl = "/asns/" + cond,
                    asnPopupGridWidgetId = 'asnPopup',
                    asnColumns = [
                        { filterable: false, title: '到货通知单号', field: 'id', align: 'left', width: "120px"},
                        { filterable: false, title: '商家', field: 'storerId', align: 'left', width: "120px;", template: WMS.UTILS.storerFormat},
                        { filterable: false, title: '来源单号', field: 'fromOrderNo', align: 'left', width: "120px"},
                        { filterable: false, title: 'ERP单号', field: 'fromErpNo', align: 'left', width: "120px"}
                    ],
                    asnDataSource = wmsDataSource({
                        url: asnUrl,
                        schema: {
                            model: {
                                id: "id",
                                fields: {storer:  { type: "number" }}
                            }
                        }
                    });

                $scope.asnGridOptions = WMS.GRIDUTILS.getGridOptions({
                    widgetId: asnPopupGridWidgetId,
                    dataSource: asnDataSource,
                    columns: asnColumns,
                    autoBind: false,
                    editable: false,
                    selectable: "row",
                    height: 220
                },$scope);


                $scope.$on("kendoWidgetCreated", function(event, widget){
                    if (widget.options !== undefined && widget.options.widgetId === asnPopupGridWidgetId) {
                        if (cond !== "" && cond !== "/") {
                            widget.dataSource.read();
                            widget.refresh();
                        }
                    }
                });

                $scope.selectVendor = function(){
                    var selectView = $scope.asnPopupGrid.select();
                    var selectedData = $scope.asnPopupGrid.dataItem(selectView);

                    if (_.isFunction($scope.asnPopup.setReturnData)) {
                        $scope.asnPopup.setReturnData(selectedData);
                    }
                    $scope.closeVendorWindow();
                };


            }]);

})