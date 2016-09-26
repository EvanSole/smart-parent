define(['app'], function (app) {
    'use strict';
    app.filter('statesFormat', function () {
        return function (input, codeType) {
            var codeArr = window.WMS[codeType];
            var txt = '';

            if (codeArr !== undefined) {
                for (var i = 0; i < codeArr.length; i++) {
                    var data = codeArr[i];
                    if (data.value == input) {
                        txt = data.description;
                    }
                }
            }
            return txt;
        };
    });
    
    
    app.filter('orderUserFormat',function(){
        return function(input){
            var users = window.QC.ORDER_USER;
            if(users[input] != undefined){
                return users[input]
            }
            
            return input;
        }
    });

    app.filter('dateFilter', function () {
        return function (input) {
            if(input == 0){
                return null;
            }else{
                return input * 1000;
            }

            return input;
        };
    });

    app.filter('yesOrNoFormat', ['$filter', function ($filter) {
        return function (input) {
            var txt = "否";
            if (input === '1' || input === true) {
                txt = "是";
            }
            return txt;
        };
    }]);

    app.filter('dataIgnore', ['$filter', function ($filter) {
        return function (input) {
            if(input === '1970-01-01 08:00:00'){
                return "";
            }
            return input;
        };
    }]);
});