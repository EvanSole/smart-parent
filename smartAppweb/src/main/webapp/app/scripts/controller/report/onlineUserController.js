/**
 * Created by xiagn on 15/4/1.
 */
define(['scripts/controller/controller'], function (controller, sku) {
    "use strict";

    controller.controller('onlineUserController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource','$http',
            function ($scope, $rootScope, $sync, $url, wmsDataSource,$http) {

                var url = "/author/user/online",
                    cols = [
                        { title: '操作', command: [
                            { name: "clearLogin", template: "<a  class='k-button k-button-icontext k-grid-edit' href='\\#' ng-click='clearLogin(this);' ><span class='k-icon k-edit'></span>清除登录</a>",
                                className: "btn-auth-clearLogin" }

                        ],
                            width: "70px"
                        },
                        { field: 'loginName', title: '登陆名', filterable: false, align: 'left', width: '80px'},
                        { field: 'userName', title: '用户名', filterable: false, align: 'left', width: '80px'},
                        { field: 'cliIp', title: '用户ip', filterable: false, align: 'left', width: '100px'},
                        { field: 'loginTime', title: '登陆时间', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.timestampFormat("loginTime")},
                        { field: 'lastOperateTime', title: '最后操作时间', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.timestampFormat("lastOperateTime")},
                        { field: 'source', title: '登录来源', filterable: false, align: 'left', width: '100px'},
                        { field: 'tenantId', title: 'tenantId', hidden:true, filterable: false, align: 'left', width: '100px'},
                        { field: 'sessionKey', title: 'session', hidden:true, filterable: false, align: 'left', width: '100px'},
                        { field: 'svrIp', title: '服务器ip', filterable: false, align: 'left', width: '100px'}
                    ],
                    dataSource = wmsDataSource({
                        url: url,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: { type: "number", editable: false, nullable: true }
                                }
                            },
                            parse: function (data) {
                                return _.map(data, function (record) {
                                    record.activeQty = record.onhandQty - record.allocatedQty;
                                    return record;
                                });
                            }

                        }
                    });


                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: dataSource,
                    columns: cols,
                    editable: false
                }, $scope);


                $scope.clearLogin = function (data) {
                    $.when(kendo.ui.ExtOkCancelDialog.show({
                        title: "确认",
                        message: "是否确定清除登录记录",
                        icon: 'k-ext-question' })
                    ).done(function(resp){
                        if (resp.button === "OK") {
                            var sessionKey = data.dataItem.sessionKey;
                            if(sessionKey.indexOf(".") != -1){
                                sessionKey = sessionKey.split("-")[0] +"*";
                            }
                            var obj= sessionKey+"_"+data.dataItem.loginName+"_"+data.dataItem.tenantId;

                            $sync(window.BASEPATH + "/author/user/online", "DELETE",{data: obj}).then(function(xhr){
                                $scope.onlineUserGrid.dataSource.read();
                            });
                        }
                    });

                };

            }]);

})