/**
 * Created by xiagn on 15/4/2.
 */
define(['scripts/controller/controller',
    '../../model/inventory/moveModel'
], function(controller, moveModel) {
    "use strict";
    controller.controller('inventoryMoveController',
        ['$scope','$rootScope','sync', 'url', 'wmsDataSource','$filter',
            function($scope, $rootScope, $sync, $url, wmsDataSource, $filter) {
                var inventoryMoveUrl = $url.inventoryMoveUrl,
                    moveGridName = "库存移动",
                    inventoryMoveColumns = [
                        WMS.UTILS.CommonColumns.checkboxColumn,
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { field: 'id', title: '移货单号', filterable: false, align:'left', width: '110px'},
//                        { field: 'storerId', title: '商家', filterable: false, align:'left', width: '100px', template:WMS.UTILS.storerFormat},
//                        { field: 'referNo', title: '参考单号', filterable: false, align:'left', width: '110px'},
                        { field: 'reasonCode', title: '移动原因', filterable: false, align:'left', width: '110px', template:WMS.UTILS.codeFormat('reasonCode','MoveReason')},
                        { field: 'datasourceCode', title: '数据来源', filterable: false, align:'left', width: '110px', template:WMS.UTILS.codeFormat('datasourceCode','DataSource')},
                        { field: 'statusCode', title: '单据状态', filterable: false, align:'left', width: '110px', template:WMS.UTILS.codeFormat('statusCode','TicketStatus')},
                        { field: 'skuBarcode', title: '商品条码', filterable: false, align:'left', width: '160px'},
                        { field: 'fromZoneId', title: '来源库区', filterable: false, align:'left', width: '110px', template:WMS.UTILS.zoneNoFormat('fromZoneId')},
                        { field: 'toZoneId', title: '目的库区', filterable: false, align:'left', width: '110px', template:WMS.UTILS.zoneNoFormat('toZoneId')},
                        { field: 'fromLocationId', title: '来源货位', filterable: false, align:'left', width: '110px', template:WMS.UTILS.locationFormat('fromLocationId')},
                        { field: 'toLocationId', title: '目的货位', filterable: false, align:'left', width: '110px', template:WMS.UTILS.locationFormat('toLocationId')},
                        { field: 'fromCartonNo', title: '来源箱号', filterable: false, align:'left', width: '110px'},
                        { field: 'toCartonNo', title: '目的箱号', filterable: false, align:'left', width: '110px'},
                        { field: 'movedQty', title: '移动数量', filterable: false, align:'left', width: '110px'},
                        { field: 'memo', title: '备注', filterable: false, align:'left', width: '100px'},
                        { field: 'submitUser', title: '提交人', filterable: false, align:'left', width: '100px'},
                        { field: 'submitDate', title: '提交日期', filterable: false, align:'left', width: '150px',template: WMS.UTILS.timestampFormat("submitDate")}
                    ],
                    inventoryMoveDataSource = wmsDataSource({
                        url: inventoryMoveUrl,
                        schema: {
                            model: moveModel.header
                        },
                        parseRequestData: function(data,method) {
                            if (method === "create") {
                                // todo 多条
                                data.moveSkuIds = [];
                                data.moveQtys = [];
//                                data.toCartonNo = data.fromCartonNo;
                                _.each(data.skus, function(sku){
                                    data.moveSkuIds.push(sku.id);
                                    data.moveQtys.push(sku.qty);
                                });

                            }
                            return data;
                        }
                    });

                inventoryMoveColumns = inventoryMoveColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);

                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

                // 初始化检索区数据
//                $scope.query = {
//                    moveTimeFrom: $filter('date')(new Date(),'yyyy/MM/dd 00:00:00')
//                };
                // 弹出画面商品GRID
                $scope.moveSkuGridOptions = {
                    columns: [
                        WMS.GRIDUTILS.deleteOptionButton(),
                        { editor:WMS.UTILS.columnEditor.readOnly, title: '商品条码', field: 'barcode', align: 'left', width: "160px"},
                        { editor:WMS.UTILS.columnEditor.readOnly, title: '商品名称', field: 'itemName', align: 'left', width: "80px"},
                        { editor:WMS.UTILS.columnEditor.readOnly, title: '商品状态', field: 'inventoryStatusCode', align: 'left', width: "80px", template: WMS.UTILS.codeFormat("inventoryStatusCode", "InventoryStatus")},
                        { editor:WMS.UTILS.columnEditor.readOnly, title: '在库数量', field: 'onhandQty', align: 'left', width: "80px"},
                        { editor:WMS.UTILS.columnEditor.readOnly, title: '已分配量', field: 'allocatedQty', align: 'left', width: "80px"},
                        { editor:WMS.UTILS.columnEditor.readOnly, title: '可用数量', field: 'availableQty', align: 'left', width: "80px"},
                        { editor:WMS.UTILS.columnEditor.readOnly, title: '已拣量', field: 'pickedQty', align: 'left', width: "80px"},
                        { editable: true, title: '移动数量', field: 'qty', align: 'left', width: "80px"}
                    ],
                    dataSource: {},
                    toolbar: [
                        {
                            template: '<a class="k-button k-grid-custom-command" ng-click="windowOpen()" href="\\#">新增</a>'
                        }],
                    editable:  "incell",
                    pageable: false,
                    customerRemove: function(data) {
                        var dataItem = this.$angular_scope.dataItem;
                        dataItem.skus = _.reject(dataItem.skus, function(sku){
                            return sku.id === data.id;
                        });
                    },
                    edit: function(e) {
                        var input = e.container.find(".k-input"),
                            dataItem = e.sender.$angular_scope.dataItem,
                            model = e.model;
                        var value = input.val();
                        input.keyup(function(){
                            value = input.val();
                        });
                        input.blur(function(){
                            var intValue = parseInt(value);

                            if(model.availableQty < intValue ){
                                kendo.ui.ExtAlertDialog.showError("不能超量移货（当前可用数量：" + model.availableQty+ "）");
                                WMS.UTILS.setValueInModel(model, 'qty', model.availableQty);
                                return;
                            } else if (intValue < 1) {
                                kendo.ui.ExtAlertDialog.showError("移动数量不能小于1");
                                return;
                            }
                            var record = _.findWhere(dataItem.skus, {
                                id: model.id
                            });
                            if (record) {
                                record.qty = intValue;
                            }
                        });
                    }
                };

                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    moduleName: moveGridName,
                    dataSource: inventoryMoveDataSource,
                    toolbar: [{
                        className: 'btn-auth-add',
                        template:
                            '<a class="k-button k-button-icontext k-grid-add" href="\\#"><span class="k-icon k-add"></span>新增</a>'
                    },{
                        className: 'btn-auth-submit',
                        template:
                            '<a class="k-button k-grid-custom-command" ng-click="changeStatus(\'Submitted\')" href="\\#">提交</a>'
                    }],
                    columns: inventoryMoveColumns,
                    editable: {
                        mode: "popup",
                        window:{
                            width:"640px"
                        },
                        template: kendo.template($("#move-editor").html())
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
//                    edit: function(e){
//                        var dataItem = e.model;
//                        $scope.checkEdit = !dataItem.isNew() && dataItem.skuId !== '0';
//                    },
                    save: function(e) {

                        var validateResult = true,
                            model = e.model;
                        if (!model.fromLocationId || !model.toLocationId) {
                          kendo.ui.ExtAlertDialog.showError("来源or目标货位不可为空");
                          validateResult = false;
                        }
                        var fromLocationNo = $("#fromLocationNo").val();
                        var toLocationNo = $("#toLocationNo").val();
                        if ((model.fromLocationId === model.toLocationId) || (fromLocationNo === toLocationNo)){
                            kendo.ui.ExtAlertDialog.showError("来源和目标货位不能相同");
                            validateResult = false;
                        }
                        if (!validateResult) {
                            e.preventDefault();
                            return;
                        }

                        if (model.isNew()) {
                            if (_.isEmpty(model.skus)) {
                                validateResult = false;
                                $.when(kendo.ui.ExtOkCancelDialog.show({
                                        title: "确认/取消",
                                        message: "即将生成整货位移动单，请确认？",
                                        icon: "k-ext-question" })
                                ).done(function (response) {
                                        if (response.button !== "OK") {
                                            kendo.ui.ExtAlertDialog.showError("请至少选择一个商品");
                                        }else{
                                            $scope.inventoryMoveGrid.saveChanges();
                                        }
                                    });
                            }
                        } else {
//                            if (model.skuItemName === undefined) {
//                                kendo.ui.ExtAlertDialog.showError("请至少选择一个商品!");
//                                validateResult = false;
//                            }
                            if (model.maxOnHandQty !== undefined && model.maxOnHandQty < model.movedQty) {
                                kendo.ui.ExtAlertDialog.showError("不能超量移货(当前库存：" + model.maxOnHandQty + ")");
                                validateResult = false;
                            }
                        }
                        if (!validateResult) {
                            e.preventDefault();
                        }
                    },
                    widgetId : "moveWidgetId"
                }, $scope);

//                $scope.$on("kendoWidgetCreated", function(event, widget){
//                    if (widget.options !== undefined && widget.options.widgetId === "moveWidgetId") {
//                        console.log(event);
//                    }
//                });

                $scope.changeStatus = function(status){
                    var inventoryMoveGrid = this.inventoryMoveGrid;
                    var selectData = WMS.GRIDUTILS.getCustomSelectedData(inventoryMoveGrid);
                    var ids = [];
                    var error = '';
                    selectData.forEach(function (data) {
                        if (data.statusCode !== "Initial" && data.statusCode === 'Submitted') {
                            error = "移货单据状态不匹配不能执行提交操作！";
                            return;
                        }
                        ids.push(data.id);
                    });
                    if (error !== "") {
                        kendo.ui.ExtAlertDialog.showError(error);
                        return;
                    }
                    if (ids.length === 0) {
                        kendo.ui.ExtAlertDialog.showError("请至少选择一条数据!");
                        return;
                    }
                    $sync(inventoryMoveUrl + "/batch/" + ids, "PUT")
                        .then(function(){
                            $scope.inventoryMoveGrid.dataSource.read({});
                        }, function () {
                            $scope.inventoryMoveGrid.dataSource.read({});
                        });
                };

                $scope.windowOpenForUpdate = function() {
                    var currentDataItem = this.dataItem;
                    $scope.skuPopup.initParam = function(subScope){
                        subScope.selectable = "row";
//                        subScope.hideSkuPopupCondition = true;
                        subScope.type = "move";
//                        subScope.url = $url.dataInventoryUrl + "/storer/" + currentDataItem.storerId +
//                            "/location/" + currentDataItem.fromLocationId;
                        subScope.url = $url.dataInventoryUrl + "/location/" + currentDataItem.fromLocationId;
                    };
                    $scope.skuPopup.setReturnData = function(returnData){
                        if (_.isEmpty(returnData)) {
                            return;
                        }
                        WMS.UTILS.setValueInModel(currentDataItem, "skuId", returnData.skuId);
                        WMS.UTILS.setValueInModel(currentDataItem, "skuItemName", returnData.skuItemName);
                        WMS.UTILS.setValueInModel(currentDataItem, "skuBarcode", returnData.skuBarcode);
                        WMS.UTILS.setValueInModel(currentDataItem, "maxOnHandQty", returnData.onhandQty);
                        WMS.UTILS.setValueInModel(currentDataItem, "movedQty", returnData.onhandQty);
                    };
                    $scope.skuPopup.refresh().open().center();
                };

                $scope.clearSkuInfo = function() {
                    var currentDataItem = this.dataItem;
                    WMS.UTILS.setValueInModel(currentDataItem, "skuId", "");
                    WMS.UTILS.setValueInModel(currentDataItem, "skuItemName", "");
                    WMS.UTILS.setValueInModel(currentDataItem, "skuBarcode", "");
                    WMS.UTILS.setValueInModel(currentDataItem, "maxOnHandQty", "");
                    WMS.UTILS.setValueInModel(currentDataItem, "movedQty", "");
                };

                $scope.clearFromLocationInfo = function(){
                    var currentDataItem = this.dataItem;
                    WMS.UTILS.setValueInModel(currentDataItem, "fromLocationId", "");
                    WMS.UTILS.setValueInModel(currentDataItem, "fromZoneId", "");
                };

                $scope.validateFromLocationValue = function(e){
                    var evt = e || event;
                    var dataItem = this.dataItem,
                        targetEl = $(evt.target);
                    if(targetEl.val() === ""){
                        $scope.clearFromLocationInfo.apply(this);
                        return;
                    }
                    var locationNo = targetEl.val();
                    var locationUrl = $url.dataLocationUrl + "/locationInfo?locationNo=" + locationNo;
                    $sync(locationUrl, "GET", {wait:false}).then(function(resp){
                        var result = resp.result;
                        if(result === null){
                            WMS.UTILS.setValueInModel(dataItem, "fromLocationId", "");
                            WMS.UTILS.setValueInModel(dataItem, "fromZoneId", "");
                            kendo.ui.ExtAlertDialog.showError("请输入正确的货位!");
                            return;
                        }else{
                            WMS.UTILS.setValueInModel(dataItem, "fromLocationId", result.id);
                            WMS.UTILS.setValueInModel(dataItem, "fromZoneId", result.zoneId);
                        }
                    });
                    if(dataItem.fromLocationId === undefined || dataItem.fromLocationId === ""){
                        return;
                    }
                    validateInventory(dataItem.fromLocationId);
                };

                function validateInventory(locationId){
                    var url = $url.dataInventoryUrl + "/location/"+ locationId;
                    $sync(url, "GET", {wait: false}).then(function(xhr){
                        var result = xhr.result.rows;
                        if(result === null){
                            kendo.ui.ExtAlertDialog.showError("该货位没有商品!");
                            return;
                        }
                    });
                }

                $scope.clearToLocationInfo = function(){
                    var currentDataItem = this.dataItem;
                    WMS.UTILS.setValueInModel(currentDataItem, "toLocationId", "");
                    WMS.UTILS.setValueInModel(currentDataItem, "toZoneId", "");
                };

                $scope.validateToLocationValue = function(e){
                    var evt = e || event;
                    var dataItem = this.dataItem,
                        targetEl = $(evt.target);
                    if(targetEl.val() === ""){
                        $scope.clearToLocationInfo.apply(this);
                        return;
                    }
                    var locationNo = targetEl.val();
                    var locationUrl = $url.dataLocationUrl + "/locationInfo?locationNo="+locationNo;
                    $sync(locationUrl, "GET", {wait: false}).then(function(resp){
                        var result = resp.result;
                        if(result === null){
                            WMS.UTILS.setValueInModel(dataItem, "toLocationId", "");
                            WMS.UTILS.setValueInModel(dataItem, "toZoneId", "");
                            kendo.ui.ExtAlertDialog.showError("请输入正确的货位!");
                            return;
                        }else{
                            WMS.UTILS.setValueInModel(dataItem, "toLocationId", result.id);
                            WMS.UTILS.setValueInModel(dataItem, "toZoneId", result.zoneId);
                        }
                    });
                    if(dataItem.toLocationId === undefined || dataItem.toLocationId === ""){
                        return;
                    }
                };

                $scope.validateSkuValue = function(e) {
                    var evt = e || event;
                    var that = this,
                        dataItem = this.dataItem,
                        targetEl = $(evt.target);
                    if (targetEl.val() === "") {
                        $scope.clearSkuInfo.apply(this);
                        return;
                    }
//                    if (dataItem.storerId ===undefined || dataItem.fromLocationId === undefined) {
//                      return;
//                    }
                    if( dataItem.fromLocationId === undefined){
                        return;
                    }
//                    var url = $url.dataInventoryUrl + "/storer/" + dataItem.storerId +
//                        "/location/" + dataItem.fromLocationId;
                    var url = $url.dataInventoryUrl + "/location/"+ dataItem.fromLocationId;
                    $sync(url, "GET", {wait:false}).then(function(resp){
                        var checkResult = true;
                        if (_.isEmpty(resp.result)) {
                            checkResult = false;
                        } else {
                            var inventoryList = resp.result.rows,
                                skuIds = _.map(inventoryList, function(record){
                                    return record.skuId;
                                });
                            $sync($url.dataGoodsUrl+"/ids/"+_.uniq(skuIds).join(","), "GET", {wait:false})
                                .then(function(resp) {
                                    var sku = _.find(resp.result.rows, function(sku) {
                                        return sku.barcode === targetEl.val();
                                    });
                                    if (sku === undefined) {
                                        WMS.UTILS.setValueInModel(dataItem, "skuId", "");
                                        WMS.UTILS.setValueInModel(dataItem, "skuItemName", "");
                                        WMS.UTILS.setValueInModel(dataItem, "skuBarcode", "");
                                        WMS.UTILS.setValueInModel(dataItem, "maxOnHandQty", "");
                                        WMS.UTILS.setValueInModel(dataItem, "movedQty", "");
                                        $.when(kendo.ui.ExtAlertDialog.showError("商品条码不存在")).done(function () {
                                            setTimeout(function () {
                                                targetEl.focus();
                                            }, 500);
                                        });
                                    } else {
                                        var record = _.find(inventoryList, function(record){
                                            return record.skuId === sku.id;
                                        });
                                        record.skuBarcode = sku.barcode;
                                        record.skuItemName = sku.itemName;
                                        WMS.UTILS.setValueInModel(dataItem, "skuId", record.skuId);
                                        WMS.UTILS.setValueInModel(dataItem, "skuItemName", record.skuItemName);
                                        WMS.UTILS.setValueInModel(dataItem, "skuBarcode", record.skuBarcode);
                                        WMS.UTILS.setValueInModel(dataItem, "maxOnHandQty", record.onhandQty);
                                        WMS.UTILS.setValueInModel(dataItem, "movedQty", record.onhandQty);
                                    }
                                });
                        }
                        if (!checkResult) {
                            $scope.clearSkuInfo.apply(that);
                            $.when(kendo.ui.ExtAlertDialog.showError("当前货位不存在该商品的库存")).done(function(){
                                setTimeout(function(){
                                    targetEl.focus();
                                },500);
                            });
                        }
                    });
                };

                $scope.windowOpen = function(){
                    var currentDataItem = this.dataItem,
                        inventoryMoveSkuGrid = this.inventoryMoveSkuGrid;
//                    if (!currentDataItem.storerId) {
//                        kendo.ui.ExtAlertDialog.showError("请选择商家");
//                        return;
//                    }
                    if (!currentDataItem.fromLocationId) {
                        kendo.ui.ExtAlertDialog.showError("请选择来源货位");
                        return;
                    }
                    $scope.skuPopup.initParam = function(subScope){
                        subScope.selectable = "multiple, row";
//                        subScope.hideSkuPopupCondition = true;
//                        subScope.url = $url.dataInventoryUrl + "/storer/" + currentDataItem.storerId +
//                            "/location/" + currentDataItem.fromLocationId;
                        subScope.url = $url.dataInventoryUrl + "/location/"+currentDataItem.fromLocationId;
                        subScope.type = "move";
                    };
                    $scope.skuPopup.setReturnData = function(returnData){
                        if (_.isEmpty(returnData)) {
                            return;
                        }
                        var data = _.map(returnData, function(record){
                            return {
                                id: record.skuId,
                                barcode: record.skuBarcode,
                                itemName: record.skuItemName,
                                inventoryStatusCode: record.inventoryStatusCode,
                                onhandQty: record.onhandQty+"",
                                allocatedQty: record.allocatedQty+"",
                                availableQty:record.onhandQty-record.allocatedQty+"",
                                pickedQty: record.pickedQty+"",
                                qty: record.onhandQty-record.allocatedQty+""

                            };
                        });
                        var ds = new kendo.data.DataSource({
                            data: data
                        });
                        currentDataItem.skus = data;
                        inventoryMoveSkuGrid.setDataSource(ds);
                        inventoryMoveSkuGrid.refresh();
                    };
                    $scope.skuPopup.refresh().open().center();
                };
            }]);
});
