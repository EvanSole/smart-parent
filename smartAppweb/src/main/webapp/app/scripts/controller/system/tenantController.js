/**
 * Created by a2015-217 on 15/5/12.
 */
define(['scripts/controller/controller', '../../model/system/tenantModel'], function (controller, tenant) {
    "use strict";
    controller.controller('tenantController',['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource','$filter',
            function($scope, $rootScope, $sync, $url, wmsDataSource, $filter) {

                var tenantHeaderUrl = $url.systemTenantUrl,
                    tenantHeaderColumns = [
                        //WMS.GRIDUTILS.CommonOptionButton(),
                        { title: '租户Id', field: 'id', align: 'left', width: "150px"},
                        { title: '租户编号', field: 'tenantNo', align: 'left', width: "200px"},
                        { title: '租户名称', field: 'description', align: 'left', width: "200px"}
                    ],
                    tenantHeaderDataSource = wmsDataSource({
                        url: tenantHeaderUrl,
                        schema: {
                            model: tenant.tenantHeader
                        }
                    });
                tenantHeaderColumns = tenantHeaderColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: tenantHeaderDataSource,
                    toolbar: [{ template:
                        '<a class="k-button k-button-icontext k-grid-add" href="\\#"><span class="k-icon k-add"></span>新增</a>'}],
                    columns: tenantHeaderColumns,
                    editable: {
                        mode: "popup",
                        window:{
                            width:"380"
                        },
                        template: kendo.template($("#tenant-kendo-template").html())
                    }
                }, $scope);

                $scope.search = function() {
                    var condition = {"tenantNo":$scope.tenantNo, "description":$scope.description};
                    $scope.tenantHeaderGrid.dataSource.filter(condition);
                    $scope.tenantHeaderGrid.refresh();
                };

            }]);
})