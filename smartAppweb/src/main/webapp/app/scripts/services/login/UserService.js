
define(['scripts/services/services'], function(services) {
    "use strict";

    services.factory('UserInterceptor',["$q","$rootScope","$location",function ($q,$rootScope,$location) {
        //用户权限验证拦截器
        return {
            response: function (result) {
                return result;
            },
            responseError: function (response) {
                console.warn('Failed with http', (response.message || response.status), 'status');
                if (response.status == 403) {
                    console.warn('Forbidden, need login to auth');
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    }]);

    services.factory('UserService', ["$q","$rootScope","$http","$window","$location","sync","url",function ($q,$rootScope,$http,$window,$location,sync,url) {

        var userLogin = function(username,password,tenantNo,captcha,remember){
            var deferred = $q.defer();
            $http({
                 method : 'POST',
                 url : url.loginUrl,
                 data : $.param({"userName":username,"password":password,tenantNo:tenantNo,rememberMe:remember,captcha:captcha}), // pass in data as strings
                 // set the headers so angular passing info as form data (not request payload)
                 headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
             }).then(function(resultDatas) {
                // if successful, bind success message to message
                if(resultDatas.data.suc==true) {
                    var userInfo = {
                        tenantNo: resultDatas.data.result.tenantNo,
                        userName: resultDatas.data.result.userName
                    };
                    $rootScope.user = userInfo;
                    $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
                }
                deferred.resolve(resultDatas.data);
                //$location.path("/login");
            },function(resultDatas){
                // if not successful, bind errors to error variables
                deferred.reject(resultDatas.data);
            });
            return deferred.promise;
        }

        var userLogout = function(){
            var deferred = $q.defer();
            $http({
                method: "GET",
                url: url.logoutUrl
            }).then(function(result) {
                $window.sessionStorage["userInfo"] = null;
                deferred.resolve(result);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        var userModifyPassword = function(username,oldPassword,newPassword){

        }


        return {
            login :function (username,password,tenantNo,captcha,remember) {
               return userLogin(username,password,tenantNo,captcha,remember);
            },
            logout:function(){
               return userLogout();
            },
            modifyPassword :function(username,oldPassword,newPassword){
                userModifyPassword(username,oldPassword,newPassword);
            }

        }
    }]);

})