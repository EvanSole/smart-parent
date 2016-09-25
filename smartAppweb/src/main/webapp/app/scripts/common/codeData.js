/***
 * 初始化数据,对应 t_ionic_code_header 、 t_ionic_code_detail
 */
define(['app'], function (app) {
    'use strict';
     app.factory('initializeData', ['sync','url', function ($sync , $url) {
        return {
            init: function (callback) {
                 return $sync($url.codeDataUrl, "GET", {wait: false})
                    .then(function (xhr) {
                        if (xhr.result) {
                            var option = {};
                            for (var key in xhr.result) {
                                var codeDetail = xhr.result[key];
                                if (codeDetail) {
                                    var opt = [];
                                    for (var i = 0; i < codeDetail.length; i++) {
                                        var isDefault = codeDetail[i].isDefault;
                                        var codeValue = codeDetail[i].codeValue;
                                        var codeName = codeDetail[i].codeName;
                                        var o = {};
                                        o.key = codeName;
                                        o.value = codeValue;
                                        //o.isDefault = isDefault;
                                        opt[i] = o;
                                    }
                                    option[key] = opt;
                                }
                            }
                            window.WMS.CODE_SELECT_DATA = option;
                            callback();
                        }
                    })
            }
        };
     }]);
});