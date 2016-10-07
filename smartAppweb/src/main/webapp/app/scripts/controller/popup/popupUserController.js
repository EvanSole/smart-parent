
define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('popupUserController',
        ['$scope','$rootScope','sync', 'url','wmsDataSource',
            function($scope, $rootScope, $sync, $url, wmsDataSource) {
                var cond = "";
                if ($scope.skuPopup !== undefined) {
                    if (_.isFunction($scope.userPopup.initParam)) {
                        $scope.userPopup.initParam($scope);
                        cond = "/" + $scope.param;
                    }
                }
                var userUrl = $url.dataUserWarehouseUrl + cond,
                    userPopupGridWidgetId = "userPopup",
                    userColumns = [
                        { filterable: false, title: '登入账号', field: 'loginName', align: 'left', width: "120px"},
                        { filterable: false, title: '用户名称', field: 'userName', align: 'left', width: "120px"},
                        { filterable: false, title: '部门名称', field: 'departmentCode', align: 'left', width: "120px"}
                    ],
                    userDataSource = wmsDataSource({
                        url: userUrl,
                        schema: {
                            model: {
                                id: 'id',
                                field: {
                                    id: {type:"number", editable: false, nullable: true }
                                }
                            }
                        }
                    });

                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    widgetId: userPopupGridWidgetId,
                    dataSource: userDataSource,
                    columns: userColumns,
                    autoBind: false,
                    editable: false,
                    selectable: "row"
                }, $scope);
                $scope.$on("kendoWidgetCreated", function(event, widget){
                    if (widget.options !== undefined && widget.options.widgetId === userPopupGridWidgetId) {
                        if (cond !== "" && cond !== "/") {
                            widget.dataSource.read();
                            widget.refresh();
                        }
                    }
                });

                $scope.selectUser = function(){
                    var selectView = $scope.userPopupGrid.select();
                    var selectData = $scope.userPopupGrid.dataItem(selectView);

                    if (_.isFunction($scope.userPopup.setReturnData)) {
                        $scope.userPopup.setReturnData(selectData);
                    }
                    $scope.closeUserWindow();
                };

                $scope.closeUserWindow = function(){
                    $scope.userPopup.close();
                };

            }]);

})