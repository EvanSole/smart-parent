define(['scripts/controller/controller'], function (controller) {
    "use strict";
    controller.controller('commodityTypeController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource',
            function ($scope, $rootScope, $sync, $url, wmsDataSource) {
                var commodityTypeUrl = $url.dataCommodityTypeUrl,
                    commodityTypeColumns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        {filterable: false, title: '类别名称', field: 'typeName', align: 'left', width: "250px"},
                        {filterable: false, title: '收货策略', field: 'receiptStrategy', align: 'left', width: "100px",template:WMS.UTILS.receiptStrategyFormat},
                        {filterable: false, title: '质检策略', field: 'qcStrategy', align: 'left', width: "100px",template:WMS.UTILS.qcStrategyFormat}
                    ],
                    commodityTypeDataSource = wmsDataSource({
                        url: commodityTypeUrl,
                        schema: {
                            model: {
                                id:"id"
                            }
                        }
                    });

                commodityTypeColumns = commodityTypeColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);

                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: commodityTypeDataSource,
                    toolbar: [
                        {name: "create", text: "新增", className: "btn-auth-add"}
                    ],
                    columns: commodityTypeColumns,
                    editable: {mode: "popup", window: {
                        width: "620px"
                    }, template: kendo.template($("#commodityTypeEdit").html())}
                }, $scope);

            }

        ]);

});
