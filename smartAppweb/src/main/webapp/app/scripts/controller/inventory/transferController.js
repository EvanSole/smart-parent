/**
 * created by qingjianwu on 15/09/21
 */
define(['scripts/controller/controller',
    '../../model/inventory/transferModel'], function(controller, transferModel){
    "use strict";
    controller.controller('inventoryTransferController',
        ['$scope', '$rootScope', 'sync', 'url', 'FileUploader', 'wmsDataSource', '$filter',
            function($scope, $rootScope, $sync, $url, FileUploader, wmsDataSource, $filter){
                var url = $url.inventoryTransferUrl,
                    columns = [
                        WMS.GRIDUTILS.deleteOptionButton(),
                        { title: '调拨单号', field: 'id', align: 'left', width: "150px"},
//                        { title: '租户编号', field: 'tenantId', align: 'left', width: "150px"},
                        { title: '单据状态', field: 'statusCode', align: 'left', width: "150px", template:WMS.UTILS.codeFormat('statusCode','TicketStatus')},
                        { title: '单据类型', field: 'typeCode', align: 'left', width: "150px", template:WMS.UTILS.codeFormat('typeCode','AllocationType')},
                        { title: '是否生成反向调拨单', field: 'isReverse', align: 'left', width: "150px", template: WMS.UTILS.checkboxDisabledTmp("isReverse")},
                        { title: '关联单号', field: 'referNo', align: 'left', width: "150px"},
                        { title: '来源商家', field: 'fromStorerId', align: 'left', width: "150px", template:WMS.UTILS.storerFormat("fromStorerId")},
                        { title: '目的商家', field: 'toStorerId', align: 'left', width: "150px", template:WMS.UTILS.storerFormat("toStorerId")},
                        { title: '提醒日期', field: 'noticeTime', align: 'left', width: "150px", template: WMS.UTILS.timestampFormat("noticeTime", "yyyy-MM-dd HH:mm:ss")},
                        { title: '备注', field: 'memo', align: 'left', width: "150px"}
                    ],
                    detailBaseColumns = [
                        { title: '调拨明细单号', field: 'id', align: 'left', width: "150px"},
                        { title: '商品条码', field: 'barcode', align: 'left', width: "150px"},
                        { title: '来源商品名称', field: 'fromSkuItemName', align: 'left', width: "150px"},
                        { title: '目的商品名称', field: 'toSkuItemName', align: 'left', width: "150px"},
                        { title: '来源货位', field: 'fromLocationId', align: 'left', width: "150px", template: WMS.UTILS.locationFormat('fromLocationId')},
                        { title: '目的货位', field: 'toLocationId', align: 'left', width: "150px", template: WMS.UTILS.locationFormat('toLocationId')},
                        { title: '调拨数量', field: 'transferQty', align: 'left', width: "150px"},
                        { title: '备注', field: 'memo', align: 'left', width: "150px"}
                    ],
                    dataSource = wmsDataSource({
                        url: url,
                        schema: {
                            model: transferModel.transferHeader
                        }
                    });
                columns = columns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                detailBaseColumns = detailBaseColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);

                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: dataSource,
                    toolbar: [
                        { name: "create", text: "新增", className:"btn-auth-add"},
                        {template: '<kendo-button class="k-primary" ng-click="submit()">提交</kendo-button>', className:"btn-auth-submit"},
                        {template: '<kendo-button class="k-primary" ng-click="confirm()">确认</kendo-button>', className:"btn-auth-confirm"},
                        {template: '<kendo-button class="k-primary" ng-click="cancel()">撤销</kendo-button>', className:"btn-auth-cancel"}
                    ],
                    columns: columns,
                    editable: {
                        mode: "popup",
                        window: {
                            width: "640px"
                        },
                        template: kendo.template($("#form-add").html())
                    },
                    selectable: "row",
                    dataBound: function(e) {
                        var grid = this,
                            trs = grid.tbody.find(">tr");
                        var myDate = new Date();
                        var currentTime = myDate.getTime();
                        _.each(trs, function(tr,i){
                            var record = grid.dataItem(tr);
                            if (record.statusCode !== "Initial") {
                                $(tr).find(".k-button").remove();
                            }

                            if (record.noticeTime > 0 && record.noticeTime <= currentTime && record.referNo != null && record.referNo != '' && record.statusCode != 'Confirmed') {
                                $(tr).css("background-color", "#FFD700")
                            }
                        });
                    },
                    save: function(e){
                        var model = e.model;
                        if(model.fromStorerId === model.toStorerId ){
                            kendo.ui.ExtAlertDialog.showError("来源商家和目的商家不能相同");
                            e.preventDefault();
                        }
                    }
                },$scope);

                $scope.transferDetailOptions = function(dataItem){
                    var detailColumns = [],
                        toolbar = [];
                    if(dataItem.statusCode === "Initial"){
                        detailColumns = [WMS.GRIDUTILS.CommonOptionButton()];
                        toolbar = [{ name: "create", text:"新增"},
                            {template: '<a class="k-button k-button-custom-command" ng-click="import($event, dataItem)">导入</a>', className:"btn-auth-import"}
                        ];
                    }
                    detailColumns = detailColumns.concat(detailBaseColumns);

                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource:wmsDataSource({
                            url: url + "/" + dataItem.id + "/detail",
                            schema:{
                                model: transferModel.transferDetail
                            },
                            pageSize: 5
                        }),
                        toolbar: toolbar,
                        editable:{
                            mode: "popup",
                            window: {
                                width: "640px"
                            },
                            template: kendo.template($("#transferDetail-editor").html())
                        },
                        columns: detailColumns,
                        edit: function(e){
                            var model = e.model;
                            $("#skuBarcode").val(model.fromSkuBarcode);
                            $("#skuItemName").val(model.fromSkuItemName);
                        },
                        save: function(e){
                            var model = e.model;
                            var transferQty = model.transferQty;
//                            var activeQty = $("#activeQty").val();
                            if(transferQty <= 0){
                                kendo.ui.ExtAlertDialog.showError("调拨数量需大于0");
                                e.preventDefault();
                                return;
                            }
//                            if(transferQty > activeQty){
//                                kendo.ui.ExtAlertDialog.showError("调拨数量不能大于库存可用数量["+activeQty+"]");
//                                e.preventDefault();
//                                return;
//                            }
                            var fromLocationNo = $("#fromLocationNo").val();
                            var toLocationNo = $("#toLocationNo").val();
                            if((model.fromLocationId === model.toLocationId) || (fromLocationNo === toLocationNo)){
                                kendo.ui.ExtAlertDialog.showError("来源和目的货位不能相同");
                                e.preventDefault();
                                return;
                            }

                            var grid = e.sender;
                            var fromLocationUrl = $url.dataLocationUrl + "/locationInfo?locationNo=" + fromLocationNo;
                            var saveFlag = false;
                            $sync(fromLocationUrl, "GET", {wait: false})
                                .then(function(resp){
                                    if(_.isEmpty(resp.result)){
                                        kendo.ui.ExtAlertDialog.showError("请输入正确的来源货位");
                                        return;
                                    } else {
                                        var fromLocation = resp.result;
                                        WMS.UTILS.setValueInModel(dataItem, "fromLocationId", fromLocation.id);
                                        WMS.UTILS.setValueInModel(dataItem, "fromZoneId", fromLocation.zoneId);

                                        var toLocationUrl = $url.dataLocationUrl + "/locationInfo?locationNo=" + toLocationNo;
                                        $sync(toLocationUrl, "GET", {wait: false})
                                            .then(function(resp){
                                                if(_.isEmpty(resp.result)){
                                                    kendo.ui.ExtAlertDialog.showError("请输入正确的目的货位");
                                                    return;
                                                } else {
                                                    var toLocation = resp.result;
                                                    WMS.UTILS.setValueInModel(dataItem, "toLocationId", toLocation.id);
                                                    WMS.UTILS.setValueInModel(dataItem, "toZoneId", toLocation.zoneId);

                                                    var skuBarcode = $("#skuBarcode").val();
                                                    var skuUrl = window.BASEPATH + "/goods/storer/"+ dataItem.fromStorerId +"/skuBarcode/"+ skuBarcode;
                                                    $sync(skuUrl, "GET", {wait: false})
                                                        .then(function(resp){
                                                            if(_.isEmpty(resp.result)){
                                                                kendo.ui.ExtAlertDialog.showError("请输入正确的商品条码");
                                                                return;
                                                            } else {
                                                                var sku = resp.result;
                                                                WMS.UTILS.setValueInModel(dataItem, "skuId", sku.id);
                                                                WMS.UTILS.setValueInModel(dataItem, "barcode", sku.barcode);
                                                                WMS.UTILS.setValueInModel(dataItem, "fromSkuItemName", sku.itemName);
                                                                WMS.UTILS.setValueInModel(dataItem, "toSkuItemName", sku.itemName);
                                                                WMS.UTILS.setValueInModel(dataItem, "skuItemName", sku.itemName);
                                                                saveFlag = true;
                                                                grid.saveChanges();
                                                            }
                                                        });

                                                }
                                            });
                                    }
                                });



                            if(saveFlag){
                                grid.saveChanges();
                            }else{
                                e.preventDefault();
                            }
                        }
                    });
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
//                    validateInventory(dataItem.fromLocationId);
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

                var clearValueAry = ['skuItemName','skuBarcode', 'barcode','skuId' ];

                $scope.checkSkuBarcode = function(dataItem){
                    var headDataItem = $scope.$$childTail.dataItem;
                    var skuBarcode = $("#skuBarcode").val();
                    if(skuBarcode === ""){
                        _.each(clearValueAry, function(item) {
                            $("#" + item).val("");
                        });
                    } else {
                        var skuUrl = window.BASEPATH + "/goods/storer/"+ headDataItem.fromStorerId +"/skuBarcode/"+ skuBarcode;
                        $sync(skuUrl, "GET", {wait: false})
                            .then(function(xhr){
                                var sku = xhr.result;

                                if(sku !== null){
                                    WMS.UTILS.setValueInModel(dataItem, "skuId", sku.id);
                                    WMS.UTILS.setValueInModel(dataItem, "barcode", sku.barcode);
                                    WMS.UTILS.setValueInModel(dataItem, "skuItemName", sku.itemName);
//                                    WMS.UTILS.setValueInModel(dataItem, "activeQty", inventory.onhandQty - inventory.allocatedQty);
                                } else {
                                    _.each(clearValueAry, function(item) {
                                        $("#" + item).val("");
                                    });
                                    kendo.ui.ExtAlertDialog.showError("请输入合法的商品条码!");
                                }
                            });
                    }
                };

                $scope.windowOpen = function(dataItem){
                    var currentDataItem = this.dataItem;
                    $scope.skuPopup.initParam = function(subScope){
                        subScope.selectable = "row";
                        subScope.type = "goods";
                        subScope.url = $url.validSkuUrl + "/" + dataItem.fromStorerId;
                    };
                    $scope.skuPopup.setReturnData = function(returnData){
                        if (_.isEmpty(returnData)) {
                            return;
                        }
                        WMS.UTILS.setValueInModel(currentDataItem, "skuId", returnData.id);
                        WMS.UTILS.setValueInModel(currentDataItem, "skuItemName", returnData.itemName);
                        WMS.UTILS.setValueInModel(currentDataItem, "skuBarcode", returnData.barcode);
                        WMS.UTILS.setValueInModel(currentDataItem, "barcode", returnData.barcode);
//                        WMS.UTILS.setValueInModel(currentDataItem, "activeQty", returnData.onhandQty - returnData.allocatedQty);
                    };
                    $scope.skuPopup.refresh().open().center();
                };

                $scope.submit = function(){
                    var selectView = $scope.kendoGrid.select();
                    var selectData = $scope.kendoGrid.dataItem(selectView);
                    var url = "/inventory/transfer/submit";
                    if(selectData === null){
                        kendo.ui.ExtAlertDialog.showError("请选择一条数据!");
                    } else {
                        $sync(window.BASEPATH + url, "POST", {data:{id:selectData.id}})
                            .then(function(xhr){
                                $scope.kendoGrid.dataSource.read();
                            });
                    }
                };

                $scope.confirm = function(){
                    var selectView = $scope.kendoGrid.select();
                    var selectData = $scope.kendoGrid.dataItem(selectView);
                    var url = "/inventory/transfer/confirm";
                    if(selectData === null){
                        kendo.ui.ExtAlertDialog.showError("请选择一条数据!");
                    } else {
                        $sync(window.BASEPATH + url, "POST", {data:{id:selectData.id}})
                            .then(function(xhr){
                                $scope.kendoGrid.dataSource.read();
                            });
                    }
                };

                $scope.cancel = function(){
                    var selectView = $scope.kendoGrid.select();
                    var selectData = $scope.kendoGrid.dataItem(selectView);
                    var url = "/inventory/transfer/cancel";
                    if(selectData === null){
                        kendo.ui.ExtAlertDialog.showError("请选择一条数据!");
                    } else {
                        $sync(window.BASEPATH + url, "POST", {data:{id:selectData.id}})
                            .then(function(xhr){
                                $scope.kendoGrid.dataSource.read();
                            });
                    }
                };

                $scope.import = function(e, dataItem){
                    var headerId = dataItem.id;
                    e.preventDefault();
                    var transferDetailGrid = this.transferDetailGrid;
                    var importWindow = transferDetailGrid.$angular_scope.importWindow;
                    var targetScope = transferDetailGrid.$angular_scope;
                    targetScope.fileName = '';

                    if(importWindow === undefined){
                        console.warn("需要定义importWindow");
                    }

                    var uploader = targetScope.uploader = new FileUploader({
                        url: window.BASEPATH + "/inventory/transfer/import?headerId="+headerId,
                        alias: "file",
                        removeAfterUpload: true
                    });

                    uploader.onAfterAddingFile = function(item) {
                        targetScope.fileName = item.file.name;
                        $('.js_operationResult').hide();
                    };

                    uploader.onSuccessItem = function(fileItem, response, status, headers) {
                        console.info('onSuccessItem', fileItem, response, status, headers);
                        if (response.suc) {
                            importWindow.close();
                            kendo.ui.ExtAlertDialog.show({
                                title: "信息",
                                message: "导入成功！",
                                icon: "k-ext-information" });
                        }else{
                            if(response.result === null){
                                kendo.ui.ExtAlertDialog.showError(response.message);
                                return;
                            }
                            if (typeof(response.result) == 'object') {
                                $('.js_operationResult').show();
                                var errLogData = _.map(response.result, function (record) {
                                    return {message: record};
                                });
                                $("#importListGrid").kendoGrid({
                                    columns: [
                                        {
                                            field: "message",
                                            filterable: false,
                                            width: 220,
                                            title: '错误信息'
                                        }
                                    ],
                                    height: 150,
                                    dataSource: errLogData
                                });
                            }
                        }
                    };

                    uploader.onErrorItem = function(fileItem, response, status, headers) {
                        kendo.ui.ExtAlertDialog.showError("导入失败");
                    };

                    // 打开文件导入window
                    importWindow.setOptions({
                        width: "630",
                        title: "商家调拨导入",
                        modal:true,
                        actions: ["Close"],
                        content:{
                            template:kendo.template($('#J_fileForm').html())
                        },
                        open: function () {
                            $('.js_operationResult').hide();
                        }
                    });
                    importWindow.refresh().center().open();

                    targetScope.uploadFile = function() {
                        // 已经存在明细，提示是否覆盖
                        if (transferDetailGrid !== undefined && transferDetailGrid.dataSource.data().length > 0) {
                            $.when(kendo.ui.ExtOkCancelDialog.show({
                                    title: "确认/取消",
                                    message: "已经存在明细，是否覆盖，确定导入？",
                                    icon: "k-ext-question" })
                            ).done(function (response) {
                                    if (response.button === "OK") {
                                        uploader.uploadAll();
                                    }
                                });
                        } else {
                            uploader.uploadAll();
                        }
                    };
                };

                $scope.changeAllocationType = function(dataItem){
                    var typeCode = $("#typeCode").val();
                    if(typeCode === "Borrow"){
                        $scope.allocationTypeDisable = false;
                        var isReverse = $("#isReverse").val();
                        if(isReverse === "on"){
                            dataItem.isReverse = 1;
                        }else{
                            dataItem.isReverse = 0;
                        }
                        dataItem.noticeTime = $("#noticeTime").val();
                    }else{
                        $scope.allocationTypeDisable = true;
                        dataItem.isReverse = false;
                        dataItem.noticeTime = null;
                    }

                };

            }
        ]
    );
});