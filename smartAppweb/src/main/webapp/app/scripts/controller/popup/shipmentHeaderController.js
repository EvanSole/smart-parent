define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('popupShipmentHeaderController',
        ['$scope','$rootScope','sync','wmsDataSource',
            function($scope, $rootScope, $sync, wmsDataSource) {

                    var selectable = "row",
                    headerColumns = [
                        { title: '数据来源', field: 'datasourceCode', align: 'left',width:"120px;",template:WMS.UTILS.codeFormat('datasourceCode','DataSource')},
                        { title: '出库单号', field: 'id', align: 'left',width:"120px;"},
                        { title: '通知单号', field: 'dnId', align: 'left',width:"120px;"},
                        { title: '参考单号', field: 'referNo', align: 'left',width:"120px;"},
                        { title: '交易单号', field: 'tradeNos', align: 'left',width:"120px;"},
                        { title: '仓库名称', field: 'warehouseId', align: 'left',width:"120px;", template: WMS.UTILS.whFormat},
                        { title: '商家名称', field: 'storerId', align: 'left',width:"120px;", template: WMS.UTILS.storerFormat},
                        { title: '波次单号', field: 'waveId', align: 'left',width:"120px;"},
                        { title: '波次序号', field: 'waveSeq', align: 'left',width:"120px;"},
                        { title: '拣货货区', field: 'defaultZoneNo', align: 'left',width:"120px;"},
                        { title: '拣货货位', field: 'defaultLocationNo', align: 'left',width:"120px;"},
                        { title: '活动名称', field: 'promotionId', align: 'left',width:"120px;"},
                        { title: '店铺名称', field: 'shopName', align: 'left',width:"120px"},
                        { title: '分销商', field: 'distributorName', align: 'left',width:"120px"},
                        { title: '会员', field: 'buyerName', align: 'left',width:"120px"},
                        { title: '收货人', field: 'receiverName', align: 'left',width:"120px"},
                        { title: 'OMS取消', field: 'isCancelled',template:WMS.UTILS.checkboxTmp("isCancelled"), align: 'left',width:"120px"},
                        { title: 'WMS拒单', field: 'isClosed',template:WMS.UTILS.checkboxTmp("isClosed"), align: 'left',width:"120px"},
                        { title: '单据状态', field: 'statusCode',template:WMS.UTILS.codeFormat("statusCode","TicketStatus"), align: 'left',width:"120px"},
                        { title: '分配状态', field: 'allocateStatuscode',template:WMS.UTILS.codeFormat("allocateStatuscode","OrderOperationStatus"), align: 'left',width:"120px"},
                        { title: '拣货状态', field: 'pickStatuscode',template:WMS.UTILS.codeFormat("pickStatuscode","OrderOperationStatus"), align: 'left',width:"120px"},
                        { title: '复核状态', field: 'checkStatuscode',template:WMS.UTILS.codeFormat("checkStatuscode","OrderOperationStatus"), align: 'left',width:"120px"},
                        { title: '打包状态', field: 'packageStatuscode',template:WMS.UTILS.codeFormat("packageStatuscode","OrderOperationStatus"), align: 'left',width:"120px"},
                        { title: '称重状态', field: 'weightStatuscode',template:WMS.UTILS.codeFormat("weightStatuscode","OrderOperationStatus"), align: 'left',width:"120px"},
                        { title: '发货状态', field: 'deliveryStatuscode',template:WMS.UTILS.codeFormat("deliveryStatuscode","OrderOperationStatus"), align: 'left',width:"120px"},
                        { title: '交接状态', field: 'handoverStatuscode',template:WMS.UTILS.codeFormat("handoverStatuscode","OrderOperationStatus"), align: 'left',width:"120px"},
                        { title: '发票号', field: 'invoiceNo', align: 'left',width:"120px"},
                        { title: '订单日期', field: 'orderTime',template:WMS.UTILS.timestampFormat("orderTime","yyyy-MM-dd"),align: 'left',width:"120px"},
                        { title: '支付时间', field: 'paymentTime',template:WMS.UTILS.timestampFormat("paymentTime","yyyy-MM-dd"), align: 'left',width:"120px"},
                        { title: '承运商', field: 'carrierCode',template:WMS.UTILS.codeFormat("carrierCode","Carrier"), align: 'left',width:"120px"},
                        { title: '物流单号', field: 'carrierReferNo', align: 'left',width:"120px"}

                    ],

                headerColumns = headerColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                headerColumns.splice(0,0,WMS.UTILS.CommonColumns.checkboxColumn);
                $scope.shipmentsGridOptions =WMS.GRIDUTILS.getGridOptions({
                    dataSource: {},
                    columns: headerColumns,
                    editable: false,
                    moudleName:'出库单',
                    selectable: "row",
                    widgetId: "header"
//                    autoBind:false

                }, $scope);

                $scope.$on("kendoWidgetCreated", function (event, widget) {
                    if (widget.options !== undefined && widget.options.widgetId === 'header') {
                        if (_.isFunction($scope.shipmentPopup.initParam)) {
                            $scope.shipmentPopup.initParam($scope);
                            if ($scope.selectable) {
                                selectable = $scope.selectable;
                            }
                            if ($scope.url) {
                               var shipmentUrl = $scope.url;
                                widget.setOptions({selectable: selectable,columns:headerColumns});
                            }
                            var shipmentHeaderDataSource = wmsDataSource({
                                url: $scope.url,
                                schema: {
                                    model: {
                                        id:"id",
                                        fields: {
                                            id: {type:"number", editable: false, nullable: true },
                                            isCancelled: {type:"boolean"},
                                            isClosed: {type:"boolean"},
                                            isPrintexpress: {type:"boolean"},
                                            isPrintdelivery: {type:"boolean"},
                                            isPrintPicking: {type:"boolean"}

                                        }
                                    }
                                }
                            });
                            widget.setDataSource(shipmentHeaderDataSource);
                            widget.refresh();
                        }

                    }


                       //选中出库单信息
                    $scope.selectShipment = function(){
                        var selectView = $scope.shipmentGrid.select();
                        if (selectable !== "row") {
                            var selectedDataArray = _.map(selectView, function(view) {
                                return $scope.shipmentGrid.dataItem(view);
                            });
                            if (_.isFunction($scope.shipmentPopup.setReturnData)) {
                                $scope.shipmentPopup.setReturnData(selectedDataArray);
                            }
                        } else {
                            var selectedData = $scope.shipmentGrid.dataItem(selectView);
                            if (_.isFunction($scope.shipmentPopup.setReturnData)) {
                                $scope.shipmentPopup.setReturnData(selectedData);
                            }
                        }

                        $scope.closeShipmentWindow();
                    };

                    $scope.closeShipmentWindow = function(){
                        $scope.shipmentPopup.close();
                    };


                });


            }]);



})