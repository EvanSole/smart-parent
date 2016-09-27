define(['../controller',
        '../../model/warehouse/out/shipmentHeaderModel'
    ], function (controller, shipmentHeaderModel) {
        "use strict";
        controller.controller('reportOutShipmentDeliveredController',
            ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource',
                function ($scope, $rootScope, $sync, $url, wmsDataSource) {
                    var shipmentHeaderUrl = $url.warehouseOutShipmentHeaderUrl,
                        shipmentHeaderColumns = [
                            {filterable: false, title: '商家名称', field: 'storerId', align: 'left', width: "120px;", template: WMS.UTILS.storerFormat},
                            {filterable: false, title: '订单来源', field: 'fromtypeCode', align: 'left', width: "100px", template: WMS.UTILS.codeFormat('fromtypeCode', 'AllShipmentFrom')},
                            {filterable: false, title: '店铺名称', field: 'shopName', align: 'left', width: "120px"},
                            {filterable: false, title: '出库单号', field: 'id', align: 'left', width: "120px"},
                            {filterable: false, title: 'ERP单号', field: 'fromErpNo', align: 'left', width: "120px;"},
    /*                        {filterable: false, title: '波次单号', field: 'waveId', align: 'left',width:"120px;"},*/
                            {filterable: false, title: '参考单号', field: 'referNo', align: 'left',width:"120px;"},
                            {filterable: false, title: '承运商', field: 'carrierNo', template: WMS.UTILS.carrierFormat, align: 'left', width: "120px"},
                            {filterable: false, title: '物流单号', field: 'carrierReferNo', align: 'left',width:"120px"},
                            {filterable: false, title: '发货时间', field: 'deliveryTime', template: WMS.UTILS.timestampFormat("deliveryTime", "yyyy-MM-dd HH:mm:ss"), align: 'left', width: "150px"},
                            {filterable: false, title: '收件人姓名', field: 'receiverName', align: 'left', width: "120px"},
                            {filterable: false, title: '省份', field: 'stateName', align: 'left', width: "120px"},
                            {filterable: false, title: '城市', field: 'cityName', align: 'left', width: "120px"},
                            {filterable: false, title: '区县', field: 'districtName', align: 'left', width: "120px"},
                            {filterable: false, title: '收货地址', field: 'address', align: 'left', width: "120px", template:function(dataItem) {return WMS.UTILS.tooLongContentFormat(dataItem,'address');}},
                            {filterable: false, title: '重量', field: 'totalWeight', align: 'left', width: "120px"},
                            {filterable: false, title: '箱型', field: 'cartongroupCode', align: 'left', width: "120px"},
                            {filterable: false, title: '下单时间', field: 'orderTime', template: WMS.UTILS.timestampFormat("orderTime", "yyyy-MM-dd HH:mm:ss"), align: 'left', width: "150px"},
                            {filterable: false, title: '创建时间', field: 'createTime', template: WMS.UTILS.timestampFormat("createTime", "yyyy-MM-dd HH:mm:ss"), align: 'left', width: "150px"}
                        ],
                        shipmentHeaderDataSource = wmsDataSource({
                            url: shipmentHeaderUrl,
                            schema: {
                                model: shipmentHeaderModel.shipmentHeader
                            }
                        });
                    $scope.shipmentDeliveredOptions = WMS.GRIDUTILS.getGridOptions({
                        dataSource: shipmentHeaderDataSource,
                        exportable: true,
                        rowsSizePerRequest:20000,
                        toolbar: [
                        ],
                        columns: shipmentHeaderColumns
                    }, $scope);
                }
            ]
        );
    }
)