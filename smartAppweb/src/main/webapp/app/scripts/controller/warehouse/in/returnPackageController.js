define(['scripts/controller/controller'], function (controller) {
    "use strict";
    controller.controller('warehouseInReturnPackageController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource',
            function ($scope, $rootScope, $sync, $url, wmsDataSource) {
                var returnPackageUrl = $url.ReturnPackageUrl,
                    returnPackageColumns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { filterable: false, title: '承运商', field: 'carrierNo', align: 'left', width: "120px"},
                        { filterable: false, title: '物流单号', field: 'carrierReferNo', align: 'left', width: "120px"},
                        { filterable: false, title: '单据状态', field: 'statusCode', template: WMS.UTILS.codeFormat("statusCode", "TicketStatus"), align: 'left', width: "120px"},
                        { filterable: false, title: '联系人', field: 'contacts', align: 'left', width: "120px"},
                        { filterable: false, title: '联系人手机', field: 'contactsTel', align: 'left', width: "120px"},
                        { filterable: false, title: '省份', field: 'province', align: 'left', width: "120px"},
                        { filterable: false, title: '城市', field: 'city', align: 'left', width: "120px"},
                        { filterable: false, title: '区/县', field: 'area', align: 'left', width: "120px"},
                        { filterable: false, title: '街道', field: 'street', align: 'left', width: "120px"},
                        { filterable: false, title: '详细地址', field: 'address', align: 'left', width: "160px", template:function(dataItem) {return WMS.UTILS.tooLongContentFormat(dataItem,'address');}},
                        { filterable: false, title: '退货区', field: 'returnZone', align: 'left', width: "120px"},
                        { filterable: false, title: '备注', field: 'memo', align: 'left', width: "120px"}
                    ],

                    returnPackageDataSource = wmsDataSource({
                        url: returnPackageUrl,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "number", editable: false, nullable: true },
                                    carrierNo: {type: "string", editable: true, nullable: true },
                                    carrierReferNo: {type: "string", editable: true, nullable: true }
                                }
                            }
                        }
                    });
                returnPackageColumns = returnPackageColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: returnPackageDataSource,
                    toolbar: [
                        { name: "create", text: "新增", className: "btn-auth-add"}
                    ],
                    columns: returnPackageColumns,
                    editable: {
                        mode: "popup",
                        template: kendo.template($("#returnPackageEditor").html()),
                        window: {
                            width: "640px"
                        }
                    },
                    filterable: true,
                    dataBound: function (e) {
                        var grid = this,
                            trs = grid.tbody.find(">tr");
                            _.each(trs, function (tr, i) {
                            var returnPackage = grid.dataItem(tr);
                            if (returnPackage.statusCode ===  'Submitted' || returnPackage.statusCode ===  'Confirmed') {
                                  $(tr).find(".k-button").remove();
                            }
                        });
                    }
                }, $scope);
                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;


            }
        ]
    );
});
