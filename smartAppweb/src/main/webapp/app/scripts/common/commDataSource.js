define(['app','kendo','sync'], function (app,kendo) {
    "use strict";
    app.factory('wmsDataSource', ['$http', '$q', 'sync', 'url', function ($http, $q, $sync, url) {
        var omitKeys = ["filter", "skip", "sort", "take"];
        /**
         * 正式环境用数据交换器
         * @param options
         */
        var WmsOnlineTransport = function (options) {
            this.url = options.url;
            this.idPro = options.idPro;
            this.otherData = options.otherData;
            this.parseRequestData = options.parseRequestData;
            this.filter = options.filter;
            this.callback = options.callback || {};
        };
        WmsOnlineTransport.prototype.read = function (options) {
            var transport = this,
                parentDs = this.parentDs;

            var paramData = options.data;
            if (_.isFunction(transport.parseRequestData)) {
                paramData = transport.parseRequestData(paramData, "search");
            }
            var filter = paramData.filter !== undefined ? paramData.filter.filters[0] : undefined || this.filter;
            if (filter) {
                this.filter = filter;
                $.each(this.filter, function (i, v) {
                    if ($.trim(v) !== "") {
                        paramData[i] = v;
                    }
                });
            }
            if (_.isArray(options.data.sort) && !_.isEmpty(options.data.sort)) {
                paramData.sortKey = paramData.sort[0].field;
                paramData.asc = paramData.sort[0].dir === "asc" ? "true" : "false";
            }
            var requestData = _.omit(paramData, omitKeys);
            $sync(transport.url, "GET", { data: requestData, wait:false } )
                .then(function (responseData) {
                    var data=[];
                    if(responseData.result){
                        data = responseData.result.rows;
                    }
                    data = _.map(data, function (record) {
                        record.total = responseData.result.total;
                        return record;
                    });
                    options.success(data);
                });
        };
        WmsOnlineTransport.prototype.create = function (options) {
            var transport = this,
                parentDs = this.parentDs;
            if (this.otherData) {
                $.extend(true,options.data, this.otherData);
            }
            var paramData = options.data;
            if (_.isFunction(transport.parseRequestData)) {
                paramData = transport.parseRequestData(paramData, "create");
            }
            var $q = $sync(transport.url, "POST",{ data: paramData } );
            if (_.isFunction(transport.callback.create)) {
                $q.then(function (xhr) {
                    transport.callback.create(xhr, options.data);
                }).then(function (xhr) {
                    parentDs.read();
                });
            } else {
                $q.then(function (xhr) {
                    parentDs.read();
                });
            }
        };
        WmsOnlineTransport.prototype.update = function (options) {
            var transport = this,
                parentDs = this.parentDs;
            var idPro = "id";
            if(transport.idPro){
                idPro = transport.idPro;
            }
            var paramData = options.data;
            if (_.isFunction(transport.parseRequestData)) {
                paramData = transport.parseRequestData(paramData, "update");
            }
            var $q = $sync(transport.url + "/" + options.data[idPro], "PUT", { data: paramData } );
            if (_.isFunction(transport.callback.update)) {
                $q.then(function (xhr) {
                    transport.callback.update(xhr, paramData);
                })
                    .then(function (xhr) {
                        options.success();
                    });
            } else {
                $q.then(function (xhr) {
                    options.success();
                });
            }

        };
        WmsOnlineTransport.prototype.destroy = function (options) {
            // 逻辑上根据后台返回结果决定是否删除，因此把改方法的请求移动到preDestroy中
            options.success();
        };
        WmsOnlineTransport.prototype.preDestroy = function (data) {
            var transport = this,
                parentDs = this.parentDs;
            var $q = $sync(transport.url, "DELETE", {data: data.id});
            if (_.isFunction(transport.callback.destroy)) {
                $q.then(function (xhr) {
                    transport.callback.destroy(xhr, data);
                }).then(function (xhr) {
                    parentDs.remove(data);
                });
            } else {
                $q.then(function (xhr) {
                    parentDs.remove(data);
                });
            }
        };

        var WmsDataSource = kendo.data.DataSource.extend({
            init: function (options) {
                var trans = {},
                    customerOptions = {autoSync: false};
                customerOptions.transport = new WmsOnlineTransport(options);
                _.defaults(options, customerOptions);

                kendo.data.DataSource.fn.init.call(this, options);
            }
        });
        var defaultOptions = {
            pageSize: 30,
            serverPaging: true,
            serverFiltering: true
//            ,serverSorting: true
        };
        return function DsFactory(options) {
            var ds;
            _.defaults(options, defaultOptions);

            var total = function (total) {
                return total.length > 0 ? total[0].total : 0;
            };
            if (options.schema === undefined) {
                options.schema = {
                    total: total
                };
            } else {
                options.schema.total = total;
            }
            ds = new WmsDataSource(options);
            ds.options.transport.parentDs = ds;
            return ds;
        };
    }]);
});