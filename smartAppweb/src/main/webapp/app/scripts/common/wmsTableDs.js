define('LocalTableDs',
    ['jquery', 'underscore','app/common/wmsUrl'],
    function($, _, WmsUrl){
        'use strict';
        var tableCache_ = {};
        var LocalTableDs = function(config) {
            var dataUrl = WmsUrl.get(config.name);
            var that = this;
            $.ajax({
                url: dataUrl,
                dataType: 'json',
                async: false
            }).done(function(content){
                that.datas = content;
            }).fail(function(e){
                console.log("load file " + dataUrl + " fail : " + e);
            });
        };
        LocalTableDs.prototype.toJSON = function() {
            return this.datas;
        };
        return function(tableName, useCache, async) {
            if (!async) async = false;
            if (useCache === undefined) useCache = true;
            if (!useCache || !_.has(tableCache_, tableName)) {
                tableCache_[tableName] = new LocalTableDs({
                    name : tableName
                });
            }
            return $.extend(true, {}, tableCache_[tableName]);
        };
    });
define('RemoteTableDs',
    ['jquery', 'underscore'],
    function($, _){
        'use strict';
         // todo
        var RemoteTableDs = function(config) {
            var dataUrl = 'http://localhost:8080/uc/module/left';
            var that = this;
            $.ajax({
                url: dataUrl,
                dataType: 'json',
                async: false
            }).done(function(content){
                that.datas = content;
            }).fail(function(e){
                console.log("load file " + dataUrl + " fail : " + e);
            });
        };
        RemoteTableDs.prototype.toJSON = function() {
            return this.datas;
        }
    });
define(['jquery', 'underscore', 'LocalTableDs', 'RemoteTableDs'],
    function($, _, LocalTableDs, RemoteTableDs){
        'use strict';
        return wmsConfig.isOffLine ? LocalTableDs : RemoteTableDs;
    });