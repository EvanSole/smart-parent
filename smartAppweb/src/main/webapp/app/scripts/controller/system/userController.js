
define(['scripts/controller/controller', '../../model/system/userModel', '../../model/system/roleModel'],
    function(controller, userModel, roleModel) {
    "use strict";
    controller.controller('userController',
        ['$scope', '$rootScope', 'sync', 'url','wmsDataSource',
            function($scope, $rootScope, $sync, $url,wmsDataSource) {
                var userUrl = $url.authorUserUrl,
                    userColumns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { title: '登录账号', field: 'userName',align: 'left', width: "150px"},
                        { title: '用户姓名', field: 'realName', align: 'left', width: "150px"},
                        { title: '电子邮箱', field: 'email', align: 'left', width: "150px"},
                        { title: '固定电话', field: 'telephone', align: 'left', width: "150px"},
                        { title: '移动电话', field: 'mobile', align: 'left', width: "150px"},
                        { filterable: false, title: '系统管理员', field: 'isAdmin', template: WMS.UTILS.checkboxDisabledTmp("isAdmin"), align: 'left', width: "100px"},
                        { filterable: false, title: '是否可用', field: 'isActive', template: WMS.UTILS.checkboxDisabledTmp("isActive"), align: 'left', width: "100px"},
                    ],
                    userRoleColumns = [
                        WMS.UTILS.CommonColumns.checkboxColumn,
                        { filterable: false, title: '角色名称', field: 'roleName', align: 'left', width: "130px"},
                        { filterable: false, title: '是否可用', field: 'isActive', template:WMS.UTILS.checkboxDisabledTmp("isActive"), align: 'left', width: "75px"}
                    ],

                    userDataSource = wmsDataSource({
                        url: userUrl,
                        schema: {
                            model: userModel.header
                        }
                    });
                userColumns = userColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                userColumns.splice(0, 0, WMS.UTILS.CommonColumns.checkboxColumn);


                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    widgetId:"userWidget",
                    dataSource: userDataSource,
                    toolbar: [{ name: "create", text: "新增用户", className:"btn-auth-add"},
                        { name: "resetPwd", text: "重置密码", className:"btn-auth-resetPwd"}],
                    columns: userColumns,
                    editable:{
                        mode:"popup",
                        window: {
                            width: "600px"
                        },
                        template: kendo.template($("#userEditor").html())}
                }, $scope);
                $scope.search = function() {
                    var condition = {"userName":$scope.userName,"realName":$scope.realName};
                    $scope.userGrid.dataSource.filter(condition);
                    $scope.userGrid.refresh();
                };

                $scope.userRoleGridOptions = function(dataItem){
                    var userRoleUrl = userUrl + "/" + dataItem.id + "/role";
                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource:wmsDataSource({
                            url: userRoleUrl,
                            schema:{
                                model: roleModel.header
                            }
                        }),
                        editable: {
                            mode: "popup"
                        },
                        toolbar: [
                            { template:'<a class="k-button k-button-custom-command" ng-click="geantRole(dataItem)">分配角色</a>', className: "btn-auth-addWhUser"},
                            { template:'<a class="k-button k-button-custom-command" ng-click="batchDelete(this)">批量删除</a>', className: "btn-auth-batchDelete"}
                        ],
                        columns:userRoleColumns,
                    }, $scope);
                };

                $scope.geantRole = function(dataItem){
                    $scope.permissionPopup.refresh().open().center();
                    $scope.gridUUid = this.userRoleGrid;
                    var roleDataSource = wmsDataSource({
                        serverPaging:false,
                        url: userUrl+"/"+ dataItem.id +"/allocatable/role",
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "number", editable: false, nullable: true }
                                }
                            }
                        }
                    });
                    this.roleGrid.setDataSource(roleDataSource);
                    this.roleGrid.refresh();
                    $scope.userId = dataItem.id;
                };

                var allocatAbleUserColumns = [
                    WMS.UTILS.CommonColumns.checkboxColumn,
                    { filterable: false, title: '角色名称', field: 'roleName', align: 'left', width: "130px"},
                    { filterable: false, title: '是否可用', field: 'isActive', template:WMS.UTILS.checkboxDisabledTmp("isActive"), align: 'left', width: "75px"}
                ];

                $scope.roleGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: {},
                    pageable: false,
                    editable: false,
                    toolbar: [
                        { template:'<a class="k-button k-button-custom-command" ng-click="saveRole()">保存分配</a>'}
                    ],
                    columns: allocatAbleUserColumns,
                    filterable: true
                });


                //保存分配角色
                $scope.saveRole = function (dataItem){
                    var ids ="";
                    var selectedData = WMS.GRIDUTILS.getCustomSelectedData($scope.roleGrid);
                    for(var i=0;i<selectedData.length;i++){
                        ids += selectedData[i].id+",";
                    }
                    ids = ids.substring(0,ids.length-1);
                    if(ids === ""){
                        kendo.ui.ExtAlertDialog.showError("请至少选择一条数据.");
                        return;
                    }
                    var userId = $scope.userId;
                    var params={userId:userId,roleIds:ids};
                    $sync(userUrl+"/"+userId+"/allocatable/role","POST",{data: params}).
                    then(function(){
                        $scope.permissionPopup.close();
                        $scope.gridUUid.dataSource.read();
                    }) ;
                };
                //批量删除分配角色
                $scope.batchDelete = function(e){
                    var ids = "";
                    var selectedData = WMS.GRIDUTILS.getCustomSelectedData(e.userRoleGrid);
                    for(var i=0;i<selectedData.length;i++){
                        ids+=selectedData[i].id+",";
                    }
                    ids = ids.substring(0,ids.length-1);
                    var userId = e.dataItem.id;
                    if(ids ===""){
                        kendo.ui.ExtAlertDialog.showError("请至少选择一条数据.");
                        return;
                    }
                    $sync(userUrl +"/"+userId+ "/allocatable/role/" + ids, "DELETE")
                        .then(function (xhr) {
                            e.userRoleGrid.dataSource.read({});
                        }, function (xhr) {
                            e.userRoleGrid.dataSource.read({});
                        });
                };



                //用户所属仓库
                $scope.warehouseOptios = function (dataItem) {
                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource: wmsDataSource({
                            url: userUrl +"/"+dataItem.id+"/warehouse",
                            schema: {
                                model: {
                                    id: "id",
                                    fields: {
                                        id: {type: "number", editable: false, nullable: true }
                                    }
                                },
                                total: function (total) {
                                    return total.length > 0 ? total[0].total : 0;
                                }
                            }
                        }),
                        columns: warehouseColumns
                    }, $scope);
                };
                var warehouseColumns = [
                    { title: '仓库编号', field: 'warehouseNo', align: 'left', width: "120px"},
                    { title: '仓库名称', field: 'warehouseName', align: 'left', width: "120px"},
                    { filterable: false, title: '仓库类型', field: 'typeCode', align: 'left', width: "120px"}
                ];


                $scope.$on("kendoWidgetCreated", function (event, widget) {
                    if (widget.options !== undefined && widget.options.widgetId === 'userWidget') {
                        //提交操作
                        $(".k-grid-resetPwd").on('click', function (e) {
                            var authority = $rootScope.user.authority
                            if(!authority.isAdmin){
                                $.when(kendo.ui.ExtWaitDialog.show({
                                    title: "错误",
                                    message: '只有管理员可以重置密码!'}));
                            }
                            var selectedData = WMS.GRIDUTILS.getCustomSelectedData($scope.userGrid);
                            var ids = [];
                            selectedData.forEach(function (value) {
                                ids.push(value.id);
                            });
                            if(ids.length != 1){
                                kendo.ui.ExtAlertDialog.showError("只能请选择一条数据!");
                                return;
                            }

                            kendo.ui.ExtOkCancelDialog.show({
                                title: "确认",
                                message: "是否确定重置["+ selectedData[0].userName+"]的密码为默认密码?",
                                icon: 'k-ext-question'}
                            ).done(function (resp) {
                                if(resp.button === "OK"){
                                    $sync(userUrl+"/"+ids[0]+"/defaultPwd","PUT");
                                }
                            });


                        });
                    }
                });

            }]);

})