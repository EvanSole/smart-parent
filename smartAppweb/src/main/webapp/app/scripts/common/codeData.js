define(['app'], function (app) {
    'use strict';
    app.factory('initializeData', ['sync', function ($sync) {
        return {
            init: function (funcCallBack) {
                $sync(window.BASEPATH + "/code/all/details", "GET", {wait: false})
                    .then(function (xhr) {
                        if (xhr.result) {
                            var option = {};
                            for (var key in xhr.result) {
                                var codeDetail = xhr.result[key];
                                if (codeDetail) {
                                    var descOpt = [];
                                    for (var i = 0; i < codeDetail.length; i++) {
                                        var codeValue = codeDetail[i].codeValue;
                                        var codeName = codeDetail[i].codeName;
                                        var objectCode = {};
                                        objectCode.key = codeName;
                                        objectCode.value = codeValue;
                                        descOpt[i] = objectCode;
                                    }
                                    option[key] = descOpt;
                                }
                            }
                            window.WMS.CODE_SELECT_DATA = option;
                            funcCallBack();
                        }
                    })
                    .then(function () {
                        if (window.WMS.WAREHOUSE_DATA === undefined) {
                            $sync(window.BASEPATH + "/index/warehouse", "GET", {wait: false}).then(function (xhr) {
                                if (xhr.result) {
                                    window.WMS.WAREHOUSE_DATA = xhr.result;
                                }
                            });
                        }
                    })
            }
        }
    }]);
});