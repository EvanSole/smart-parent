define(['app'], function (app) {
    'use strict';
    app.factory('wmsPrint', ['$http','sync', 'url', function ($http,$sync, url) {
        var Print_Detail = "PRINT_DETAIL_DIV_";
        var Print_Div = "PRINT_DIV_";
        var WmsPrint = function () {
        }//打印对象
        var LODOP;
        //打印模板对象
        var WmsPrintTemplate = [];
        //打印映射
        var PRINT_CONTENT = {};
        var CNPrint = {};
        $http.get(url.printTemps).success(function(response) {
            WmsPrintTemplate = response;
        });
        $http.get(url.printMaps).success(function(response) {
            PRINT_CONTENT = response;
        });
        /**
         * 获得LODOP对象
         * @returns {*}
         */
        function _lodopCustom() {
            return getLodop(document.getElementById('LODOP'), document.getElementById('LODOP_EM'));
        }


        function _machine() {
            LODOP = _lodopCustom();
            var iPrinterCount = LODOP.GET_PRINTER_COUNT();//获取打印机设备数量
            var printerDevice = [];//设备集合
            for (var i = 0; i < iPrinterCount; i++) {
                var printerName = LODOP.GET_PRINTER_NAME(i);
                var printer = {key: printerName, value: printerName};
                printerDevice.push(printer);
            }
            return printerDevice;
        }

        function _defaultMachine() {
            return LODOP.GET_PRINTER_NAME(-1);
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

        function error(message) {
            return {suc: false, message: message};
        }

        function succ() {
            return {suc: true};
        }


        function _content(key) {
            return PRINT_CONTENT[key];
        }

        /**
         * 执行打印入口
         * @param printData     需要打印的数据
         * @param type          打印类别
         * @param templateObj   打印模版数据
         * @param copies   打印份数
         * @returns {boolean}
         */
        function printExec(printData, type, templateObj, copies, printer) {
            if (templateObj == null) {
                kendo.ui.ExtAlertDialog.showError(type + "没有设置模板");
                return error("没有设置模板");
            }
            LODOP = _lodopCustom();
            LODOP.PRINT_INIT(type + "打印");
            if (copies) {
                LODOP.SET_PRINT_COPIES(copies);
            } else {
                LODOP.SET_PRINT_COPIES(1);
            }
            //是否多条打印
            var isArray = $.isArray(printData);

            var printOptions = templateObj.printOptions;
            if(!printOptions){
                printOptions = {"pageLength":"2900","pageWidth":"2100","pageOri":"1"};
            }
            if (typeof printOptions == "string") {
                printOptions = $.parseJSON(printOptions)
            }
            if (printer) {
                printOptions.printMachine = printer;
            }

            if (printOptions !== undefined && (printOptions.pageLength !== undefined || printOptions.pageWidth !== undefined)) {
                //设置纸张大小
                setPageSize(printOptions.pageOri, printOptions.pageWidth, printOptions.pageLength, "");
            }

            //如果设置了打印机 则选择设置的打印机
            if (printOptions.printMachine !== undefined && printOptions.printMachine != '') {
                LODOP.SET_PRINTER_INDEX(printOptions.printMachine);
            } else if (printOptions.printMachine == undefined || printOptions.printMachine == '') {
                LODOP.SET_PRINTER_INDEX(-1);//取默认打印机
            } else {
                return error("获取打印机错误");
            }
            var keyMap = _content(type);

            if (isArray) {
                if (printData.length == 0) {
                    return error("不存在可打印的数据")
                }
                for (var i = 0; i < printData.length; i++) {
                    printDataFunc(printData[i], keyMap, templateObj, i, type);
                }
            } else {
                printDataFunc(printData, keyMap, templateObj, 0, type);
            }

//            LODOP.PREVIEW();
            var printFlag = LODOP.PRINT();
            return {suc: printFlag};
        }

        function _fieldEnByCn(cn, field) {
            if (typeof field == "string") {
                field = $.parseJSON(field);
            }
            var obj = {};
            for (var i = 0; i < field.length; i++) {
                if (cn.indexOf(field[i].cn) != -1) {
                    obj = field[i];
                    break;
                }
            }

            return obj;
        }

        function replaceStr(content, dest, ori) {
            if (ori == undefined) {
                ori = '';
            }

            var contentNew = content.replace(dest, ori);

            return contentNew;
        }


        function _lodopCustom_CaiNiao() {
            var ctl = getCaiNiaoPrint(document.getElementById('CaiNiaoPrint_OB'), document.getElementById('CaiNiaoPrint_EM'));
            //涉及到多商家的时候需要动态赋值
            var AppKey = "12030431";//98801
            var Seller_ID = "120617230";//155809
            ctl.SET_PRINT_IDENTITY("AppKey=" + AppKey + "98801&Seller_ID=" + Seller_ID);

            return ctl;
        }

        function printDataFunc_CaiNiao(o, keyMap, templateObj, dataIndex, type) {
            var wayBillData = o["logisticAreaName"];
            if (wayBillData != null) {
                if (typeof wayBillData == "string" && wayBillData.length > 0) {
                    wayBillData = $.parseJSON(wayBillData)
                }
            } else {
                wayBillData = {"shortAddress": "", "packageCenterName": "", "packageCenterCode": ""};
            }
            //0:预览并打印logo,1:预览不打印logo
            CNPrint.SET_PRINT_STYLEA("ali_waybill_cp_logo_up", "PreviewOnly", 1);//上面logo
            CNPrint.SET_PRINT_STYLEA("ali_waybill_cp_logo_down", "PreviewOnly", 1);//下面logo

            CNPrint.SET_PRINT_STYLEA("ali_waybill_short_address", "CONTENT", wayBillData.shortAddress);//大头笔
            CNPrint.SET_PRINT_STYLEA("ali_waybill_package_center_name", "CONTENT", wayBillData.packageCenterName);//集散地名称
            CNPrint.SET_PRINT_STYLEA("ali_waybill_package_center_code", "CONTENT", wayBillData.packageCenterCode);//集散地条码

            CNPrint.SET_PRINT_STYLEA("ali_waybill_send_name", "CONTENT", o["shopContact"]);//寄件人姓名
            CNPrint.SET_PRINT_STYLEA("ali_waybill_send_phone", "CONTENT", o["shopTel"]);//寄件人电话
            CNPrint.SET_PRINT_STYLEA("ali_waybill_shipping_address", "CONTENT", o["shopAddress"]);//寄件人地址
            CNPrint.SET_PRINT_STYLEA("ali_waybill_consignee_name", "CONTENT", o["receiverName"]);//收件人姓名
            CNPrint.SET_PRINT_STYLEA("ali_waybill_consignee_phone", "CONTENT", o["mobile"]);//收件人电话
            CNPrint.SET_PRINT_STYLEA("ali_waybill_consignee_address", "CONTENT", o["address"]);//收件人地址
            CNPrint.SET_PRINT_STYLEA("ali_waybill_waybill_code", "CONTENT", o["carrierReferNo"]);//面单号

            CNPrint.SET_PRINT_STYLEA("ali_waybill_shipping_branch_name", "CONTENT", "");//发件网点名称
            CNPrint.SET_PRINT_STYLEA("ali_waybill_shipping_branch_code", "CONTENT", "");//发件网点代码

            CNPrint.SET_PRINT_STYLEA("ali_waybill_ext_send_date", "CONTENT", o["deliveryTime"]);//发件日期(中通要求)
            CNPrint.SET_PRINT_STYLEA("ali_waybill_ext_sf_biz_type", "CONTENT", "");//业务类型(顺丰要求)
            CNPrint.SET_PRINT_STYLEA("ali_waybill_shipping_address_city", "CONTENT", o["cityName"]);//发件城市(中国邮政要求)

            CNPrint.SET_PRINT_STYLEA("ali_waybill_product_type", "CONTENT", "");//产品类型(代收货款)
            CNPrint.SET_PRINT_STYLEA("ali_waybill_cod_amount", "CONTENT", "");//服务


            var field = keyMap.field;
            var contentObj = templateObj.content;
            if (typeof contentObj == "string") {
                contentObj = $.parseJSON(contentObj)
            }
            var itemArr = contentObj.item;

            if (contentObj.bkgPath !== undefined && contentObj.bkgPath != "") {
                var imgPath = contentObj.bkgPath;

                //物流单图片
                if (contentObj.bkgUrlIsHttp) {
                    imgPath = httpImgPathPrefix + imgPath;
                }

                CNPrint.ADD_PRINT_SETUP_BKIMG(imgFileTypeHandle(imgPath));
                CNPrint.SET_SHOW_MODE("BKIMG_IN_PREVIEW", true);
            }

            var tableIndex = 0;
            for (var i = 0; i < itemArr.length; i++) {
                var item = itemArr[i];

                if (item.styleA !== undefined && item.styleA.PreviewOnly == true) {
                    continue;
                }
                var className = item.className;
                var styleA = item.styleA;
                if (className == 'Text' || className == 'BarCode' || className == 'Rect' || className == 'Image') {
                    var contentCn = item.ItemContent;
                    var repalceObj = _fieldEnByCn(contentCn, field)

                    var replacesStr = ''
                    if (repalceObj !== undefined) {
                        if (o[repalceObj.en] !== undefined) {
                            replacesStr = o[repalceObj.en];

                        }
                    }

                    var result = replaceStr(contentCn, repalceObj.cn, replacesStr);

                    if (className == 'BarCode') {
                        CNPrint.ADD_PRINT_BARCODE(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, item.styleA.FontName, result);
                        if (!styleA.showBarCode) {//条形码显示文字开关
                            CNPrint.SET_PRINT_STYLEA(0, "ShowBarText", 0);
                        }
                    } else if (className == 'Rect') {
                        CNPrint.ADD_PRINT_RECT(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, 0, 1);
                    }
                    else if (className == 'Image') {
                        if (result) {
                            CNPrint.ADD_PRINT_IMAGE(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, result);
                        } else {
                            CNPrint.ADD_PRINT_HTM(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, "谢谢惠顾!");
                        }
                    } else {
                        CNPrint.ADD_PRINT_TEXT(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, result);
                    }


                    for (var id in styleA) {
                        if (styleA[id] != '' && styleA[id] != 0 && styleA[id] != '#000000') {
                            if (id == 'LinkedItem') {
                                CNPrint.SET_PRINT_STYLEA(0, "LinkedItem", styleA[id] * (dataIndex + 1));
                            } else {
                                CNPrint.SET_PRINT_STYLEA(0, id, styleA[id]);
                            }

                        }
                    }
                } else {
                    if (dataIndex == 0) {
                        //if (keyMap.detailDiv != undefined || keyMap.detailDiv != null) {
                        //if ($("#"+type+"_Detail").length>0) {
                        //    //document.getElementById(type+"_Detail").innerHTML = item.ItemContent;
                        //    $("#"+type+"_Detail").html(item.ItemContent);
                        //}
                        if ($("#" + Print_Detail).length <= 0) {
                            $("body").append("<div id='" + Print_Detail + "' style='display:none;'></div>");
                        } else {
                            $("#" + Print_Detail).html("");
                        }
                        $("#" + Print_Detail).html(item.ItemContent);
                    }
                    tableIndex = item.index;
                    _detailContent_CaiNiao(keyMap, o, item)
                }
            }


            //做关联处理
            if (tableIndex != 0) {
                var itemCount = itemArr.length;

                for (var i = 0; i < itemArr.length; i++) {
                    var item = itemArr[i];

                    if (item.styleA.ItemType == 1) {

                        var sourctIndex = (dataIndex * itemCount) + parseInt(item.index);
                        var targetIndex = (dataIndex * itemCount) + parseInt(tableIndex);

                        CNPrint.SET_PRINT_STYLEA(sourctIndex, "LinkedItem", targetIndex);
                    }
                }
            }

            //分页
            CNPrint.NewPageA();
        }


        /**
         * 获得打印明细内容
         * @param line
         * @param keyMap
         * @param o
         * @param tableObj
         */
        function _detailContent_CaiNiao(keyMap, o, tableObj) {
            var htmlStr = '';
            var tmpHtml;
            if (keyMap.detailDiv == undefined || keyMap.detailDiv == null) {
                $("#printDiv").append(tableObj.ItemContent);
            } else {
                tmpHtml = document.getElementById(keyMap.detailDiv).innerHTML;
                $("#printDiv").append(tmpHtml);
                var tr = $("#printDiv table tbody tr").eq(0).clone();
                var trHtml = tr.html();
                var detailDataArr = o.item;
                var detailKeyMap = keyMap.detail;
                for (var i = 0; i < detailDataArr.length; i++) {
                    trHtml = tr.html();
                    var detailData = detailDataArr[i];

                    for (var detailKey in detailKeyMap) {
                        var oriStr = ''
                        if (detailData[detailKey] != undefined && detailData[detailKey] != 'undefined') {
                            oriStr = detailData[detailKey];
                        }
                        trHtml = replaceStr(trHtml, detailKeyMap[detailKey], oriStr)

                    }

                    $("#printDiv table tbody").append("<tr>" + trHtml + "</tr>")

                }
                //拼接tfoot
                if (o.postfee != undefined) {
                    var tfootHtml;
                    tfootHtml = '<tr><TD class="td1" colspan="2">配送费(元)</TD><TD class="td1" colspan="2">￥' + o.postfee + '</TD><TD class="td1" colspan="2">优惠券（元）</TD><TD class="td1" colspan="2">-' + o.discountFee + '</TD></tr>'
                    tfootHtml += '<tr><TD class="td1" colspan="2"></TD><TD class="td1" colspan="2"></TD><TD class="td1" colspan="2"">订单总金额（元）</TD> <TD class="td1" colspan="2">￥' + (o.totalFee - o.discountFee) + '</TD></tr>';
                    $("#printDiv table tfoot").after(tfootHtml);
                }
                $("#printDiv table tbody tr").eq(0).remove();
            }

            CNPrint.ADD_PRINT_TABLE(tableObj.ItemTop, tableObj.ItemLeft, tableObj.ItemWidth, tableObj.ItemHeight, document.getElementById("printDiv").innerHTML)
            $("#printDiv").empty();
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

        /**
         * 执行打印入口
         * @param printData     需要打印的数据
         * @param type          打印类别
         * @param templateObj   打印模版数据
         * @returns {boolean}
         */
        function printExec_CaiNiao(carrierCode, printData, type, templateObj, printer) {

            CNPrint = _lodopCustom_CaiNiao();

            CNPrint.PRINT_INITA(0, 14, 400, 800, type + "打印");
            CNPrint.SET_PRINT_MODE("CAINIAOPRINT_MODE", "CP_CODE=" + carrierCode + "&CONFIG=0");

            //是否多条打印
            var isArray = $.isArray(printData);
            var printOptions = templateObj.printOptions;
            if (templateObj.printOptions && typeof templateObj.printOptions == "string") {
                printOptions = $.parseJSON(printOptions)
            }else if(!printOptions){
                printOptions = {"pageLength":"1800","pageWidth":"1100","pageOri":"1"};
            }
            if (printer) {
                printOptions.printMachine = printer;
            }
            if (printOptions !== undefined && (printOptions.pageLength !== undefined || printOptions.pageWidth !== undefined)) {
                //设置纸张大小
                setPageSize_CaiNiao(printOptions.pageOri, printOptions.pageWidth, printOptions.pageLength, "");
            }

            //如果设置了打印机 则选择设置的打印机
            if (printOptions.printMachine !== undefined && printOptions.printMachine != '') {
                CNPrint.SET_PRINTER_INDEX(printOptions.printMachine);
            } else if (printOptions.printMachine == undefined || printOptions.printMachine == '') {
                CNPrint.GET_PRINTER_NAME(-1);//取默认打印机
            } else {
                return error("获取打印机错误!");
            }
            var keyMap = _content(type);
            if (!keyMap) {
                kendo.ui.ExtAlertDialog.showError(type + "----未关联打印映射");
                return error(type + "----未关联打印映射!");
            }
            if (isArray) {
                if (printData.length == 0) {
                    return error("不存在可打印的数据!");
                }
                for (var i = 0; i < printData.length; i++) {
                    printDataFunc_CaiNiao(printData[i], keyMap, templateObj, i, type);
                }
            } else {
                printDataFunc_CaiNiao(printData, keyMap, templateObj, 0, type);
            }

            var printFlag = CNPrint.PRINT();
            return printFlag;
        }

        /**
         * 获得打印明细内容
         * @param line
         * @param keyMap
         * @param o
         * @param tableObj
         */
        function _detailContent(keyMap, o, tableObj) {
            var htmlStr = '';
            var tmpHtml;
            if (keyMap.hasDetail != 1) {
                $("#" + Print_Div).append(tableObj.ItemContent);
            } else {
                tmpHtml = $("#" + Print_Detail).html();
                $("#" + Print_Div).append(tmpHtml);
                var tr = $("#" + Print_Div + " table tbody tr").eq(0).clone();
                var trHtml = tr.html();
                var detailDataArr = o.item;
                var detailKeyMap = keyMap.detail;
                if (typeof contentObj == "string") {
                    var detailKeyMap = $.parseJSON(keyMap.detail);
                }
                for (var i = 0; i < detailDataArr.length; i++) {
                    trHtml = tr.html();
                    var detailData = detailDataArr[i];

                    for (var detailKey in detailKeyMap) {
                        var oriStr = ''
                        if (detailData[detailKey] != undefined && detailData[detailKey] != 'undefined') {
                            oriStr = detailData[detailKey];
                        }
                        trHtml = replaceStr(trHtml, detailKeyMap[detailKey], oriStr)

                    }

                    $("#" + Print_Div + " table tbody").append("<tr>" + trHtml + "</tr>")

                }
                //拼接tfoot
                if (o.postfee != undefined) {
                    var tfootHtml;
                    tfootHtml = '<tr><TD class="td1" colspan="2">配送费(元)</TD><TD class="td1" colspan="2">￥' + o.postfee + '</TD><TD class="td1" colspan="2">优惠券（元）</TD><TD class="td1" colspan="2">-' + o.discountFee + '</TD></tr>'
                    tfootHtml += '<tr><TD class="td1" colspan="2"></TD><TD class="td1" colspan="2"></TD><TD class="td1" colspan="2"">订单总金额（元）</TD> <TD class="td1" colspan="2">￥' + (o.totalFee - o.discountFee) + '</TD></tr>';
                    $("#" + Print_Div + " table tfoot").after(tfootHtml);
                }
                $("#" + Print_Div + " table tbody tr").eq(0).remove();
            }

            LODOP.ADD_PRINT_TABLE(tableObj.ItemTop, tableObj.ItemLeft, tableObj.ItemWidth, tableObj.ItemHeight, document.getElementById(Print_Div).innerHTML)
            $("#" + Print_Div).empty();

        }


        function printDataFunc(o, keyMap, templateObj, dataIndex, type) {
            var field = keyMap.field;
            var contentObj = templateObj.content;
            if (typeof contentObj == "string") {
                contentObj = $.parseJSON(contentObj)
            }
            var itemArr = contentObj.item;

            if (contentObj.bkgPath !== undefined && contentObj.bkgPath != "") {
                var imgPath = contentObj.bkgPath;

                //物流单图片
                if (contentObj.bkgUrlIsHttp) {
                    imgPath = httpImgPathPrefix + imgPath;
                }

                LODOP.ADD_PRINT_SETUP_BKIMG(imgFileTypeHandle(imgPath));
                LODOP.SET_SHOW_MODE("BKIMG_IN_PREVIEW", true);
            }

            var tableIndex = 0;
            for (var i = 0; i < itemArr.length; i++) {
                var item = itemArr[i];


                if (item.styleA !== undefined && item.styleA.PreviewOnly == true) {
                    continue;
                }
                var className = item.className;
                var styleA = item.styleA;
                if (className == 'Text' || className == 'BarCode' || className == 'Rect' || className == 'Image') {
                    var contentCn = item.ItemContent;
                    var repalceObj = _fieldEnByCn(contentCn, field)

                    var replacesStr = ''
                    if (repalceObj !== undefined) {
                        if (o[repalceObj.en] !== undefined) {
                            replacesStr = o[repalceObj.en];

                        }
                    }

                    var result = replaceStr(contentCn, repalceObj.cn, replacesStr);

                    if (className == 'BarCode') {
                        LODOP.ADD_PRINT_BARCODE(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, item.styleA.FontName, result);
                        if (!styleA.showBarCode) {//条形码显示文字开关
                            LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
                        }
                    } else if (className == 'Rect') {
                        LODOP.ADD_PRINT_RECT(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, 0, 1);
                    }
                    else if (className == 'Image') {
                        if (result) {
                            LODOP.ADD_PRINT_IMAGE(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, result);
                        } else {
                            LODOP.ADD_PRINT_HTM(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, "谢谢惠顾!");
                        }
                    }
                    else {
                        LODOP.ADD_PRINT_TEXT(item.ItemTop, item.ItemLeft, item.ItemWidth, item.ItemHeight, result);
                    }


                    for (var id in styleA) {
                        if (styleA[id] != '' && styleA[id] != 0 && styleA[id] != '#000000') {
                            if (id == 'LinkedItem') {
                                LODOP.SET_PRINT_STYLEA(0, "LinkedItem", styleA[id] * (dataIndex + 1));
                            } else {
                                LODOP.SET_PRINT_STYLEA(0, id, styleA[id]);
                            }

                        }
                    }
                } else {

                    if (dataIndex == 0) {
                        if (keyMap.hasDetail == 1) {
                            if ($("#" + Print_Detail).length <= 0) {
                                $("body").append("<div id='" + Print_Detail + "' class='display:none;'></div>");
                            } else {
                                $("#" + Print_Detail).html("");
                            }
                            $("#" + Print_Detail).html(item.ItemContent);

                        }
                        //if ($("#"+type+"_Detail").length>0) {
                        //    //document.getElementById(keyMap.detailDiv).innerHTML = item.ItemContent;
                        //    $("#"+type+"_Detail").html(item.ItemContent);
                        //}
                    }
                    tableIndex = item.index;
                    _detailContent(keyMap, o, item)

                }
            }


            //做关联处理
            if (tableIndex != 0) {
                var itemCount = itemArr.length;

                for (var i = 0; i < itemArr.length; i++) {
                    var item = itemArr[i];

                    if (item.styleA.ItemType == 1) {

                        var sourctIndex = (dataIndex * itemCount) + parseInt(item.index);
                        var targetIndex = (dataIndex * itemCount) + parseInt(tableIndex);

                        LODOP.SET_PRINT_STYLEA(sourctIndex, "LinkedItem", targetIndex);
                    }
                }
            }

            //分页
            LODOP.NewPageA();
        }

        ///获取默认模板
        function _defaultTemplate(code, carrierCode) {
            var template = null;
            $(WmsPrintTemplate).each(function () {
                if (this.reportCategoryCode == code) {
                    if (carrierCode) {
                        if (this.carrier == carrierCode) {
                            template = this;
                        }
                    } else {
                        template = this;
                    }
                }
            });
            if (template == null) {
                if (carrierCode) {
                    kendo.ui.ExtAlertDialog.showError(carrierCode + "-" + code + " - 不存在默认模板");
                } else {
                    kendo.ui.ExtAlertDialog.showError(code + " - 不存在默认模板");
                }
            }
            return template;
        }

        ///获取默认模板
        function _defaultTemplateById(id) {
            var template = null;
            $(WmsPrintTemplate).each(function () {
                if (this.id == id) {
                    template = this;
                }
            });
            return template;
        }


        WmsPrint.prototype.PrintType = {
            QC_Pick: "QC_Pick",
            ExpressCaiNiao: "Express_CaiNiao",
            QC_Order_Pick: "QC_Order_Pick",
            Barcode:"Barcode"
        }


        /////////////////////////////////对外暴露接口开始/////////////////////////////////////
        /**
         * 打印商品条码
         * @param ids
         * @param templateId 模板ID
         * @param copies 打印份数
         */
        WmsPrint.prototype.printSkuBarcode = function (printDatas, copies) {
            return printExec(printDatas, this.PrintType.SkuBarcode, _defaultTemplate(this.PrintType.SkuBarcode), copies);
        }


        /**
         * 打印条码
         * @param ids
         * @param templateId 模板ID
         * @param copies 打印份数
         */
        WmsPrint.prototype.printBarcode = function (printDatas, copies) {
            return printExec(printDatas, this.PrintType.Barcode, _defaultTemplate(this.PrintType.Barcode), copies);
        }


        /**
         * 打印电子面单
         * @param ids
         * @param templateId 模板ID
         * @param copies 打印份数
         */
        WmsPrint.prototype.printWayBillExpress = function (carrierCode, printDatas) {
            return printExec_CaiNiao(carrierCode, printDatas, this.PrintType.Express, _defaultTemplate(this.PrintType.Express, carrierCode));
        }


        /**
         * 打印物流单
         */
        WmsPrint.prototype.printExpress = function (carrierCode, printDatas, templateId, printer) {
            if (templateId) {
                return printExec_CaiNiao(carrierCode, printDatas, this.PrintType.ExpressCaiNiao, _defaultTemplateById(templateId), printer);
            } else {
                return printExec_CaiNiao(carrierCode, printDatas, this.PrintType.ExpressCaiNiao, _defaultTemplate(this.PrintType.ExpressCaiNiao, carrierCode), printer);
            }
        }

        /**
         * 打印数据
         * @param ids
         * @param type 打印类型
         * @param copies 打印份数
         */
        WmsPrint.prototype.printData = function (printDatas, type, copies) {
            return printExec(printDatas, type, _defaultTemplate(type), copies);
        }

        /**
         * 打印数据
         * @param ids
         * @param type 打印类型
         * @param copies 打印份数
         */
        WmsPrint.prototype.printDataByTemplateId = function (printDatas, type, templateId, copies, printer) {
            return printExec(printDatas, type, _defaultTemplateById(templateId), copies, printer);
        }

        /**
         * 打印数据
         * @param ids
         * @param templateId 模板ID
         * @param copies 打印份数
         */
        WmsPrint.prototype.printDataByTempId = function (printDatas, id, copies) {
            var template = _defaultTemplateById(id);
            return printExec(printDatas, template.reportCategoryCode, template, copies);
        }


        //获取当前环境所配置的打印机
        WmsPrint.prototype.getCurrentMachines = function () {
            return _machine();
        };

        //获取默认打印机
        WmsPrint.prototype.getDefaultMachine = function () {
            return _defaultMachine();
        };

        WmsPrint.prototype.getReportContent = function (key) {
            return _content(key);
        }
        /////////////////////////////////对外暴露接口结束/////////////////////////////////////

        if ($("#" + Print_Div).length <= 0) {
            $("body").append("<div id='" + Print_Div + "' style='display:none;'></div>");
        } else {
            $("#" + Print_Div).html("");
        }
        //绑定打印模板
        return new WmsPrint();
    }
    ])
    ;
})
;

