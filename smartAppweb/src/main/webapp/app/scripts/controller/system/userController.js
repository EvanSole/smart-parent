/**
 * Created by MLS on 15/3/9.
 */
define(['scripts/controller/controller',
    '../../model/author/userModel',
    '../../model/author/roleModel'], function(controller,userModel, roleModel) {
    "use strict";
    controller.controller('authorUserController',
        ['$scope', '$rootScope', 'sync', 'url','wmsDataSource',
            function($scope, $rootScope, $sync, $url,wmsDataSource) {
                var userUrl = $url.authorUserUrl,
                    userColumns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { title: '登录账号', field: 'loginName',align: 'left', width: "150px",filterable: {cell: {enabled: true,delay: 1500}}},
                        { title: '用户姓名', field: 'userName', align: 'left', width: "150px"},
                        { title: '电子邮箱', field: 'email', align: 'left', width: "150px"},
                        { title: '固定电话', field: 'telephone', align: 'left', width: "150px"},
                        { title: '移动电话', field: 'mobile', align: 'left', width: "150px"},
//                        { filterable: false, title: '所属部门代码', field: 'departmentCode', align: 'left', width: "100px"},
                        { filterable: false, title: '系统管理员', field: 'isAdmin', template: WMS.UTILS.checkboxDisabledTmp("isAdmin"), align: 'left', width: "100px"},
                        { filterable: false, title: '是否可用', field: 'isActive', template: WMS.UTILS.checkboxDisabledTmp("isActive"), align: 'left', width: "100px"},
                        { filterable: false, title: '是否批量扫描', field: 'isMutiScan', template:WMS.UTILS.checkboxDisabledTmp("isMutiScan"), align: 'left', width: "150px"}
//                        { filterable: false, title: '累计登录出错次数', field: 'failedTimes', align: 'left', width: "100px"},
//                        { filterable: false, title: '是否强制下线重登录', field: 'isKickOff', template: WMS.UTILS.checkboxTmp("isDel"), align: 'left', width: "100px"},
//                        { filterable: false, title: '系统授权码', field: 'sessionId', align: 'left', width: "100px"},
//                        { filterable: false, title: '多重登录', field: 'isallowMultiLogin', template: WMS.UTILS.checkboxTmp("isDel"), align: 'left', width: "100px"},
//                        { filterable: false, title: '是否删除', field: 'isDel', template:  WMS.UTILS.checkboxDisabledTmp("isDel"), align: 'left', width: "200px"}
                    ],
                    userRoleColumns = [
                        WMS.UTILS.CommonColumns.checkboxColumn,
                        { filterable: false, title: '角色名称', field: 'roleName', align: 'left', width: "130px"},
                        { filterable: false, title: '是否可用', field: 'isActive', template:WMS.UTILS.checkboxDisabledTmp("isActive"), align: 'left', width: "75px"},
//                        { filterable: false, title: '是否用复杂验证', field: 'isComplex', template:WMS.UTILS.checkboxDisabledTmp("isActive"), align: 'left', width: "130px"},
//                        { filterable: false, title: '密码最小长度(0表示不限制)', field: 'minLength', align: 'left', width: "130px"},
//                        { filterable: false, title: '允许出错次数(0表示不限制)', field: 'failedLimit', align: 'left', width: "130px"},
                        { editor:WMS.UTILS.columnEditor.hidden, filterable: false, title: '创建人', field: 'createUser', align: 'left',  width:"75px"} ,
                        { editor:WMS.UTILS.columnEditor.hidden, filterable: false, title: '创建时间', field: 'createTime', align: 'left',  width:"100px",
                        template: WMS.UTILS.timestampFormat("createTime")} ,
                        { editor:WMS.UTILS.columnEditor.hidden, filterable: false, title: '修改人', field: 'updateUser', align: 'left',  width:"75px"} ,
                        { editor:WMS.UTILS.columnEditor.hidden, filterable: false, title: '修改时间', field: 'updateTime', align: 'left',  width:"100px",
                            template: WMS.UTILS.timestampFormat("updateTime")}
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
                $scope.userRoleGridOptions = function(dataItem){
                    var userRoleUrl = userUrl + "/" + dataItem.id + "/role";
                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource:wmsDataSource({
                            url: userRoleUrl,
                            schema:{
                                model: roleModel.header
                            }
                        }),
                        widgetId:"userRoleWidget",
                        toolbar: [{
                            template: '<span class="k-button" id="saveUserRole" ng-click="saveUserRole()">保存</span>', className:"btn-auth-userRoleGrant"
                        }],
                        columns:userRoleColumns,
                        //selectable: "multiple, row",
                        dataBound: function(e){
                            var grid = this,
                                trs = grid.tbody.find(">tr");
                            _.each(trs, function(tr,i){
                                var record = grid.dataItem(tr);
                                if (record.isChecked === 1) {
                                    $(tr).find("[isCheck]").attr("checked",true);
                                    $(tr).addClass("k-state-selected");
                                }
                            });

                            $scope.saveUserRole = function(){
                                console.log("#saveUserRole click");
                                var userRoleGrid = this.userRoleGrid;
//                                var selectView = userRoleGrid.select();
                                var selectView = WMS.GRIDUTILS.getCustomSelectedData(userRoleGrid);
                                var allRows = userRoleGrid.table.find("tr").select();

                                var selectedDataArray = _.map(selectView, function(view) {
                                    return view.id;
                                });
                                var unSelectedDataArray = _.map(allRows, function(view){
                                    return userRoleGrid.dataItem(view).id;
                                });

                                var selectedDataStr = selectedDataArray.join(",");
                                var unSelectedDataStr = unSelectedDataArray.join(",");
                                $sync(userRoleUrl, "PUT", {
                                    data: {"selectIds":selectedDataStr, "unSelectIds":unSelectedDataStr},
                                    success: function(xhr){
                                        userRoleGrid.refresh();
                                    }
                                });
                            };
                        }
                    }, $scope);
                };
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
                    var condition = {"loginName":$scope.loginName,"userName":$scope.userName};
                    $scope.userGrid.dataSource.filter(condition);
                    $scope.userGrid.refresh();
                };


                $scope.storerOptios = function (dataItem) {
                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource: wmsDataSource({
                            url: $url.dataStorerUrl +"/user/storers/" + dataItem.id,
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
                        columns: storerColumns
                    }, $scope);
                };
                //分配结果列
                var storerColumns = [
                    { title: '商家编号', field: 'storerNo', align: 'left', width: "120px"},
                    { title: '商家简称', field: 'shortName', align: 'left', width: "120px"}
                ];


                $scope.warehouseOptios = function (dataItem) {
                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource: wmsDataSource({
                            url: $url.dataWarehouseUrl +"/user/warehouse/" + dataItem.id,
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
                //分配结果列
                var warehouseColumns = [
                    { title: '仓库编号', field: 'warehouseNo', align: 'left', width: "120px"},
                    { title: '仓库名称', field: 'warehouseName', align: 'left', width: "120px"},
                    { filterable: false, title: '仓库类型', field: 'typeCode', align: 'left', width: "120px", template: WMS.UTILS.codeFormat('typeCode', 'WarehouseType')}
                ];



                $scope.$on("kendoWidgetCreated", function (event, widget) {
                    if (widget.options !== undefined && widget.options.widgetId === 'userWidget') {

                        //提交操作
                        $(".k-grid-resetPwd").on('click', function (e) {
                            var authority = $rootScope.user.authority


                            if(!authority.isAdmin){
                                $.when(kendo.ui.ExtWaitDialog.show({
                                    title: "错误",
                                    message: '只有管理员可以重置密码'}));
                            }

                            var selectedData = WMS.GRIDUTILS.getCustomSelectedData($scope.userGrid);
                            var ids = [];
                            selectedData.forEach(function (value) {
                                ids.push(value.id);
                            });

                            if(ids.length != 1){
                                kendo.ui.ExtAlertDialog.showError("请选择一条数据");
                                return;
                            }

                            kendo.ui.ExtOkCancelDialog.show({
                                title: "确认",
                                message: "是否确定重置["+ selectedData[0].userName+"]的密码为默认密码！",
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