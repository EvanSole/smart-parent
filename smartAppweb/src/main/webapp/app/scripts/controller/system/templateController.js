define(['scripts/controller/controller'], function (controller) {
    "use strict";
    controller.controller('systemTemplateController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource', 'wmsReportPrint', '$filter',
            function ($scope, $rootScope, $sync, $url, wmsDataSource, wmsReportPrint, $filter) {

                $scope.reportCategoryCodeShow = true;
                $scope.carrierShow = true;
                var LODOP = null;
                var CNPrint = null;
                $scope.pageOriAll = [
                    {value: "0", key: "方向不定"},
                    {value: "1", key: "纵向,固定纸张"},
                    {value: "2", key: "横向,固定纸张"},
                    {value: "3", key: "纵向,宽度固定"}
                ];
                var templateUrl = $url.systemTemplateListUrl,
                    templateColumns = [
                        { title: '操作', command: [
                            { name: "edit", template: "<a class='k-button k-button-custom-command' href='\\#' ng-click='editTemplate(dataItem);' >编辑</a>",
                                className: "btn-auth-edit",
                                text: { edit: "编辑", cancel: "取消", update: "更新" } },
                            WMS.GRIDUTILS.deleteButton

                        ],
                            width: "100px"
                        },
                        { filterable: false, title: '模版名称', field: 'reportName', align: 'left', width: "120px"},
                        { filterable: false, title: '模版类型', field: 'reportCategoryCode', template: WMS.UTILS.codeFormat("reportCategoryCode", "ReportCategory"), align: 'left', width: "120px"},
                        { filterable: false, title: '物流公司', field: 'carrier', template: WMS.UTILS.codeFormat("carrier", "Carrier"), align: 'left', width: "120px"},
                        { filterable: false, title: '是否默认', field: 'isDefault', template: WMS.UTILS.checkboxAuthTmp("isDefault"), align: 'left', width: "120px"},
                        { filterable: false, title: '创建人', field: 'createUser', align: 'left', width: "120px"},
                        { filterable: false, title: '修改人', field: 'updateUser', width: "120px"},
                        { title: '创建时间', field: 'createTime', align: 'left', width: "120px", template: WMS.UTILS.timestampFormat("createTime")},
                        { title: '修改时间', field: 'updateTime', align: 'left', width: "120px", template: WMS.UTILS.timestampFormat("updateTime")}
                    ],

                    templateDataSource = wmsDataSource({
                        url: templateUrl,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "number", editable: false, nullable: true },
                                    isDefault: { type: "boolean" }
                                }
                            }
                        }, callback: {
                            update: function (response, editData) {
                                $scope.mainGridOptions.dataSource.read();
                            }
                        }
                    });

                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: templateDataSource,
                    toolbar: [
                        {template: '<a class="k-button k-grid-addTemplate" ng-click="addTemplate()" href="\\#">新增</a>', className: "btn-auth-addTemplate"}
                    ],
                    columns: templateColumns,
                    editable: {
                        mode: "popup",
                        window: {
                            width: "500px"
                        }
//                        template: kendo.template($("#templateEditor").html())
                    }

                }, $scope);


                //新增
                $scope.addTemplate = function () {
                    $scope.templateModel = {};
                    $scope.reportCategoryCodeShow = false;
                    $scope.templatePopup.refresh().open().center();
                };


                //自定义模板编辑页面
                $scope.editTemplate = function (data) {
                    $scope.reportCategoryCodeShow = true;
                    $scope.templateModel = {};
                    $scope.templateModel.id = data.id;
                    $scope.templateModel.reportName = data.reportName;
                    var reportName = $filter('codeFormat')(data.reportCategoryCode, 'ReportCategory');
                    var carriers = $filter('codeFormat')(data.carrier, 'Carrier');
                    $scope.templateModel = data;
                    $scope.templateModel.reportCategoryCode = {key: reportName, value: data.reportCategoryCode};
                    $scope.templateModel.carrier = {key: carriers, value: data.carrier};
                    $scope.templateModel.isDefault = data.isDefault;
                    var options = JSON.parse(data.printOptions);
                    $scope.templateModel.pageLength = options.pageLength;
                    $scope.templateModel.pageWidth = options.pageWidth;
                    $scope.templateModel.pageOri = {value: options.pageOri};
                    $scope.templateModel.printMachine = options.printMachine;
                    $scope.templatePopup.refresh().open().center();
                };


                /**
                 * 模版名称搜索
                 */
                $scope.search = function () {
                    var condition = {"reportName": $scope.reportName};
                    $scope.templateGrid.dataSource.filter(condition);
                    $scope.templateGrid.refresh();
                };

                $scope.printer = '';
                try {
                    if (navigator.userAgent.indexOf("Mac") < 0) {
                        $scope.allPrinter = wmsReportPrint.getCurrentMachines();
                        var defPrinter = wmsReportPrint.getDefaultMachine();
                        if (defPrinter) {
                            $scope.printer = {key: defPrinter, value: defPrinter};
                        }
                    }
                } catch (e) {
                    console.log(e);
                }

                /**
                 * 控制物流公司菜单显示
                 * @param data
                 */
                $scope.change = function (data) {
                    if (data.templateModel) {
                        var categoryCode = data.templateModel.reportCategoryCode.value;
                        if (categoryCode !== 'Express') {
                            $scope.carrierShow = false;
                        } else {
                            $scope.carrierShow = true;
                        }
                    }
                }


                /**
                 * 设置模版
                 * @param e
                 */
                $scope.setTemplate = function (e) {
                    getDefaultTemplate();
                }


                /**
                 * 保存模版
                 */
                $scope.saveTemplate = function (e) {
                    var formValidator = $(e.target).parents(".k-edit-form-container").kendoValidator({ validateOnBlur: false }).data("kendoValidator");
                    if (!formValidator.validate()) {
                        return;
                    }
                    var carrierVal;
                    if ($scope.templateModel.carrier) {
                        carrierVal = $scope.templateModel.carrier.value;
                    } else {
                        carrierVal = "";
                    }
                    var pageOriVal;
                    if ($scope.templateModel.pageOri) {
                        pageOriVal = $scope.templateModel.pageOri.value;
                    } else {
                        pageOriVal = "";
                    }
                    var params = {
                        "id": $scope.templateModel.id,
                        "reportName": $scope.templateModel.reportName,
                        "reportCategoryCode": $scope.templateModel.reportCategoryCode.value,
                        "carrier": carrierVal,
                        "isDefault": $scope.templateModel.isDefault,
                        "content": $scope.templateModel.content,
                        "printOptions": JSON.stringify({pageLength: $scope.templateModel.pageLength, pageWidth: $scope.templateModel.pageWidth, pageOri: pageOriVal, printMachine: $scope.templateModel.printMachine})
                    };
                    if ($scope.templateModel.id) {
                        //更新模版信息
                        $sync(window.BASEPATH + "/report/template", "PUT", {data: params})
                            .then(function (xhr) {
                                $scope.templateModel = {};
                                $scope.templatePopup.close();
                                $scope.templateGrid.dataSource.read();
                            }, function (xhr) {
                                $scope.mainGridOptions.dataSource.read();
                            });
                    } else {
                        //保存模版信息
                        $sync(window.BASEPATH + "/report/template", "POST", {data: params})
                            .then(function (xhr) {
                                $scope.templateModel = {};
                                $scope.templatePopup.close();
                                $scope.templateGrid.dataSource.read();
                            }, function (xhr) {
                                $scope.mainGridOptions.dataSource.read();
                            });
                    }

                };

                /**
                 * 关闭模板
                 */
                $scope.templateClose = function () {
//                    $scope.mainGridOptions.dataSource.read();
                    $scope.templatePopup.close();
                };


                function getDefaultTemplate() {
                    //是否启用云栈
                    if ($('#reportCategoryCode').val() == "Express" && $('#carrier').val().length > 0 && $('#carrier').val() != null && $('#carrier').val() != undefined) {
                        $sync(window.BASEPATH + "/carrier/carrierNo/" + $('#carrier').val(), "GET")
                            .then(function (result) {
                                if (result.suc && result.result != null) {
                                    if ($scope.IsCloudStack != undefined && $scope.IsCloudStack != result.result.isCloudStack) {
                                        $scope.templateModel.content = '';
                                    }
                                    $scope.IsCloudStack = result.result.isCloudStack;
                                } else {
                                    if ($scope.IsCloudStack != undefined) {
                                        $scope.templateModel.content = '';
                                    }
                                    $scope.IsCloudStack = 0;
                                }

                                if ($scope.IsCloudStack == 1) {
                                    toDesignTemplate_CaiNiao();
                                } else {
                                    toDesignTemplate();
                                }
                            }
                        )
                    } else {
                        toDesignTemplate();
                    }
                }

                function toDesignTemplate_CaiNiao() {
                    //如果模版为空 则尝试获取admin的默认模版
                    if ($('#carrier').val().length > 0 && $('#content').val() == undefined || $('#content').val() == '') {
                        $sync(window.BASEPATH + "/report/template/adminDefault", "GET", {data: {reportCategoryCode: $('#reportCategoryCode').val(), carrier: $('#carrier').val()}})
                            .then(function (result) {
                                if (result.suc) {
                                    var tempEntity = result.data;
                                    if (tempEntity !== undefined && tempEntity.content != '' && tempEntity.content != null) {
                                        $('#content').val(tempEntity.content);
                                    }
                                    if (tempEntity !== undefined && tempEntity.printOptions != '' && tempEntity.printOptions != null) {
                                        var printOptions = JSON.parse(tempEntity.printOptions);
                                        $('#pageLength').val(printOptions.pageLength);
                                        $('#pageWidth').val(printOptions.pageWidth);
                                    }
                                    printSet_CaiNiao();
                                }
                                else {
                                    kendo.ui.ExtAlertDialog.showError("请选择出库单");
                                }
                            }
                        )
                    } else {
                        printSet_CaiNiao();
                    }
                }

                function toDesignTemplate() {
                    //如果模版为空 则尝试获取admin的默认模版
                    if ($('#carrier').val().length > 0 && $('#content').val() == undefined || $('#content').val() == '') {
                        $sync(window.BASEPATH + "/report/template/adminDefault", "GET", {data: {reportCategoryCode: $('#reportCategoryCode').val(), carrier: $('#carrier').val()}})
                            .then(function (result) {
                                if (result.suc) {
                                    var tempEntity = result.data;
                                    if (tempEntity !== undefined && tempEntity.content != '' && tempEntity.content != null) {
                                        $('#content').val(tempEntity.content);
                                    }
                                    if (tempEntity !== undefined && tempEntity.printOptions != '' && tempEntity.printOptions != null) {
                                        var printOptions = JSON.parse(tempEntity.printOptions);
                                        $('#pageLength').val(printOptions.pageLength);
                                        $('#pageWidth').val(printOptions.pageWidth);
                                    }

                                    printSet();
                                }
                                else {
                                    kendo.ui.ExtAlertDialog.showError("请选择出库单");
                                }
                            }
                        )
                    }
                    else {
                        printSet();
                    }
                }

                /**
                 * 获得LODOP对象
                 * @returns {*}
                 */
                function getLodopCustom() {
                    return getLodop(document.getElementById('LODOP'), document.getElementById('LODOP_EM'));
                }

                function getLodopCustom_CaiNiao() {
                    return getCaiNiaoPrint(document.getElementById('CaiNiaoPrint_OB'), document.getElementById('CaiNiaoPrint_EM'));
                }

                //模版设置
                function printSet() {
                    //获得LODOP对象 并初始化
                    LODOP = getLodopCustom();
                    var printModelName = $('#reportName').val();
                    LODOP.PRINT_INIT(printModelName + "的模板");

                    if ($('#pageLength').val() != '' || $('#pageWidth').val() != '') {
                        var height = $('#pageLength').val();
                        var width = $('#pageWidth').val();
                        setPageSize($('#pageLength').val(), width, height, "");
                    }
                    //var content = $('#content').val();
                    var content = $scope.templateModel.content;
                    if (content != '' && content != null && content !== undefined) {
                        designPrintByContent(content, wmsReportPrint.getReportContent($('#reportCategoryCode').val()))
                    } else {
                        var type = $('#reportCategoryCode').val();
                        var obj = wmsReportPrint.getReportContent(type);
                        if (obj == undefined) {
                            kendo.ui.ExtAlertDialog.showError("未获取到当前模版" + printModelName + "的配置信息,请检查模版类型是否有效!");
                            return;
                        }
                        var field = obj.field;
                        designPrint(field, obj.detailDiv)
                    }
                    var contentObj = makeTemplateObj();
                    $scope.templateModel.content = JSON.stringify(contentObj);
                    $('#content').val(JSON.stringify(contentObj));

                }

                function printSet_CaiNiao() {
                    //获得LODOP对象 并初始化
                    CNPrint = getLodopCustom_CaiNiao();

                    var printModelName = $('#reportName').val();
                    CNPrint.PRINT_INITA(0, 0, 400, 800, printModelName + "的模板");

                    var config = "0";
                    var CP_CODE = $("#carrier").val();
                    CNPrint.SET_PRINT_MODE("CAINIAOPRINT_MODE", "CP_CODE=" + CP_CODE + "&CONFIG=0");
                    CNPrint.SET_SHOW_MODE("SHOW_SCALEBAR", 1);

                    CNPrint.SET_PRINT_STYLEA("ali_waybill_cp_logo_up", "PreviewOnly", 0);//上面logo
                    CNPrint.SET_PRINT_STYLEA("ali_waybill_cp_logo_down", "PreviewOnly", 0);//下面logo
                    CNPrint.SET_PRINT_STYLEA("ali_waybill_short_address", "CONTENT", "EYB大头笔长8字");//大头笔
                    CNPrint.SET_PRINT_STYLEA("ali_waybill_package_center_name", "CONTENT", "EYB集散地无限制");//集散地名称
                    CNPrint.SET_PRINT_STYLEA("ali_waybill_package_center_code", "CONTENT", "053277886278");//集散地条码
                    CNPrint.SET_PRINT_STYLEA("ali_waybill_send_name", "CONTENT", "浙江杭州行者");//寄件人姓名
                    CNPrint.SET_PRINT_STYLEA("ali_waybill_send_phone", "CONTENT", "180000980909");//寄件人电话
                    CNPrint.SET_PRINT_STYLEA("ali_waybill_shipping_address", "CONTENT", "浙江省杭州市余杭区文一西路1001号阿里巴巴淘宝城5号小邮局");//寄件人电话
                    CNPrint.SET_PRINT_STYLEA("ali_waybill_consignee_name", "CONTENT", "齐齐哈尔沐鱼");//收件人姓名
                    CNPrint.SET_PRINT_STYLEA("ali_waybill_consignee_phone", "CONTENT", "15605883677");//收件人电话
                    CNPrint.SET_PRINT_STYLEA("ali_waybill_consignee_address", "CONTENT", "黑龙江省齐齐哈尔市建华区文化大街42号齐齐哈尔大学计算机工程学院计算机001班");//收件人地址
                    CNPrint.SET_PRINT_STYLEA("ali_waybill_waybill_code", "CONTENT", "1234555");//面单号

                    CNPrint.SET_PRINT_STYLEA("ali_waybill_shipping_branch_name", "CONTENT", "发件网点名称");//发件网点名称
                    CNPrint.SET_PRINT_STYLEA("ali_waybill_shipping_branch_code", "CONTENT", "发件网点代码");//发件网点代码
                    CNPrint.SET_PRINT_STYLEA("ali_waybill_ext_send_date", "CONTENT", "发件日期");//发件日期(中通要求)
                    CNPrint.SET_PRINT_STYLEA("ali_waybill_ext_sf_biz_type", "CONTENT", "业务类型");//业务类型(顺丰要求)
                    CNPrint.SET_PRINT_STYLEA("ali_waybill_shipping_address_city", "CONTENT", "发件城市");//发件城市(中国邮政要求)

                    CNPrint.SET_PRINT_STYLEA("ali_waybill_product_type", "CONTENT", "代收货款");//产品类型
                    CNPrint.SET_PRINT_STYLEA("ali_waybill_cod_amount", "CONTENT", "FKFS=到付;PSRQ=2015-07-10");//服务
                    CNPrint.SET_PRINT_STYLEA("EWM", "CONTENT", "123456789012");
                    CNPrint.SET_PRINT_STYLEA("dabiao", "CONTENT", "");


                    if ($('#pageLength').val() != '' || $('#pageWidth').val() != '') {
                        var height = $('#pageLength').val();
                        var width = $('#pageWidth').val();
                        setPageSize_CaiNiao($('#pageLength').val(), width, height, "");
                    }

                    var contentType = "Express_CaiNiao";
                    var content = $scope.templateModel.content;
                    if (content != '' && content != null && content !== undefined) {
                        designPrintByContent_CaiNiao(content, wmsReportPrint.getReportContent(contentType))
                    } else {
                        var obj = wmsReportPrint.getReportContent(contentType);
                        if (obj == undefined) {
                            kendo.ui.ExtAlertDialog.showError("未获取到当前模版" + printModelName + "的配置信息,请检查模版类型是否有效!");
                            return;
                        }
                        var field = obj.field;
                        designPrint_CaiNiao(field, obj.detailDiv)
                    }
                    var contentObj = makeTemplateObj_CaiNiao();
                    $scope.templateModel.content = JSON.stringify(contentObj);
                    $('#content').val(JSON.stringify(contentObj));
                }


                //新建设计模版
                function designPrint(field, detailDiv) {
                    var top = 10, left = 10;
                    for (var i = 0; i < field.length; i++) {
                        top += 20;
                        left += 20;
                        if (field[i].type == 'barcode') {
                            var codeType = '128A';
                            if (field[i].codeType !== undefined) {
                                codeType = field[i].codeType;
                            }
                            //TODO 这里需要判断不同的物流公司有不同的CodeType,传递不同的条码值
                            LODOP.ADD_PRINT_BARCODE(28, 34, 307, 47, "128C", field[i].cn);
                        } else {
                            LODOP.ADD_PRINT_TEXT(top, left, 75, 20, field[i].cn);
                        }
                    }

                    if (detailDiv !== undefined) {
                        LODOP.ADD_PRINT_HTM(0, 0, 750, 500, document.getElementById(detailDiv).innerHTML);
                    }
                    LODOP.SET_SHOW_MODE("SHOW_SCALEBAR", 1);
                    var content = LODOP.PRINT_DESIGN();
                    return content;
                }

                function designPrint_CaiNiao(field, detailDiv) {
                    var top = 150, left = 10;
                    for (var i = 0; i < field.length; i++) {
                        top += 20;
                        left += 20;
                        if (field[i].type == 'barcode') {
                            var codeType = '128A';
                            if (field[i].codeType !== undefined) {
                                codeType = field[i].codeType;
                            }
                            //TODO 这里需要判断不同的物流公司有不同的CodeType,传递不同的条码值
                            CNPrint.ADD_PRINT_BARCODE(28, 34, 307, 47, "128C", field[i].cn);
                        } else {
                            CNPrint.ADD_PRINT_TEXT(top, left, 75, 20, field[i].cn);
                        }
                    }

                    if (detailDiv !== undefined) {
                        CNPrint.ADD_PRINT_HTM(0, 0, 750, 500, document.getElementById(detailDiv).innerHTML);
                    }
                    CNPrint.SET_SHOW_MODE("SHOW_SCALEBAR", 1);
                    var content = CNPrint.PRINT_DESIGN();
                    return content;
                }

                /**
                 * 组织模版数据
                 * @returns {{}}
                 */
                function makeTemplateObj() {
                    var count = LODOP.GET_VALUE('ItemCount', 0);
                    var contentObj = {};
                    var itemArr = [];
                    for (var i = 0; i <= count; i++) {
                        var className = LODOP.GET_VALUE('ItemClassName', i);
                        if (className == '') {
                            continue;
                        }

                        var item = {
                            className: className,
                            ItemTop: LODOP.GET_VALUE('ItemTop', i),
                            ItemLeft: LODOP.GET_VALUE('ItemLeft', i),
                            ItemWidth: LODOP.GET_VALUE('ItemWidth', i),
                            ItemHeight: LODOP.GET_VALUE('ItemHeight', i),
                            index: LODOP.GET_VALUE('ItemNameID', i)
                        };

                        var styleA = {};
                        if (className != 'Table' && className != 'Htm') {
                            item.ItemContent = LODOP.GET_VALUE('ItemContent', i)
                            styleA.ItemType = LODOP.GET_VALUE('ItemPageType', i);      //普通 眉脚等
                            styleA.FontName = LODOP.GET_VALUE('ItemFontName', i);//条形码类型
                            styleA.FontSize = LODOP.GET_VALUE('ItemFontSize', i);
                            styleA.FontColor = LODOP.GET_VALUE('ItemColor', i);
                            styleA.showBarCode = LODOP.GET_VALUE('ItemShowBarText', i);//条形码是否显示文本


                            styleA.PreviewOnly = LODOP.GET_VALUE('ItemPreviewOnly', i);//仅用来预览
                            styleA.Repeat = LODOP.GET_VALUE('ItemPRepeat', i);        //仅用来预览

                            styleA.Alignment = LODOP.GET_VALUE('ItemAlign', i);
                            styleA.Bold = LODOP.GET_VALUE('Itembold', i);
                            styleA.Italic = LODOP.GET_VALUE('ItemItalic', i);
                            styleA.Underline = LODOP.GET_VALUE('ItemUnderline', i);

                            styleA.PenWidth = LODOP.GET_VALUE('ItemPenWidth', i);             //打印项线条宽度
                            styleA.PenStyle = LODOP.GET_VALUE('ItemPenStyle', i);             //打印项线条类型
                            styleA.Horient = LODOP.GET_VALUE('ItemHorient', i);               //打印项左右位置
                            styleA.Vorient = LODOP.GET_VALUE('ItemVorient', i);               //打印项左右位置


                            styleA.LineSpacing = LODOP.GET_VALUE('ItemLineSpacing', i);           //打印项行间距
                            styleA.LetterSpacing = LODOP.GET_VALUE('ItemLetterSpacing', i);       //打印项字间距
                            styleA.ItemGroundColor = LODOP.GET_VALUE('ItemGroundColor', i);
                            styleA.AlignJustify = LODOP.GET_VALUE('ItemAlignJustify', i);        //该打印项文本两端是否靠齐
                            styleA.SpacePatch = LODOP.GET_VALUE('ItemSpacePatch', i);          //该打印项文本尾是否补空格

                            styleA.TextFrame = LODOP.GET_VALUE('ItemTextFrame', i);               //该打印项边框类型
                            styleA.ItemLetterSpacing = LODOP.GET_VALUE('ItemSpacePatch', i);    //该打印项文本尾是否补空格
                            styleA.ItemGroundColor = LODOP.GET_VALUE('ItemAlignJustify', i);    //该打印项文本两端是否靠齐


                            styleA.ItemLineSpacing = LODOP.GET_VALUE('ItemTranscolor', i);       //该打印项图片透明背景色
                            styleA.ItemTop2Offset = LODOP.GET_VALUE('ItemTop2Offset', i);        //该打印项次页上边距偏移
                            styleA.ItemLeft2Offset = LODOP.GET_VALUE('ItemLeft2Offset', i);    //该打印项次页左边距偏移

                            styleA.ItemTranscolor = LODOP.GET_VALUE('ItemTranscolor', i);       //该打印项图片透明背景色
                            styleA.LinkedItem = LODOP.GET_VALUE('ItemLinkedItem', i);        //该打印项的关联对象的类名（或识别号）
                        } else {

                            if (className == 'Htm') {
                                var strIn = LODOP.GET_VALUE('ItemContent', i);
                                strIn = strIn.replace(/\\n/g, "<br/>");
                                strIn = strIn.replace(/\\"/g, '"');
                                strIn = strIn.replace(/<br\/>/g, "\n");
                                item.ItemContent = strIn;

                            } else if (className == 'BarCode') {
                                item.barCode = '128A';
                            }

                            item.ItemTableHeightScope = LODOP.GET_VALUE('ItemTableHeightScope', i);       //该打印项表格高是否含头脚
                        }

                        item.styleA = styleA;

                        itemArr.push(item);
                    }

                    contentObj.item = itemArr;
                    return contentObj;
                }

                function makeTemplateObj_CaiNiao() {
                    var contentType = "Express_CaiNiao";
                    var configItems = wmsReportPrint.getReportContent(contentType);

                    var count = CNPrint.GET_VALUE('ItemCount', 0);
                    var contentObj = {};
                    var itemArr = [];
                    for (var i = 0; i <= count; i++) {
                        //类型
                        var className = CNPrint.GET_VALUE('ItemClassName', i);
                        if (className == '') {
                            continue;
                        }

                        //只保存自定义的几个字段
                        var itemContent = CNPrint.GET_VALUE('ItemContent', i);
                        if (itemContent != undefined && itemContent.length > 0) {
                            var isConfig = 0;
                            for (var j = 0; j < configItems.field.length; j++) {
                                if (configItems.field[j].cn == itemContent) {
                                    isConfig = 1;
                                    break;
                                }
                            }
                            if (isConfig == 0) {
                                continue;
                            }
                        } else {
                            continue;
                        }


                        var item = {
                            className: className,
                            ItemTop: CNPrint.GET_VALUE('ItemTop', i),
                            ItemLeft: CNPrint.GET_VALUE('ItemLeft', i),
                            ItemWidth: CNPrint.GET_VALUE('ItemWidth', i),
                            ItemHeight: CNPrint.GET_VALUE('ItemHeight', i),
                            index: CNPrint.GET_VALUE('ItemNameID', i)
                        };

                        var styleA = {};
                        if (className != 'Table' && className != 'Htm') {
                            item.ItemContent = CNPrint.GET_VALUE('ItemContent', i);

                            styleA.ItemType = CNPrint.GET_VALUE('ItemPageType', i);      //普通 眉脚等
                            styleA.FontName = CNPrint.GET_VALUE('ItemFontName', i);//条形码类型
                            styleA.FontSize = CNPrint.GET_VALUE('ItemFontSize', i);
                            styleA.FontColor = CNPrint.GET_VALUE('ItemColor', i);
                            styleA.showBarCode = CNPrint.GET_VALUE('ItemShowBarText', i);//条形码是否显示文本

                            styleA.PreviewOnly = CNPrint.GET_VALUE('ItemPreviewOnly', i);//仅用来预览
                            styleA.Repeat = CNPrint.GET_VALUE('ItemPRepeat', i);        //仅用来预览

                            styleA.Alignment = CNPrint.GET_VALUE('ItemAlign', i);
                            styleA.Bold = CNPrint.GET_VALUE('Itembold', i);
                            styleA.Italic = CNPrint.GET_VALUE('ItemItalic', i);
                            styleA.Underline = CNPrint.GET_VALUE('ItemUnderline', i);

                            styleA.PenWidth = CNPrint.GET_VALUE('ItemPenWidth', i);             //打印项线条宽度
                            styleA.PenStyle = CNPrint.GET_VALUE('ItemPenStyle', i);             //打印项线条类型
                            styleA.Horient = CNPrint.GET_VALUE('ItemHorient', i);               //打印项左右位置
                            styleA.Vorient = CNPrint.GET_VALUE('ItemVorient', i);               //打印项左右位置


                            styleA.LineSpacing = CNPrint.GET_VALUE('ItemLineSpacing', i);           //打印项行间距
                            styleA.LetterSpacing = CNPrint.GET_VALUE('ItemLetterSpacing', i);       //打印项字间距
                            styleA.ItemGroundColor = CNPrint.GET_VALUE('ItemGroundColor', i);
                            styleA.AlignJustify = CNPrint.GET_VALUE('ItemAlignJustify', i);        //该打印项文本两端是否靠齐
                            styleA.SpacePatch = CNPrint.GET_VALUE('ItemSpacePatch', i);          //该打印项文本尾是否补空格

                            styleA.TextFrame = CNPrint.GET_VALUE('ItemTextFrame', i);               //该打印项边框类型
                            styleA.ItemLetterSpacing = CNPrint.GET_VALUE('ItemSpacePatch', i);    //该打印项文本尾是否补空格
                            styleA.ItemGroundColor = CNPrint.GET_VALUE('ItemAlignJustify', i);    //该打印项文本两端是否靠齐


                            styleA.ItemLineSpacing = CNPrint.GET_VALUE('ItemTranscolor', i);       //该打印项图片透明背景色
                            styleA.ItemTop2Offset = CNPrint.GET_VALUE('ItemTop2Offset', i);        //该打印项次页上边距偏移
                            styleA.ItemLeft2Offset = CNPrint.GET_VALUE('ItemLeft2Offset', i);    //该打印项次页左边距偏移

                            styleA.ItemTranscolor = CNPrint.GET_VALUE('ItemTranscolor', i);       //该打印项图片透明背景色
                            styleA.LinkedItem = CNPrint.GET_VALUE('ItemLinkedItem', i);        //该打印项的关联对象的类名（或识别号）
                        } else {
                            if (className == 'Htm') {
                                var strIn = CNPrint.GET_VALUE('ItemContent', i);
                                strIn = strIn.replace(/\\n/g, "<br/>");
                                strIn = strIn.replace(/\\"/g, '"');
                                strIn = strIn.replace(/<br\/>/g, "\n");
                                item.ItemContent = strIn;
                            } else if (className == 'BarCode') {
                                item.barCode = '128A';
                            }
                            item.ItemTableHeightScope = CNPrint.GET_VALUE('ItemTableHeightScope', i);       //该打印项表格高是否含头脚
                        }

                        item.styleA = styleA;

                        itemArr.push(item);
                    }

                    contentObj.item = itemArr;
                    return contentObj;
                }


                //编辑模版
                function designPrintByContent(contentObj, typeObj) {
                    contentObj = JSON.parse(contentObj);
                    var itemArr = contentObj.item;
                    var linkedItemObj = {};
                    if (itemArr) {
                        for (var i = 0; i < itemArr.length; i++) {
                            var item = itemArr[i];
                            var className = item.className;
                            var styleA = item.styleA;
                            if (className == 'Text') {
                                LODOP.ADD_PRINT_TEXT(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, item.ItemContent);
                                for (var id in styleA) {
                                    if (styleA[id] != '' && styleA[id] != 0 && styleA[id] != '#000000') {
                                        if (id == 'LinkedItem') {
                                            linkedItemObj[item.index] = styleA[id]
                                        } else {
                                            LODOP.SET_PRINT_STYLEA(0, id, styleA[id]);
                                        }

                                    }
                                }
                            } else if (className == 'Htm') {
                                LODOP.ADD_PRINT_HTM(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, item.ItemContent);
                            } else if (className == 'BarCode') {
                                LODOP.ADD_PRINT_BARCODE(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, styleA.FontName, item.ItemContent);
                                if (!styleA.showBarCode) {//条形码显示文字开关
                                    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
                                }
                            } else if (className == 'Rect') {
                                LODOP.ADD_PRINT_RECT(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, 0, 1);
                            }
                            else if (className == 'Image') {
                                LODOP.ADD_PRINT_IMAGE(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, item.ItemContent);
                            } else {
                                if (typeObj.detailDiv != null) {
                                    LODOP.ADD_PRINT_TABLE(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, document.getElementById(typeObj.detailDiv).innerHTML);
                                }
                            }
                        }

                    }
                    for (var id in linkedItemObj) {
                        LODOP.SET_PRINT_STYLEA(id, "LinkedItem", linkedItemObj[id]);
                    }
                    LODOP.PRINT_DESIGN();

                }

                function designPrintByContent_CaiNiao(contentObj, typeObj) {
                    contentObj = JSON.parse(contentObj);
                    var itemArr = contentObj.item;
                    var linkedItemObj = {};
                    if (itemArr) {
                        for (var i = 0; i < itemArr.length; i++) {
                            var item = itemArr[i];
                            var className = item.className;
                            var styleA = item.styleA;
                            if (className == 'Text') {
                                CNPrint.ADD_PRINT_TEXT(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, item.ItemContent);
                                for (var id in styleA) {
                                    if (styleA[id] != '' && styleA[id] != 0 && styleA[id] != '#000000') {
                                        if (id == 'LinkedItem') {
                                            linkedItemObj[item.index] = styleA[id]
                                        } else {
                                            CNPrint.SET_PRINT_STYLEA(0, id, styleA[id]);
                                        }
                                    }
                                }
                            } else if (className == 'Htm') {
                                CNPrint.ADD_PRINT_HTM(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, item.ItemContent);
                            } else if (className == 'BarCode') {
                                CNPrint.ADD_PRINT_BARCODE(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, styleA.FontName, item.ItemContent);
                                if (!styleA.showBarCode) {//条形码显示文字开关
                                    CNPrint.SET_PRINT_STYLEA(0, "ShowBarText", 0);
                                }
                            } else if (className == 'Rect') {
                                CNPrint.ADD_PRINT_RECT(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, 0, 1);
                            } else if (className == 'Image') {
                                CNPrint.ADD_PRINT_IMAGE(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, item.ItemContent);
                            } else {
                                if (typeObj.detailDiv != null) {
                                    CNPrint.ADD_PRINT_TABLE(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, document.getElementById(typeObj.detailDiv).innerHTML);
                                }
                            }
                        }

                    }

                    for (var id in linkedItemObj) {
                        CNPrint.SET_PRINT_STYLEA(id, "LinkedItem", linkedItemObj[id]);
                    }
                    CNPrint.PRINT_DESIGN();
                }

                /**
                 * 设置纸张信息
                 * @param ori
                 * @param width
                 * @param height
                 * @param pageType
                 */
                function setPageSize(ori, width, height, pageType) {
                    if (ori == '' || ori === undefined) {
                        orig = '0';
                    }
                    if (width == '' || width === undefined)width = 0;
                    if (height == '' || height === undefined)height = 0;
                    if (pageType == undefined) {
                        pageType = "";
                    }
                    LODOP.SET_PRINT_PAGESIZE(ori, width, height, "CreateCustomPage");
                }

                /**
                 * 设置纸张信息
                 * @param ori
                 * @param width
                 * @param height
                 * @param pageType
                 */
                function setPageSize_CaiNiao(ori, width, height, pageType) {
                    if (ori == '' || ori === undefined) {
                        orig = '0';
                    }
                    if (width == '' || width === undefined)width = 0;
                    if (height == '' || height === undefined)height = 0;
                    if (pageType == undefined) {
                        pageType = "";
                    }
                    CNPrint.SET_PRINT_PAGESIZE(ori, width, height, "CreateCustomPage");
                }


            }
        ])
    ;

})