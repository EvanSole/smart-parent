define(['scripts/controller/controller',
    '../../model/inventory/countModel'
], function(controller, countModel){
    "use strict";
    controller.controller('inventoryCountController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource', '$filter',
            function($scope, $rootScope, $sync, $url, wmsDataSource, $filter){

                function timestampFormat(tempstamp, format) {
                    var dateFormat = "yyyy/MM/dd HH:mm:ss";
                    if (format === undefined) {
                        format = dateFormat;
                    }
                    return "<span ng-bind=\"dataItem." + tempstamp + "|date:'" + format + "'\"></span>";
                }

                var inventoryCountUrl = $url.inventoryCountUrl,
                    inventoryCountColumns = [
//                        WMS.UTILS.CommonColumns.checkboxColumn,
                        WMS.GRIDUTILS.deleteOptionButton(),
                        { field: 'id', title: '盘点单号', filterable: false, align:'left', width: '110px'},
                        { field: 'typeCode', title: '盘点类型', filterable: false, align:'left', width: '110px', template:WMS.UTILS.codeFormat("typeCode", "CountTypeCode")},
                        { field: 'modeCode', title: '盘点方式', filterable: false, align:'left', width: '110px', template:WMS.UTILS.codeFormat("modeCode", "CountModeCode")},
                        { field: 'originalInventoryCount', title: '原盘点单号', filterable: false, align:'left', width: '110px'},
                        { field: 'countPercent', title: '盘点比例', filterable: false, align:'left', width: '110px'},
                        { field: 'isNullLoc', title: '盘点空库位', filterable: false, align:'left', width: '110px', template: WMS.UTILS.checkboxDisabledTmp('isNullLoc')},
                        { field: 'statusCode', title: '盘点状态', filterable: false, align:'left', width: '110px', template:WMS.UTILS.codeFormat("statusCode", "CountStatus")},
                        { field: 'storer', title: '商家', filterable: false, align:'left', width: '110px', template: function (dataItem) {return WMS.UTILS.tooLongContentFormat(dataItem, 'storer');}}
                    ],
//                    inventoryCountLocColumns = [
//                        WMS.UTILS.CommonColumns.checkboxColumn,
//                        { field: 'id', title: '盘点任务号', filterable: false, align:'left', width: '110px'},
//                        { field: 'inventoryCountId', title: '盘点单号', filterable: false, align:'left', width: '110px'},
//                        { field: 'zoneId', title: '库区', filterable: false, align:'left', width: '110px', template:WMS.UTILS.zoneNoFormat},
//                        { field: 'locationId', title: '货位', filterable: false, align:'left', width: '110px', template:WMS.UTILS.locationFormat},
//                        { field: 'statusCode', title: '盘点状态', filterable: false, align:'left', width: '110px', template:WMS.UTILS.codeFormat("statusCode", "CountLocStatusCode")},
//                        { field: 'systemQty', title: '系统数量', filterable: false, align:'left', width: '110px'},
//                        { field: 'countQty', title: '实盘数量', filterable: false, align:'left', width: '110px'},
//                        { field: 'assignUser', title: '指定盘点人', filterable: false, align:'left', width: '110px'},
//                        { field: 'realUser', title: '实际盘点人', filterable: false, align:'left', width: '110px'}
//                    ],
                    inventoryCountLocBaseColumns = [
                        { field: 'id', title: '盘点任务号', filterable: false, align:'left', width: '110px'},
                        { field: 'inventoryCountId', title: '盘点单号', filterable: false, align:'left', width: '110px'},
                        { field: 'zoneId', title: '库区', filterable: false, align:'left', width: '110px', template:WMS.UTILS.zoneNoFormat},
                        { field: 'channel', title: '巷道', filterable: false, align:'left', width: '110px'},
                        { field: 'locationId', title: '货位', filterable: false, align:'left', width: '110px', template:WMS.UTILS.locationFormat},
                        { field: 'statusCode', title: '盘点状态', filterable: false, align:'left', width: '110px', template:WMS.UTILS.codeFormat("statusCode", "CountLocStatusCode")},
                        { field: 'systemQty', title: '系统数量', filterable: false, align:'left', width: '110px'},
                        { field: 'countQty', title: '实盘数量', filterable: false, align:'left', width: '110px'},
                        { field: 'assignUser', title: '指定盘点人', filterable: false, align:'left', width: '110px'},
                        { field: 'realUser', title: '实际盘点人', filterable: false, align:'left', width: '110px'},
                        { field: 'taskBeginTime', title: '盘点开始时间', filterable: false, align:'left', width: '150px', template: function(obj){
                            if (obj.taskBeginTime == 0) {return ''} else { return timestampFormat("taskBeginTime")}}},
                        { field: 'taskEndTime', title: '盘点结束时间', filterable: false, align:'left', width: '150px', template: function(obj){
                            if (obj.taskEndTime == 0) {return ''} else { return timestampFormat("taskEndTime")}}}
                    ],
                    inventoryCountInvColumns = [
                        { field: 'id', title: '盘点明细号', filterable: false, align:'left', width: '110px'},
                        { field: 'inventoryCountId', title: '盘点单号', filterable: false, align:'left', width: '110px'},
                        { field: 'locationId', title: '货位', filterable: false, align:'left', width: '110px', template:WMS.UTILS.locationFormat},
                        { field: 'skuBarcode', title: '商品条码', filterable: false, align:'left', width: '160px'},
                        { field: 'skuItemName', title: '商品名称', filterable: false, align:'left', width: '110px'},
                        { field: 'inventoryStatusCode', title: '商品状态', filterable: false, align:'left', width: '110px', template:WMS.UTILS.codeFormat("inventoryStatusCode", "InventoryStatus")},
                        {filterable: false, title: '颜色', field: 'skuColorCode', align: 'left', width: "100px", template: WMS.UTILS.codeFormat('skuColorCode', 'SKUColor')},
                        {filterable: false, title: '尺码', field: 'skuSizeCode', align: 'left', width: "100px", template: WMS.UTILS.codeFormat('skuSizeCode', 'SKUSize')},
                        { field: 'productNo', title: '产品货号', filterable: false, align:'left', width: '110px'},
                        { field: 'systemQty', title: '系统数量', filterable: false, align:'left', width: '110px'},
                        { field: 'countQty', title: '实盘数量', filterable: false, align:'left', width: '110px'},
                        { field: 'createTime', title: '盘点开始时间', filterable: false, align:'left', width: '150px', template: timestampFormat("createTime")},
                        { field: 'updateTime', title: '盘点结束时间', filterable: false, align:'left', width: '150px', template: timestampFormat("updateTime")}
                    ],
                    inventoryCountDiffColumns = [
                        { field: 'inventoryLocId', title: '盘点任务号', filterable: false, align:'left', width: '110px'},
                        { field: 'inventoryInvId', title: '盘点明细号', filterable: false, align:'left', width: '110px'},
                        { field: 'locationId', title: '货位', filterable: false, align:'left', width: '110px', template:WMS.UTILS.locationFormat},
                        { field: 'skuBarcode', title: '商品条码', filterable: false, align:'left', width: '160px'},
                        { field: 'skuItemName', title: '商品名称', filterable: false, align:'left', width: '110px'},
                        { field: 'systemQty', title: '系统数量', filterable: false, align:'left', width: '110px'},
                        { field: 'countQty', title: '实盘数量', filterable: false, align:'left', width: '110px'},
                        { field: 'diffQty', title: '差异数量', filterable: false, align:'left', width: '110px'},
                        { field: 'assignUser', title: '指定盘点人', filterable: false, align:'left', width: '110px'},
                        { field: 'realUser', title: '实际盘点人', filterable: false, align:'left', width: '110px'}
                    ],
                    inventoryCountDataSource = wmsDataSource({
                        url: inventoryCountUrl,
                        schema: {
                            model: countModel.invCount
                        }
                    });
                inventoryCountColumns = inventoryCountColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);

                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;


                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: inventoryCountDataSource,
                    editable: {
                        mode: "popup",
                        window: {
                            width: "640px"
                        },
                        template: kendo.template($("#form-edit").html())
                    },
                    toolbar:[
                        {template: '<kendo-button class="k-primary" ng-click="submit()">提交</kendo-button>', className:"btn-auth-submit"},
//                        {template: '<kendo-button class="k-primary" ng-click="repeat()">复盘</kendo-button>', className:"btn-auth-repeat"},
                        {template: '<kendo-button class="k-primary" ng-click="close()">关闭</kendo-button>', className:"btn-auth-close"},
                        {template: '<kendo-button class="k-primary" ng-click="cancel()">取消</kendo-button>', className:"btn-auth-cancel"}
//                        {template: '<kendo-button class="k-primary" ng-click="oneKeyRepeat()">一键复盘</kendo-button>', className:"btn-auth-oneKeyRepeat"}
                    ],
                    dataBound: function(e) {
                        var grid = this,
                            trs = grid.tbody.find(">tr");
                        _.each(trs, function(tr,i){
                            var record = grid.dataItem(tr);
                            if (record.statusCode !== "unsubmitted") {
                                $(tr).find(".k-button").remove();
                            }
                        });
                    },
                    selectable: "row",
                    columns: inventoryCountColumns
                }, $scope);

//                inventoryCountLocColumns = inventoryCountLocColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);

                $scope.countTaskOptions = function(dataItem){
                    var countLocColumns = [];
                    countLocColumns = countLocColumns.concat(WMS.UTILS.CommonColumns.checkboxColumn);
                    if(dataItem.modeCode === "counting" && (dataItem.statusCode === "counting" || dataItem.statusCode === "counted")){
                        countLocColumns = countLocColumns.concat(WMS.GRIDUTILS.editOptionButton());
                    }
                    countLocColumns = countLocColumns.concat(inventoryCountLocBaseColumns);
                    countLocColumns = countLocColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);

                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource: wmsDataSource({
                            url: inventoryCountUrl + "/" + dataItem.id + "/task",
                            schema:{
                                model: countModel.invCountLoc
                            },
                            pageSize: 30,
                            parseRequestData:function(data,str){
                                if(str == "search"){
                                    if($scope.$$childHead.query != undefined) {
                                        if ($scope.$$childHead.query.locationNo != undefined) {
                                            data.locationNo = $scope.$$childHead.query.locationNo;
                                        }
                                        if ($scope.$$childHead.query.barcode != undefined) {
                                            data.barcode = $scope.$$childHead.query.barcode;
                                        }
                                    }
                                }
                                return data;
                            }
                        }),
                        toolbar:[
                            {template: '<kendo-button class="k-primary" ng-click="allocate()">分配</kendo-button>', className:"btn-auth-allocate"}
                        ],
                        editable: {
                            mode: "popup",
                            window: {
                                width: "360px"
                            },
                            template: kendo.template($("#form-edit-task").html())
                        },
                        dataBound: function() {
                            var grid = this,
                                trs = grid.tbody.find(">tr");
                            _.each(trs, function(tr,i){
                                var record = grid.dataItem(tr);
                                if (record.statusCode !== "3") {
                                    $(tr).find(".k-button").remove();
                                }
                            });
                        },
//                        selectable: "row",
                        widgetId: "countTaskWidget",
                        columns: countLocColumns
                    }, $scope);
                };

                //库存盘点任务指派begin
                $scope.allocate = function(){
                    var dataItem = this.dataItem;
                    var countTaskGrid = $scope.$$childTail.countTaskGrid;
                    var selectView = WMS.GRIDUTILS.getCustomSelectedData(countTaskGrid);
                    if(selectView.length === 0){
                        kendo.ui.ExtAlertDialog.showError("请选择一条数据!");
                        return;
                    }

                    $scope.taskAllocatePopup.refresh().open().center();
                    $scope.countModel = {};
                    $scope.countModel.id = dataItem.id;
//                    $sync(window.BASEPATH + "/inventoryCount/", "GET")
//                        .then(function(xhr){
//                            $scope.allocateUsers = xhr.result;
//                        });
                };

                $scope.confirmAllocate = function(e){
                    var countTaskGrid = $scope.$$childTail.countTaskGrid;
                    var selectView = WMS.GRIDUTILS.getCustomSelectedData(countTaskGrid);
                    var selectedDataArray = _.map(selectView, function(view) {
                        return view.id;
                    });
                    var selectedDataStr = selectedDataArray.join(",");
                    var id = $scope.countModel.id;
                    var assignUser = $scope.countModel.assignUser;
                    $sync(window.BASEPATH + "/inventoryCount/"+id+"/task/allocate", "PUT", {data:{ids:selectedDataStr, assignUser:assignUser}})
                        .then(function(xhr){
                            if(xhr.suc){
                                $scope.inventoryCountGrid.dataSource.read();
                                $scope.taskAllocatePopup.close();
                            }
                        });
                };

                $scope.closeAllocate = function(){
                    $scope.taskAllocatePopup.close();
                };
                //库存盘点任务指派end

//                $scope.$on("kendoWidgetCreated", function(event, widget){
//                    if(widget.options !== undefined && widget.options.widgetId === 'countTaskWidget'){
//                        widget.bind("edit", function(e){
//                            $scope.editTaskModel = e.model;
//                        });
//                    }
//                });

                $scope.assignUserWindowOpen = function(){
                    $scope.userWhPopup.setReturnData = function(returnData){
                        if (_.isEmpty(returnData)) {
                            return;
                        }
//                        WMS.UTILS.setValueInModel($scope.editTaskModel, "assignUser", returnData.userName);
                        $scope.countModel.assignUser = returnData.userName;
                    };
                    $scope.userWhPopup.refresh().open().center();
                };

                inventoryCountInvColumns = inventoryCountInvColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);

                $scope.countDetailOptions = function(dataItem){
                    var countInvColumns = [];
                    if(dataItem.modeCode === "scan"  && (dataItem.statusCode === "counting" || dataItem.statusCode === "counted")){
                        countInvColumns = countInvColumns.concat(WMS.GRIDUTILS.editOptionButton());
                    }
                    countInvColumns = countInvColumns.concat(inventoryCountInvColumns);

                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource: wmsDataSource({
                            url: inventoryCountUrl + "/" + dataItem.id + "/detail",
                            schema:{
                                model: countModel.invCountInv
                            },
                            pageSize: 30,
                            parseRequestData:function(data,str){
                                if(str == "search"){
                                    if($scope.$$childHead.query != undefined) {
                                        if ($scope.$$childHead.query.locationNo != undefined) {
                                            data.locationNo = $scope.$$childHead.query.locationNo;
                                        }
                                        if ($scope.$$childHead.query.barcode != undefined) {
                                            data.barcode = $scope.$$childHead.query.barcode;
                                        }
                                    }
                                }
                                return data;
                            }
                        }),
                        editable: {
                            mode: "popup",
                            window: {
                                width: "360px"
                            },
                            template: kendo.template($("#form-edit-task").html())
                        },

                        dataBound: function() {
                            var grid = this,
                                trs = grid.tbody.find(">tr");
                            _.each(trs, function(tr,i){
                                var record = grid.dataItem(tr);
                                if (record.statusCode !== "3") {
                                    $(tr).find(".k-button").remove();
                                }
                            });
                        },
                        columns: countInvColumns
                    }, $scope);
                };

//                inventoryCountDiffColumns = inventoryCountDiffColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);

                $scope.countDiffOptions = function(dataItem){
                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource: wmsDataSource({
                            url: inventoryCountUrl + "/" + dataItem.id + "/diff",
                            schema:{
                                model: countModel.invCountDiff
                            },
                            pageSize: 30,
                            parseRequestData:function(data,str){
                                if(str == "search"){
                                    if($scope.$$childHead.query != undefined) {
                                        if ($scope.$$childHead.query.locationNo != undefined) {
                                            data.locationNo = $scope.$$childHead.query.locationNo;
                                        }
                                        if ($scope.$$childHead.query.barcode != undefined) {
                                            data.barcode = $scope.$$childHead.query.barcode;
                                        }
                                    }
                                }
                                return data;
                            }
                        }),
                        columns: inventoryCountDiffColumns
                    }, $scope);
                };

                $scope.submit = function(){
                    var selectView = $scope.inventoryCountGrid.select();
                    var selectData = $scope.inventoryCountGrid.dataItem(selectView);
                    if(selectData === null){
                        kendo.ui.ExtAlertDialog.showError("请选择一条数据!");
                    }else{
                        $sync(window.BASEPATH + "/inventoryCount/submit/"+selectData.id, "PUT")
                            .then(function(xhr){
                                if(xhr.suc){
                                    $scope.inventoryCountGrid.dataSource.read();
                                }
                            });
                    }
                };

                $scope.cancel = function(){
                    var selectView = $scope.inventoryCountGrid.select();
                    var selectData = $scope.inventoryCountGrid.dataItem(selectView);
                    if(selectData === null){
                        kendo.ui.ExtAlertDialog.showError("请选择一条数据!");
                    }else{
                        $sync(window.BASEPATH + "/inventoryCount/cancel/"+selectData.id, "PUT")
                            .then(function(xhr){
                                if(xhr.suc){
//                                    kendo.ui.ExtAlertDialog.showError("取消成功！");
                                    $scope.inventoryCountGrid.dataSource.read();
                                }
                            });
                    }
                };

                $scope.oneKeyRepeat = function(){
                    $.when(kendo.ui.ExtOkCancelDialog.show({
                            title: "确认/取消",
                            message: "正在准备一键复盘，请确认是否操作？",
                            icon: "k-ext-question" })
                    ).done(function (response) {
                            if (response.button === "OK") {
                                $sync(window.BASEPATH + "/inventoryCount/oneKeyRepeat", "PUT")
                                    .then(function(xhr){

                                    });
                            }
                        });
                };

                $scope.repeat = function(){
                    var selectView = $scope.inventoryCountGrid.select();
                    var selectData = $scope.inventoryCountGrid.dataItem(selectView);
                    if(selectData === null){
                        kendo.ui.ExtAlertDialog.showError("请选择一条数据!");
                    }else{
                        $sync(window.BASEPATH + "/inventoryCount/repeat/"+selectData.id, "PUT")
                            .then(function(xhr){
                                if(xhr.suc){
                                    var result = xhr.result;
                                    if(result === "NoDifference & NoExist"){
                                        kendo.ui.ExtAlertDialog.showError("盘点无差异，无须复盘!");
                                    }else if(result === "NoDifference & Exist"){
                                        $.when(kendo.ui.ExtOkCancelDialog.show({
                                                title: "确认/取消",
                                                message: "仍有未盘点的任务，是否继续？",
                                                icon: "k-ext-question" })
                                        ).done(function (response) {
                                                if (response.button === "OK") {
                                                    kendo.ui.ExtAlertDialog.showError("盘点无差异，无须复盘!");
                                                }
                                            });
                                    }else if(result === "Difference & NoExist"){
                                        generateRepeatInvCount(selectData.id);
                                    }else if(result === "Difference & Exist"){
                                        $.when(kendo.ui.ExtOkCancelDialog.show({
                                                title: "确认/取消",
                                                message: "仍有未盘点的任务，是否继续？",
                                                icon: "k-ext-question" })
                                        ).done(function (response) {
                                                if (response.button === "OK") {
                                                    generateRepeatInvCount(selectData.id);
                                                }
                                            });
                                    }
                                }
                            });
                    }
                };

                function generateRepeatInvCount(id){
                    $sync(window.BASEPATH + "/inventoryCount/generateRepeat/"+id, "PUT")
                        .then(function(xhr){
                            if(xhr.suc){
                                $scope.inventoryCountGrid.dataSource.read();
                            }
                        });
                }

                function closeInventoryCount(id){
                    $sync(window.BASEPATH + "/inventoryCount/close/"+id, "PUT")
                        .then(function(xhr){
                            if(xhr.suc){
                                $scope.inventoryCountGrid.dataSource.read();
                            }
                        });
                }

                $scope.close = function(){
                    var selectView = $scope.inventoryCountGrid.select();
                    var selectData = $scope.inventoryCountGrid.dataItem(selectView);
                    if(selectData === null){
                        kendo.ui.ExtAlertDialog.showError("请选择一条数据!");
                    }else{
                        $sync(window.BASEPATH + "/inventoryCount/closeCheck/"+selectData.id, "PUT")
                            .then(function(xhr){
                                if(xhr.suc){
                                    var result = xhr.result;
                                    if(result === "NoDifference & NoExist"){
                                        closeInventoryCount(selectData.id);
                                    }else if(result === "NoDifference & Exist"){
                                        $.when(kendo.ui.ExtOkCancelDialog.show({
                                                title: "确认/取消",
                                                message: "仍有未盘点的任务，是否继续？",
                                                icon: "k-ext-question" })
                                        ).done(function (response) {
                                                if (response.button === "OK") {
                                                    closeInventoryCount(selectData.id);
                                                }
                                            });
                                    }else if(result === "Difference & NoExist"){
                                        if(selectData.modeCode === "counting"){
                                            closeInventoryCount(selectData.id);
                                        }else{
                                            closeInventoryCount(selectData.id);
                                        }
                                    }else if(result === "Difference & Exist"){
                                        $.when(kendo.ui.ExtOkCancelDialog.show({
                                                title: "确认/取消",
                                                message: "仍有未盘点的任务，是否继续？",
                                                icon: "k-ext-question" })
                                        ).done(function (response) {
                                                if (response.button === "OK") {
                                                    if(selectData.modeCode === "counting"){
                                                        closeInventoryCount(selectData.id);
                                                    }else{
                                                        closeInventoryCount(selectData.id);
                                                    }
                                                }
                                            });
                                    }
                                }
                            });
                    }
                };
            }
        ]);
});