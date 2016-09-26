/**
 * Created by zw on 15/4/20.
 */

define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('picUploadController',
        ['$scope', '$rootScope', '$http', 'url', 'FileUploader', 'wmsDataSource', 'sync', '$filter',
            function($scope, $rootScope, $http, $url, FileUploader, wmsDataSource, $sync, $filter) {
                var picUploadColumns = [
                        {filterable: false, title: '图片', align: 'left', width: "100px", template:"<a class='k-button k-button-custom-command'  name='uploadPic' href='\\#' ng-click='uploadPic(this);' >上传图片</a>"},
                        {filterable: false, title: '质检修改', align: 'left', width: "100px", template:"<a class='k-button k-button-custom-command'  name='updateQc' href='\\#' ng-click='updateQc(this);' >修改</a>"},
                        { field: 'type', title: '质检单类型', filterable: false, align: 'left', width: '110px', template: WMS.UTILS.statesFormat('type', 'QcOrderTypeEnum')},
                        { field: 'qcOrderId', title: '质检单号', filterable: false, align: 'left', width: '110px'},
                        { field: 'processStatus', title: '单据状态', filterable: false, align: 'left', width: '110px', template: WMS.UTILS.statesFormat('processStatus', 'QcOrderProcessStatusEnum')},
                        { field: 'qcResult', title: '质检结果', filterable: false, align: 'left', width: '110px', template: WMS.UTILS.statesFormat('qcResult', 'QcOrderQualityResultEnum')},
                        { field: 'sellerUserName', title: '商家名称', filterable: false, align: 'left', width: '110px'},
                        { field: 'shopOrderId', title: '交易单号', filterable: false, align: 'left', width: '110px'},
                        { field: 'optUserName', title: '质检人', filterable: false, align: 'left', width: '110px'},
                        { field: 'qcOptFinishedTime', title: '质检完成时间', filterable: false, align: 'left', width: '110px', template: WMS.UTILS.timestampFormat("qcOptFinishedTime", "yyyy-MM-dd HH:mm:ss")},
                        { field: 'goodsCategoryName', title: '商品类目', filterable: false, align: 'left', width: '110px'},
                        { field: 'goodsCode', title: '商品编码', filterable: false, align: 'left', width: '110px'},
                        { field: 'goodsName', title: '商品名称', filterable: false, align: 'left', width: '110px'},
                        { field: 'goodsPrice', title: '订单金额', filterable: false, align: 'left', width: '110px'},
                        { field: 'buyerUserId', title: '下单账号', filterable: false, align: 'left', width: '110px'},
                        { field: 'inspectionRemark', title: '备注', filterable: false, align: 'left', width: '110px'},
                        { field: 'expressId', title: '物流单号', filterable: false, align: 'left', width: '110px'},
                        { field: 'created', title: '创建时间', filterable: false, align: 'left', width: '110px', template: WMS.UTILS.timestampFormat("created", "yyyy-MM-dd HH:mm:ss")},
                        { field: 'failImageList', title: '是否已上传', filterable: false, align: 'left', width: '110px', template: function(data) {
                            if (data.failImageList != '' && data.failImageList.length > 0) {
                                return '已上传';
                            } else {
                                return '未上传';
                            }
                        }}
                    ];

                var picUploadDataSource = wmsDataSource({
                    url: $url.qcOrderQueryUrl + "/query/list/unqualified",
                    schema: {
                        model: {
                            id:"qcOrderId",
                            fields: {
                                id: { type: "number", editable: false, nullable: true }
                            }
                        },
                        total: function (total) {
                            return total.length > 0 ? total[0].total : 0;
                        }
                    }
                });


                $scope.picUploadGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: picUploadDataSource,
                    columns: picUploadColumns,
                    autoBind: true
                }, $scope);

                var uploader = $scope.uploader = new FileUploader({
                    url:window.BASEPATH + "/qc/order/qcOperation/picUpload",
                    alias: "file",
                    queueLimit: 10,
                    removeAfterUpload: true,
                    withCredentials: true
                });

                uploader.onCompleteAll = function(item) {
                    $scope.picUploadGrid.dataSource.read({});
                }
                var operateQcOrderId;
                $scope.picUploadSave = function() {
                    var resultMap = {
                        qcOrderId: operateQcOrderId
                    };
                    uploader.onBeforeUploadItem=function(item) {
                        item.formData = [{resultMap:JSON.stringify(resultMap)}];
                    }
                    uploader.uploadAll();
                    $scope.showPicUploadPopup.close();
                }

                $scope.uploadPic = function uploadPic(data){
                    $('#container').empty();
                    $('#showImage').empty();
                    $('#showOptions').empty();
                    uploader.clearQueue();
                    operateQcOrderId = data.dataItem.qcOrderId;

                    if (data.dataItem.failImageList != null && data.dataItem.failImageList.length > 0) {
                        var failImage = data.dataItem.failImageList.split(";");
                        for (var i = 0; i < failImage.length; i++) {
                            if (failImage[i].length > 0) {
                                $('#showImage').append('<div class="img-item clearfix"><div class="close fa fa-close" data-i="'+i+'" data-qcorderid="'+operateQcOrderId+'" data-count="'+failImage.length+'"></div><a href="http://s22.mogucdn.com'+ failImage[i] +'" target="_blank"><img src="http://s22.mogucdn.com' + failImage[i] + '" style="width:400px;height:400px;"></a></div>')
                            }
                        }
                    }

                    $('#showOptions').append(data.dataItem.failOptionIdListValue);


                    $scope.showPicUploadPopup.refresh();
                    $scope.showPicUploadPopup.open().center();

                }

                $('#showImage').on("click",function(e){
                    if($(e.target).hasClass("close")){
                        console.log($(e.target).data("i"));
                        console.log($(e.target).data("qcorderid"));
                        var i = $(e.target).data("i");
                        var qcOrderId = $(e.target).data("qcorderid");
                        var count = $(e.target).data("count");
                        var resultMap = {
                            index: i,
                            qcOrderId: qcOrderId,
                            count: count
                        }
                        $sync(window.BASEPATH + "/qc/order/qcOperation/deletePic", "POST",{data:resultMap})
                            .then(function (data) {
                                $('#showImage').empty();
                                if (data.data != null && data.data.length > 0) {

                                    var failImage = data.data.split(";");
                                    for (var i = 0; i < failImage.length; i++) {
                                        if (failImage[i].length > 0) {
                                            $('#showImage').append('<div class="img-item clearfix"><div class="close fa fa-close" data-i="'+i+'" data-qcorderid="'+qcOrderId+'" data-count="'+failImage.length+'"><a href="http://s22.mogucdn.com'+ failImage[i] +'" target="_blank"></div><img src="http://s22.mogucdn.com' + failImage[i] + '" style="width:400px;height:400px;"></a></div>')
                                        }
                                    }
                                }
                                $scope.picUploadGrid.dataSource.read({});
                            }, function (data) {
                                $('#showImage').empty();
                                if (data != null && data.dataItem.length > 0) {

                                    var failImage = data.split(";");
                                    for (var i = 0; i < failImage.length; i++) {
                                        if (failImage[i].length > 0) {
                                            $('#showImage').append('<div class="img-item clearfix"><div class="close fa fa-close" data-i="'+i+'" data-qcorderid="'+qcOrderId+'" data-count="'+failImage.length+'"></div><a href="http://s22.mogucdn.com'+ failImage[i] +'" target="_blank"><img src="http://s22.mogucdn.com' + failImage[i] + '" style="width:400px;height:400px;"></a></div>')
                                        }
                                    }
                                }
                                $scope.picUploadGrid.dataSource.read({});
                            });
                    }
                });

                $scope.cancelClose = function () {
                    $scope.showPicUploadPopup.close();
                    $('#container').empty();
                    uploader.clearQueue();
                };

//                function sendFile(option, cb) {
//                    /* {
//                     field: name,
//                     url  : '/path/to/upload',
//                     file : FileObject
//                     } */
//                    var field = option.field,
//                        xhr     = new XMLHttpRequest(),
//                        fd      = new FormData(),
//                        resp;
//
//                    xhr.open("POST", option.url, true);
//                    xhr.onreadystatechange = function () {
//                        if (xhr.readyState == 4 && xhr.status == 200) {
//                            // Handle response.
//                            resp = JSON.parse(xhr.responseText);
//                            cb && cb(resp);
//                        }
//                    };
//                    xhr.addEventListener('load', function () {
//                        resp = JSON.parse(xhr.responseText);
//                        //cb(resp);
//                    }, false);
//
//
//
//                    // send multiple files;
//                    //var files = Array.apply(null,option.file);
//                    //files.forEach(function(item) {
//                    // fd.append(field, item, item.name);
//                    //})
//                    fd.append(field, option.file);
//
//                    if (Object.keys(option.form).length >= 1) {
//                        for (var item in option.form) {
//                            if (option.form.hasOwnProperty(item)) {
//                                fd.append(item, JSON.stringify(option.form[item]));
//                            }
//                        }
//                    }
//
//                    // Initiate a multipart/form-data upload
//                    xhr.send(fd);
//                }

                $(document).on('change', '#prefiles', function(ev) {
                    function readURL(file) {
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            $('#container').append('<img src="' + e.target.result+ '" style="width:200px;height:200px;margin : 10px 0px 15px 5px;">')
                        }
                        reader.readAsDataURL(file);
                    }

                    var $that = $(this),
                        files = Array.apply(null, this.files);

//                    _files = this.files;
                    $.each(files, function(i, file) {
                        readURL(file);
                    })
                });

        var operationMap = {};
        var operations;
        $scope.updateQc = function(obj) {
            $scope.updateQcPopup.refresh();
            $scope.updateQcPopup.open().center();

            setQcOperationsNull();

            $sync(window.BASEPATH + "/qc/order/qcOperationUpdate/" + obj.dataItem.qcOrderId, "GET")
                .then(function (xhr) {

                    var packInResult = xhr.data;
                    $scope.qcOperation_img = 'http://s22.mogucdn.com'+ packInResult.qualityCheckOrderDetail.goodsImage;
                    $scope.qcOperation_qcOrderId = packInResult.qualityCheckOrder.qcOrderId;
                    $scope.qcOperation_type = packInResult.qualityCheckOrder.type;
                    $scope.qcOperation_goodsName = packInResult.qualityCheckOrderDetail.goodsName;
                    $scope.qcOperation_goodsDesc = packInResult.qualityCheckOrderDetail.goodsDesc;
                    $scope.qcOperation_expressId = packInResult.qualityCheckOrder.expressId;
                    $scope.qcOperation_goodsDesc = packInResult.qualityCheckOrderDetail.goodsDesc;
                    $scope.qcOperation_goodsCode = packInResult.qualityCheckOrderDetail.goodsCode;
                    $scope.qcOperation_goodsPrice = packInResult.qualityCheckOrderDetail.goodsPrice;
                    $scope.qcOperation_shopName = packInResult.qualityCheckOrder.sellerUserName;


                    $scope.qcOperation_goodsDetailUrl = packInResult.qualityCheckOrderDetail.goodsLink;
//                    $scope.qcOperation_operations = packInResult.optionMap;
                    operations = packInResult.optionMap;
                    $scope.qcOperation_goodsDesc = packInResult.qualityCheckOrderDetail.goodsDesc;
                    $scope.qcOperation_qcType = packInResult.qualityCheckOrder.qcType;
                    $scope.qcOperation_inspectionRemark = packInResult.qualityCheckOrderDetail.inspectionRemark;

                    $scope.qcOperation_goodsLevel = packInResult.qualityCheckOrderDetail.qcLevel;
                    $scope.qcOperation_qcRemark = packInResult.qualityCheckOrderDetail.qcLevelRemark;
                    $scope.qcOperation_qcResult = packInResult.qualityCheckOrderDetail.qcResult;
                    $scope.qcOperation_otherRemark = packInResult.qualityCheckOrderDetail.otherRemark;
                    $scope.qcOperation_optionType = packInResult.qualityCheckOrder.optionType;
                    $scope.changeQcResult(packInResult.qualityCheckOrderDetail.qcResult);

                    operationMap = {};
//
                    $("#operation_items").css('display','block');

                    $("#qcOrderId").val('');

                    $scope.changeOptionType($scope.qcOperation_optionType);

                    setTimeout(function () {
                        JSON.parse(packInResult.qualityCheckOrderDetail.failOptionIdList, function(key, value) {
                            if (key != null && key != '') {
                                operationMap[key] = value;
                                $('#'+key+"_subOption").css("background", '#0000CD');
                                $('#'+key+"_subOption").css("color", '#FFFFFF');
                                $('#'+key+"_subOption").attr("value", '2');
                            }
                        });
                    }, 200);
                }, function (data) {
                    $("#operation_items").css('display','none');
                    setQcOperationsNull()
                    $("#qcOrderId").val('');
                    setTimeout(function () {
                        $("#qcOrderId").focus();
                    }, 500);
                });
                }

                $scope.changeOptionType = function(obj) {
                    var operationTypes = {};

                    _.map(operations, function(key, value) {
                        if (key.optionType == obj) {
                            operationTypes[value] = key;
                        }
                        return value;});
                    $scope.qcOperation_operations = operationTypes;
                    var optionKeys = _.map($scope.qcOperation_operations, function(key, value) {return key});

                    setTimeout(function () {
                        var activateTable = $("#"+optionKeys[0].optionId + "_tabStrip");
                        $("#tabStrip").kendoTabStrip().data("kendoTabStrip");
                        $("#tabStrip").kendoTabStrip().data("kendoTabStrip").activateTab(activateTable);
                    }, 200);

                    setTimeout(function () {
                        JSON.parse(JSON.stringify(operationMap), function(key, value) {
                            if (key != null && key != '') {
                                $('#'+key+"_subOption").css("background", '#0000CD');
                                $('#'+key+"_subOption").css("color", '#FFFFFF');
                                $('#'+key+"_subOption").attr("value", '2');
                            }
                        });
                    }, 500);

                }

                $scope.clickTab = function(_this) {
                    $("#"+_this.item.optionId + "_tabStrip").show();
                    $scope.percentDivChecked = true;
                    $scope.moveChecked = true;
                    var activateTable = $("#"+_this.item.optionId + "_tabStrip");
                    $("#tabStrip").kendoTabStrip().data("kendoTabStrip").activateTab(activateTable);
                }

                $scope.changeColor = function(_this) {
                    if($('#'+_this.subItem.optionId+"_subOption").attr("value")=='1') {
                        $('#'+_this.subItem.optionId+"_subOption").css("background", '#0000CD');
                        $('#'+_this.subItem.optionId+"_subOption").css("color", '#FFFFFF');
                        $('#'+_this.subItem.optionId+"_subOption").attr("value", '2');
                        operationMap[_this.subItem.optionId] = _this.subItem.parentOptionId;
                    } else {

                        $('#'+_this.subItem.optionId+"_subOption").css("background", '#DBDBDB');
                        $('#'+_this.subItem.optionId+"_subOption").css("color", '#666');
                        $('#'+_this.subItem.optionId+"_subOption").attr("value", '1');
                        delete operationMap[_this.subItem.optionId];
                    }
                }

                $scope.changeQcResult = function(obj) {
                    if (obj == '2') {
                        $("#qcLevelDiv").show();
                        $("#qcLevelRemarkDiv").show();
                    } else {
                        $scope.qcOperation_goodsLevel = '1';
                        $("#qcLevelDiv").hide();
                        $("#qcLevelRemarkDiv").hide();
                    }
                }

                $scope.qcResultUpdate = function(obj) {
                    if(!$scope.qcOperation_qcResult || $scope.qcOperation_qcResult == '') {
                        kendo.ui.ExtAlertDialog.showError("请选择质检结果!");
                        return;
                    }

//                    if (!$scope.qcOperation_qcOrderId || $scope.qcOperation_qcOrderId == '') {
//                        kendo.ui.ExtAlertDialog.showError("请输入质检单号/物流单号");
//                        return;
//                    }

                    if ($scope.qcOperation_qcResult === '2') {
                        if ($scope.qcOperation_goodsLevel === '1' || $scope.qcOperation_goodsLevel === 1 || $scope.qcOperation_goodsLevel === '') {
                            kendo.ui.ExtAlertDialog.showError("请选择商品等级!");
                            return;
                        }
                    }

                    var resultMap = {
                        qcOrderId: $scope.qcOperation_qcOrderId,
                        goodsLevel: $scope.qcOperation_goodsLevel,
                        qcRemark: $scope.qcOperation_qcRemark,
                        qcResult: $scope.qcOperation_qcResult,
                        qcOptions: operationMap,
                        otherRemark: $scope.qcOperation_otherRemark
                    };

                    $sync(window.BASEPATH + "/qc/order/qcOperation/saveOperationResultWithoutFile", "POST", {data:resultMap})
                        .then(function (data) {
                            setQcOperationsNull();
                            $scope.picUploadGrid.dataSource.read({});
                        }, function () {
                            $scope.picUploadGrid.dataSource.read({});
                        });
                    $scope.updateQcPopup.close();
                    setQcOperationsNull();
                }

                $scope.cancelCloseUpdate = function() {
                    $scope.updateQcPopup.close();
                    setQcOperationsNull();
                }

                function setQcOperationsNull() {
                    $scope.qcOperation_img = '';
                    $scope.qcOperation_qcOrderId = '';
                    $scope.qcOperation_type = '';
                    $scope.qcOperation_goodsName = '';
                    $scope.qcOperation_goodsDesc = '';
                    $scope.qcOperation_expressId = '';
                    $scope.qcOperation_goodsDesc = '';
                    $scope.qcOperation_goodsCode = '';
                    $scope.qcOperation_goodsPrice = '';
                    $scope.qcOperation_shopName = '';

                    $scope.qcOperation_goodsLevel = '';
                    $scope.qcOperation_goodsDetialUrl = '';
                    $scope.qcOperation_operations = '';
                    $scope.qcOperation_qcResult = '';
                    $scope.qcOperation_goodsDesc = '';
                    $scope.qcOperation_qcRemark = '';
                    $scope.qcOperation_otherRemark = '';
                    $scope.qcOperation_qcType = '';
                    $("#qcLevelDiv").hide();
                    $("#qcLevelRemarkDiv").hide();
                    operationMap = {};
                }
    }]);



})