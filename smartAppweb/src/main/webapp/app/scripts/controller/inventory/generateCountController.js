
define(['scripts/controller/controller'
], function(controller){
    "use strict";
    controller.controller('inventoryGenerateCountController',
        ['$scope', '$rootScope', 'sync', 'url', 'FileUploader', 'wmsDataSource', '$filter',
            function($scope, $rootScope, $sync, $url, FileUploader, wmsDataSource, $filter){

                var ASSIGN_COUNT = "assign";
                var RANDOM_COUNT = "random";
                var TOUCH_COUNT = "move";

                var PIECE_SCAN = "scan";
                var TOTAL_COUNT = "counting";

                $scope.query = {};
                $scope.query.typeCode = ASSIGN_COUNT;
                $scope.query.modeCode = PIECE_SCAN;
                $scope.query.isNullLoc = "0";

                $scope.percentDivChecked = true;
                $scope.moveChecked = true;

                var skuDataSource = new kendo.data.DataSource({
                    schema: {
                        model: {
                            id: "skuId",
                            fields:{
                                skuId: {type:"number", editable:true, nullable: true},
                                skuBarcode: {type:"string", editable:true, nullable: true}
                            }
                        }
                    },
                    data: []
                });

                $scope.model = {};

                $scope.skuOptions = WMS.GRIDUTILS.getGridOptions({
                    hasTabHeader: true,
                    toolbar:[{
                        className: 'btn-auth-import-sku',
                        template:
                            '<a class="k-button k-button-icontext k-grid-custom-command" style="width: 40px;" href="\\#" ng-click="importSku($event)">导入</a>'
                    },{
                        className: 'btn-auth-add-sku',
                        template:
                            '<a class="k-button k-button-icontext k-grid-add" href="\\#"><span class="k-icon k-add"></span>新增</a>'
                    }
                    ],
                    columns: [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { field: 'skuId', title: '货号', filterable: false, align:'left', width: '110px'},
                        { field: 'skuBarcode', title: '商品条码', filterable: false, align:'left', width: '160px'},
                        { field: 'skuItemName', title: '商品名称', filterable: false, align:'left', width: '110px'},
                        { field: 'skuSizeCode', title: '尺码', filterable: false, align:'left', width: '110px', template: WMS.UTILS.codeFormat('skuSizeCode', 'SKUSize')},
                        { field: 'skuColorCode', title: '颜色', filterable: false, align:'left', width: '110px', template: WMS.UTILS.codeFormat('skuColorCode', 'SKUColor')}
                    ],
                    dataSource: skuDataSource,
                    editable: {
                        mode: "popup",
                        window: {
                            width: "640px"
                        },
                        template: kendo.template($("#sku-form-edit").html())
                    },
                    edit: function(e) {
                        $scope.model.skuId = e.model.skuId;
                        $scope.model.skuBarcode = e.model.skuBarcode;
                        $scope.model.skuItemName = e.model.skuItemName;
                        $scope.model.skuSizeCode = e.model.skuSizeCode;
                        $scope.model.skuColorCode = e.model.skuColorCode;
                    },
                    cancel: function(e) {
                        if(!e.model.isNew()){
                            e.preventDefault();

                            e.model.skuId = $scope.model.skuId;
                            e.model.skuBarcode = $scope.model.skuBarcode;
                            e.model.skuItemName = $scope.model.skuItemName;
                            e.model.skuSizeCode = $scope.model.skuSizeCode;
                            e.model.skuColorCode = $scope.model.skuColorCode;

                            skuSaveCheck(e);
                        }
                    },
                    save: function(e){
                        e.preventDefault();

                        skuSaveCheck(e);
                    },
                    pageable: false
                });

                function skuSaveCheck(e){
                    var skuBarcode = e.model.skuBarcode;
                    var uid = e.model.uid;

                    var skuData = $scope.skuGrid.dataSource.data();
                    var flag = false;
                    _.each(skuData, function(record){
                        if(skuBarcode === record.skuBarcode && record.uid !== uid){
                            flag= true;
                            return;
                        }
                    });
                    if(flag){
                        kendo.ui.ExtAlertDialog.showError("已存在重复的信息");
                        return;
                    }

                    $sync(window.BASEPATH + "/inventoryGenerate/sku", "POST", {data:{skuBarcode:skuBarcode}, wait: false})
                        .then(function(xhr){
                            if(xhr.suc){
                                $scope.skuGrid.saveChanges();
                            }
                        });
                }

                $scope.checkSkuBarcode = function(dataItem){
                    var skuBarcode = dataItem.skuBarcode;
                    $sync(window.BASEPATH + "/inventoryGenerate/sku?skuBarcode="+skuBarcode, "GET")
                        .then(function(xhr){
                            var sku = xhr.result;
                            if(sku !== null){
                                WMS.UTILS.setValueInModel(dataItem, "skuId", sku.id);
                                WMS.UTILS.setValueInModel(dataItem, "skuItemName", sku.itemName);
                                WMS.UTILS.setValueInModel(dataItem, "skuSizeCode", sku.sizeCode);
                                $("#skuSizeCode").val($filter('codeFormat')(sku.sizeCode,"SKUSize"));
                                WMS.UTILS.setValueInModel(dataItem, "skuColorCode", sku.colorCode);
                                $("#skuColorCode").val($filter('codeFormat')(sku.colorCode,"SKUColor"));
                            }else{
                                WMS.UTILS.setValueInModel(dataItem, "skuId", "");
                                WMS.UTILS.setValueInModel(dataItem, "skuItemName", "");
                                WMS.UTILS.setValueInModel(dataItem, "skuSizeCode", "");
                                WMS.UTILS.setValueInModel(dataItem, "skuColorCode", "");
                            }
                        });
                };

                $scope.importSku = function(ev){
                    ev.preventDefault();
                    var skuGrid = this.skuGrid;
                    var importWindow = skuGrid.$angular_scope.importWindow;
                    var targetScope = skuGrid.$angular_scope;
                    targetScope.fileName = '';

                    if(importWindow === undefined){
                        console.warn("需要定义importWindow");
                    }

                    var uploader = targetScope.uploader = new FileUploader({
                        url:window.BASEPATH + "/inventoryGenerate/importSku",
                        alias: "file",
                        removeAfterUpload: true
                    });

                    uploader.onAfterAddingFile = function (item) {
                        targetScope.fileName = item.file.name;
                        $('.js_operationResult').hide();
                    };

                    uploader.onSuccessItem = function(fileItem, response, status, headers) {
                        console.info('onSuccessItem', fileItem, response, status, headers);
                        if (response.suc) {
                            var data = response.result;
                            skuGrid.dataSource.data(data);
                            importWindow.close();
                            kendo.ui.ExtAlertDialog.show({
                                title: "信息",
                                message: "导入成功！",
                                icon: "k-ext-information" });
                        } else {
                            if(response.result === null){
                                kendo.ui.ExtAlertDialog.showError(response.message);
                                return;
                            }
                            if (typeof(response.result) == 'object') {
                                $('.js_operationResult').show();
                                var errLogData = _.map(response.result, function(record) {
                                    for (var key in record) {
                                        if (record.hasOwnProperty(key)) {
                                            return {id:key,message:record[key]};
                                        }
                                    }
                                });
                                $("#importListSkuGrid").kendoGrid({
                                    columns: [
                                        {
                                            field: "id",
                                            filterable: false,
                                            width: 30,
//                                            attributes: {style: 'text-align: center;'},
                                            title: '商品条码'
                                        },
                                        {
                                            field: "message",
                                            filterable: false,
                                            width: 70,
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
                        title: "商品导入",
                        modal:true,
                        actions: ["Close"],
                        content:{
                            template:kendo.template($('#J_fileFormSku').html())
                        },
                        open: function () {
                            $('.js_operationResult').hide();
                        }
                    });
                    importWindow.refresh().center().open();

                    targetScope.uploadSkuFile = function() {
                        // 已经存在明细，提示是否覆盖
                        if (skuGrid !== undefined && skuGrid.dataSource.data().length > 0) {
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

                var zoneDataSource = new kendo.data.DataSource({
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                id: {type: "string", editable: true, nullable: true },
                                zoneNo: {type: "string", editable: true, nullable: true },
                                roadway: {type: "string", editable: true, nullable: true }
                            }
                        }
                    },
                    data: []
                });
                $scope.zoneOptions = WMS.GRIDUTILS.getGridOptions({
                    toolbar:[{
                        className: 'btn-auth-import-zone',
                        template:
                            '<a class="k-button k-button-icontext k-grid-custom-command" style="width: 40px;" href="\\#" ng-click="importZone($event)">导入</a>'
                    },{
                        className: 'btn-auth-add-zone',
                        template:
                            '<a class="k-button k-button-icontext k-grid-add" href="\\#"><span class="k-icon k-add"></span>新增</a>'
                    },{
                        className: 'btn-auth-add-zone',
                        template:
//                            '<div class="panel-group" id="isNullLocDiv"  >' +
                            '<label>空库位：</label>' +
//                                '<div class="panel-select">' +
                                    '<select name="query.isNullLoc" id="query.isNullLoc" ng-model="query.isNullLoc" >' +
                                        '<option value="0" selected="selected">不参与盘点</option><option value="1">参与盘点</option></select>'
//                            '</div></div>'
                    }
                    ],
                    columns: [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { field: 'zoneNo', title: '货区', filterable: false, align:'left', width: '110px'},
                        { field: 'roadway', title: '巷道', filterable: false, align:'left', width: '110px'}
                    ],
                    dataSource:zoneDataSource,
                    editable: {
                        mode: "popup",
                        window: {
                            width: "640px"
                        },
                        template: kendo.template($("#zone-form-edit").html())
                    },
                    edit: function(e){
                        $scope.model.zoneNo = e.model.zoneNo;
                        $scope.model.roadway = e.model.roadway;
                    },
                    cancel: function(e) {
                        if(!e.model.isNew()){
                            e.preventDefault();

                            e.model.zoneNo = $scope.model.zoneNo;
                            e.model.roadway = $scope.model.roadway;

                            zoneSaveCheck(e);
                        }
                    },
                    save: function(e){
                        e.preventDefault();

                        zoneSaveCheck(e);
                    },
                    pageable: false
                });

                function zoneSaveCheck(e){
                    var zoneNo = e.model.zoneNo;
                    var roadway = e.model.roadway;
                    var uid = e.model.uid;

                    var zoneData = $scope.zoneGrid.dataSource.data();
                    var flag = false;
                    if(zoneNo !== null && roadway === null){
                        _.each(zoneData, function(record){
                            if(zoneNo === record.zoneNo && record.roadway === null && record.uid !== uid){
                                flag= true;
                                return;
                            }
                        });
                    }else if(zoneNo === null && roadway !== null){
                        _.each(zoneData, function(record){
                            if(record.zoneNo === null && roadway === record.roadway && record.uid !== uid){
                                flag= true;
                                return;
                            }
                        });
                    }else if(zoneNo !== null && roadway !== null){
                        _.each(zoneData, function(record){
                            if(zoneNo === record.zoneNo && roadway === record.roadway && record.uid !== uid){
                                flag= true;
                                return;
                            }
                        });
                    }else if(zoneNo === null && roadway === null){
                        kendo.ui.ExtAlertDialog.showError("货区和巷道不能同时为空");
                        return;
                    }
                    if(flag){
                        kendo.ui.ExtAlertDialog.showError("已存在重复的信息");
                        return;
                    }

                    $sync(window.BASEPATH + "/inventoryGenerate/zone", "POST", {data:{zoneNo:zoneNo, roadway:roadway}, wait: false})
                        .then(function(xhr){
                            if(xhr.suc){
                                e.model.id = zoneNo + " & " +roadway;
                                $scope.zoneGrid.saveChanges();
                            }
                        });
                }

//                $scope.checkZoneNo = function(dataItem){
//                    var zoneNo = dataItem.zoneNo;
//                    var roadway = dataItem.roadway;
//                    $sync(window.BASEPATH + "/inventoryGenerate/zone?zoneNo="+zoneNo+"&roadway="+roadway, "GET")
//                        .then(function(xhr){
//                            var zone = xhr.result;
//                            if(zone !== null){
//                                WMS.UTILS.setValueInModel(dataItem, "roadway", zone.roadway);
//                            }else{
//                                WMS.UTILS.setValueInModel(dataItem, "roadway", "");
//                            }
//                        });
//                };

                $scope.checkZoneInfos = function(dataItem) {
                    var zoneId = $("#zoneId").val();

                    $sync(window.BASEPATH + "/inventoryGenerate/queryZone/"+zoneId, "GET")
                        .then(function(xhr){
                            var zone = xhr.result;
                            if(zone !== null){
                                WMS.UTILS.setValueInModel(dataItem, "zoneNo", zone.zoneNo);
                            }else{
                                WMS.UTILS.setValueInModel(dataItem, "zoneNo", "");
                            }
                        });

                };

                $scope.importZone = function(ev){
                    ev.preventDefault();
                    var zoneGrid = this.zoneGrid;
                    var importWindow = zoneGrid.$angular_scope.importWindow;
                    var targetScope = zoneGrid.$angular_scope;
                    targetScope.fileName = '';

                    if(importWindow === undefined){
                        console.warn("需要定义importWindow");
                    }

                    var uploader = targetScope.uploader = new FileUploader({
                        url:window.BASEPATH + "/inventoryGenerate/importZone",
                        alias: "file",
                        removeAfterUpload: true
                    });

                    uploader.onAfterAddingFile = function (item) {
                        targetScope.fileName = item.file.name;
                        $('.js_operationResult').hide();
                    };

                    uploader.onSuccessItem = function(fileItem, response, status, headers) {
                        console.info('onSuccessItem', fileItem, response, status, headers);
                        if (response.suc) {
                            var data = response.result.rows;
                            zoneGrid.dataSource.data(data);
                            importWindow.close();
                            kendo.ui.ExtAlertDialog.show({
                                title: "信息",
                                message: "导入成功！",
                                icon: "k-ext-information" });
                        } else {
                            if(response.result === null){
                                kendo.ui.ExtAlertDialog.showError(response.message);
                                return;
                            }
                            if (typeof(response.result) == 'object') {
                                $('.js_operationResult').show();
                                var errLogData = _.map(response.result, function(record) {
                                    for (var key in record) {
                                        if (record.hasOwnProperty(key)) {
                                            return {id:key,message:record[key]};
                                        }
                                    }
                                });
                                $("#importListZoneGrid").kendoGrid({
                                    columns: [
                                        {
                                            field: "id",
                                            filterable: false,
                                            width: 30,
//                                            attributes: {style: 'text-align: center;'},
                                            title: '货区 & 巷道'
                                        },
                                        {
                                            field: "message",
                                            filterable: false,
                                            width: 70,
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
                        title: "货区&巷道导入",
                        modal:true,
                        actions: ["Close"],
                        content:{
                            template:kendo.template($('#J_fileFormZone').html())
                        },
                        open: function () {
                            $('.js_operationResult').hide();
                        }
                    });
                    importWindow.refresh().center().open();

                    targetScope.uploadZoneFile = function() {
                        // 已经存在明细，提示是否覆盖
                        if (zoneGrid !== undefined && zoneGrid.dataSource.data().length > 0) {
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

                var locationDataSource = new kendo.data.DataSource({
                    schema: {
                        model: {
                            id: "locationNo",
                            fields: {
                                locationNo: {type: "string", editable: true, nullable: true }
                            }
                        }
                    },
                    data: []
                });

                $scope.locationOptions = WMS.GRIDUTILS.getGridOptions({
                    toolbar:[{
                        className: 'btn-auth-import-location',
                        template:
                            '<a class="k-button k-button-icontext k-grid-custom-command" style="width: 40px;" href="\\#" ng-click="importLocation($event)">导入</a>'
                    },{
                        className: 'btn-auth-add-location',
                        template:
                        '<a class="k-button k-button-icontext k-grid-add" href="\\#"><span class="k-icon k-add"></span>新增</a>'
                    }
                    ],
                    columns: [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { field: 'locationNo', title: '货位', filterable: false, align:'left', width: '110px'}
                    ],
                    dataSource:locationDataSource,
                    editable: {
                        mode: "popup",
                        window: {
                            width: "450px"
                        },
                        template: kendo.template($("#location-form-edit").html())
                    },
                    edit: function(e){
                        $("#locationNo").val(e.model.locationNo);

                        $scope.model.locationNo = e.model.locationNo;
                    },
                    cancel: function(e) {
                        if(!e.model.isNew()){
                            e.preventDefault();

                            e.model.locationNo = $scope.model.locationNo;
                            $("#locationNo").val(e.model.locationNo);

                            locationSaveCheck(e);
                        }
                    },
                    save: function(e){
                        e.preventDefault();

                        locationSaveCheck(e);
                    },
                    pageable: false
                });

                function locationSaveCheck(e){
                    var locationNo = $("#locationNo").val();
                    e.model.locationNo = $("#locationNo").val();
                    var uid = e.model.uid;

                    var locationData = $scope.locationGrid.dataSource.data();
                    var flag = false;
                    _.each(locationData, function(record){
                        if(locationNo === record.locationNo && record.uid !== uid){
                            flag= true;
                            return;
                        }
                    });
                    if(flag){
                        kendo.ui.ExtAlertDialog.showError("已存在重复的信息");
                        return;
                    }

                    $sync(window.BASEPATH + "/inventoryGenerate/location", "POST", {data:{locationNo:locationNo}, wait: false})
                        .then(function(xhr){
                            if(xhr.suc){
                                $scope.locationGrid.saveChanges();
                            }
                        });
                }

                $scope.importLocation = function(ev){
                    ev.preventDefault();
                    var locationGrid = this.locationGrid;
                    var importWindow = locationGrid.$angular_scope.importWindow;
                    var targetScope = locationGrid.$angular_scope;
                    targetScope.fileName = '';

                    if(importWindow === undefined){
                        console.warn("需要定义importWindow");
                    }

                    var uploader = targetScope.uploader = new FileUploader({
                        url:window.BASEPATH + "/inventoryGenerate/importLocation",
                        alias: "file",
                        removeAfterUpload: true
                    });

                    uploader.onAfterAddingFile = function (item) {
                        targetScope.fileName = item.file.name;
                        $('.js_operationResult').hide();
                    };

                    uploader.onSuccessItem = function(fileItem, response, status, headers) {
                        console.info('onSuccessItem', fileItem, response, status, headers);
                        if (response.suc) {
                            var data = response.result;
                            locationGrid.dataSource.data(data);
                            importWindow.close();
                            kendo.ui.ExtAlertDialog.show({
                                title: "信息",
                                message: "导入成功！",
                                icon: "k-ext-information" });
                        } else {
                            if(response.result === null){
                                kendo.ui.ExtAlertDialog.showError(response.message);
                                return;
                            }
                            if (typeof(response.result) == 'object') {
                                $('.js_operationResult').show();
                                var errLogData = _.map(response.result, function(record) {
                                    for (var key in record) {
                                        if (record.hasOwnProperty(key)) {
                                            return {id:key,message:record[key]};
                                        }
                                    }
                                });
                                $("#importListLocationGrid").kendoGrid({
                                    columns: [
                                        {
                                            field: "id",
                                            filterable: false,
                                            width: 30,
//                                            attributes: {style: 'text-align: center;'},
                                            title: '货位编号'
                                        },
                                        {
                                            field: "message",
                                            filterable: false,
                                            width: 70,
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
                        title: "货位导入",
                        modal:true,
                        actions: ["Close"],
                        content:{
                            template:kendo.template($('#J_fileFormLocation').html())
                        },
                        open: function () {
                            $('.js_operationResult').hide();
                        }
                    });
                    importWindow.refresh().center().open();

                    targetScope.uploadLocationFile = function() {
                        // 已经存在明细，提示是否覆盖
                        if (locationGrid !== undefined && locationGrid.dataSource.data().length > 0) {
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

                var storerDataSource = new kendo.data.DataSource({
                    schema: {
                        model: {
                            id: "storerNo",
                            fields:{
                                storerNo: {type:"string", editable:true, nullable: true}
                            }
                        }
                    },
                    data: []
                });

                $scope.storerOptions = WMS.GRIDUTILS.getGridOptions({
                    toolbar:[{
                        className: 'btn-auth-import-storer',
                        template:
                            '<a class="k-button k-button-icontext k-grid-custom-command" style="width: 40px;" href="\\#" ng-click="importStorer($event)">导入</a>'
                    },{
                        className: 'btn-auth-add-storer',
                        template:
                            '<a class="k-button k-button-icontext k-grid-add" href="\\#"><span class="k-icon k-add"></span>新增</a>'
                    }
                    ],
                    columns: [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { field: 'storerNo', title: '商家编码', filterable: false, align:'left', width: '110px'},
                        { field: 'storerName', title: '商家名称', filterable: false, align:'left', width: '110px'}
                    ],
                    dataSource:storerDataSource,
                    editable: {
                        mode: "popup",
                        window: {
                            width: "450px"
                        },
                        template: kendo.template($("#storer-form-edit").html())
                    },
                    edit: function(e) {
                        $scope.model.storerNo = e.model.storerNo;
                        $scope.model.storerName = e.model.storerName;
                    },
                    cancel: function(e) {
                        if(!e.model.isNew()){
                            e.preventDefault();

                            e.model.storerNo = $scope.model.storerNo;
                            e.model.storerName = $scope.model.storerName;

                            storerSaveCheck(e);
                        }
                    },
                    save: function(e){
                        e.preventDefault();

                        storerSaveCheck(e);
                    },
                    pageable: false
                });

                function storerSaveCheck(e){
                    var storerNo = e.model.storerNo;
                    var uid = e.model.uid;

                    if(storerNo === null || storerNo === ""){
                        kendo.ui.ExtAlertDialog.showError("请选择商家");
                        return;
                    }
                    var storerData = $scope.storerGrid.dataSource.data();
                    var flag = false;
                    _.each(storerData, function(record){
                        if(storerNo === record.storerNo && record.uid !== uid){
                            flag= true;
                            return;
                        }
                    });
                    if(flag){
                        kendo.ui.ExtAlertDialog.showError("已存在重复的信息");
                        return;
                    }

                    $sync(window.BASEPATH + "/inventoryGenerate/storer", "POST", {data:{storerNo:storerNo}, wait: false})
                        .then(function(xhr){
                            if(xhr.suc){
                                $scope.storerGrid.saveChanges();
                            }
                        });
                }

                $scope.checkStorerNo = function(dataItem){

                    var storerId = $("#storerId")[0].attributes.value.value;
                    if(storerId === ""){
                        kendo.ui.ExtAlertDialog.showError("请选择商家");
                        WMS.UTILS.setValueInModel(dataItem, "storerName", "");
                        WMS.UTILS.setValueInModel(dataItem, "storerNo", "");
                        return;
                    }
                    $sync(window.BASEPATH + "/storer/storer/"+storerId, "GET")
                        .then(function(xhr){
                            var storer = xhr.result;
                            if(storer !== null){
                                WMS.UTILS.setValueInModel(dataItem, "storerName", storer.shortName);
                                WMS.UTILS.setValueInModel(dataItem, "storerNo", storer.storerNo);
                            }else{
                                WMS.UTILS.setValueInModel(dataItem, "storerName", "");
                                WMS.UTILS.setValueInModel(dataItem, "storerNo", "");
                            }
                        });
                };

                $scope.importStorer = function(ev){
                    ev.preventDefault();
                    var storerGrid = this.storerGrid;
                    var importWindow = storerGrid.$angular_scope.importWindow;
                    var targetScope = storerGrid.$angular_scope;
                    targetScope.fileName = '';

                    if(importWindow === undefined){
                        console.warn("需要定义importWindow");
                    }

                    var uploader = targetScope.uploader = new FileUploader({
                        url:window.BASEPATH + "/inventoryGenerate/importStorer",
                        alias: "file",
                        removeAfterUpload: true
                    });

                    uploader.onAfterAddingFile = function (item) {
                        targetScope.fileName = item.file.name;
                        $('.js_operationResult').hide();
                    };

                    uploader.onSuccessItem = function(fileItem, response, status, headers) {
                        console.info('onSuccessItem', fileItem, response, status, headers);
                        if (response.suc) {
                            var data = response.result.rows;
                            storerGrid.dataSource.data(data);
                            importWindow.close();
                            kendo.ui.ExtAlertDialog.show({
                                title: "信息",
                                message: "导入成功！",
                                icon: "k-ext-information" });
                        } else {
                            if(response.result === null){
                                kendo.ui.ExtAlertDialog.showError(response.message);
                                return;
                            }
                            if (typeof(response.result) == 'object') {
                                $('.js_operationResult').show();
                                var errLogData = _.map(response.result, function(record) {
                                    for (var key in record) {
                                        if (record.hasOwnProperty(key)) {
                                            return {id:key,message:record[key]};
                                        }
                                    }
                                });
                                $("#importListStorerGrid").kendoGrid({
                                    columns: [
                                        {
                                            field: "id",
                                            filterable: false,
                                            width: 30,
//                                            attributes: {style: 'text-align: center;'},
                                            title: '商家编号'
                                        },
                                        {
                                            field: "message",
                                            filterable: false,
                                            width: 70,
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
                        title: "商家导入",
                        modal:true,
                        actions: ["Close"],
                        content:{
                            template:kendo.template($('#J_fileFormStorer').html())
                        },
                        open: function () {
                            $('.js_operationResult').hide();
                        }
                    });
                    importWindow.refresh().center().open();

                    targetScope.uploadStorerFile = function() {
                        // 已经存在明细，提示是否覆盖
                        if (storerGrid !== undefined && storerGrid.dataSource.data().length > 0) {
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

                $scope.operatorWindowOpen = function(){
                    $scope.userWhPopup.setReturnData = function(returnData){
                        if (_.isEmpty(returnData)) {
                            return;
                        }
                        $scope.query.operator = returnData.userName;
                    };
                    $scope.userWhPopup.refresh().open().center();
                };

                $scope.generateCount = function(query){
                    var skuGrid = this.skuGrid;
                    var skuData = skuGrid.dataSource.data();
                    var sku = _.map(skuData, function(record){
                        return {
                            skuBarcode: record.skuBarcode
                        };
                    });

                    var zoneGrid = this.zoneGrid;
                    var zoneData = zoneGrid.dataSource.data();
                    var zone = _.map(zoneData, function(record){
                        return {
                            zoneNo: record.zoneNo,
                            roadway: record.roadway
                        };
                    });

                    var locationGrid = this.locationGrid;
                    var locationData = locationGrid.dataSource.data();
                    var location = _.map(locationData, function(record){
                        return {
                            locationNo: record.locationNo
                        };
                    });

                    var storerGrid = this.storerGrid;
                    var storerData = storerGrid.dataSource.data();
                    var storer = _.map(storerData, function(record){
                        return {
                            storerNo: record.storerNo
                        };
                    });

                    var params = this.query;

                    params.isNullLoc = $("#query\\.isNullLoc").val();

                    var map = {};
                    if(params.typeCode === ASSIGN_COUNT){
                        if(sku.length === 0 && zone.length === 0 && location.length === 0 && storer.length === 0){
                            kendo.ui.ExtAlertDialog.showError("请至少在1个标签内导入数据");
                            return;
                        }

                        map = {
                            "params": params,
                            "sku": sku,
                            "zone": zone,
                            "location": location,
                            "storer": storer
                        };
                    }else if(params.typeCode === RANDOM_COUNT){
                        if(params.percent !== undefined && params.percent !== ""){
                            if(params.percent < 1){
                                kendo.ui.ExtAlertDialog.showError("盘点比例不能小于1");
                                return;
                            }
                            if(params.percent > 100){
                                kendo.ui.ExtAlertDialog.showError("盘点比例不能大于100");
                                return;
                            }
                        }else{
                            kendo.ui.ExtAlertDialog.showError("请输入盘点比例！");
                            return;
                        }

//                        if(zone.length === 0 && storer.length === 0){
//                            kendo.ui.ExtAlertDialog.showError("请至少在1个标签内导入数据");
//                            return;
//                        }

                        map = {
                            "params": params,
                            "zone": zone,
                            "storer": storer
                        };
                    }else if(params.typeCode === TOUCH_COUNT){
                        map = {
                            "params": params
                        };
                    }


                    $sync(window.BASEPATH + "/inventoryGenerate/sum", "POST", {data:map})
                        .then(function(xhr){
                            var sum = xhr.result.result;
                            if(sum === null){
                                kendo.ui.ExtAlertDialog.showError("没有需要盘点的货位，请检查！");
                                return;
                            }
                            $.when(kendo.ui.ExtOkCancelDialog.show({
                                    title: "确认/取消",
                                    message: "生成盘点货位"+sum+"个，是否确认生成盘点单？",
                                    icon: "k-ext-question" })
                            ).done(function (response) {
                                    if (response.button === "OK") {
                                        var url = "/inventoryGenerate";
                                        $sync(window.BASEPATH + url, "POST", {data:map})
                                            .then(function(xhr){
                                                if(xhr.suc){
                                                    kendo.ui.ExtAlertDialog.show({
                                                        title: "信息",
                                                        message: "盘点单生成成功！",
                                                        icon: "k-ext-information" }
                                                    );
                                                }
                                            });
                                    }
                                });
                        });
                };

                $scope.changeTypeCode = function(typeCode){
                    if(typeCode === ASSIGN_COUNT){
                        $("#skuTab").show();
                        $("#zoneTab").show();
                        $("#locationTab").show();
                        $("#storerTab").show();
                        $scope.percentDivChecked = true;
//                        $scope.query.percent = "";
                        $scope.moveChecked = true;
                        var skuTabToActivate = $("#skuTab");
                        $("#tabStrip").kendoTabStrip().data("kendoTabStrip").activateTab(skuTabToActivate);
                    } else if(typeCode === RANDOM_COUNT){
                        $("#skuTab").hide();
                        $("#locationTab").hide();
                        $("#zoneTab").show();
                        $("#storerTab").show();
                        $scope.percentDivChecked = false;
                        $scope.moveChecked = true;
                        var zoneTabToActivate = $("#zoneTab");
                        $("#tabStrip").kendoTabStrip().data("kendoTabStrip").activateTab(zoneTabToActivate);
                        $scope.clickZoneTab();
                    } else if(typeCode === TOUCH_COUNT){
                        $scope.percentDivChecked = true;
                        $scope.moveChecked = false;
                    }
                };

                $scope.clearOperator = function(e){
                    $scope.query.operator = "";
                };

                $scope.clickSkuTab = function(){
                  WMS.UTILS.resetTableHeight(true, false, true);
                };

                $scope.clickZoneTab = function(){
                  WMS.UTILS.resetTableHeight(true, false, true);
                };
//
//                $scope.clickLocationTab = function(){
//                    $("#isNullLocDiv").hide();
//                    $scope.query.isNullLoc = "0";
//                };
//
//                $scope.clickStorerTab = function(){
//                    $("#isNullLocDiv").hide();
//                    $scope.query.isNullLoc = "0";
//                };

                $scope.customerResetFn = function() {
                    $scope.query.typeCode = ASSIGN_COUNT;
                    $scope.query.modeCode = PIECE_SCAN;
                    $scope.changeTypeCode("assign");
                    $scope.query.percent = "";
                    $scope.query.operator = "";
                    $scope.query.countBeginTime = "";
                    $scope.query.countEndTime = "";
                    this.locationGrid.dataSource.data([]);
                    this.skuGrid.dataSource.data([]);
                    this.storerGrid.dataSource.data([]);
                    this.zoneGrid.dataSource.data([]);
                };
            }
        ]

    );
});