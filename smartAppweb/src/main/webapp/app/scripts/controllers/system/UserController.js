
define(['scripts/controllers/controllers','scripts/models/system/userModel','scripts/services/services'], function(controller,userModel) {
    "use strict";
    controller.controller('UserController',['$scope','$rootScope','$state', 'sync', 'url','commonDataSource', 
        function ($scope, $rootScope,$state, $sync, $url, commonDataSource ) {

            console.log(" UserController ... ");

            var userUrl = $url.userUrl,
                userColumns = [
                    GLOBAL.GRIDUTILS.CommonOptionButton(),
                    {filterable: false, title: '登录名', field: 'userName', align: 'left', width: "150px"},
                    {filterable: false, title: '用户名', field: 'realName', align: 'left', width: "150px"}
                ],
                userDataSource = commonDataSource({
                    url: userUrl,
                    schema: {
                        model: userModel.user
                    }
                });

            userColumns = userColumns.concat(GLOBAL.UTILS.CommonColumns.defaultColumns);
            $scope.mainGridOptions = GLOBAL.GRIDUTILS.GetGridOptions({
                dataSource: userDataSource,
                toolbar: [
                    {name: "create", text: "新增", className: "btn-auth-add"}
                ],
                columns: userColumns,
                editable: {mode: "popup", window: {
                    width: "620px"
                }, template: kendo.template($("#user-kendo-template").html())}
            }, $scope);


    }])
})