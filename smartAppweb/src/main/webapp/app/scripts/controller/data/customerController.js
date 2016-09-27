/**
 * Created by MLS on 15/3/31.
 */

define(['scripts/controller/controller', 'scripts/model/data/customerModel'], function(controller, customer) {
    "use strict";
    controller.controller('dataCustomerController',
        ['$scope', '$rootScope', '$http', 'url', 'wmsDataSource',
            function($scope, $rootScope, $http, $url, wmsDataSource) {
                var headerUrl = $url.dataCustomerUrl,
                    headerColumns = [
                        //WMS.UTILS.CommonColumns.checkboxColumn,
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { filterable: false, title: '商家名称', field: 'storerId', align: 'left', width: "100px",template:WMS.UTILS.storerFormat},
                        { filterable: false, title: '客户编号', field: 'customerNo', align: 'left', width: "150px"},
                        { filterable: false, title: '客户简称', field: 'shortName', align: 'left', width: "150px"},
                        { filterable: false, title: '客户全称', field: 'longName', align: 'left', width: "150px"},
                        { filterable: false, title: '国家', field: 'country', align: 'left', width: "100px"},
                        { filterable: false, title: '省份', field: 'state', align: 'left', width: "100px"},
                        { filterable: false, title: '城市', field: 'city', align: 'left', width: "100px"},
                        { filterable: false, title: '地区', field: 'district', align: 'left', width: "150px"},
                        { filterable: false, title: '可用', field: 'isActive', template: WMS.UTILS.checkboxDisabledTmp("isActive"), align: 'left', width: "75px"}
                    ],

                    headerDataSource = wmsDataSource({
                        url: headerUrl,
                        schema: {
                            model: customer.header
                        }
                    });

                headerColumns = headerColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);

                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: headerDataSource,
                    toolbar: [{ name: "create", text: "新增", className:"btn-auth-add"}],
                    columns: headerColumns,
                    editable: {mode: "popup",window:{
                        width:"650px"
                    }, template: kendo.template($("#customerEditor").html())}
                }, $scope);


            }]);

})