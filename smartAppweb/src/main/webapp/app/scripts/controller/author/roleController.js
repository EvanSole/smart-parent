/**
 * Created by MLS on 15/3/9.
 */
define(['scripts/controller/controller','../../model/author/roleModel'], function(controller,roleModel) {
    "use strict";
    controller.controller('authorRoleController',
        ['$scope', '$rootScope', 'sync', 'url','wmsDataSource',
            function($scope, $rootScope, $sync,$url,wmsDataSource) {
                var roleUrl = $url.authorRoleUrl,
                    roleColumns = [
                        { title: '操作', command:[
                            { name: "grant", text:"授权", className: "btn-auth-grant", click:function(e){
                                  $scope.grantFunc(e,this);
                            } },
                            { name: "edit", className: "btn-auth-edit",
                                text: { edit: "编辑", cancel: "取消", update: "保存" } },
                            WMS.GRIDUTILS.deleteButton
                        ],
                            width:"240px"
                        },
                        { title: '角色名称', field: 'roleName',align: 'left', width: "150px",
                            filterable: {cell: {
                                enabled: true,
                                delay: 1500
                            }}
                        },
                        { filterable: false, title: '是否可用', field: 'isActive', template:WMS.UTILS.checkboxDisabledTmp("isActive"), align: 'left', width: "75px"}
                    ],
                    roleDataSource =  wmsDataSource({
                        url: roleUrl,
                        schema: {
                            model: roleModel.header
                        }
                    });
                roleColumns = roleColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions =  WMS.GRIDUTILS.getGridOptions({
                    dataSource: roleDataSource,
                    toolbar: [{ name: "create", text: "新建角色", className: "btn-auth-add"}],
                    columns: roleColumns,
                    editable: {
                        mode: "popup",
                        window: {
                            width: "500px"
                        },
                        template: kendo.template($("#roleEditor").html())
                    }
                }, $scope);

                var detailColumns=[
                    {filterable: false, title: '用户姓名', field: 'userName', align: 'left', width: "200px"},
                    {filterable: false, title: '登录账号', field: 'loginName', align: 'left', width: "200px"},
                    { filterable: false, title: '系统管理员', field: 'isAdmin', template: WMS.UTILS.checkboxDisabledTmp("isAdmin"), align: 'left', width: "100px"}
                ];

                $scope.roleUserOptions = function (dataItem) {
                    var defaultOptions = {
                        dataSource: wmsDataSource({
                            url: roleUrl + "/" + dataItem.id + "/user",
                            pageSize: 100
                        }),
                        columns: detailColumns
                    };

                    return WMS.GRIDUTILS.getGridOptions(defaultOptions, $scope);
                };

                $scope.grantFunc=function(e, gridWidgets){
                    e.preventDefault();
                    var dataItem = gridWidgets.dataItem($(e.currentTarget).closest("tr"));
                    $scope.grantPop.selectDataItem = dataItem;
                    $scope.grantPop.content(kendo.template($("#grantPop-template").html()));
                    $scope.grantPop.center().open();

                };

                $scope.search = function() {
                    var condition = {"roleName":$scope.roleName};
                    $scope.roleGrid.dataSource.filter(condition);
                    $scope.roleGrid.refresh();
                };


            }]).controller('authorRoleGrantController',
        ['$scope', '$rootScope', 'url','sync',
            function ($scope, $rootScope, $url,$sync) {
                var parent = $scope.$parent;
                $scope.model = parent.grantPop.selectDataItem;

                var authorModuleUrl = $url.authorRoleUrl;
                var roleId =$scope.model.id;
                $scope.naviOptions = {
                    dataTextField: "name",
                    checkboxes: {
                        checkChildren: true
                    }
//                    ,
//                    check: function(e) {
//                        console.log("Checking", e.node);
//                    }
                };

                $.ajax({
                    url: authorModuleUrl+"/"+roleId+"/module",
                    dataType: 'json',
                    async: true
                }).done(function(content){
//                        var naviDatasource = new kendo.data.HierarchicalDataSource({
//                            data: kendo.observableHierarchy(
//                                WMS.UTILS.processTreeData(content.result, "id", "parentId", 0))
//                        });
                    if ($scope.tree) {
                        $scope.tree.dataSource.data(kendo.observableHierarchy(
                            WMS.UTILS.processTreeData(content.result.rows, "id", "parentId", 0, true)));
                        $scope.tree.expand(".k-item");

                    } else {
                        $scope.treeData = kendo.observableHierarchy(
                            WMS.UTILS.processTreeData(content.result.rows, "id", "parentId", 0, true));
                    }



                }).fail(function(e){
                    console.log("load file " + authorModuleUrl + " fail : " + e);
                });
                $scope.saveRoleAction = function(){

                    var treeObj = $scope.tree;
                    var data = treeObj.dataSource.view();
                    $scope.selData=[];
                    $scope.getCheckedNode(data);
                    var authorModuleUrl = $url.authorRoleUrl;
                    var roleId;
                    $sync(authorModuleUrl+"/"+roleId+"/module",
                        "POST",
                        {
                            data: {
                                roleId:$scope.model.id,
                                actions: _.uniq($scope.selData)
                            }
                    }).then(function(){
                            $scope.closePop();
                    });
                };

                $scope.expandAll = function() {
                    $scope.tree.expand(".k-item");
                };
                $scope.collapseAll = function() {
                    $scope.tree.collapse(".k-item");
                };

                $scope.getCheckedNode=function(data){
                    for(var i = 0;i < data.length;i++){
                        var value = data[i];
                        if(value.checked){
                            $scope.selData.push(value.id);
                        }

                        if(value.items !== undefined && value.items.length > 0){
                            if (hasCheckChildren(value.items)) {
                                $scope.selData.push(value.id);
                            }
                            $scope.getCheckedNode(value.items);
                        }
                    }

                };
                function hasCheckChildren(children) {
                  var has = false;
                  _.each(children, function(child){
                    if (child.checked) {
                      has = true;
                    }
                    if (!has && child.items !== undefined && child.items.length > 0) {
                      has = hasCheckChildren(child.items);
                    }
                    if (has) {
                      return has;
                    }
                  });

                  return has;
                }
                $scope.closePop = function(){
                    parent.grantPop.close();
                };

            }]);


})