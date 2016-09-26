/**
 * Created by lykos on 15/4/1.
 */
define(['app', 'kendo', 'scripts/common/sync','scripts/common/wmsDataSource'],function(app, kendo){
    'use strict';
    app.factory('wmsLog', ['$http', '$q', 'sync','wmsDataSource', function ($http, $q, $sync,wmsDataSource) {
       var LogUtil = function(){
           this.operationLog = function(orderKey) {
               return WMS.GRIDUTILS.getGridOptions({
                   dataSource: wmsDataSource({
                       url: "/wmsLog/" + orderKey,
                      // serverPaging:false,
//                       pageSize: 5,
                       schema: {
                           model: {
                               id:"id",
                               fields: {
                                   id: {type:"number", editable: false, nullable: true },
                                   createTime:{type:"number"},
                                   updateTime:{type:"number"}
                               }
                           },
                           total: function(total) {
                               return total.length > 0 ? total[0].total : 0;
                           }
                       }
                   }),
//                 pageable: true,
                   columns: [
                       { field: "businessId", title: "单号", width: "100px" },
                       { field: "businessType", title: "业务类型", width: "150px", template: WMS.UTILS.statesFormat('businessType', 'BussessLogTypeEnum') },
                       { field: "optType", title: "操作类型", width: "150px", template: WMS.UTILS.statesFormat('optType', 'OptTypeEnum') },
                       { field: "description", title: "操作描述", width: "200px", template:function(dataItem) {return WMS.UTILS.tooLongContentFormat(dataItem,'description');}},
                       { field: "optUserName", title: "操作人", width: "100px" },
                       { field: "created", title: "创建时间", width: "150px", template:WMS.UTILS.timestampFormat('created','yyyy/MM/dd HH:mm:ss')}
                   ]
               });
           };
       };
        return new LogUtil();
    }]);
});