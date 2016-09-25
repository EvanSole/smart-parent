define(['app'], function (app) {
    'use strict';
    app.filter('codeFormat', function () {
        return function (input, codeType) {
            var codeArr = window.WMS.CODE_SELECT_DATA[codeType];
            var txt = '';
            if (codeArr !== undefined) {
                for (var i = 0; i < codeArr.length; i++) {
                    var data = codeArr[i];
                    if (data.value == input) {
                        txt = data.key;
                    }
                }
            }
            return txt;
        };
    });

    app.filter('shopFormat', function () {
        return function (input) {
            var stArr = window.WMS.SHOP_DATA;
            var txt = input;
            if (stArr !== undefined) {
                for (var i = 0; i < stArr.length; i++) {
                    if (stArr[i].value == input) {
                        txt = stArr[i].key;
                    }
                }
            }
            return txt;
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
});