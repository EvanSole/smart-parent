/**
 * Created by zw .
 */

define(['scripts/controller/controller', 'scripts/model/data/shopModel'], function (controller, shopModel) {
    "use strict";
    controller.controller('dataShopController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource',
            function ($scope, $rootScope, $sync, $url, wmsDataSource) {
                var shopUrl = $url.dataShopUrl,
                    shopColumns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        {filterable: false, title: '商家', field: 'storerId', align: 'left', width: "150px", template: WMS.UTILS.storerFormat},
                        {filterable: false, title: '店铺编号', field: 'shopNo', align: 'left', width: "150px"},
                        {filterable: false, title: '店铺名称', field: 'shopName', align: 'left', width: "250px"},
                        {filterable: false, title: '所属平台', field: 'platformCode', align: 'left', width: "100px", template: WMS.UTILS.codeFormat('platformCode', 'ShopPlatform')},
                        {filterable: false, title: '可用', field: 'isActive', align: 'left', width: "100px", template: WMS.UTILS.checkboxDisabledTmp('isActive')},
                        {filterable: false, title: '已授权', field: 'token', align: 'left', width: "100px", template: WMS.UTILS.checkboxAuthTmp('token')},
                        {filterable: false, title: '国家', field: 'country', align: 'left', width: "120px"},
                        {filterable: false, title: '省份', field: 'state', align: 'left', width: "120px"},
                        {filterable: false, title: '城市', field: 'city', align: 'left', width: "120px"}
                    ],
                    shopDataSource = wmsDataSource({
                        url: shopUrl,
                        schema: {
                            model: shopModel.shop
                        }
                    });

                shopColumns = shopColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: shopDataSource,
                    toolbar: [
                        {name: "create", text: "新增", className: "btn-auth-add"}
                    ],
                    columns: shopColumns,
                    editable: {mode: "popup", window: {
                        width: "620px"
                    }, template: kendo.template($("#shopEdit").html())}
                }, $scope);

            }

        ]);

});
