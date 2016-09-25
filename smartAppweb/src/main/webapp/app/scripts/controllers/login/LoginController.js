
define(['scripts/controllers/controllers','scripts/services/services'], function(controller) {
    "use strict";
    controller.controller('LoginController',function ($scope, $rootScope, $state, UserService) {

        $scope.currentUser = null;

        //刷新验证码图片
        $(function(){
            $('#validatePic').click(function (){
                $(this).attr('src', '../validate.jpg?' + Math.floor(Math.random()*100) );
            })
        });

        //Enter
        $('.login-form input').keypress(function(e) {
            if (e.which == 13) {
                $scope.login();
            }
        });
        //用户登陆
        $scope.login = function(){
            console.log(" user login ... ");
            var errorMsg = "";
            var username = $scope.user.username;
            var password = $scope.user.password;
            var tenantNo = $scope.user.tenantNo;
            var remember = $scope.remember;
            var captcha = $("#validateCode").val();//验证码
            if(tenantNo == "" || tenantNo == undefined){
                errorMsg += "Tenant is required.";
                $scope.loginMessage = errorMsg;
                $scope.isShow = true;
                $("#InfoMessage").css('display','block');
                return false;
            }
            if(username == "" || username == undefined){
                errorMsg += "Username is required.";
                $scope.loginMessage = errorMsg;
                $scope.isShow = true;
                $("#InfoMessage").css('display','block');
                return false;
            }
            if(password == "" || password == undefined){
                errorMsg += "Password is required.";
                $scope.loginMessage = errorMsg;
                $scope.isShow = true;
                $("#InfoMessage").css('display','block');
                return false;
            }
            $("#InfoMessage").removeClass("alert-danger").addClass("alert-success");

            //login
            var promise = UserService.login(username, password, tenantNo, captcha, false);
            promise.then(function(data) {
                if(data.suc == true) {
                    $scope.loginMessage = "登录成功,正在跳转中...";
                    $scope.isShow = true;
                    $("#InfoMessage").css('display', 'block');
                    //$location.path("/index");
                    $state.go("index");
                }else{
                    $scope.loginMessage = data.message;
                    $scope.isShow = true;
                    $("#InfoMessage").css('display', 'block');
                    $("#login_validate").css('display', 'block');
                    return false;
                }
            });
        };

        //退出登陆
        $scope.logout = function(){
            console.log(" user logout ... ");
            var promise = UserService.logout();
            promise.then(function(data) {
               $state.go("login");
            });
        }

    });
})