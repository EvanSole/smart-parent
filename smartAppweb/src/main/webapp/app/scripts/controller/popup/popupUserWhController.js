
define(['scripts/controller/controller'], function(controller){
    "use strict";
    controller.controller('popupUserWhController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource',
            function($scope, $rootScope, $sync, $url, wmsDataSource){
                var url = $url.dataUserWhUrl,
                    userWhPopupGridWidgetId = "userWhPopup",
                    userWhColumns = [
                        { filterable: false, title: '登入账号', field: 'loginName', align: 'left', width: "120px"},
                        { filterable: false, title: '用户名称', field: 'userName', align: 'left', width: "120px"},
                    ],
                    userWhDataSource = wmsDataSource({
                        url: url,
                        schema: {
                            model: {
                                id: 'id',
                                field: {
                                    id: {type:"number", editable: false, nullable: true }
                                }
                            }
                        }
//                        pageSize: 10
                    });

                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    widgetId: userWhPopupGridWidgetId,
                    dataSource: userWhDataSource,
                    columns: userWhColumns,
                    selectable: "row",
//                    pageSize: 10,
                    editable: false,
                    height: 280
                }, $scope);

                $scope.selectUser = function(){
                    var selectView = $scope.userWhPopupGrid.select();
                    var selectData = $scope.userWhPopupGrid.dataItem(selectView);

                    if (_.isFunction($scope.userWhPopup.setReturnData)) {
                        $scope.userWhPopup.setReturnData(selectData);
                    }
                    $scope.closeUserWindow();
                };

                $scope.closeUserWindow = function(){
                    $scope.userWhPopup.close();
                };
            }
        ]);
});