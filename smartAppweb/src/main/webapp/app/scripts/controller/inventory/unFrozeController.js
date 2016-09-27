/**
 * Created by fuminwang on 15/3/30.
 */


define(['scripts/controller/controller', '../../model/inventory/frozeModel'], function (controller, froze) {
    "use strict";
    controller.controller('inventoryUnFrozenController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource','$filter',
            function($scope, $rootScope, $sync, $url, wmsDataSource, $filter) {
                var frozeHeaderUrl = $url.inventoryUnfrozeHeaderUrl,
                    frozeHeaderColumns = [
                        WMS.UTILS.CommonColumns.checkboxColumn,
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { title: '解冻单号', field: 'id', align: 'left', width: "150px"},
//                        { title: '租户', field: 'tenantId', align: 'left', width: "150px"},
//                        { title: '仓库', field: 'warehouseId', align: 'left', width: "150px", template:WMS.UTILS.whFormat},
                        { title: '商家', field: 'storerId', align: 'left', width: "150px", template:WMS.UTILS.storerFormat},
                        { title: '参考单号', field: 'referNo', align: 'left', width: "150px"},
                        //{ title: '冻结原因', field: 'reasonCode', align: 'left', width: "150px"},
                        //{ title: '冻结状态', field: 'isHold', align: 'left', width: "150px"},
                        { title: '单据状态', field: 'statusCode', align: 'left', width: "150px", template:WMS.UTILS.codeFormat('statusCode','TicketStatus')},
                        { title: '来源冻结单', field: 'sourceHoldId', align: 'left', width: "150px"},
                        { title: '商品条码', field: 'skuBarcode', align: 'left', width: "160px"},
                        { title: '指定库区', field: 'zoneId', align: 'left', width: "150px", template:WMS.UTILS.zoneNoFormat},
                        { title: '指定货位', field: 'locationId', align: 'left', width: "150px", template:WMS.UTILS.locationFormat},
                        { title: '指定箱号', field: 'cartonNo', align: 'left', width: "150px"},
                        { title: '指定批次号', field: 'lotKey', align: 'left', width: "150px"},
                        //{ title: '指定收货', field: 'receiptId', align: 'left', width: "150px"},
                        { title: '备注', field: 'memo', align: 'left', width: "150px"}
                    ],
                    frozeHeaderDataSource = wmsDataSource({
                        url: frozeHeaderUrl,
                        schema: {
                            model: froze.frozeHeader
                        }
                    });
                frozeHeaderColumns = frozeHeaderColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: frozeHeaderDataSource,
                    toolbar: [{ template:
                        '<a class="k-button k-button-icontext k-grid-add" href="\\#"><span class="k-icon k-add"></span>新增</a>',
                        className:"btn-auth-add"},
                        { template:
                        '<a class="k-button k-grid-custom-command" ng-click="submit()" href="\\#">提交</a>', className:"btn-auth-unfreeze"}],
                    columns: frozeHeaderColumns,
                    editable: {
                        mode: "popup",
                        window:{
                            width:"640px"
                        },
                        template: kendo.template($("#frozen-add").html())
                    },
                    edit: function(e){
//                        $scope.getFrozeData();

                        $scope.changeHoldId();
                    },
                    save: function(e){
                        $('#memo').focus();
                        var model = e.model;

                        if (!model.locationNo || model.locationNo === "") {
                            if ($("#locationNo").val() !== "") {
                                model.locationNo = $("#locationNo").val();
                            }
                        }

                        if(model.sourceHoldId === null ){
                            $rootScope.submitLocation(e.sender, e.model, true, "");


                            e.preventDefault();
                        }
                    },
                    dataBound: function(e) {
                        var grid = this,
                            trs = grid.tbody.find(">tr");
                        _.each(trs, function(tr,i){
                            var record = grid.dataItem(tr);
                            if (record.statusCode !== "Initial") {
                                $(tr).find(".k-button").remove();
                            }
                        });
                    },
                    widgetId: "unHoldHeader"
                }, $scope);
                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;

                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

                $scope.submit = function() {
                    var grid  = $scope.frozenHeaderGrid;
                    var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                    var url="/inventory/state/unfreeze";
                    if(selectData===null || selectData.length === 0){
                        kendo.ui.ExtAlertDialog.showError("请选择提交数据!");
                        return;
                    }
                    if(selectData[0].statusCode === "Submitted"){
                        kendo.ui.ExtAlertDialog.showError("已提交!请勿重复提交!");
                        return;
                    }
                    else{
                        $sync(url,"POST",{
                                data:{id:selectData[0].id}
                            }
                        ).then(function(data){
                                //刷新grid
                                $scope.frozenHeaderGrid.dataSource.read({});
                            });
                    }
                };

                // 初始化检索区数据
//                $scope.query = {
//                    unfrozeDateFrom: $filter('date')(new Date(),'yyyy/MM/dd 00:00:00')
//                };

                $scope.changeHoldId = function($item,$models){
                    $scope.storerIdChange($item,$models);
                    var storerId = $("#storerId")[0].attributes.value.value;
                    $sync(window.BASEPATH + "/inventory/state/all", "GET",{wait:false, data:{storerId:storerId}})
                        .then(function (xhr){
                        $scope.cascadeFrozeData = xhr.result.rows;
                    });
                };
            }]);
})