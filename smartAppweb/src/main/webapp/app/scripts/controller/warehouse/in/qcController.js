/**
 * Created by zw on 15/4/20.
 */

define(['scripts/controller/controller','../../../model/warehouse/in/receiptModel'], function(controller,receiptModel) {
    "use strict";
    controller.controller('warehouseInQcController',
        ['$scope', '$rootScope', '$http', 'url','wmsDataSource','wmsLog', 'sync', '$filter', 'wmsReportPrint',
            function($scope, $rootScope, $http, $url, wmsDataSource, wmsLog, $sync, $filter, wmsReportPrint) {
                var headerUrl = $url.warehouseInQcUrl,
                    headerColumns = [
                        //WMS.UTILS.CommonColumns.checkboxColumn,
                        //WMS.GRIDUTILS.CommonOptionButton,
                        { filterable: false, title: '质检单号', field: 'id', align: 'left', width: "100px"},
                        { filterable: false, title: '通知单号', field: 'asnId', align: 'left', width: "100px"},
                        //{ filterable: false, title: 'ASN类型', field: 'xx', align: 'left', width: "100px"},//TODO 没有字段，且WMS_2.0_QC.docx中备注的选项是receiptHeader中才能录入的
                        { filterable: false, title: '质检进度',   field: 'statusCode', align: 'left', width: "150px", template:WMS.UTILS.codeFormat('statusCode','OrderOperationStatus')},
                        { filterable: false, title: 'ERP单号',   field: 'fromErpNo', align: 'left', width: "150px"},
                        //{ filterable: false, title: '商家', field: 'storerId', align: 'left', width: "100px",template:WMS.UTILS.storerFormat},//TODO 没有字段，不知道哪里取
                        { filterable: false, title: '供应商', field: 'vendorName', align: 'left', width: "150px"},
                        { filterable: false, title: '总品相数', field: 'totalCategoryQty', align: 'left', width: "100px"},
                        { filterable: false, title: '总合格数', field: 'qualifiedQty', align: 'left', width: "100px"},
                        { filterable: false, title: '总不合格数', field: 'unqualifiedQty', align: 'left', width: "100px"},
                        //{ filterable: false, title: '需质检总数', field: 'xx', align: 'left', width: "100px"},//TODO 没有字段，且品类，数量详细已经在中显示了
                        //{ filterable: false, title: '实检数量', field: 'xx', align: 'left', width: "100px"},//TODO 没有字段，且品类，数量详细已经在中显示了
                        { filterable: false, title: '备注', field: 'description', align: 'left', width: "200px"}
                    ],

                    headerDataSource = wmsDataSource({
                        url: headerUrl,
                        schema: {
                            model: {
                                id:"id",
                                fields: {
                                    id: { type: "number", editable: false, nullable: true }
                                }
                            }
                        }
                    });

                headerColumns = headerColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                headerColumns.splice(0,0,WMS.UTILS.CommonColumns.checkboxColumn);

                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    widgetId:"header",
                    dataSource: headerDataSource,
                    toolbar: [{ name: "close", text: "关闭",className: "btn-auth-closeCheck"},
                        {template: '<a class="k-button k-grid-print" ng-click="receipt()" href="\\#">质检收货完成</a>', className: "btn-auth-batchDelivery"}],
                    columns: headerColumns,
                    //editable: {mode: "popup", template: kendo.template($("#qcHeaderEditor").html())},
                    //height: 400,
                    customChange: function (grid) {
                        $(".k-grid-close").css({"visibility":"hidden"});
                        $(".k-grid-print").css({"visibility":"hidden"});
                        var selected = WMS.GRIDUTILS.getCustomSelectedData($scope.qcHeaderGrid);
                        if (selected.length > 0) {
                            var close = 0, size = selected.length;
                            $.each(selected, function () {
                                if (this.statusCode=== 'Doing') {
                                    close++;
                                }
                            });
                            if (close === size) {
                                $(".k-grid-close").css({"visibility":"visible"});
                                $(".k-grid-print").css({"visibility":"visible"});
                            }
                        } else {
                            $(".k-grid-close").css({"visibility":"visible"});
                            $(".k-grid-print").css({"visibility":"visible"});
                        }
                    }
                }, $scope);

                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

                $scope.qcDetailOptions = function(dataItem) {
                    var checkColumn = [
                        { filterable: false, title: '质检', field: 'skuId', align: 'left',width:"100px;", template : '<a class="k-button k-button-custom-command btn-auth-check" ng-click="openQcCheck(this)">质检</a>'}
                    ];
                    //质检明细信息
                    var qcDetailColumns = [
                        //WMS.GRIDUTILS.deleteOptionButton,
                        /*{ title: '操作', command: [
                         { name: "check", template: "<a  class='k-button k-button-icontext k-grid-edit' href='\\#'><span class='k-icon k-edit'></span>编辑</a>",
                         className: "btn-auth-check"}
                         ],
                         width: "100px"
                         },*/
                        { filterable: false, title: '商品图片', field: 'skuImageUrl', align: 'left', width: "120px", template:"<img src='#=skuImageUrl#' width='100px' height='100px' />"},
                        { filterable: false, title: '商品条码', field: 'skuBarcode', align: 'left',width:"160px;"},
                        { filterable: false, title: '商品名称', field: 'skuItemName', align: 'left',width:"120px;"},
                        { filterable: false, title: '颜色', field: 'skuColorCode', align: 'left', width: "120px;"},
                        { filterable: false, title: '尺码', field: 'skuSizeCode', align: 'left', width: "120px;", template: WMS.UTILS.codeFormat('skuSizeCode', 'SKUSize')},
                        { filterable: false, title: '货号', field: 'skuProductNo', align: 'left', width: "120px;"},
                        { filterable: false, title: '型号', field: 'skuModel', align: 'left', width: "120px;"},
                        { filterable: false, title: '需质检总数量', field: 'qcQty', align: 'left',width:"120px;"},
                        { filterable: false, title: '实检数量', field: 'checkedQty', align: 'left',width:"120px;"},
                        { filterable: false, title: '合格品数量', field: 'qualifiedQty', align: 'left',width:"120px;"},
                        { filterable: false, title: '不合格品数量', field: 'unqualifiedQty', align: 'left',width:"120px;"}
                        //{ filterable: false, title: '明细进度', field: 'xx', align: 'left',width:"120px;"}//TODO 没有字段
                    ];
                    qcDetailColumns = qcDetailColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                    if(dataItem.statusCode !== "Finished" && dataItem.statusCode !== "Closed"){
                        qcDetailColumns = checkColumn.concat(qcDetailColumns);
                    }
                    var toolbar=[];
                    /* 顶部质检按钮 modified by zw 2015-11-06
                    if (dataItem.statusCode !=='Closed') {
                        toolbar = [{ template:'<a class="k-button k-button-custom-command btn-auth-check" ng-click="openQcCheck(dataItem)">质检</a>'}];
                    }*/
                    return WMS.GRIDUTILS.getGridOptions({
                        widgetId:"detail",
                        dataSource: wmsDataSource({
                            url: headerUrl+"/"+dataItem.id+"/detail",
                            schema: {
                                model: {
                                    id:"id",
                                    fields: {
                                        id: {type:"number", editable: false, nullable: true },
                                        skuId:{type:"number"}
                                    }
                                }
                            }
                        }),
                        editable: {
                            mode: "popup",
                            window: {
                                width: '710px'
                            }
                        },
                        toolbar: toolbar,
                        columns: qcDetailColumns
                    }, $scope);
                };


                //质检检查记录信息

                $scope.qcCheckOptions = function(dataItem) {
                    var qcCheckColumns = [
                        { filterable: false, title: '查看', field: 'qcCheckId', align: 'left',width:"130px;", template : '<a class="k-button k-button-custom-command btn-auth-check" ng-click="openQcCheckDetail(dataItem)">查看质检详细</a>'},
                        { filterable: false, title: '商品条码', field: 'skuBarcode', align: 'left',width:"160px;"},
                        { field: 'locationId', title: '货位', filterable: false, align: 'left', width: '160px', template: WMS.UTILS.locationFormat, sortable: {
                            compare: function(a, b) {
                                return $filter("locationFormat")(a.locationId).localeCompare($filter("locationFormat")(b.locationId));
                            }
                        }},
                        { filterable: false, title: '批次号', field: 'description', align: 'left',width:"120px;"},
                        { filterable: false, title: '商品名称', field: 'skuItemName', align: 'left',width:"120px;"},
                        { filterable: false, title: '商品状态', template: WMS.UTILS.codeFormat('isQualified','GoodsStatus'),field: 'isQualified', align: 'left',width:"120px;"},
                        { filterable: false, title: '检验数量', field: 'qcQty', align: 'left',width:"120px;"}
                        //{ filterable: false, title: '不合格原因',template: WMS.UTILS.codeFormat('unQualifiedReason','UnqualifiedReason'),field: 'unQualifiedReason', align: 'left',width:"120px;"}
                    ];
                    qcCheckColumns = qcCheckColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);

                    return WMS.GRIDUTILS.getGridOptions({
                        widgetId:"check",
                        dataSource: wmsDataSource({
                            url: headerUrl+"/"+dataItem.id+"/qcLog",
                            callback: {
                                destroy: function (response, editData) {
                                    $scope.qcDetailGrid.dataSource.read();//刷新detailGrid
                                }
                            },
                            schema: {
                                model: {
                                    id:"id",
                                    fields: {
                                        id: {type:"number", editable: false, nullable: true }
                                    }
                                }
                            }
                        }),
                        editable: {
                            mode: "popup"
                        },
                        columns: qcCheckColumns
                    }, $scope);
                };


                function getSelId(){
                    var selectedData=WMS.GRIDUTILS.getCustomSelectedData($scope.qcHeaderGrid);
                    var ids=[];
                    selectedData.forEach(function(value){
                        ids.push(value.id);
                    });
                    var id = ids.join(",");
//                    console.log(id);
                    return id;
                }

                //操作日志
                $scope.logOptions = wmsLog.operationLog;

                $scope.$on("kendoRendered", function(e) {

                });


                $scope.$on("kendoWidgetCreated", function(event, widget){
                    if (widget.options !== undefined && widget.options.widgetId === 'detail') {
                        $scope.qcDetailGrid = widget;
                        widget.bind("edit", function(e) {
                            $scope.editModel = e.model;
                        });
                    }
                    if (widget.options !== undefined && widget.options.widgetId === 'check') {
                        $scope.qcCheckGrid = widget;
                    }
                    if (widget.options !== undefined && widget.options.widgetId === 'header') {
                        widget.bind("edit", function(e) {
                            $scope.editHeaderModel = e.model;
                        });
                        //关闭质检单操作
                        $(".k-grid-close").on('click',function(e){
                            var id = getSelId();
                            if(!id){
                                return;
                            }

                            $.when(kendo.ui.ExtOkCancelDialog.show({
                                    title: "确认/取消",
                                    message: "确定关闭？",
                                    icon: "k-ext-question" })
                            ).done(function (response) {
                                    if (response.button === "OK") {
                                        $sync(window.BASEPATH + "/qc/close/" + id , "PUT")
                                            .then(function (xhr) {
                                                $scope.qcHeaderGrid.dataSource.read({});
                                            },function (xhr) {
                                                $scope.qcHeaderGrid.dataSource.read({});
                                            });
                                    }
                                });



                        });
                    }
                });

                $scope.receipt = function () {
                    var qcHeaderGrid = this.qcHeaderGrid;
                    var selectView = WMS.GRIDUTILS.getCustomSelectedData(qcHeaderGrid);
                    var selectedDataArray = _.map(selectView, function (view) {
                        return view.id;
                    });
                    var selectDataIds = selectedDataArray.join(",");
                    if (selectDataIds === "") {
                        kendo.ui.ExtAlertDialog.showError("请选择要自动收货的数据！");
                        return;
                    }
                    $sync(window.BASEPATH + "/qc/delivery/"+selectDataIds, "POST")
                        .then(function (xhr) {
                        });
                };

                $scope.isPrint = false;

                $scope.checkClose = function(){
                    $scope.checkModel = {};
                    $scope.checkPopup.close();
                };

                $scope.badLocationClose = function(){
                    $scope.badLocationPopup.close();
                };


                //单独绑定事件，之前的方式会被多次调用，导致id取的不对 zw
                $scope.openQcCheck = function(obj){
                    $scope.isOverReceipt = false;//初始设置超收提权为false
                    //$scope.checkPopup.refresh().open().center();
                    $scope.checkPopup.refresh().open().maximize();
                    $scope.checkModel = {};
                    $scope.checkModel.qcId = obj.dataItem.qcId;
                    $scope.checkModel.asnId = obj.$parent.dataItem.asnId;
                    $scope.checkModel.skuId = obj.dataItem.skuId;
                    $scope.checkModel.location = "";
                    $("#productionTime").val("");
                    $scope.prepareCheckData();
                    setTimeout(function(){$("#location").focus();}, 2000);

                };

                $scope.prepareCheckData = function(){
                    var skuId    = $scope.checkModel.skuId;
                    var headerId = $scope.checkModel.qcId;
                    //1、查询后台
                    $sync(window.BASEPATH + "/qc/" + headerId + "/" + skuId + "/checkData", "GET", {data : null}).then(function(xhr){
                        if(xhr.result === null){
                            return ;
                        }
                        var imageUrls = xhr.result.sku.imageUrlDetail;
                        $scope.checkModel.colorCode         = xhr.result.sku.colorCode;
                        $scope.checkModel.barcode           = xhr.result.sku.barcode;
                        //$scope.checkModel.sizeCode          = xhr.result.sku.sizeCode;
                        $scope.checkModel.sizeCode          = $filter('codeFormat')(xhr.result.sku.sizeCode, 'SKUSize');
                        $scope.checkModel.categoryid        = $filter('commodityTypeFormat')(xhr.result.sku.categoryid,'commodityType');
                        $scope.checkModel.itemName          = xhr.result.sku.itemName;
                        $scope.checkModel.importantSize     = xhr.result.sku.importantSize;
                        $scope.checkModel.imageUrlDetail    = imageUrls.substr(1, imageUrls.length-2).replace(/"/g,"").split(",");
                        $scope.checkModel.imageUrl          = xhr.result.sku.imageUrl;
                        $scope.checkModel.qcQty             = xhr.result.qcDetail.qcQty;
                        $scope.checkModel.checkedQty        = xhr.result.qcDetail.checkedQty;
                        $scope.checkModel.detailId          = xhr.result.qcDetail.id;
                        $scope.checkModel.asnDetailId       = xhr.result.qcDetail.asnDetailId;
                        $scope.checkModel.skuId             = xhr.result.sku.id;
                        $scope.checkModel.items             = xhr.result.items;
                        if(xhr.result.isByProductionTime===0){
                            $("#productionTime").attr("disabled", true);
                            $("#productionTime").addClass("inputDisbled");
                        }else{
                            $("#productionTime").removeAttr("disabled");
                            $("#productionTime").removeClass("inputDisbled");
                        }
                    });

                };

                $scope.beforeConfirmValidate = function(){
                    var isOk = false;
                    if($("#location").val() === "" || $("#location").val() === undefined){
                        kendo.ui.ExtAlertDialog.showError("请扫描货位！", $("#location"));
                        return false;
                    }
                    var parentInputs = $("#qcItems input[id^='parent']");//取到所有类型按钮
                    $.each(parentInputs, function(i, parentInput){
                        var parentBtn   = $(parentInput);//单个类型按钮
                        var parentId    = parentBtn.attr("id");
                        var items       = $(parentInput).parent().parent().parent().find("input[parentId='" + parentId + "']");
                        if(parentBtn.is(":checked")){//如果类型按钮选中，可以通过
                            isOk = true;
                        }else{//没选择，就要判断类型下的质检项，有没有选中一个
                            isOk = false;
                            $.each(items, function(j, item){
                                if($(item).is(":checked")){//如果有一项选中，此类型就算是质检了
                                    isOk = true;
                                    return false;
                                }
                            });
                        }
                        //任意一个分类有未选中的，都不行。这时候就可以返回错误了。
                        if(!isOk){
                            kendo.ui.ExtAlertDialog.showError("有未完成质检项，请检查！");
                            return false;
                        }
                    });
                    return isOk;
                };

                $scope.checkIsQualified = function(){
                    var isQualified = true;
                    if($("input[parentId]").is(":checked")){//如果质检项有被选中的，则是不合格
                        isQualified = false;
                    }
                    if(!isQualified){//不合格，要弹出输入残品容器号的页面
                        $scope.badLocationPopup.refresh().open().center();
//                        setTimeout(function(){$("#badLocationNo").focus().select();}, 500);
                        $("#badLocationNo").select();
                        setTimeout(function () {
                            $("#badLocationNo").focus();
                        }, 500);
                    }
                    return isQualified;
                };


                $scope.checkConfirm = function(e){
                    //校验数据输入完整性
                    if(!$scope.beforeConfirmValidate()){
                        return;
                    }
                    //判断是否合格，不合格要弹出残品货位输入框
                    var isQualified = $scope.checkIsQualified();
                    if(isQualified){
                        if($scope.confirmQc(isQualified)){
                            return true;
                        }else{
                            return false;
                        }
                    }else{
                        return false;
                    }

                };


                $scope.confirmQc = function(isQualified){
                    $scope.isReceiveSku = true;
                    if(isQualified){
                        $scope.checkModel.location = $("#location").val();

                    }else{
                        $scope.checkModel.location = $("#badLocationNo").val();
                    }
                    $scope.badLocationClose();//关闭残品容器号页面
                    //提交
                    var params = {
                        "barcode"       : $scope.checkModel.barcode,
                        "detailId"      : $scope.checkModel.detailId,
                        "asnId"         : $scope.checkModel.asnId,
                        "asnDetailId"   : $scope.checkModel.asnDetailId,
                        "skuId"         : $scope.checkModel.skuId,
                        "location"      : $scope.checkModel.location,
                        "qcId"          : $scope.checkModel.qcId,
                        "productionTime": $("#productionTime").val(),
                        "isOverReceipt" : $scope.isOverReceipt
                    };
                    var items = $("#qcItems").serializeArray();
                    var qcItem = {};
                    var j = 0;
                    $.each(items, function(i, item){
                        //最后一组数据，根据itemId_doNotDeleteMe这个标签取
                        if(item.name.indexOf("itemId") !== -1){
                            if(j !== 0){//第一个进来，不处理
                                params["qcItem" + j] = qcItem;
                                qcItem = {};
                                j++;
                            }else{
                                j++;
                            }
                        }
                        var itemName = item.name.substr(0, item.name.indexOf("_"));
                        qcItem[itemName] = item.value;
                    });
                    //质检，这里不需要指定qcDetailId，所以传0
                    $sync(window.BASEPATH + "/qc/" + $scope.checkModel.qcId + "/checkData", "POST",{data: params})
                        .then(function (xhr) {
                            $scope.qcDetailGrid.dataSource.read();//刷新detailGrid
                            $scope.qcCheckGrid.dataSource.read(); //刷新checkGrid
                            //质检完成后，重新查询，然后清空质检项
                            $scope.prepareCheckData();
                            $("#qcItems input[type='checkbox']").attr("checked", false);
                            if($scope.isPrint){
                                $scope.print();
                            }
                            $scope.isPrint = false;
                        },function (xhr) {
                            //正残品不能混放，焦点重新回归到容器号
                            setTimeout(function(){$("#location").focus().select();}, 500);
                            return ;
                        });

                };


                $scope.checkConfirmAndPrint = function(){
                    $scope.isPrint = true;
                    $scope.checkConfirm();
                };

                //扫描残品容器后的提交事件
                $scope.badConfirm = function(){
                    $scope.confirmQc(false);
                };



                $scope.allOk = function (e){
                    var parentId = $(e.currentTarget).attr("id");
                    var isChecked = $(e.currentTarget).is(":checked");
                    if(isChecked){
                        $(e.currentTarget).parent().parent().parent().find("input[parentId='" + parentId + "']").attr("checked", !isChecked);
                    }

                };


                $scope.oneNotOk = function (e){
                    var parentId = $(e.currentTarget).attr("parentId");
                    $("#"+parentId).attr("checked", false);

                };



                //打印
                $scope.print = function(){
                   var skuId = $scope.checkModel.skuId;
                    if(skuId === ""){
                        kendo.ui.ExtAlertDialog.showError("没有需要打印的信!");
                        return;
                    }
                    var array = [];
                        array.push(skuId);
                    wmsReportPrint.printSkuBarcodeByIds(array,1);
                };


                //单独绑定事件，之前的方式会被多次调用，导致id取的不对 zw
                $scope.openQcCheckDetail = function(dataItem){
                    var qcCheckId = dataItem.id;
                    $scope.checkDetailPopup.refresh().open().center();
                    $sync(window.BASEPATH + "/qc/" + qcCheckId + "/qcCheckDetails" , "GET", {data: null}).then(function(xhr){
                        $scope.qcItems = xhr.result.rows;
                    });

                };


                $scope.checkQcCheckDetail = function(){
                    $scope.qcItems = {};
                    $scope.checkDetailPopup.close();
                };


                //confirm消息监听
                $scope.$on('confirmOK', function () {
                    if($scope.isReceiveSku === true){//扫描收货的监听
                        /***********提权操作 BEGIN***********/
                        $scope.overReceiptPopup.refresh().open().center();
                        $scope.overReceipt = {};
                        setTimeout(function () {
                            $("#overReceiptValue").focus();
                        }, 1000);
                        $scope.isReceiveSku = false;
                        /***********提权操作   END***********/
                    }
                });


                //验证超收提权密码
                $scope.validateOverReceipt = function(){
                    var params = {
                        "orderTypeCode"     :   "Qc",
                        "overReceiptValue"  :   $("#overReceiptValue").val(),
                        "sysKey"            :   "overReceipt",//硬代码，如果上线可能要改，或者数据库按照这个配
                        "id"                :   $scope.checkModel.qcId
                        //"storerId"          :   $scope.storerId
                    };
                    $sync(window.BASEPATH + "/receipt/overReceipt", "POST", {data: params}).then(function(xhr){
                        $scope.isOverReceipt = true;//超收标记，true
                        $scope.overReceiptPopup.close();//关闭提权弹出框
                        //提交
                    }, function(xhr){//提权密码错误

                    });
                };


            }]);

})