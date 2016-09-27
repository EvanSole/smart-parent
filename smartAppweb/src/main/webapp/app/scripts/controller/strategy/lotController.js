

define(['scripts/controller/controller',
    'scripts/model/strategy/lotStrategyModel'], function(controller,lotStrategy) {
    "use strict";
    controller.controller('strategyLotController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource',
            function($scope, $rootScope, $sync, $url, wmsDataSource) {
                var lotUrl = $url.strategyLotUrl,
                    lotStrategyColumns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        {  title: '策略名称', field: 'strategyName', align: 'left', width: "120px"},
//                        {  title: '是否可用', field: 'isActive', template: WMS.UTILS.checkboxTmp("isActive"), align: 'left', width: "120px"},
//                        {  title: '是否默认', field: 'isDefault',template: WMS.UTILS.checkboxTmp("isDefault"), align:'left', width:"120px"},
                        {  title: '按到货通知单', field: 'isByAsn',template: WMS.UTILS.checkboxTmp("isByAsn"), align: 'left', width: "120px"},
                        {  title: '按入库单', field: 'isByReceipt',template: WMS.UTILS.checkboxTmp("isByReceipt"), align: 'left', width: "120px"},
                        {  title: '按生产日期', field: 'isByProductionTime',template: WMS.UTILS.checkboxTmp("isByProductionTime"), align: 'left', width: "120px"},
                        {  title: '描述', field: 'description', align: 'left', width: "120px"}

                    ],

                    lotStrategyDetailColumns = [
//                        WMS.GRIDUTILS.CommonOptionButton("detail"),
                        {filterable: false, title: '批次属性', field: 'lotAttributeCode', align: 'left', width: "150px"},
                        {filterable: false, title: '商品属性', field: 'skuCategoryCode', align: 'left', width: "100px"},
                        {filterable: false, title: '显示名称', field: 'displayName', align: 'left', width: "100px"},
                        {filterable: false, title: '显示顺序', field: 'displayOrder', align: 'left', width: "100px"},
                        {filterable: false, title: '数据类型', field: 'datatypeCode', align: 'left', width: "100px", template:WMS.UTILS.codeFormat('datatypeCode','DataType')},
                        { filterable: false, title: '是否可用', field: 'isActive', template: WMS.UTILS.checkboxTmp("isActive"), align: 'left', width: "100px"},
                        {filterable: false, title: '是否必选项', field: 'isMust',template: WMS.UTILS.checkboxTmp("isMust"), align: 'left', width: "120px"},
                        {filterable: false, title: '默认值', field: 'defaultValue', align: 'left', width: "90px"}
                    ],
                    codeHeaderDataSource = wmsDataSource({
                        url: lotUrl,
                        schema: {
                            model:lotStrategy.lotstrategyHeader
                        },
                        callback: {
                            update: function (response, editData) {
                                $scope.lotGridOptions.dataSource.read();
                            }
                        }
                    });
                lotStrategyColumns = lotStrategyColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                lotStrategyDetailColumns = lotStrategyDetailColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.lotGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: codeHeaderDataSource,
                    toolbar: [{ name: "create", text: "新增"}],
                    columns: lotStrategyColumns,
                    edit:function(e){
                        $scope.$apply(function(){
                            $scope.isDefault = e.model.isDefault;
                        });
                        $scope.$apply(function(){
                            $scope.isActive = e.model.isActive;
                        });
                        if(e.model.isByAsn === true){
                            $("#isByAsn").prop("checked", "checked");
                        }
                        if(e.model.isByReceipt === true){
                            $("#isByReceipt").prop("checked", "checked");
                        }
                        if(e.model.isByProductionTime === true){
                            $("#isByProductionTime").prop("checked", "checked");
                        }
                    },
                    save: function(e){
                        var isByAsn = $("#isByAsn").attr("checked");
                        var isByReceipt = $("#isByReceipt").attr("checked");
                        var isByProductionTime = $("#isByProductionTime").attr("checked");
                        if(isByAsn === "checked"){
                            e.model.isByAsn = true;
                        }
                        if(isByReceipt === "checked"){
                            e.model.isByReceipt = true;
                        }
                        if(isByProductionTime === "checked"){
                            e.model.isByProductionTime = true;
                        }
                        if(e.model.isByAsn === false && e.model.isByReceipt === false && e.model.isByProductionTime === false ){
                            kendo.ui.ExtAlertDialog.showError("按通知单、入库单、生产日期必选其一。");
                            e.preventDefault();
                            return;
                        }
                    },
                    editable: {
                        mode: "popup",
                        window:{
                            width:"620px"
                        },
                        template: kendo.template($("#lotEditor").html())
                    }
                }, $scope);

                $scope.detailOptions = function(dataItem) {

                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource: wmsDataSource({
                            url: lotUrl + "/" + dataItem.id + "/detail",
                            schema: {
                                model: {
                                    id: "id",
                                    fields: {
                                        id: {type: "number", editable: false, nullable: true },
                                        isActive: {type: "boolean"},
                                        isDefault: {type: "boolean"},
                                        isMust: {type: "boolean"},
                                        datatypeCode: {type: "string"}

                                    }
                                }
                            },
                            total: function (total) {
                                return total.length > 0 ? total[0].total : 0;
                            }
                        }),
                        editable: {
                            mode: "popup",
                            window: {
                                width: "1050px"
                            },
                            template: kendo.template($("#lotDetailEditor").html())
                        },
                        toolbar: [
                            { name: "create", text: "编辑"}
                        ],
                        columns: lotStrategyDetailColumns,
                        edit: function(e){
                            var lotStrategyUrl = lotUrl + "/" + dataItem.id + "/detail";
                            $sync(lotStrategyUrl, "GET", {wait:false}).then(function(resp){
                                var rows = resp.result.rows;
                                var index = 1;
                                _.each(rows, function(lotDetail){
                                    $("#id_"+index).val(lotDetail.id);
                                    $("#lotAttributeCode_"+index).val(lotDetail.lotAttributeCode);
                                    $("#skuCategoryCode_"+index).val(lotDetail.skuCategoryCode);
                                    $("#displayName_"+index).val(lotDetail.displayName);
                                    $("#displayOrder_"+index).val(lotDetail.displayOrder);
                                    $("#datatypeCode_"+index).val(lotDetail.datatypeCode);
                                    if(lotDetail.isActive === 1){
                                        $("#isActive_"+index).prop("checked", "checked");
                                    }
                                    if(lotDetail.isMust === 1){
                                        $("#isMust_"+index).prop("checked", "checked");
                                    }
                                    $("#defaultValue_"+index).val(lotDetail.defaultValue);
                                    index++;
                                });
                                if(rows.length > 0){
                                    e.model.id_1 = rows[0].id;
                                    e.model.id_2 = rows[1].id;
                                    e.model.id_3 = rows[2].id;
                                    e.model.id_4 = rows[3].id;
                                    e.model.id_5 = rows[4].id;
                                    e.model.id_6 = rows[5].id;
                                    e.model.id_7 = rows[6].id;
                                    e.model.id_8 = rows[7].id;
                                    e.model.id_9 = rows[8].id;
                                    e.model.id_10 = rows[9].id;

                                    e.model.lotAttributeCode_1 = rows[0].lotAttributeCode;
                                    e.model.lotAttributeCode_2 = rows[1].lotAttributeCode;
                                    e.model.lotAttributeCode_3 = rows[2].lotAttributeCode;
                                    e.model.lotAttributeCode_4 = rows[3].lotAttributeCode;
                                    e.model.lotAttributeCode_5 = rows[4].lotAttributeCode;
                                    e.model.lotAttributeCode_6 = rows[5].lotAttributeCode;
                                    e.model.lotAttributeCode_7 = rows[6].lotAttributeCode;
                                    e.model.lotAttributeCode_8 = rows[7].lotAttributeCode;
                                    e.model.lotAttributeCode_9 = rows[8].lotAttributeCode;
                                    e.model.lotAttributeCode_10 = rows[9].lotAttributeCode;

                                    e.model.skuCategoryCode_1 = rows[0].skuCategoryCode;
                                    e.model.skuCategoryCode_2 = rows[1].skuCategoryCode;
                                    e.model.skuCategoryCode_3 = rows[2].skuCategoryCode;
                                    e.model.skuCategoryCode_4 = rows[3].skuCategoryCode;
                                    e.model.skuCategoryCode_5 = rows[4].skuCategoryCode;
                                    e.model.skuCategoryCode_6 = rows[5].skuCategoryCode;
                                    e.model.skuCategoryCode_7 = rows[6].skuCategoryCode;
                                    e.model.skuCategoryCode_8 = rows[7].skuCategoryCode;
                                    e.model.skuCategoryCode_9 = rows[8].skuCategoryCode;
                                    e.model.skuCategoryCode_10 = rows[9].skuCategoryCode;

                                    e.model.displayName_1 = rows[0].displayName;
                                    e.model.displayName_2 = rows[1].displayName;
                                    e.model.displayName_3 = rows[2].displayName;
                                    e.model.displayName_4 = rows[3].displayName;
                                    e.model.displayName_5 = rows[4].displayName;
                                    e.model.displayName_6 = rows[5].displayName;
                                    e.model.displayName_7 = rows[6].displayName;
                                    e.model.displayName_8 = rows[7].displayName;
                                    e.model.displayName_9 = rows[8].displayName;
                                    e.model.displayName_10 = rows[9].displayName;

                                    e.model.displayOrder_1 = rows[0].displayOrder;
                                    e.model.displayOrder_2 = rows[1].displayOrder;
                                    e.model.displayOrder_3 = rows[2].displayOrder;
                                    e.model.displayOrder_4 = rows[3].displayOrder;
                                    e.model.displayOrder_5 = rows[4].displayOrder;
                                    e.model.displayOrder_6 = rows[5].displayOrder;
                                    e.model.displayOrder_7 = rows[6].displayOrder;
                                    e.model.displayOrder_8 = rows[7].displayOrder;
                                    e.model.displayOrder_9 = rows[8].displayOrder;
                                    e.model.displayOrder_10 = rows[9].displayOrder;

                                    e.model.datatypeCode_1 = rows[0].datatypeCode;
                                    e.model.datatypeCode_2 = rows[1].datatypeCode;
                                    e.model.datatypeCode_3 = rows[2].datatypeCode;
                                    e.model.datatypeCode_4 = rows[3].datatypeCode;
                                    e.model.datatypeCode_5 = rows[4].datatypeCode;
                                    e.model.datatypeCode_6 = rows[5].datatypeCode;
                                    e.model.datatypeCode_7 = rows[6].datatypeCode;
                                    e.model.datatypeCode_8 = rows[7].datatypeCode;
                                    e.model.datatypeCode_9 = rows[8].datatypeCode;
                                    e.model.datatypeCode_10 = rows[9].datatypeCode;

                                    e.model.isActive_1 = rows[0].isActive;
                                    e.model.isActive_2 = rows[1].isActive;
                                    e.model.isActive_3 = rows[2].isActive;
                                    e.model.isActive_4 = rows[3].isActive;
                                    e.model.isActive_5 = rows[4].isActive;
                                    e.model.isActive_6 = rows[5].isActive;
                                    e.model.isActive_7 = rows[6].isActive;
                                    e.model.isActive_8 = rows[7].isActive;
                                    e.model.isActive_9 = rows[8].isActive;
                                    e.model.isActive_10 = rows[9].isActive;

                                    e.model.isMust_1 = rows[0].isMust;
                                    e.model.isMust_2 = rows[1].isMust;
                                    e.model.isMust_3 = rows[2].isMust;
                                    e.model.isMust_4 = rows[3].isMust;
                                    e.model.isMust_5 = rows[4].isMust;
                                    e.model.isMust_6 = rows[5].isMust;
                                    e.model.isMust_7 = rows[6].isMust;
                                    e.model.isMust_8 = rows[7].isMust;
                                    e.model.isMust_9 = rows[8].isMust;
                                    e.model.isMust_10 = rows[9].isMust;

                                    e.model.defaultValue_1 = rows[0].defaultValue;
                                    e.model.defaultValue_2 = rows[1].defaultValue;
                                    e.model.defaultValue_3 = rows[2].defaultValue;
                                    e.model.defaultValue_4 = rows[3].defaultValue;
                                    e.model.defaultValue_5 = rows[4].defaultValue;
                                    e.model.defaultValue_6 = rows[5].defaultValue;
                                    e.model.defaultValue_7 = rows[6].defaultValue;
                                    e.model.defaultValue_8 = rows[7].defaultValue;
                                    e.model.defaultValue_9 = rows[8].defaultValue;
                                    e.model.defaultValue_10 = rows[9].defaultValue;
                                }

                            });
                        },
                        save: function(e){
                            e.preventDefault();

                            $scope.$$childTail.lotDetailGrid.saveChanges();
                        }
                    }, $scope);
                };


//                $scope.search = function() {
//                    var condition = {"strategyName":$scope.strategyName};
//                    $scope.lotGrid.dataSource.filter(condition);
//                    $scope.lotGrid.refresh();
//                };

                $scope.change = function(data){
                    var _this = data.dataItem;
                    if(_this.isDefault==true){
                        _this.isActive=false;
                    }else{
                        _this.isActive=true;
                    }
                };

                $scope.clickRadioButton = function(inputId, data){
                    $(".radioClass").attr("checked", false);
                    $("#"+inputId).attr("checked", "checked");
                    $("#"+inputId).prop("checked", "checked");
                    var dataItem = data.dataItem;
                    if(inputId === "isByAsn"){
                        dataItem.isByAsn = true;
                        dataItem.isByReceipt = false;
                        dataItem.isByProductionTime = false;
                    }else if(inputId === "isByReceipt"){
                        dataItem.isByAsn = false;
                        dataItem.isByReceipt = true;
                        dataItem.isByProductionTime = false;
                    }else if(inputId === "isByProductionTime"){
                        dataItem.isByAsn = false;
                        dataItem.isByReceipt = false;
                        dataItem.isByProductionTime = true;
                    }
                };

            }]);

})