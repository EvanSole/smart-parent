/**
 * Created by fuminwang on 15/3/30.
 *
 * Updated by qingjianwu on 15/4/13
 */
define(['scripts/controller/controller',
    '../../model/inventory/adjustModel'], function (controller, adjustModel) {
    "use strict";
    controller.controller('inventoryAdjustmentController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource', '$filter',
            function ($scope, $rootScope, $sync, $url, wmsDataSource, $filter) {
                var url = $url.inventoryAdjustUrl,
                    columns = [
                        WMS.UTILS.CommonColumns.checkboxColumn,
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { title: '调整单号', field: 'id', align: 'left', width: "150px"},
                        { title: '仓库', field: 'warehouseId', align: 'left', width: "150px", template:WMS.UTILS.whFormat},
                        { title: '数据来源',field: 'isAutoGen', filterable: false, align:'left', width: '110px', template:WMS.UTILS.codeFormat('isAutoGen','AutoGenType')},
                        { title: '商家', field: 'storerId', align: 'left', width: "150px", template:WMS.UTILS.storerFormat},
                        { title: '盘点单号', field: 'cycleCountId', align: 'left', width: "150px"},
                        { title: '参考单号', field: 'referNo', align: 'left', width: "150px"},
                        { title: '调整原因', field: 'resonCode', align: 'left', width: "150px", template:WMS.UTILS.codeFormat('resonCode', 'AmountAdjustReason')},
                        { title: '单据状态', field: 'statusCode', align: 'left', width: "150px", template:WMS.UTILS.codeFormat('statusCode', 'TicketStatus')},
                        { title: '备注', field: 'memo', align: 'left', width: "150px"}
                    ] ,
                    detailBaseColumns = [
//                        WMS.GRIDUTILS.CommonOptionButton,
//                        {filterable: false, title: '调整行号', field: 'detailLineNo', align: 'left', width: "100px"},
//                        {filterable: false, title: '图片名称', field: 'imageName', align: 'left', width: "100px"},
//                        {filterable: false, title: '参考行号', field: 'referLineNo', align: 'left', width: "100px"},
//                        { title: '仓库', field: 'warehouseId', align: 'left', width: "150px", template:WMS.UTILS.whFormat},
//                        { title: '商家', field: 'storerId', align: 'left', width: "150px", template:WMS.UTILS.storerFormat},
//                        { title: '调整原因', field: 'resonCode', align: 'left', width: "150px", template:WMS.UTILS.codeFormat('resonCode', 'AdjustReason')},
//                        {filterable: false, title: 'sku', field: 'skuSku', align: 'left', width: "100px"},
                        {filterable: false, title: '调前库区', field: 'zoneId', align: 'left', width: "100px",template:WMS.UTILS.zoneNoFormat},
                        {filterable: false, title: '调前货位', field: 'locationId', align: 'left', width: "100px", template:WMS.UTILS.locationFormat},
                        {filterable: false, title: '商品条码', field: 'skuBarcode', align: 'left', width: "160px"},
                        {filterable: false, title: '商品名称', field: 'skuItemName', align: 'left', width: "100px"},
                        {filterable: false, title: '颜色', field: 'skuColorCode', align: 'left', width: "100px", template: WMS.UTILS.codeFormat('skuColorCode', 'SKUColor')},
                        {filterable: false, title: '尺码', field: 'skuSizeCode', align: 'left', width: "100px", template: WMS.UTILS.codeFormat('skuSizeCode', 'SKUSize')},
                        {filterable: false, title: '调整前数量', field: 'originalQty', align: 'left', width: "150px"},
                        {filterable: false, title: '目标数量', field: 'adjustedQty', align: 'left', width: "110px"},
                        {filterable: false, title: '原成本', field: 'originalPrice', align: 'left', width: "100px"},
                        {filterable: false, title: '新成本', field: 'newPrice', align: 'left', width: "100px"},
                        {filterable: false, title: '原库存状态', field: 'originalInvStatusCode', align: 'left', width: "100px",template:WMS.UTILS.codeFormat("originalInvStatusCode", "InventoryStatus")},
                        {filterable: false, title: '新库存状态', field: 'newInvStatusCode', align: 'left', width: "150px",template:WMS.UTILS.codeFormat("newInvStatusCode", "InventoryStatus")},
                        {filterable: false, title: '调前箱号', field: 'cartonNo', align: 'left', width: "100px"},
                        {filterable: false, title: '备注', field: 'description', align: 'left', width: "100px"}
                    ],
                    dataSource = wmsDataSource({
                        url: url + '/Quantity/list',
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "number", editable: false, nullable: true }
                                }
                            }
                        }
                    });
                columns = columns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                detailBaseColumns = detailBaseColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: dataSource,
                    toolbar: [
                        { name: "create", text: "新增", className:"btn-auth-add"},
                        {template: '<kendo-button class="k-primary" ng-click="submit()">提交</kendo-button>', className:"btn-auth-submit"}
                    ],
                    columns: columns,
                    editable: {
                        mode: "popup",
                        window: {
                            width: "640px"
                        },
                        template: kendo.template($("#form-add").html())
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
                    selectable: "row"
                },$scope);

                var disableAry = ['skuItemName','skuBarcode','skuId','newInvStatusCode','adjustedQty','newPrice'],
                  hiddenAry = ['skuDiv i'],
                  clearValueAry = ['skuItemName','skuBarcode','skuId','adjustedQty','newPrice','originalQty','originalPrice'];
                $scope.isflag = 'true';
                $scope.adjustDetailOptions = function(dataItem){
                    var detailColumns = [],
                    toolbar = [];
                    if(dataItem.statusCode === "Initial"){
                        detailColumns = [WMS.GRIDUTILS.CommonOptionButton()];
                        toolbar = [{ name: "create", text:"新增"}];
                    }
                    detailColumns = detailColumns.concat(detailBaseColumns);

                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource:wmsDataSource({
                            url: url + "/" + dataItem.id + "/detail",
                            schema:{
                                model: adjustModel.adjustDetail
                            },
                            pageSize: 5
                        }),
                        toolbar: toolbar,
                        editable:{
                            mode: "popup",
                            window: {
                                width: "640px"
                            },
                            template: kendo.template($("#adjustDetail-editor").html())
                        },
                        columns: detailColumns,
                        widgetId: "adjustDetail",
                        save: function(e){
                            var model = e.model;
                            var barcode = $('#skuBarcode').val();
                            $scope.isflag = 'true';
//                            model.dirty = false;
                            if ($('#skuBarcode').val() != '') {
                                if ((!model.originalInvStatusCode == false) && model.originalInvStatusCode != "") {
                                  if (model.originalQty > 0) {

                                  } else {

                                      if(model.adjustedQty === ""){
                                          kendo.ui.ExtAlertDialog.showError("请输入调整数量");
                                          e.preventDefault();
                                          $scope.isflag = 'false';
                                          return;
                                      }
                                      if(model.adjustedQty <= 0) {
                                          kendo.ui.ExtAlertDialog.showError("调整数量需大于0");
                                          e.preventDefault();
                                          $scope.isflag = 'false';
                                          return;
                                      }
                                      if(model.newPrice < 0) {
                                          kendo.ui.ExtAlertDialog.showError("新成本价不能为负数");
                                          e.preventDefault();
                                          $scope.isflag = 'false';
                                          return;
                                      }
                                  }
                                } else {
                                  if(!model.newInvStatusCode || model.adjustedQty === ""){
                                    kendo.ui.ExtAlertDialog.showError("请输入调整数量和新库存状态");
                                    e.preventDefault();
                                      $scope.isflag = 'false';
                                      return;
                                  }
                                  if(model.adjustedQty <= 0) {
                                      kendo.ui.ExtAlertDialog.showError("调整数量需大于0");
                                      e.preventDefault();
                                      $scope.isflag = 'false';
                                      return;
                                  }
                                    if(model.newPrice < 0) {
                                        kendo.ui.ExtAlertDialog.showError("新成本价不能为负数");
                                        e.preventDefault();
                                        $scope.isflag = 'false';
                                        return;
                                    }

                                }

                                if ($scope.isflag == 'true') {
                                    $scope.isflag = $scope.submitLocation(e.sender, e.model, true, "");
                                }
                                e.preventDefault();
                            } else {
                                kendo.ui.ExtAlertDialog.showError("请输入商品条码!");
                                e.preventDefault();
                                $scope.isflag = 'false';
                                e.preventDefault();
                            }
                            if ($scope.isflag == 'false') {
                                return;
                            }
                            e.preventDefault();
                        },
                        edit: function(e){
                            var model = e.model;
                            model.storerId = dataItem.storerId;
                            // 未输入货位不能继续编辑其他内容
                            if (!model.locationId) {
                              _.each(disableAry, function(item){
                                $("#"+item).attr("disabled", true);
                              });
                              _.each(hiddenAry, function(item){
                                $("#"+item).hide();
                              });

                              _.each(clearValueAry, function(item){
                                $("#"+item).val("");
                              });
                            }
                          // 货位内容被清空，清空其他内容并不能继续编辑其他内容
                          e.container.on('mls:setValue', '#locationId', function(){
                            $scope.checkLocationNo(e.model);
                          });
                            // sku输入正确后，获得其在此货位上的信息
                            e.container.on('mls:setValue', '#skuId', function(){
                              $scope.checkSkuBarcodeNo(e.model, '2');
                            });
                            $("#newInvStatusCode").attr("disabled", true);
                            // 状态和数量不能同时调整
                            if(!model.newInvStatusCode || !model.originalInvStatusCode) {
                                $("#adjustedQty").attr("readonly", false);
                                $("#newInvStatusCode").attr("disabled", false);
                            }else if(model.newInvStatusCode !== model.originalInvStatusCode){
                                $("#adjustedQty").attr("readonly", "readonly");
                                $("#adjustedQty").val("");
                            }
                        }
                    },$scope);
                };

                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

                //提交方法
                $scope.submit = function() {
                    var selectView = $scope.kendoGrid.select();
                    var selectData = $scope.kendoGrid.dataItem(selectView);
                    var url="/inventory/adjust/submit";
                    if(selectData===null){
                        kendo.ui.ExtAlertDialog.showError("请选择提交数据!");
                    }
                    else{
                        $sync(window.BASEPATH + url, "POST", {data:{id:selectData.id}})
                            .then(function(xhr){
                                kendo.ui.ExtAlertDialog.showError("调整成功！");
                                $scope.kendoGrid.dataSource.read();
                            });
                    }
                };

                // 初始化检索区数据
//                $scope.query = {
//                    startTime: $filter('date')(new Date(),'yyyy/MM/dd 00:00:00')
//                };

                $scope.checkSkuBarcodeNo = function(dataItem, flag) {
                    var searchSkuId = "";

                    if (flag == '2') {
                        searchSkuId = $('#skuId').val();

                        if (searchSkuId == "" ) {
                            _.each(clearValueAry, function(item) {
                                $("#" + item).val("");
                            });
                        } else {
                            $sync(window.BASEPATH + "/inventory/sku/" + searchSkuId + "/location/" + dataItem.locationId, "GET", {wait: false})
                                .then(function (xhr) {
                                    var inventory = xhr.result;
                                    if (inventory === null) {
                                        WMS.UTILS.setValueInModel(dataItem, "originalQty", 0);
                                        WMS.UTILS.setValueInModel(dataItem, "originalPrice", 0);
                                    } else {
                                        WMS.UTILS.setValueInModel(dataItem, "originalQty", inventory.onhandQty);
                                        WMS.UTILS.setValueInModel(dataItem, "originalPrice", inventory.price);
                                    }
                                });
                        }
                    }

                    if (flag == '1') {
                        var searchBarcode = $("#skuBarcode").val();
                        if (searchBarcode == "" ) {
                            _.each(clearValueAry, function(item) {
                                $("#" + item).val("");
                            });
                        } else {
                            $sync(window.BASEPATH + "/inventory/barcode/"+ searchBarcode +"/location/"+ dataItem.locationId+"/storerId/"+dataItem.storerId, "GET", {wait:false})
                                .then(function(xhr){
                                    var inventory = xhr.result;

                                    if (inventory.sku != null ) {
                                        WMS.UTILS.setValueInModel(dataItem, "skuId", inventory.sku.id);
                                        WMS.UTILS.setValueInModel(dataItem, "skuItemName", inventory.sku.itemName);
                                        if (inventory.id > 0) {
                                            WMS.UTILS.setValueInModel(dataItem, "originalQty", inventory.onhandQty);
                                            WMS.UTILS.setValueInModel(dataItem, "originalPrice", inventory.price);
                                        } else {
                                            WMS.UTILS.setValueInModel(dataItem, "originalQty", 0);
                                            WMS.UTILS.setValueInModel(dataItem, "originalPrice", 0);
                                        }
                                    } else {
                                        _.each(clearValueAry, function(item) {
                                            $("#" + item).val("");
                                        });
                                        kendo.ui.ExtAlertDialog.showError("请输入合法的商品条码!");
                                    }
                                });
                        }
                    }
                }

                var oriLocationNo = '';
                $scope.checkLocationNo = function(dataItem) {
                    var locationNo = $("#locationNo").val();
                    if (locationNo == "" ) {
                        _.each(disableAry, function(item){
                            $("#"+item).attr("disabled", true);
                        });
                        _.each(hiddenAry, function(item){
                            $("#"+item).hide();
                        });

                        _.each(clearValueAry, function(item){
                            $("#"+item).val("");
                        });
                        dataItem.locationId='';
                        dataItem.locationNo='';
                        dataItem.originalInvStatusCode='';
                        dataItem.originalInvStatus='';
                        $('#originalInvStatus').val("");
                        $('#originalInvStatusCode').val("");
                        $('#newInvStatus').val("");
                        $('#newInvStatusCode').val("");
                        return;
                    }
//                    if (locationNo == "" || (locationNo == oriLocationNo && oriLocationNo != '')) {
//                        return;
//                    }
//                    oriLocationNo = locationNo;

                    _.each(clearValueAry, function(item){
                        $("#"+item).val("");
                    });
                    $sync(window.BASEPATH + "/location/locationInfo?locationNo="+locationNo, "GET", {wait:false})
                        .then(function(xhr){
                            var result = xhr.result;
                            if (result == null) {
                                kendo.ui.ExtAlertDialog.showError("请输入合法的货位号!");
                                _.each(disableAry, function(item){
                                    $("#"+item).attr("disabled", true);
                                });
                                _.each(hiddenAry, function(item){
                                    $("#"+item).hide();
                                });
                                _.each(clearValueAry, function(item){
                                    $("#"+item).val("");
                                });
                                dataItem.locationId='';
                                dataItem.locationNo='';
                                dataItem.originalInvStatusCode='';
                                dataItem.originalInvStatus='';
                                $('#originalInvStatus').val("");
                                $('#originalInvStatusCode').val("");
                                $('#newInvStatus').val("");
                                $('#newInvStatusCode').val("");
                                $("#locationNo").val("");
                            } else {
                                _.each(disableAry, function (item) {
                                    $("#" + item).attr("disabled", false);
                                });
                                _.each(hiddenAry, function (item) {
                                    $("#" + item).show();
                                });
                                $("#locationId").val(result.id);
                                dataItem.locationId=result.id;
                                dataItem.locationNo=result.locationNo;
                                dataItem.zoneId=result.zoneId;
                                $sync(window.BASEPATH + "/inventory/adjust/findInventory/"+result.id, "GET", {wait:true})
                                    .then(function(xhr){
                                        var resultRows = xhr.result.rows;
                                        if (resultRows != null) {
                                            WMS.UTILS.setValueInModel(dataItem, "originalInvStatus", $filter('codeFormat')(resultRows[0].inventoryStatusCode,"InventoryStatus"));
                                            WMS.UTILS.setValueInModel(dataItem, "originalInvStatusCode", resultRows[0].inventoryStatusCode);
                                            WMS.UTILS.setValueInModel(dataItem, "newInvStatusCode", resultRows[0].inventoryStatusCode);
                                            $("#newInvStatusCode").attr("disabled", true);
//                                            WMS.UTILS.setClass();
                                        } else {
                                            dataItem.originalInvStatusCode='';
                                            dataItem.originalInvStatus='';
                                            $('#originalInvStatus').val("");
                                            $('#originalInvStatusCode').val("");
                                        }
                                    });
                            }
                     });
                };

                $scope.submitLocation = function(grid, dataItem, isSku, prefix){

                     var searchLocation = $("#locationNo").val();
                     $sync($url.validLocationUrl + "?locationNo="+searchLocation, "GET", {wait: false})
                         .then(function(resp){
                             if(_.isEmpty(resp.result)){
                                 //that.locationError(dataItem, "请输入合法的货位号");
                                 kendo.ui.ExtAlertDialog.showError("请输入合法的货位号");
                             }else {

                                 if (resp.result.id == dataItem.locationId) {
                                     if (isSku == true) {
                                         $scope.submitSku(grid, dataItem, isSku, prefix);
                                     } else {
                                         grid.saveChanges();
                                     }
                                 } else {
                                     _.each(clearValueAry, function(item) {
                                         $("#" + item).val("");
                                     });
                                 }
                             }
                         });
                };

                $scope.submitSku = function(grid, dataItem, isSku, prefix){
                    var searchBarcode = $("#skuBarcode").val();
                    $sync(window.BASEPATH + "/inventory/barcode/"+ searchBarcode +"/location/"+ dataItem.locationId+"/storerId/"+dataItem.storerId, "GET", {wait:false})
                        .then(function(xhr){
                            var inventory = xhr.result;
                            if(_.isEmpty(inventory.sku)){
                                kendo.ui.ExtAlertDialog.showError("请输入合法的商品条码");
                            }else {
                                    grid.saveChanges();
                            }
                        });
                }

                $scope.changeInventoryStatus = function(){
                  this.dataItem.dirty = true;
                  var newInvStatusCode = $('#newInvStatusCode').val();
                  var originalInvStatusCode = $('#originalInvStatusCode').val();

                  if(!newInvStatusCode || !originalInvStatusCode) {
                     $("#adjustedQty").attr("readonly", "readonly");
                     $("#adjustedQty").val("");
                     $("#newPrice").val("");
                     this.dataItem.adjustedQty = '';
                     this.dataItem.newPrice = '';
                    $("#adjustedQty").attr("readonly", false);
                  }else if(newInvStatusCode !== originalInvStatusCode){
                    $("#adjustedQty").attr("readonly", "readonly");
                    $("#adjustedQty").val("");
                    this.dataItem.adjustedQty = '';
                    this.dataItem.newPrice = '';
                    $("#newPrice").val("");
                  }else{
                    $("#adjustedQty").attr("readonly", false);
                  }
                };
            }]);
})