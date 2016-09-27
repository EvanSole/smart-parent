define(['app', 'kendo', 'scripts/common/sync','scripts/common/wmsDataSource'],function(app, kendo){
    'use strict';
    app.factory('wmsLog', ['$http', '$q', 'sync','wmsDataSource', function ($http, $q, $sync,wmsDataSource) {
       var LogUtil = function(){
           this.operationLog = function(orderKey,ordertypeCode) {
               return WMS.GRIDUTILS.getGridOptions({
                   dataSource: wmsDataSource({
                       url: "/record/operation?orderKey="+orderKey+"&ordertypeCode="+ordertypeCode,
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
//                   pageable: true,
                   columns: [
                       { field: "orderKey", title: "单号", width: "56px" },
                       { field: "operationCode", title: "操作", width: "56px",template:WMS.UTILS.codeFormat('operationCode','OrderOperations') },
                       { field: "statusCode", title: "操作结果", width: "56px",template:WMS.UTILS.codeFormat('statusCode','OrderOperationStatus')},
                       { field: "description", title: "备注", width: "56px",template:function(dataItem) {return WMS.UTILS.tooLongContentFormat(dataItem,'description');}},
                       { field: "createUser", title: "创建人", width: "56px" },
                       { field: "createTime", title: "创建时间", width: "56px" ,template:WMS.UTILS.timestampFormat('createTime','yyyy/MM/dd HH:mm:ss')}
                   ]
               });
           };
       };
        return new LogUtil();
    }]);
});