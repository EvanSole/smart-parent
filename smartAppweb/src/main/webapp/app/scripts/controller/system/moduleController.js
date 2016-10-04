
define(['scripts/controller/controller','../../model/system/permissionModel'], function(controller, actionModel) {
    "use strict";
    controller.controller('authorModuleController',
        ['$scope', '$rootScope', 'sync','url', 'wmsDataSource','$timeout',
            function ($scope, $rootScope, $sync, $url, wmsDataSource, $timeout) {
                var authorModuleUrl = $url.authorModuleUrl;
                // 得到模块数据
                $sync(authorModuleUrl, "GET").then(function(response){
                  $scope.tree = [{name:"模块管理", show: true}];
                  $scope.tree[0].items = WMS.UTILS.processTreeData(response.result.rows, "id", "parentId", 0);
                });

                $scope.typeOptions = [
                    { label: 'Web', value: 'Web' },
                    { label: 'Rf', value: 'Rf' }
                ];
                // 详细权限表格数据源
                var detailDatasource = wmsDataSource({
                    url:authorModuleUrl + "/actions",
                    schema: {
                        model: actionModel
                    },
                    parseRequestData:function(data,method,transport){
                        if(method==='search'){
                            var module = $scope.module;
                            var mId = '';
                            if(module !== undefined){
                                mId = module.id;
                            }
                            data.moduleId=mId;
                        } else {
                            data.moduleId=$scope.module.id;
                        }

                        return data;
                    },
                    callback:{
                        create:function(){

                        }
                    }

                });
                var actionCol =  [
                    WMS.GRIDUTILS.CommonOptionButton(),
                    { editor: false, filterable: false, title: '操作名称', field: 'actionName', align: 'left', width: "150px"},
                    { editor: false, filterable: false, title: '操作类型', field: 'actionCode', align: 'left', width: "100px"},
                    { editor: false, filterable: false, title: 'url', field: 'url', align: 'left', width: "100px",
                        template: function (dataItem) {
                            return WMS.UTILS.tooLongContentFormat(dataItem, 'url');
                        }
                    },
                    { editor: false, filterable: false, title: 'http方法', field: 'httpMethod', align: 'left', width: "100px"},
                    { editor: false, filterable: false, title: '描述', field: 'description', align: 'left', width: "200px",
                        template: function (dataItem) {
                            return WMS.UTILS.tooLongContentFormat(dataItem, 'description');
                        }
                    },
                    { editor: false, filterable: false, title: '相关url及方法', field: 'relationUrl', align: 'left', width: "200px",
                        template: function (dataItem) {
                            return WMS.UTILS.tooLongContentFormat(dataItem, 'relationUrl');
                        }
                    }
                ];
                actionCol = actionCol.concat(WMS.UTILS.CommonColumns.defaultColumns);

                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: detailDatasource,
                    autoBind: false,
                    sortable: true,
                    height: 300,
                    pageable:false,
                    columns: actionCol,
                    editable: {
                        mode: "popup",
                        template:kendo.template($("#editPop-template").html())
                    },
                    dataBound: function(e) {
                      if ($scope.module && $scope.module.id) {
                        $(".k-grid-add").show();
                      } else {
                        $(".k-grid-add").hide();
                      }
                    },
                    toolbar: [{ text: "新增操作", name:"create"}]
                }, $scope);
                // 保存模块信息
                $scope.saveModule = function () {
                    if ($scope.module.id) {
                        $sync( authorModuleUrl, "PUT", {data: $scope.module}).then(function(xhr){

                        });
                    } else {
                        $sync(authorModuleUrl, "POST", {data: $scope.module}).then(function (xhr) {
                          $scope.module.id = xhr.result.id;
                          $scope.authorModuleGrid.dataSource.data([]);
                        });
                    }
                };
                // 动态修改树形中的名字
                $scope.changeModuleName = function(){
                  $scope.module.name = $scope.module.moduleName;
                };
                // 展开树形
                $scope.toggleView = function($event, data) {
                    $($event.target)
                    .toggleClass('fa-caret-down')
                    .siblings('ul')
                    .slideToggle();
                  data.show = !data.show;
                };
                // 选中某一模块从后台中取得相关信息
                $scope.selected = function($event, data) {
                  if (data.id) {
                    $sync( authorModuleUrl+ "/" + data.id, "GET", {})
                      .then(function(xhr){
                        $scope.module = xhr.result;
                        $scope.authorModuleGrid.dataSource.read();
                      });
                  } else {
                    $scope.module = data;
                    $scope.authorModuleGrid.dataSource.data([]);
                  }
                  $('.region-tree-list').find('li>span').removeClass('selected');
                  $($event.target).addClass('selected');
                  data.show = true;
                };
                // 删除某一模块
                $scope.delete = function($event, data, parent, $index) {
                  $.when(kendo.ui.ExtOkCancelDialog.show({
                      title: "确认",
                      message: "是否确定删除",
                      icon: 'k-ext-question' })
                  ).done(function(resp){
                      if (resp.button === "OK") {
                        if (data.id) {
                          $sync( authorModuleUrl+ "/" + data.id, "DELETE", {})
                            .then(function(xhr){
                              parent.splice($index, 1);
                            });
                        } else {
                          $scope.$apply(parent.splice($index, 1));
                        }
                      }
                    });
                };
                // 追加新模块
                $scope.add = function(data) {
                  data.show = true;
                  data.items.push({name: "新模块",moduleName:"新模块",parentId:data.id,items: []});
                };

            }]);



});