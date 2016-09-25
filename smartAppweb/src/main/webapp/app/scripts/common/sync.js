/****
 * sync类，用来处理请求
 * underscore --> '_' , JavaScript 工具库，它提供了一整套函数式编程的实用功能
 ***/
define(['app', 'jquery', 'underscore'],function(app, $, _ ){
    "use strict";
    app.factory('sync', ['$http', '$q','$rootScope', 'url', function ($http, $q, $rootScope, urlConst) {
        function parseData(data) {
            var paramData = _.clone(data);
            _.each(_.keys(paramData),function(key){
                if (_.isObject(paramData[key]) &&
                    !_.isDate(paramData[key])) {
                    paramData[key] = parseData(paramData[key]);
                } else {
                    paramData[key] = parseBooleanToByte(paramData[key]);
                    var upKey = key.toUpperCase();
                    if (upKey.indexOf("TIME") >=0 || upKey.indexOf("DATE") >=0) {
                        paramData[key] = parseDateToLong(paramData[key]);
                    }
                }
            });
            return paramData;
        }
        function parseBooleanToByte(value) {
            if(value === true) {
                return 1;
            } else if (value === false){
                return 0;
            } else {
                return value;
            }
        }
        function parseDateToLong(value) {
            if (!value) {
                return value;
            }
            var longValue = value;
            if (_.isFunction(value.getTime)) {
                return value.getTime();
            } else {
                try{
                    var a=value.split(" ");
                    var d=a[0].split("/");

                    if (a.length>1) {
                        var t=a[1].split(":");
                        longValue= new Date(d[0],(d[1]-1),d[2],t[0],t[1],t[2]).getTime();
                    } else if (d.length === 3) {
                        longValue= new Date(d[0],(d[1]-1),d[2]).getTime();
                    }

                } catch(exception) {
                    return value;
                }
            }
            return longValue;
        }
        return function (url, method, options) {
            var defaultOptions = {
                url: url,
                method: method,
                cache: false,
                responseType: "json",
                wait : true,
                headers: {
                    'Accept': 'application/json, text/javascript',
                    'Content-Type': 'application/json; charset=utf-8',
                    'X-Requested-With' : 'XMLHttpRequest'
                }
            };
            return (function() {
                // 如果没有进行特殊设置则使用默认设置
                _.defaults(options || (options = {}), defaultOptions);

                if (options.data !== null && options.data !== undefined) {
                    var paramData = parseData(options.data);
                    if(method === "GET"){
                        options.params = _.omit(paramData, function(value, key, object) {
                            return _.isUndefined(value) || (_.isEmpty(value) && !_.isNumber(value));
                        });
                    }else if (method === "DELETE"){
                        options.url = options.url + "/" + paramData;
                    }else{
                        options.contentType = 'application/json';
                        options.data = JSON.stringify(paramData);
                    }
                }
                var deferred = $q.defer();
                if (options.wait) {
                    var timer = setTimeout(function(){
                        kendo.ui.ExtWaitDialog.show({
                            title: "处理中",
                            message: "数据处理中,请稍后..." });
                    },1000);
                }
                $http(options).success(function(data, status, headers, config) {
                    if (options.wait) {
                        window.clearTimeout(timer);
                        kendo.ui.ExtWaitDialog.hide();
                    }
                    if (data === undefined) {
                        deferred.reject(data);
                    } else if(!data.suc) {
                        if (data.resultType === "Confirm") {
                            $.when(kendo.ui.ExtOkCancelDialog.show({
                                    title: "确认",
                                    message: data.message,
                                    icon: 'k-ext-question' })
                            ).then(function(resp){
                                    if (resp.button === 'OK') {
                                        $rootScope.$broadcast('confirmOK',data);
                                    }
                                    deferred.reject(data);
                                });
                        } else {
                            if("1"===data.errorLevel){
                                var message = "<span style='color: red;font-size: 20px;'>"+data.message+"</span>";
                                $.when(kendo.ui.ExtAlertDialog.show({
                                    title: "<span style='color: red;font-size: 20px;'>错误</span>",
                                    message: message,
                                    resizable:true,
                                    height:"auto",
                                    icon: 'k-ext-error' })).done(function (resp) {
                                    if (resp.button === "OK") {
                                        deferred.reject(data);
                                        if (resp.button === 'OK') {
                                            $rootScope.$broadcast('errorOK', data);
                                        }
                                    }
                                });
                                $("#extAlertDialog").css("padding-bottom","40px");
                                setTimeout(function(){
                                    $("#extAlertDialog").focus();

                                },500);
                            }else {
                                $.when(kendo.ui.ExtAlertDialog.show({
                                    title: "错误",
                                    message: data.message,
                                    icon: 'k-ext-error' })).done(function (resp) {
                                    if (resp.button === "OK") {
                                        deferred.reject(data);
                                        if (resp.button === 'OK') {
                                            $rootScope.$broadcast('errorOK', data);
                                        }
                                    }
                                });
                            }
                        }
                    } else {

                        switch (data.resultType) {
                            case "Popup":
                                $.when(kendo.ui.ExtWaitDialog.show({
                                        title: "提示",
                                        message: data.message })
                                ).done(function () {
                                        setTimeout(function () {
                                            kendo.ui.ExtWaitDialog.hide();
                                        }, 2000);
                                    });
                                break;
                            case "Toasts":
                                $.when(kendo.ui.ExtWaitDialog.show({
                                        title: "提示",
                                        message: data.message })
                                ).done(function () {
                                        setTimeout(function () {
                                            kendo.ui.ExtWaitDialog.hide();
                                        }, 2000);
                                    });
                                break;
                            case "Confirm":
                                $.when(kendo.ui.ExtOkCancelDialog.show({
                                        title: "确认",
                                        message: data.message,
                                        icon: 'k-ext-question' })
                                ).then(function(resp){
                                        if (resp.button === 'OK') {
                                            $rootScope.$broadcast('confirmOK',data);
                                        }
                                    });
                                break;
                            case "Data":
                                break;
                        }
                    }

                }).error(function(data, status, headers, config) {
                    if (options.wait) {
                        window.clearTimeout(timer);
                        kendo.ui.ExtWaitDialog.hide();
                    }
                    if(status === 403){
                        $.when(
                            kendo.ui.ExtAlertDialog.show({
                                title: "错误",
                                message: '您的会话已经失效，即将返回到登陆页！',
                                icon: 'k-ext-error' })
                        ).then(function(resp){
                                if (resp.button === 'OK') {
                                    $rootScope.$broadcast('event:loginRequired');
                                }
                            });
                    }else if(status === 401){
                        kendo.ui.ExtAlertDialog.show({
                            title: "错误",
                            width:400,
                            message: '您无权访问该资源!['+url+']',
                            icon: 'k-ext-error' });
                    }else if(status === 500){
                        kendo.ui.ExtAlertDialog.show({
                            title: "错误",
                            width:400,
                            message: '服务端错误',
                            icon: 'k-ext-error' });
                    }
                    console.error("status:" + status);
                    deferred.reject(data);
                });
                return deferred.promise;
            }());
        };

    }]);
});

 