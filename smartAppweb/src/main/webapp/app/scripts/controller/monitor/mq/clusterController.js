/**
 * Created by MLS on 15/3/31.
 */

define(['scripts/controller/controller'], function (controller) {
    "use strict";
    controller.controller('monitorMqClusterController',
        ['$scope', '$rootScope', '$http', 'url', 'wmsDataSource',
            function ($scope, $rootScope, $http, $url, wmsDataSource) {
                var headerUrl = $url.monitorMqClusterUrl,
                    headerColumns = [
                        { filterable: false, title: '集群', field: 'culsterName', align: 'left', width: "150px"},
                        { filterable: false, title: 'broker名', field: 'brokerName', align: 'left', width: "100px"},
                        { filterable: false, title: '实例id', field: 'id', align: 'left', width: "80px"},
                        { filterable: false, title: '地址', field: 'addr', align: 'left', width: "150px"},
                        { filterable: false, title: '版本', field: 'version', align: 'left', width: "80px"},
                        { filterable: false, title: '入队tps', field: 'InTPS', align: 'left', width: "100px"},
                        { filterable: false, title: '出队tps', field: 'OutTPS', align: 'left', width: "100px"},
                        { filterable: false, title: '入队总tps(昨)', field: 'InTotalYest', align: 'left', width: "120px"},
                        { filterable: false, title: '出队总tps(昨)', field: 'OutTotalYest', align: 'left', width: "120px"},
                        { filterable: false, title: '入队总tps', field: 'InTotalToday', align: 'left', width: "100px"},
                        { filterable: false, title: '出队总tps', field: 'OutTotalToday',align: 'left', width: "100px"}
                    ],

                    headerDataSource = wmsDataSource({
                        url: headerUrl
                    });


                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: headerDataSource,
                    columns: headerColumns
                }, $scope);


            }]);

})