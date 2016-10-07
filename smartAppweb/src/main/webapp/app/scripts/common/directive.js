/****
 * 自定义指令库
 * rSelect :远程获取keyValues，数据来源于基础数据表,使用时先在urlMap里添加查询url
 * lSelect :本地获取keyValues,数据来源于数据字典表
 * wmsSelect :级联获取keyValues
 * wmsUiSelect :查询获取keyValues
 * wmsSearchButton
 * wmsResetButton
 * panelHeadingSearch
 * wmsDateTimePicker
 * wmsLabel
 * enterInput
 * wmsImport
 * jsWmsNumber
 */
define(['app', 'scripts/common/sync'], function (app) {
    "use strict";
    var urlMap = {
        warehouse: "index/warehouse",
        shop: "index/shop",
        zone: "index/zone/",
        location: "index/location"
    };
    app.directive('rSelect', ['sync', function ($sync) {
        var suffix = "_Scope";
        return {
            restrict: 'EA',
            scope: {},
            controller: function ($scope, $element) {
                var src = $element[0].attributes.src.value;
                var name = $element[0].attributes.name.value;
                var id = $element[0].attributes.id.value;
                var zero = $element[0].attributes.zero;
                var father = $element[0].attributes.father;
                var url = urlMap[src];
                $scope.selectChange = function (curId, toId) {
                    var fatherId = $("#" + curId).val();
                    var toObj = $("#" + toId);
                    if (!toObj || !toObj.attr("option")) {
                        toObj = $("[name='" + toId + "']");
                    }
                    var ngModel = toObj.attr("ng-model");
                    var option = toObj.attr("option");
                    var childSrc = toObj.attr("src");
                    var nextToId = toObj.attr("toid");
                    toObj.val("");
                    $scope.$$nextSibling[ngModel] = "";
                    if (fatherId === '') {
                        $scope.$parent[option] = null;
                        if (nextToId) {
                            $scope.selectChange(toId, nextToId);
                        }

                    } else {
                        $sync(window.BASEPATH + "/" + urlMap[childSrc] + "/" + fatherId, "GET", {wait: false})
                            .then(function (xhr) {
                                $scope.$parent[option] = xhr.result;
                            });
                        if (nextToId) {
                            $scope.selectChange(toId, nextToId);
                        }
                    }
                };
                var isHas = false;
                if ($scope.$parent.dataItem && typeof $scope.$parent.dataItem !== "string") {
                    if (name.indexOf(".") > 0) {
                        var nas = name.split(".");
                        isHas = $scope.$parent.dataItem[nas[0]][nas[1]];
                    } else {
                        isHas = $scope.$parent.dataItem[name];
                    }
                }
                if (!zero || ($scope.$parent.dataItem && isHas)) {
                    if (father) {
                        url = url + "/" + $scope.$parent.dataItem[father.value];
                    }
                    $sync(window.BASEPATH + "/" + url, "GET", {wait: false})
                        .then(function (xhr) {
                            if (_.isEmpty(xhr) || _.isEmpty(xhr.result)) {
                              return;
                            }
                            //$scope.$apply(function () {
                            var selectDatas = src;
                            var copyId = "";
                            if (id) {
                                copyId = id.replace(".", "_");
                                selectDatas += copyId + suffix;
                            } else {
                                selectDatas += suffix;
                            }
                            $scope.$parent[selectDatas] = xhr.result;
                            xhr = xhr.result;
                            if ($scope.$parent.dataItem) {
                                name = name.split(".");
                                for (var i = 0; i < xhr.length; i++) {
                                    if (name.length > 1) {
                                        if ($scope.$parent.dataItem[name[0]] && $scope.$parent.dataItem[name[0]][name[1]]) {
                                            if (xhr[i].value == $scope.$parent.dataItem[name[0]][name[1]]) {
                                                if (name[0] === 'query') {
                                                    $scope.$parent[name[0]][name[1]] = xhr[i].value;
                                                } else {
                                                    $scope["has_selected_" + src + copyId] = xhr[i];
                                                }
                                                break;
                                            }
                                        }
                                    } else {
//                                        console.log("bbbbbbb"+$scope.$parent.dataItem[name]+"--"+xhr[i].value);
                                        if (xhr[i].value == $scope.$parent.dataItem[name]) {
                                            $scope["has_selected_" + src + copyId] = xhr[i];
                                            break;
                                        }
                                    }
                                }
                            }
                            //});
                        });
                }
            },
            replace: true,
            template: function (tE, tA) {
                var selectDatas = tA.src;
                var copyId = "";
                if (tA.id) {
                    copyId = (tA.id).replace(".", "_");
                    selectDatas += copyId + suffix;
                } else {
                    selectDatas += suffix;
                }
                var name = tA.name;
                var id = tA.id;
                var ngChange = tA.ngChange;
                if (ngChange) {
                    ngChange = "ng-change='" + ngChange + "'";
                } else if (tA.toid) {
                    ngChange = "ng-change=selectChange('" + tA.id + "','" + tA.toid + "','" + selectDatas + "')";
                } else {
                    ngChange = "";
                }
                if (name.indexOf('query.') === 0) {
                    return "<select " + ngChange + " id='" + id + "' name='" + name + "' option=" + selectDatas + " ng-model='$parent." + id + "' class='ng-valid ng-dirty' ng-options='d.value as d.key for d in $parent." + selectDatas + "' ><option value=''>-- 请选择 --</option></select>";
                }
                return "<select " + ngChange + " id='" + id + "' name='" + name + "' option=" + selectDatas + " ng-model='has_selected_" + tA.src + copyId + "' ng-options='d.key for d in $parent." + selectDatas + " track by d.value' ><option value=''>-- 请选择 --</option></select>";
            }
        };
    }]).directive('lSelect', function () {
        var suffix = "_code_Scope";
        return {
            restrict: 'EA',
            scope: {},
            controller: function ($scope, $element) {
                var type = $element[0].attributes.src.value;
                var def;
                if ($element[0].attributes.default) {
                    def = $element[0].attributes.default.value;
                }
                var name = $element[0].attributes.name.value;
                $scope[type + suffix] = window.WMS.CODE_SELECT_DATA[type];
                $scope["has_selected_" + type] = "Handover";
                if (def) {
                    $.each(window.WMS.CODE_SELECT_DATA[type], function () {
                        if (def == this.value) {
                            $scope["has_selected" + type] = this;
                            return;
                        }
                    });
                }
            },
            replace: true,
            template: function (tE, tA) {
                var selectDatas = tA.src + suffix;
                var name = tA.name;
                var id = tA.id;
                var header = tA.header;
                var noheader = tA.noheader;
                if (!header) {
                    header = "-- 请选择 --";
                }
                if (noheader !== undefined && noheader !== 'undefined') {
                    noheader = "";
                } else {
                    noheader = "<option value=''>" + header + "</option>";
                }
                var ngModel = tA.ngModel;
                var ngInit = "";
                var disableFlag = false;
                if (name && name.indexOf("query.") === 0) {
                    return "<select id='" + id + "' name='" + name + "' ng-model='$parent." + tA.id + "' ng-options='d.value as d.key for d in " + selectDatas + "' >" + noheader + "</select>";
                }
                if (!ngModel) {
                    ngModel = "ng-model = 'has_selected" + tA.src + "'";
                    ngInit = "ng-init='has_selected" + tA.src + "=" + selectDatas + "[0]'";
                } else {
                    ngModel = "";
                }
                if (tA.disabled) {
                    disableFlag = tA.disabled;
                }
                return "<select  disabled＝'" + disableFlag + "' id='" + id + "' " + ngInit + "  name='" + name + "' " + ngModel + " ng-options='d.key for d in " + selectDatas + " track by d.value' >" + noheader + "</select>";
            }
        };
    }).directive('wmsSelect', ['sync', function ($sync) {
        return {
            restrict: 'EA',
            scope: {},
            link: function ($scope, $element, attr) {
                var parentScope = $scope.$parent,
                    url = window.BASEPATH + attr.src,
                    id = attr.id,
                    dataText = attr.text,
                    dataValue = attr.value,
                    dataNo = attr.no,
                    parentId = attr.parentId;
                var changeDataSource = function (url, parentValue) {
                    if (parentValue) {
                        url = url + parentValue;
                    }
                    $sync(url, "GET", {wait: false}).then(function (xhr) {
                        if (xhr == null || xhr.result == null) {
                            return;
                        }
                        var dataSource = xhr.result.rows;
                        var defaultOptions = {};
                        defaultOptions[dataText] = "-- 请选择 --";
                        defaultOptions[dataNo] = "";
                        defaultOptions[dataValue] = "";
                        dataSource.unshift(defaultOptions);
                        if (dataSource.length > 0 && !parentScope.dataItem[id]) {
                            parentScope.dataItem[id] = dataSource[0][dataValue];
                        }
                        $element.kendoDropDownList({
                            dataTextField: dataText,
                            dataValueField: dataValue,
                            headerTemplate: '<div class="dropdown-header">' +
                                '<span class="k-widget k-header cm1">代码</span>' +
                                '<span class="k-widget k-header cm2">名称</span>' +
                                '</div>',
                            template: '<span class="k-state-default cm1">#: data.' + dataNo + ' #</span>' +
                                '<span class="k-state-default cm2">#: data.' + dataText + ' #</span>',
                            dataSource: dataSource
                        });
                    });
                };
                if (parentId) {
                    var parentValue = parentScope.dataItem[parentId];
                    if (parentValue) {
                        changeDataSource(url, parentValue);
                    }
                    if ($("#" + attr.parentId)[0].classList.contains("ulSelectedW")) {
                        $scope.$parent.$watch(function(scope) { return scope[parentId] },
                            function(parentValue,oldValue) {
                                if (parentValue) {
                                    changeDataSource(url, parentValue);
                                }
                            }
                        );
                    }
                    else{
                        $("#" + attr.parentId).change(function (e) {
                            var parentValue = $(arguments[0].target).val();
                            if (parentValue) {
                                changeDataSource(url, parentValue);
                            } else {
                                $element.kendoDropDownList({
                                    dataTextField: dataText,
                                    dataValueField: dataValue,
                                    dataSource: new kendo.data.DataSource()
                                });
                            }
                        })
                    };
                } else {
                    changeDataSource(url, false);
                }
            },
            replace: true,
            template: function (tE, tA) {
                var name = tA.name,
                    id = tA.id;
                if (name.indexOf('query.') === 0) {
                    return "<select id='" + id + "' name='" + name + "' ng-model='$parent." + id + "'></select>";
                }
                return "<select id='" + id + "' name='" + name + "'></select>";
            }
        };
    }]).directive('wmsUiSelect', ['sync', function ($sync)  {
        var suffix = "_Scope";
        return {
            restrict: 'EA',
            scope: false,
            transclude: true,
            controller: function ($scope, $element) {
                var src = $element[0].attributes.src.value;
                var name = $element[0].attributes.getNamedItem("ui-select-name").value;
                var id = $element[0].attributes.getNamedItem("ui-select-id").value;
                var zero = $element[0].attributes.zero;
                var father = $element[0].attributes.father;
                var url = urlMap[src];
                //选择事件
                $scope.$parent[name + "Change"] = function ($item,$model) {
                    if($item === undefined)
                        return;
                    $scope.dataItem[name] = $item.value;
                    $scope.dataItem.set("dirty",true);
                    if (name && name.indexOf("query.") === 0) {}
                    else{ $scope.$parent[name]=$item.value;}
                };
                $scope.selectChange = function (curId, toId) {
                    var fatherId = $("#" + curId)[0].attributes.value.value;
                    var toObj = $("#" + toId);
                    if (!toObj || !toObj.attr("option")) {
                        toObj = $("[name='" + toId + "']");
                    }
                    var ngModel = toObj.attr("ng-model");
                    var option = toObj.attr("option");
                    var childSrc = toObj.attr("src");
                    var nextToId = toObj.attr("toid");
                    toObj.val("");
                    $scope.$parent.$$nextSibling[ngModel] = "";
                    if (fatherId === '') {
                        $scope.$parent[option] = null;
                        if (nextToId) {
                            $scope.selectChange(toId, nextToId);
                        }
                    } else {
                        $sync(window.BASEPATH + "/" + urlMap[childSrc] + "/" + fatherId, "GET", {wait: false})
                            .then(function (xhr) {
                                $scope.$parent[option] = xhr.result;
                            });
                        if (nextToId) {
                            $scope.selectChange(toId, nextToId);
                        }
                    }
                };
                //check exists
                var isHas = false;
                if ($scope.$parent.dataItem && typeof $scope.$parent.dataItem !== "string") {
                    if (name.indexOf(".") > 0) {
                        var nas = name.split(".");
                        isHas = $scope.$parent.dataItem[nas[0]][nas[1]];
                    } else {
                        isHas = $scope.$parent.dataItem[name];
                    }
                }
                if (!zero || ($scope.$parent.dataItem && isHas)) {
                    if (father) {
                        url = url + "/" + $scope.$parent.dataItem[father.value];
                    }
                    $sync(window.BASEPATH    + "/" + url, "GET", {wait: false})
                        .then(function (xhr) {
                            if (_.isEmpty(xhr) || _.isEmpty(xhr.result)) {
                                return;
                            }
                            //$scope.$apply(function () {
                                var selectDatas = src;
                                var copyId = "";
                                if (id) {
                                    copyId = id.replace(".", "_");
                                    selectDatas += copyId + suffix;
                                } else {
                                    selectDatas += suffix;
                                }
                                $scope.$parent[selectDatas] = xhr.result;
                                var nullData = {"key": "-- 请选择 --", "value": ""};
                                xhr = xhr.result;
                                xhr.unshift(nullData);
                                if ($scope.dataItem) {
                                    name = name.split(".");
                                    for (var i = 0; i < xhr.length; i++) {
                                        if (name.length > 1) {
                                            if ($scope.dataItem[name[0]] && $scope.dataItem[name[0]][name[1]]) {
                                                if (xhr[i].value == $scope.$parent.dataItem[name[0]][name[1]]) {
                                                    if (name[0] === 'query') {
                                                        $scope.$parent[name[0]][name[1]] = xhr[i].value;
                                                    } else {
                                                        $scope["has_selected_" + src + copyId] = xhr[i];
                                                    }
                                                    break;
                                                }
                                            }
                                        } else {
                                            if (xhr[i].value == $scope.dataItem[name]) {
                                                $scope["has_selected_" + src + copyId] = xhr[i];
                                                break;
                                            }
                                        }
                                    }
                              }
                          //}
                        });
                }
            },

            replace: true,
            template: function (tE, tA) {
                var selectDatas = tA.src;
                var copyId = "";
                var id = tA.uiSelectId;
                if (id) {
                    copyId = (id).replace(".", "_");
                    selectDatas += copyId + suffix;
                } else {
                    selectDatas += suffix;
                }
                var name = tA.uiSelectName;
                var onSelect = tA.onSelect;
                var ngModel = "";
                if (onSelect) {
                    onSelect = "on-select='" + onSelect + "'";
                } else {
                    onSelect = "";
                }
                var ngChange = tA.ngChange;
                if (ngChange) {
                    ngChange = "ng-change='" + ngChange + "' ";
                } else if (tA.toid) {
                    ngChange = "ng-change=selectChange('" + id+ "','" + tA.toid + "','" + selectDatas + "') ";
                } else {
                    ngChange = "";
                }
                if (name && name.indexOf("query.") === 0) {
                    ngModel = "$parent." + id;
                }
                else {
                    //TODO.此处DATA-BIND没有实际作用,以后考虑改为KENDO UI的方式来绑定
                    ngModel = "has_selected_" + tA.src + copyId + "' data-bind='value:" + id  +" ";
                }
                var ngDisabled = "";
                if (tA.ngDisabled && (tA.ngDisabled !== "")) {
                    ngDisabled = "ng-disabled='" + tA.ngDisabled + "'";
                }
                var header = "<span class='ng-pristine ng-valid' style='float: left'> ";
                var element = "";
                var footer = "<ui-select-match allow-clear placeholder='--请选择--' value={{$select.select.value}}>{{$select.selected.key}} " +
                    " </ui-select-match> " +
                    "<ui-select-choices repeat='wh.value as wh in $parent.$parent." + selectDatas + " | filter: $select.search'> " +
                    "<span ng-bind-html='wh.key | highlight: $select.search'></span> " +
                    "</ui-select-choices> " +
                    "</ui-select> " +
                    "</span>";
                element = "<ui-select value={{$select.selected.value}} " + ngDisabled + ngChange + onSelect+" id = '" + id + "' name='" + name + "' src='" + tA.src +"' ng-model ='"+ngModel +"' theme='select2'  class='ulSelectedW ng-isolate-scope ng-pristine' > ";

                return header + element + footer;
            }
        };
    }]).directive('a', function () {
        return {
            restrict: 'EA',
            link: function (scope, elem, attrs) {
                if (attrs['ng-click'] || attrs.href === '' || attrs.href === '#') {
                    elem.on('click', function (e) {
                        e.preventDefault();
                    });
                }
            }
        };
    }).directive('wmsSearchButton', function () {
        return {
            restrict: 'EA',
            scope: {},
            controller: function ($scope, $element) {
                $scope.searchGrid = function () {
//                    console.log($($element.context.parentElement);
                    var form = $element.parents("form");
                    var grid = $scope.$parent[form.attr("bind-ui")];
                    var params = {};
                    // form check
                    var formValidator = form.kendoValidator().data("kendoValidator");
                    if (!formValidator.validate()) {
                        return;
                    }
                    if ($scope.$parent.query !== undefined) {
                        params = $scope.$parent.query;
                    }
                    var checkSearchClient = true;
                    if ($scope.$parent.checkSearchClient){
                        checkSearchClient = $scope.$parent.checkSearchClient($scope.$parent.query);
                    }
                    if(!checkSearchClient){
                        return false;
                    }
                    if ($(form.find("input,select,checkbox")[0]).scope().query !== undefined) {
                        params = $(form.find("input,select,checkbox")[0]).scope().query;
                    }
                    if (!params) {
                        params = {};
                    }
                    params.isNotNull_ = "";
                    grid.dataSource.filter(params);
                    grid.refresh();

                };
            },
            template: function (tE, tA) {
                return "<button ng-click='searchGrid()' class='btn order-btn'><i class='fa fa-search faIcon'></i>查询</button>";
            }
        };
    }).directive('wmsResetButton', function () {
        return {
            restrict: 'EA',
            scope: {
//                customerResetFn: '@customerResetFn'
            },
            controller: function ($scope, $element) {

                $scope.reset = function () {
                    if (_.isFunction($scope.$parent.customerResetFn)) {
                        $scope.$parent.customerResetFn();
                        return;
                    }
                    var form = $element.parents("form");
                    if ($scope.$parent.query !== undefined) {
                        $scope.$parent.query = {};
                    }
                    if ($(form.find("input,select,checkbox")[0]).scope().query !== undefined) {
                        $(form.find("input,select,checkbox")[0]).scope().query = {};
                    }
                    $(form)[0].reset();//added by zw 清空radio
                };
            },
            template: function (tE, tA) {
                return "<a  ng-click='reset()' class='btn order-btn btn-cancel'><i class='fa fa-repeat faIcon'></i>重置</a>";
            }
        };
    }).directive('wmsDateTimePicker', ['$filter', function ($filter) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            template: function (tE, tA) {
                var ngModel = tA.id,
                    today = tA.today,
                    value = "",
                    dateFormat = tA.format || "yyyy/MM/dd 00:00:00";

                if (tA.isQuery) {
                    ngModel = "query." + tA.id;
                }
                return '<input id="' + tA.id + '" datepicker-popup="' + dateFormat + '" type="text" name=' + tA.id + ' is-open="' + tA.id + '_opened" ng-click="' + tA.id + '_opened = !' + tA.id + '_opened" ng-model="' + ngModel + '" today="' + today + '"/>';
            },
            link: function ($scope, $element, attrs) {
                var ngModel = attrs.ngModel, today = attrs.today;
                $scope.$watch(ngModel, function (newValue, oldValue) {
                    if ($scope.dataItem) {
                        if (newValue !== undefined || oldValue !== undefined) {
                            $scope.dataItem.set($element.attr("name"), $element.val());
                        } else {
                            var defaultValue = $scope.dataItem.get($element.attr("name"));
                            // TODO 特别处理，防止后台返回错误数据
                            if (defaultValue === "0") {
                                defaultValue = "";
                            }
                            if (today && today !== 'undefined' && !defaultValue && $scope.dataItem.isNew()) {
                                defaultValue = new Date();
                            }
                            $scope.dataItem.set($element.attr("name"), $filter("date")(defaultValue, "yyyy/MM/dd 00:00:00"));
                        }
                    } else if (attrs.isQuery) {
                        var query = $scope.query || {};
                        query[attrs.name] = $element.val();
                        $scope.query = query;
                    }
                });
            }
        };
    }]).directive('wmsLabel', function () {
        return {
            restrict: 'EA',
            link: function ($scope, $element, attr) {
                var source = attr.wmsLabel.split("."),
                    bindName = attr.bindName,
                    dataSource = window.WMS.CODE_SELECT_DATA[source[0]];
                _.each(dataSource, function (item) {
                    if (item.value === source[1]) {
                        $scope.dataItem[bindName] = source[1];
                        $element.html(item.key);
                        return;
                    }
                });

            }
        };
    }).directive('panelHeadingSearch', function () {
        return {
            restrict: 'EA',
            transclude: true,
            priority: 1000,
            template: function (tE, tA) {
                var bindUi = tA.bindUi;
                return '<div class="panel-heading m-b-5">' +
                    '<form class="pure-form pure-form-land" bind-ui="' + bindUi + '">' +

                    '<div class="panel-box-main">' +
                    '<div class="panel-box-left"><span ng-transclude></span>' +
                    '</div>' +
                    '<div class="panel-box-right">' +
                    '<wms-search-button></wms-search-button>' +
                    '<wms-reset-button></wms-reset-button>' +
                    '</div>' +
                    '</div>' +
                    '</form>' +
                    '<button class="btn m-b-ms w-ms btn-info up-down" id="J_seachToggle"><i class="fa fa-w fa-angle-double-down"></i>' +
                    '</button>' +
                    '</div><script></script>';
            }

        };
    }).directive('jsWmsNumber', function () {
      return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('input', function (e) {
              var array = $.trim($(this).val()).split('');
              array = _.filter(array, function (item) {
                if ($.trim(item) !== '') {
                  return !isNaN(item);
                }
              });
              $(this).val($.trim(array.join('')));
            });
        }

      };
    }).directive("enterInput",function(){
        return {
            replace:true,
            restrict:"A",
            scope:false,
            controller: function ($scope, $element) {
                $element[0].onkeyup = function(e){
                    if(e.keyCode === 13){
                        $scope[$element[0].attributes["enter-input"].value]();
                    }
                };
            }
        };
    }).directive('wmsImport', ['sync', 'initializeData','FileUploader', function ($sync, initializeData,FileUploader) {
        return {
            restrict: 'EA',
            scope: false,
            controller: function ($scope, $element) {
                var attr = $element[0].attributes;
                var title = attr.title.value;
                $scope.import = function(ev,grid,data) {
                    var url = window.BASEPATH+"/"+attr.url.value;
                    ev.preventDefault();
                    if(data&&data.id){
                        url += "?headerId="+data.id;
                    }
                    var targetScope = grid.$angular_scope,
                        importWindow = grid.$angular_scope.importWindow;
                    targetScope.fileName = '';
                    var uploader = targetScope.uploader = new FileUploader({
                        url: url,
                        alias: 'file',
                        removeAfterUpload: true
                    });
                    uploader.onAfterAddingFile = function (item) {
                        targetScope.fileName = item.file.name;
                        $('.js_operationResult').hide();
                    };
                    uploader.onSuccessItem = function(fileItem, response, status, headers) {
                        console.info('onSuccessItem', fileItem, response, status, headers);
                        if (response.suc) {
                            grid.dataSource.read();
                            importWindow.close();
                            kendo.ui.ExtAlertDialog.showError("导入成功");
                        } else {
                            if (typeof(response.result) == 'object') {
                                $('.js_operationResult').show();
                                var errLogData = _.map(response.result, function(record) {
                                    for (var key in record) {
                                        if (record.hasOwnProperty(key)) {
                                            return {id:key,message:record[key]};
                                        }
                                    }
                                });
                                $("#importListGrid").kendoGrid({
                                    columns: [
                                        {
                                            field: "id",
                                            filterable: false,
                                            width: 30,
                                            attributes: {style: 'text-align: center;'},
                                            title: 'ID'
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
                        width: "830",
                        title: title,
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
                        $.when(kendo.ui.ExtOkCancelDialog.show({
                                title: "确认/取消",
                                message: "确定导入？",
                                icon: "k-ext-question" })
                        ).done(function (response) {
                                if (response.button === "OK") {
                                    uploader.uploadAll();
                                }
                            });
                    };
                };
            },
            template: function (tE, tA) {
                return "<div id='importWindow' kendo-window='importWindow' k-visible='false' k-resizable='false'>"+
                    "</div>"+
                    "<script type='text/x-kendo-template' id='J_fileForm'>"+
                    "<form class='clearfix' method='post' enctype='multipart/form-data'>"+
                    " <div class='import-container clearfix'>"+
                    "       <div class='clearfix'>"+
                    "           <div class='import-rol dl-btn'>"+
                    "               <a href='/download/template/"+tA.templateName+"' class='btn mb-download'>"+
                    "                   <i class='fa fa-download faIcon'></i>"+
                    "               模板下载"+
                    "               </a>"+
                    "           </div>"+

                    "                                <div class='import-rol'>"+
                    "               <span class='upFile'>"+
                    "               选择导入文件"+
                    "                   <input class='files' type='file' name='file' nv-file-select='' uploader='uploader' accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'/>"+
                    "               </span>"+
                    "               <p class='import-file-name' ng-bind='fileName'></p>"+
                    "           </div>"+


                    "                                <div class='import-rol m-l-15'>"+
                    "               <button class='btn import-btn' type='button' value='上传文件' ng-click='uploadFile()' ng-disabled='!uploader.getNotUploadedItems().length'>"+
                    "                   <i class='fa fa-upload faIcon'></i>导入"+
                    "               </button>"+
                    "           </div>"+
                    "       </div>"+
                    "   </div>"+
                    "</form>"+
                    "<div class='import-error upFilesTest js_operationResult' style='display: none'>"+
                    "<div class='ie-header'><i class='fa fa-exclamation-circle faIcon'></i>异常结果</div>"+
                    "<div kendo-grid='importListGrid' id='importListGrid' options='importGridOptions'>"+
                    "</div>"+
                    "</div>"+
                    "</script>";
            }
        };
    }]);
});
