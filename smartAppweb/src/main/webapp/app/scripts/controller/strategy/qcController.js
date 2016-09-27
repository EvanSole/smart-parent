define(['scripts/controller/controller', 'scripts/model/strategy/qcModel'], function (controller, model) {
    "use strict";
    controller.controller('strategyQcController',
        ['$scope', '$rootScope', '$http', 'url', 'wmsDataSource',
            function ($scope, $rootScope, $http, $url, wmsDataSource) {
                var url = $url.strategyQcUrl,
                    columns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { filterable: false, title: '策略名称', field: 'strategyName', align: 'left', width: "100px"},
                        { field: 'isActive', title: '是否可用', template: WMS.UTILS.checkboxTmp("isActive"), filterable: true, width: '150px'},
                        { field: 'isDefault', title: '是否默认', template: WMS.UTILS.checkboxTmp("isDefault"), filterable: true, align: 'left', width: '150px'},
                        { filterable: false, title: '抽检比例', field: 'samplingRatio', align: 'left', width: "100px"},
                        { filterable: false, title: '是否向上取整',template: WMS.UTILS.codeFormat('isIntCeiling', 'IsRounding'),field: 'isIntCeiling', align: 'left', width: "120px"},
                        { filterable: false, title: '描述', field: 'description', align: 'left', width: "100px",template: function (dataItem) {return WMS.UTILS.tooLongContentFormat(dataItem, 'description');}}
                    ],
                    DataSource = wmsDataSource({
                        url: url,
                        schema: {
                            model: model.entity
                        },
                        callback: {
                            update: function (response, editData) {
                                $scope.mainGridOptions.dataSource.read();//刷新detailGrid
                            }
                        }
                    });
                columns = columns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: DataSource,
                    toolbar: [
                        { name: "create", text: "新增"}
                    ],
                    columns: columns,
                    editable: {
                        mode: "popup",
                        window:{
                            width:"620px"
                        },
                        template: kendo.template($("#qc-editor").html())
                    }
                }, $scope);


                $scope.change = function(data){
                    var _this = data.dataItem;
                    _this.dirty = true;//告诉FF浏览器，这条数据修改了，要请求后台
                    if(_this.isDefault){
                        _this.set("isActive", true);
                    }else{
                        _this.set("isActive", false);
                    }
                };

                $scope.detailGrid = function (dataItem) {
                    var detailGrid = WMS.GRIDUTILS.getGridOptions({
                        widgetId: "detail",
                        height: 200,
                        dataSource: wmsDataSource({
                            url: url + "/" + dataItem.id + "/details",
                            schema: {
                                model: {
                                    id: "id",
                                    fields: {
                                        id: {type: "number", editable: false, nullable: true }
                                    }
                                },
                                total: function (total) {
                                    return total.length > 0 ? total[0].total : 0;
                                }
                            } ,
//                            parseRequestData: function (data, method) {
//                                if (method === "create" || method === "update") {
//                                    data.sku = data.skuSku;
//                                }
//                                return data;
//                            },
                            otherData: {"qcStrategyId": dataItem.id}
                        }),
                        editable: {
                            mode: "popup",
                            window: {
                                width: "660px"
                            },
                            template: kendo.template($("#detail-editor").html())
                        }
//                        edit: function (e) {
//                            if (!e.model.isNew()) {
//                                editQty = e.model.expectedQty;
//                            }
//                        }
                    }, $scope);

                    var detailColumns = [];
                        detailGrid.toolbar = [
                            { name: "create", text: "新增", className: "btn-auth-add-detail"}
                        ];
                        detailColumns = [
                            WMS.GRIDUTILS.deleteOptionButton("detail"),
                            { filterable: false, title: '项目编号', field: 'qcItemId', align: 'left', width: "120px;"},
                            { filterable: false, title: '项目名称', field: 'name', align: 'left', width: "120px;"}
                        ];
                    detailColumns = detailColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                    detailGrid.columns = detailColumns;
                    return detailGrid;
                };
            }]);
})