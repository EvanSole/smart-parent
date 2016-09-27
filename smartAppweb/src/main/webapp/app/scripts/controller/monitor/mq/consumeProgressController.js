/**
 * Created by MLS on 15/3/31.
 */

define(['scripts/controller/controller'], function (controller) {
    "use strict";
    controller.controller('monitorMqConsumeProgressController',
        ['$scope', '$rootScope', '$http', 'url', 'wmsDataSource',
            function ($scope, $rootScope, $http, $url, wmsDataSource) {
                var headerUrl = $url.monitorMqConsumeProgressUrl,
                    headerColumns = [
                        { filterable: false, title: 'topic', field: 'topic', align: 'left', width: "150px"},
                        { filterable: false, title: 'broker名', field: 'brokerName', align: 'left', width: "100px"},
                        { filterable: false, title: '队列id', field: 'qId', align: 'left', width: "80px"},
                        { filterable: false, title: 'BrokerOffset', field: 'brokerOffset', align: 'left', width: "150px"},
                        { filterable: false, title: 'ConsumerOffset', field: 'consumerOffset', align: 'left', width: "150px"},
                        { filterable: false, title: '未消费数', field: 'diff', align: 'left', width: "150px"}
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