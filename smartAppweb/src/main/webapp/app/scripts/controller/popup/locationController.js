/**
 * Created by xiagn on 15/4/1.
 */
define(['scripts/controller/controller'], function(controller, skuModel) {
    "use strict";
    controller.controller('popupLocationController',
        ['$scope','$rootScope','sync','url','wmsDataSource',
            function($scope, $rootScope, $sync, $url, wmsDataSource) {
                var locationUrl = "/location?isActive=1",
                    locationColumns = [
                        {  title: '货区', field: 'zoneId',template:WMS.UTILS.zoneNoFormat, align:'left', width:"100px"},
                        {  title: '货位编号', field: 'locationNo', align:'left', width:"100px"},
                        {  title: '货架类型', field: 'zoneId',template:WMS.UTILS.zoneTypeFormat,align:'left',width:"100px"},
                        {  title: '描述', field: 'description', align: 'left', width: "130px"}
                    ],
                    dataSource = wmsDataSource({
                        url: locationUrl,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "number", editable: false, nullable: true }
                                }
                            }
                        }
                    });
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    autoBind:false,
                    widgetId: "locationPopup",
                    dataSource: dataSource,
                    columns: locationColumns,
                    editable: false,
                    selectable: "row",
                    height: 280
                }, $scope);
                $scope.selectLocation = function(){
                    var selectView = $scope.locationPopupGrid.select();
                    var selectedData = $scope.locationPopupGrid.dataItem(selectView);
                    if(selectedData === null){
                        kendo.ui.ExtAlertDialog.showError("请选择一个货位");
                        return;
                    }
                    if (_.isFunction($scope.locationPopup.setReturnData)) {
                        selectedData.zoneNo = selectedData.description + selectedData.id;
                        $scope.locationPopup.setReturnData(selectedData);
                    }
                    $scope.closeLocationWindow();
                };

                $scope.closeLocationWindow = function(){
                    $scope.query = {};
                    $scope.locationPopupGrid.dataSource.data([]);
                    $scope.locationPopup.close();
                };

                $scope.cancelLocation = function(){
                    if (_.isFunction($scope.locationPopup.setReturnData)) {
                        $scope.locationPopup.setReturnData(null);
                    }
                    $scope.closeLocationWindow();
                };

            }]);

});