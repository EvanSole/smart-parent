

define(['scripts/controller/controller',
    'scripts/model/data/zoneModel'], function(controller,zoneInfo) {
    "use strict";
    controller.controller('dataZoneController',
        ['$scope', '$rootScope', 'sync', 'url', 'FileUploader','wmsDataSource', 'wmsReportPrint',
            function($scope, $rootScope, $sync, $url, FileUploader, wmsDataSource, wmsReportPrint) {
                var locationUrl = $url.dataLocationUrl;
                var zoneUrl = $url.dataZoneUrl,
                    zoneColumns = [
                        WMS.UTILS.CommonColumns.checkboxColumn,
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { title: '仓库名称', field: 'warehouseId', align: 'left', width: "120px",template:WMS.UTILS.whFormat},
                        { title: '区域编号', field: 'zoneNo', align:'left', width:"120px"},
                        { title: '区域类型', field: 'typeCode',align:'left',width:"120px",template: WMS.UTILS.zoneTypeFormat("typeCode")},
                        { title: '优先级', field: 'priority', align: 'left', width: "120px"},
                        { title: '描述', field: 'description', align: 'left', width: "130px"},
                        { title: '可售', field: 'isOnsale',template: WMS.UTILS.checkboxDisabledTmp("isOnsale"), align: 'left', width: "130px"},
                        { title: '可用', field: 'isActive',template: WMS.UTILS.checkboxDisabledTmp("isActive"), align: 'left', width: "110px"}
                    ],
                    locationColumns = [
                        WMS.UTILS.CommonColumns.checkboxColumn,
                        WMS.GRIDUTILS.CommonOptionButton("location"),
                        { filterable: false, title: '货位编号', field: 'locationNo', align:'left', width:"100px"},
                        { filterable: false, title: '货架类型', field: 'typeCode',align:'left',width:"100px",template: WMS.UTILS.codeFormat("typeCode", "LocationType")},
                        { filterable: false, title: '存货分类', field: 'classCode',align:'left',width:"100px",template: WMS.UTILS.codeFormat("classCode", "LocationClass")},
                        { filterable: false, title: '存放方式', field: 'categoryCode',align:'left',width:"100px",template: WMS.UTILS.codeFormat("categoryCode", "LocationCategory")},
                        { filterable: false, title: '拣货次序', field: 'pickupSeq',align:'left',width:"100px"},
                        { filterable: false, title: '区域', field: 'area', align:'left', width:"100px"},
                        { filterable: false, title: '通道', field: 'channel', align:'left', width:"100px"},
                        { filterable: false, title: '层位', field: 'storey', align:'left', width:"100px"},
                        { filterable: false, title: '允许多批次混放', field: 'isMultilot',template: WMS.UTILS.checkboxDisabledTmp("isMultilot"),align:'left',width:"130px"},
                        { filterable: false, title: '允许多SKU混放', field: 'isMultisku',template: WMS.UTILS.checkboxDisabledTmp("isMultisku"),align:'left',width:"130px"},
                        { filterable: false, title: '描述', field: 'description', align: 'left', width: "100px"},
                        { filterable: false, title: '是否默认', field: 'isDefault',template: WMS.UTILS.checkboxDisabledTmp("isDefault"), align:'left', width:"100px"},
                        { filterable: false, title: '可用', field: 'isActive',template: WMS.UTILS.checkboxDisabledTmp("isActive"), align: 'left', width: "100px"}
                    ],
                    zoneDataSource = wmsDataSource({
                        url: zoneUrl,
                        schema: {
                            model:zoneInfo.zone
                        }
                    });
                zoneColumns = zoneColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                locationColumns = locationColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.zoneGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: zoneDataSource,
                    toolbar: [{ name: "create", text: "新增", className:"btn-auth-add"}
//                        {template:'<a class="k-button k-grid-custom-command" ng-click="print()" href="\\#">打印</a>', className:"btn-auth-print"}
                    ],
                    columns: zoneColumns,
                    editable: {mode: "popup",window:{
                        width:"640px"
                    },
                        selectable: "multiple, row",
                        template: kendo.template($("#zoneEditor").html())}
                }, $scope);



                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

                $scope.batchDelete = function(){
                    var locationGrid = this.locationGrid;
                    var selectedData = WMS.GRIDUTILS.getCustomSelectedData(locationGrid);
                    var ids = [];
                    selectedData.forEach(function (value) {
                        ids.push(value.id);
                    });
                    var id = ids.join(",");
                    $sync(locationUrl + "/batch/" + id, "DELETE")
                        .then(function (xhr) {
                            locationGrid.dataSource.read({});
                        }, function (xhr) {
                            locationGrid.dataSource.read({});
                        });
                };

//                $scope.print = function(){
//                    console.log("print...");
//                    var zoneGrid = this.zoneGrid;
//                    var selectView = WMS.GRIDUTILS.getCustomSelectedData(zoneGrid);
//                    var selectedDataArray = _.map(selectView, function(view) {
//                        return view.id;
//                    });
//                    var selectDataIds = selectedDataArray.join(",");
//                    if(selectDataIds === ""){
//                        kendo.ui.ExtAlertDialog.showError("请选择要打印的数据");
//                        return;
//                    }
//                    wmsReportPrint.printLocationByZoneIds(selectDataIds);
//                };


                $scope.locationPrint = function(){
                    console.log("locationPrint...");
                    var locationGrid = this.locationGrid;
                    var selectView = WMS.GRIDUTILS.getCustomSelectedData(locationGrid);
                    var selectedDataArray = _.map(selectView, function(view) {
                        return view.id;
                    });
                    var selectDataIds = selectedDataArray.join(",");
                    if(selectDataIds === ""){
                        kendo.ui.ExtAlertDialog.showError("请选择要打印的数据");
                        return;
                    }
                    wmsReportPrint.printLocationByLocationIds(selectDataIds);

                };

                $scope.import = function(ev, grid, data) {
                  ev.preventDefault();
                  var locationGrid = this.locationGrid,
                    targetScope = grid.$angular_scope,
                    importWindow = grid.$angular_scope.importWindow;
                  targetScope.fileName = '';

                  if (importWindow === undefined) {
                    console.warn("需要定义importWindow");
                  }
                  var uploader = targetScope.uploader = new FileUploader({
                    url: window.BASEPATH + "/location/import?zoneId=" + data.id,
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
                      locationGrid.dataSource.read();
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
                    width: "630",
                    title: "单据导入",
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
                        if (locationGrid !== undefined && locationGrid.dataSource.data().length > 0) {
                          $.when(kendo.ui.ExtOkCancelDialog.show({
                              title: "确认/取消",
                              message: "确定导入？",
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

            }]);

})