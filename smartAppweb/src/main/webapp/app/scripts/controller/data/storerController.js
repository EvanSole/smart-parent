define(['scripts/controller/controller','../../model/data/storerModel'], function(controller,storerModel) {
    "use strict";
    controller.controller('dataStorerController',
        ['$scope', '$rootScope', '$http', 'url','wmsDataSource','wmsLog', 'sync',
            function($scope, $rootScope, $http, $url, wmsDataSource, wmsLog, $sync) {
                var storerUrl     = $url.dataStorerUrl,
                    storerColumns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { filterable: false, title: '商家编号', field: 'storerNo', align: 'left', width: "120px"},
                        { filterable: false, title: '商家简称', field: 'shortName', align: 'left', width: "120px"},
                        { filterable: false, title: '商家全称', field: 'longName', align: 'left', width: "120px"},
                        { filterable: false, title: '商家类型', field: 'typeCode', align: 'left', width: "120px",template:WMS.UTILS.codeFormat('typeCode','StorerType')},
                        { filterable: false, title: '是否可用', field: 'isActive', align: 'left',  width:"150px",template: WMS.UTILS.checkboxDisabledTmp("isActive")}
                    ],
                    userStoreColumns = [
                        WMS.GRIDUTILS.deleteOptionButton("detail"),
                        { filterable: false, title: '登入账号', field: 'loginName', align: 'left', width: "100px"},
                        { filterable: false, title: '用户名称', field: 'userName', align: 'left', width: "100px"}
                    ],
                    userColumns = [
                        { filterable: false, title: '登入账号', field: 'loginName', align: 'left', width: "120px"},
                        { filterable: false, title: '用户名称', field: 'userName', align: 'left', width: "120px"}
                    ],
                    storerDataSource = wmsDataSource({
                        url: storerUrl,
                        schema: {
                            model:storerModel.header
                        }
                    });
                userColumns = userColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                userColumns.splice(0, 0, WMS.UTILS.CommonColumns.checkboxColumn);
                storerColumns = storerColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                userStoreColumns.splice(0, 0, WMS.UTILS.CommonColumns.checkboxColumn);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: storerDataSource,
                    toolbar: [
                        { name: "create", text: "新增商家", className:"btn-auth-add"}
                    ],
                    columns: storerColumns,
                    editable: {mode: "popup", window: {
                        width: "640px"
                    }, template: kendo.template($("#storerEditor").html())},
                    filterable: true
                }, $scope);
                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;

                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

                $scope.detailOptions = function(dataItem) {
                    return WMS.GRIDUTILS.getGridOptions({
                        dataSource: wmsDataSource({
                            url: storerUrl + "/" + dataItem.id+"/user",
                            schema: {
                                model: {
                                    id: "id",
                                    fields: {
                                        id: {type: "number", editable: false, nullable: true }
                                    }
                                }
                            }
                        }),
                        editable: {mode: "popup"},
                        toolbar: [
                            { template:'<a class="k-button k-button-custom-command" ng-click="permission(dataItem)">新增权限</a>', className:"btn-auth-saveUser"},
                            { template:'<a class="k-button k-button-custom-command" ng-click="batchDelete(this)">批量删除</a>', className: "btn-auth-batchDelete"}
                        ],
                        columns: userStoreColumns
                    }, $scope);
                };

                $scope.permission = function(e){
                    $scope.permissionPopup.refresh().open().center();
                    $scope.gridUUid = this.storerDetailGrid;
                    var userDataSource = wmsDataSource({
                        serverPaging:false,
                        url: "/storer/"+ e.id +"/userStorerCan",
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "number", editable: false, nullable: true }
                                }
                            }
                        },
                        pageSize: 30
                    });
                    this.userGrid.setDataSource(userDataSource);
                    this.userGrid.refresh();
                    $scope.storerId = e.id;
                };

                $scope.userGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: {},
                    toolbar: [
                        { template:'<a class="k-button k-button-custom-command" ng-click="saveUser()">保存权限</a>'}
                    ],
                    columns: userColumns,
                    filterable: true
                }, $scope);

                $scope.saveUser = function (){
                    var ids="";
                    var selectedData = WMS.GRIDUTILS.getCustomSelectedData($scope.userGrid);
                    for(var i=0;i<selectedData.length;i++){
                        ids+=selectedData[i].id+",";
                    }
                    ids=ids.substring(0,ids.length-1);
                    var storerId = $scope.storerId;
                    var params={storerId:storerId,userIds:ids};
                    $sync("/storer/"+storerId+"/user","POST",{data: params}).then(function(){
                        $scope.permissionPopup.close();
                        $scope.gridUUid.dataSource.read();
                    });
                };


                //批量删除权限
                $scope.batchDelete = function(e){
                    var ids = "";
                    var selectedData = WMS.GRIDUTILS.getCustomSelectedData(e.storerDetailGrid);
                    for(var i=0;i<selectedData.length;i++){
                        ids+=selectedData[i].id+",";
                    }
                    ids = ids.substring(0,ids.length-1);

                    $sync(window.BASEPATH + "/storer/user/" + ids, "DELETE")
                        .then(function (xhr) {
                            e.storerDetailGrid.dataSource.read({});
                        }, function (xhr) {
                            e.storerDetailGrid.dataSource.read({});
                        });


                };


            }
        ]
    );

});
