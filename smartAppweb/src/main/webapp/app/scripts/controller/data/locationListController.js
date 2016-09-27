

define(['scripts/controller/controller','scripts/model/data/zoneModel'], function(controller,zoneInfo) {
    "use strict";
    controller.controller('locationListController',
        ['$scope', '$rootScope', 'sync', 'url', 'FileUploader','wmsDataSource', 'wmsReportPrint',
            function($scope, $rootScope, $sync, $url, FileUploader, wmsDataSource, wmsReportPrint) {
                var locationUrl = $url.dataLocationUrl,
                    locationColumns = [
                        WMS.UTILS.CommonColumns.checkboxColumn,
                        WMS.GRIDUTILS.CommonOptionButton("location"),
                        { filterable: false, title: '库区', field: 'zoneId', template:WMS.UTILS.zoneNoFormat("zoneId"),align:'left', width:"100px"},
                        { filterable: false, title: '货位编号', field: 'locationNo', align:'left', width:"120px"},
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
                    locationDataSource = wmsDataSource({
                        url: locationUrl,
                        schema: {
                            model: zoneInfo.location
                            }
                    });
                locationColumns = locationColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.url = window.BASEPATH + "/location/import?zoneId=";
                $scope.locationGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: locationDataSource,
                    exportable: true,
                    toolbar: [{ name: "create", text: "新增", className:"btn-auth-add-location"},
                        {template:'<a class="k-button k-grid-custom-command" ng-click="locationPrint()" href="\\#">打印</a>',className:"btn-auth-print-location"},
                        {template:'<a class="k-button k-grid-custom-command" href="\\#" ng-click="import($event,locationGrid)">导入</a>',className:"btn-auth-import-location"},
                        {template:'<a class="k-button k-grid-custom-command" ng-click="batchDelete()" href="\\#">批量删除</a>', className:"btn-auth-location-batchDelete"}
                    ],
                    columns: locationColumns,
                    editable: {mode: "popup",window:{
                        width:"640px"
                    },
                    template: kendo.template($("#locationEditor").html())}
                }, $scope);


                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

                $scope.batchDelete = function(){
                    var locationGrid = $scope.locationGrid;
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

                $scope.print = function(){
                    console.log("print...");
                    var zoneGrid = this.zoneGrid;
                    var selectView = WMS.GRIDUTILS.getCustomSelectedData(zoneGrid);
                    var selectedDataArray = _.map(selectView, function(view) {
                        return view.id;
                    });
                    var selectDataIds = selectedDataArray.join(",");
                    if(selectDataIds === ""){
                        kendo.ui.ExtAlertDialog.showError("请选择要打印的数据");
                        return;
                    }
                    wmsReportPrint.printLocationByZoneIds(selectDataIds);
                };


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

                //导入货位模板
                $scope.import = function(ev,grid,data) {
//                  $scope.zonePopup.refresh().open().center();
                    ev.preventDefault();
                    var locationGrid = $scope.locationGrid,
                    targetScope = grid.$angular_scope,
                    importWindow = grid.$angular_scope.importWindow;
                    targetScope.fileName = '';

                  if (importWindow === undefined) {
                    console.warn("需要定义importWindow");
                  }
                  var uploader = targetScope.uploader = new FileUploader({
                    url: $scope.url,
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
                    width: "830",
                    title: "货位导入",
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
                      var zone = $("#zoneId").scope().$$childHead.has_selected_zonezoneId;
                      if(!zone){
                          kendo.ui.ExtAlertDialog.showError("请选择库区!");
                          return;
                      }
                        // 已经存在明细，提示是否覆盖
                        //if (locationGrid !== undefined && locationGrid.dataSource.data().length > 0) {
                          $.when(kendo.ui.ExtOkCancelDialog.show({
                              title: "确认/取消",
                              message: "确定导入？",
                              icon: "k-ext-question" })
                          ).done(function (response) {
                              if (response.button === "OK") {
                                  uploader.onBeforeUploadItem = function(item) {
                                      item.url = $scope.url+zone.value;
                                  } ;
                                  uploader.url += $scope.url+zone.value;
                                  targetScope.uploader.url = $scope.url+zone.value;
//                                  console.log(uploader);
                                  uploader.uploadAll();
                              }
                            });
                        //} else {
                         //   uploader.uploadAll();
                        //}
                  };
                };

            }]);

})