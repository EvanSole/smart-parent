define(['scripts/controller/controller', '../../model/inventory/cycleModel'], function (controller, model) {
    "use strict";
    controller.controller('inventoryCycleController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource', "$filter",
            function ($scope, $rootScope, $sync, $url, wmsDataSource, $filter) {

                var gridName = "盘点";
                var cycleHeaderUrl = $url.inventoryCycleHeaderUrl,
                    cycleHeaderColumns = [
//                        WMS.UTILS.CommonColumns.checkboxColumn,
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { title: '盘点单号', field: 'id', align: 'left', width: "110px"},
                        { title: '仓库', field: 'warehouseId', align: 'left', width: "100px", template:WMS.UTILS.whFormat},
                        { title: '商家', field: 'storerId', align: 'left', width: "100px", template:WMS.UTILS.storerFormat},
                        { title: '盘点类型', field: 'typeCode', align: 'left', width: "110px", template:WMS.UTILS.codeFormat('typeCode', 'CycleCountType')},
                        { title: '盘点时间', field: 'operateTime', align: 'left', width: "110px", template: WMS.UTILS.timestampFormat("operateTime")},
                        { title: '单据状态', field: 'statusCode', align: 'left', width: "110px", template:WMS.UTILS.codeFormat('statusCode', 'TicketStatus')},
                        { title: '总品种数', field: 'totalCategoryQty', align: 'left', width: "110px"},
                        { title: '总货位数', field: 'totallOcationQty', align: 'left', width: "110px"},
                        { title: '备注', field: 'memo', align: 'left', width: "100px"}
                    ],
                    detailColumns = [
                        WMS.GRIDUTILS.CommonOptionButton("detail"),
                        {filterable: false, title: '指定库区', field: 'zoneId', align: 'left', width: "110px", template:WMS.UTILS.zoneNoFormat},
                        {filterable: false, title: '指定货位', field: 'locationId', align: 'left', width: "110px", template:WMS.UTILS.locationFormat},
                        {filterable: false, title: '指定箱号', field: 'cartonNo', align: 'left', width: "110px"},
                        {filterable: false, title: '商品条码', field: 'skuBarcode', align: 'left', width: "160px"},
                        {filterable: false, title: '账面数量', field: 'systemQty', align: 'left', width: "110px"},
                        {filterable: false, title: '实际数量', field: 'countQty', align: 'left', width: "110px"},
                        {filterable: false, title: '复盘数量', field: 'recountQty', align: 'left', width: "110px"},
                        {filterable: false, title: '是否已盘', field: 'isCounted', align: 'left', width: "110px", template: WMS.UTILS.checkboxDisabledTmp('isCounted')},
                        {filterable: false, title: '描述', field: 'description', align: 'left', width: "200px"},
                        {filterable: false, title: '盘点次数', field: 'counter', align: 'left', width: "110px"}
                    ],
                    detailBaseColumns = [
                        {filterable: false, title: '指定库区', field: 'zoneId', align: 'left', width: "110px", template:WMS.UTILS.zoneNoFormat},
                        {filterable: false, title: '指定货位', field: 'locationId', align: 'left', width: "110px", template:WMS.UTILS.locationFormat},
                        {filterable: false, title: '指定箱号', field: 'cartonNo', align: 'left', width: "110px"},
                        {filterable: false, title: '商品条码', field: 'skuBarcode', align: 'left', width: "160px"},
                        {filterable: false, title: '账面数量', field: 'systemQty', align: 'left', width: "110px"},
                        {filterable: false, title: '实际数量', field: 'countQty', align: 'left', width: "110px"},
                        {filterable: false, title: '复盘数量', field: 'recountQty', align: 'left', width: "110px"},
                        {filterable: false, title: '是否已盘', field: 'isCounted', align: 'left', width: "110px", template: WMS.UTILS.checkboxDisabledTmp('isCounted')},
                        {filterable: false, title: '描述', field: 'description', align: 'left', width: "200px"},
                        {filterable: false, title: '盘点次数', field: 'counter', align: 'left', width: "110px"}
                    ],
                    cycleHeaderDataSource = wmsDataSource({
                        url: cycleHeaderUrl,
                        schema: {
                            model: model.cycleHeader
                        }
                    });
                cycleHeaderColumns = cycleHeaderColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                detailColumns = detailColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    moudleName: gridName,
                    dataSource: cycleHeaderDataSource,
                    selectable:"row",
                    toolbar: [
                        { name: "create", text: "新增", className:"btn-auth-add"},
                        {template: '<kendo-button class="k-primary" ng-click="submit()">提交</kendo-button>',className:"btn-auth-submit"},
                        {template: '<kendo-button class="k-primary" ng-click="affirm()">确认</kendo-button>',className:"btn-auth-affirm"},
                        {template: '<kendo-button class="k-primary" ng-click="repeal()">撤销</kendo-button>',className:"btn-auth-repeal"}
                    ],
                    columns: cycleHeaderColumns,
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
                    editable: {
                        mode: "popup",
                        window: {
                            width: "640px"
                        },
                        template: kendo.template($("#form-add").html())
                    },
                    edit:function(e){
//                        $scope.$$childTail.zoneTypeCode = e.model.zoneTypeCode;
//                        $scope.$$childTail.sourceIds = e.model.sourceIds;
                    }
                }, $scope);

                $scope.cycleDetailOptions = function(dataItem){
                    var cycleDetailColumns = [];
                    if(dataItem.statusCode === "Initial" || dataItem.statusCode === "Submitted"){
                        cycleDetailColumns = [WMS.GRIDUTILS.CommonOptionButton("detail")];
                    }
                    cycleDetailColumns = cycleDetailColumns.concat(detailBaseColumns);
                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource: wmsDataSource({
                            url: cycleHeaderUrl + "/" + dataItem.id + "/detail",
                            schema: {
                                model: {
                                    id: "id",
                                    fields: {
                                        id: {type: "number", editable: false, nullable: true }
                                    }
                                }
                            },
                            pageSize: 5
                        }),
                        editable:{
                            mode: "popup",
                            window:{
                                width: "640px"
                            },
                            template: kendo.template($("#detail-form-edit").html())
                        },
                        toolbar: [
                        ],
                        columns: cycleDetailColumns
                    }, $scope);
                };

                $scope.cycleDetailReviewOptions = function(dataItem){
                    var toolbar = [],
                        cycleDetailColumns = [];
                    if(dataItem.statusCode === "Initial" || dataItem.statusCode === "Submitted"){
                        toolbar = [{
                            template:
                                '<a class="k-button k-grid-custom-command" ng-click="changeStatus(\'review\')" href="\\#">复核</a>'
                        }];
                        cycleDetailColumns = [WMS.GRIDUTILS.CommonOptionButton("review")];
                    }
                    cycleDetailColumns = cycleDetailColumns.concat(detailBaseColumns);

                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource: wmsDataSource({
                            url: cycleHeaderUrl + "/" + dataItem.id + "/detailReview",
                            schema: {
                                model: {
                                    id: "id",
                                    fields: {
                                        id: {type: "number", editable: false, nullable: true }
                                    }
                                }
                            },
                            pageSize: 5
                        }),

                        toolbar: toolbar,
                        columns: cycleDetailColumns,
                        selectable: "row"
                    }, $scope);
                };


                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;

                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;
//                $scope.search = function () {
//                    var condition = {"id": $scope.cycId, "startTime": $scope.startTime, "endTime": $scope.endTime};
//                    $scope.cycleHeaderGrid.dataSource.filter(condition);
//                    $scope.cycleHeaderGrid.refresh();
//                };

//                $scope.$on("kendoWidgetCreated", function (event, widget) {
//                    if (widget.options !== undefined && widget.options.moudleName === gridName) {
//                        widget.bind("edit", function (e) {
//                            $scope.editModel = e.model;
//                        });
//                    }
//                });

//                $scope.windowOpen = function () {
//                    var currentData = this.dataItem;
//                    $scope.skuPopup.refresh().open().center();
////                    $scope.skuPopup.selectable = "row";
//                    $scope.skuPopup.setReturnData = function(returnData) {
//                        if (_.isEmpty(returnData)) {
//                            return;
//                        }
//                        currentData.set("sku", returnData.sku);
//                    };
//                };

                $scope.changeStatus = function(status){
                    var cycleDetailReviewGrid = this.cycleDetailReviewGrid;
                    if(cycleDetailReviewGrid){
                        var selectView = cycleDetailReviewGrid.select();
                        var selectData = cycleDetailReviewGrid.dataItem(selectView);
                        if(selectData===null || selectData.length ==0){
                            kendo.ui.ExtAlertDialog.showError("请选择一条数据!");
                            return;
                        }
                        $sync(cycleHeaderUrl + "/" + selectData.id + "/detailReview","PUT",
                            {data:{id:selectData.id}})
                            .then(function(){
                                $(selectView).find(".k-button").remove();
                            });
                    }
                };

                //提交方法
                $scope.submit = function() {
                    var grid  = $scope.cycleHeaderGrid;
                    var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                    var url="/inventory/check/submit";

                    if(selectData===null || selectData.length ==0){
                        kendo.ui.ExtAlertDialog.showError("请选择一条数据!");
                        return;
                    }
                    else{
                        $sync(url,"POST",{data:{"id":selectData[0].id}})
                        .then(function(){
                            $scope.cycleHeaderGrid.dataSource.read({});
                        });
                    }
                };
                //确认
                $scope.affirm = function(){
                    var grid = $scope.cycleHeaderGrid;
                    var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                    var url = "/inventory/check/affirm";
                    if(selectData===null || selectData.length ==0){
                        kendo.ui.ExtAlertDialog.showError("请选择一条数据!");
                        return;
                    }
                    else{
                        $sync(url, "POST",{data:{id:selectData[0].id}})
                        .then(function(data){
                            $scope.cycleHeaderGrid.dataSource.read({});
                        });
                    }
                };

                //撤销
                $scope.repeal = function(){
                    var grid = $scope.cycleHeaderGrid;
                    var selectData = WMS.GRIDUTILS.getCustomSelectedData(grid);
                    var url = "/inventory/check/repeal";
                    if(selectData===null || selectData.length ==0){
                        kendo.ui.ExtAlertDialog.showError("请选择一条数据!");
                        return;
                    }
                    else{
                        $sync(url, "POST",{data:{id:selectData[0].id}})
                          .then(function(data){
                                $scope.cycleHeaderGrid.dataSource.read({});
                          });
                      }
                };

                // 初始化检索区数据
                $scope.query = {
                    startTime: $filter('date')(new Date(),'yyyy/MM/dd 00:00:00')
                };
//
//                $scope.windowLocationOpen = function(parentGrid){
//                    $scope.locationPopup.refresh().open().center();
//                    $scope.locationPopup.setReturnData = function(returnData){
//                        if(returnData){
//                            $("#locationNo").val(returnData.locationNo);
//                            $scope.editModel.set("zoneTypeCode",returnData.zoneId);
//                            $scope.editModel.set("zoneNo",returnData.zoneNo);
//                            $scope.editModel.set("sourceIds",returnData.id);
//                            $scope.$$childTail.zoneTypeCode = returnData.zoneId;
//                            $scope.$$childTail.sourceIds = returnData.id;
//                        }else{
//                            $("#locationNo").val("");
//                            $scope.editModel.set("zoneTypeCode","");
//                            $scope.editModel.set("zoneNo","");
//                            $scope.editModel.set("sourceIds","");
//                            $scope.$$childTail.zoneTypeCode = "";
//                            $scope.$$childTail.sourceIds = "";
//                        }
//                    };
//                };


            }]);

})