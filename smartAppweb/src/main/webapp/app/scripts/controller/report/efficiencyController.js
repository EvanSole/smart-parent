/**
 * Created by MLS on 15/3/31.
 */

define(['scripts/controller/controller'], function (controller) {
    "use strict";
    controller.controller('efficiencyController',
        ['$scope', '$rootScope', '$http', 'url', 'wmsDataSource', 'wmsLog', 'sync', '$filter',
            function ($scope, $rootScope, $http, $url, wmsDataSource, wmsLog, $sync, $filter) {

                $scope.setDefaultTime = function(){
                    //赋值时间默认值
                    var today = new Date();
                    $scope.query = {};
                    $scope.query.startTime =  $filter("date")(new Date(), "yyyy/MM/dd 00:00:00");
                    $scope.query.endTime =  $filter("date")(today.setTime(today.getTime() + 1000*60*60*24), "yyyy/MM/dd 00:00:00");
                };

                $scope.setDefaultTime();

                var headerUrl = $url.reportEfficiencyControllerUrl,
                    headerColumns = [
                        { title: '操作', command: [
                            { name: "serachDetail", text: "详细", className: "btn-auth-detail", click: function (e) {
                                $scope.searchDetail(e,this);
                            } }
                        ],
                            width: "120px"
                        },
                        { filterable: false, title: '工段', field: 'sectionType', align: 'left', template: WMS.UTILS.codeFormat('sectionType', 'Efficiency'), width: "100px"},
                        { filterable: false, title: '统计开始时间', field: 'startTime', align: 'left', width: "200px;"},
                        { filterable: false, title: '统计结束时间', field: 'endTime', align: 'left', width: "200px;"},
                        { filterable: false, title: '作业时长（小时）', field: 'workingTime', align: 'left', width: "150px;"},
                        { filterable: false, title: '作业量', field: 'workload', align: 'left', width: "120px;"},
                        { filterable: false, title: '作业效率（件/小时）', field: 'workingEfficiency', align: 'left', width: "180px;"}

                    ],
                    headerDataSource = wmsDataSource({
                        url: headerUrl,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "number", editable: false, nullable: true }
                                }
                            }
                        },
                        parseRequestData:function(data){
                            data.startTime = $scope.query.startTime;
                            data.endTime = $scope.query.endTime;
                            return data;
                        }
                    });


                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    widgetId: "header",
                    exportable: true,
                    dataSource: headerDataSource,
                    columns: headerColumns,
                    //autoBind: false,
                    dataBound: function (e) {
                    }
                }, $scope);
                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;

                //计算时间差
                $scope.setTime = function(type){
                    var now = new Date();
                    switch(type){
                        case "today":
                            break;
                        case "week":
                            now.setTime(now.getTime() - 1000*60*60*24*6)
                            break;
                        case "month":
                            now.setTime(now.getTime() - 1000*60*60*24*29)
                            break;
                    }
                    //7.结束时间，假设今天是28号。当设置今天、一个月、一周时，结束时间默认为29日0点，这样保证工作时长没有X.99的小数，且更精确。若用户将结束时间手工选择18号，则显示18号0点，查询结果不包含18号0点后的数据（即18号当天数据）。 WMST-1217
                    var today = new Date();
                    $scope.query.startTime =  $filter("date")(now, "yyyy/MM/dd 00:00:00");
                    $("#startTime").val($scope.query.startTime);
                    $scope.query.endTime =  $filter("date")(today.setTime(today.getTime() + 1000*60*60*24), "yyyy/MM/dd 00:00:00");
                    $("#endTime").val($scope.query.endTime);
                }


                var detailColumns = [
                    { filterable: false, title: '作业人员', field: 'userName', align: 'left', width: "200px"},
                    { filterable: false, title: '开始作业时间', field: 'startTime', align: 'left', width: "200px;"},
                    { filterable: false, title: '结束作业时间', field: 'endTime   ', align: 'left', width: "200px;"},
                    { filterable: false, title: '作业时长（小时）', field: 'workingTime', align: 'left', width: "200px;"},
                    { filterable: false, title: '作业量', field: 'workload', align: 'left', width: "200px;"},
                    { filterable: false, title: '作业效率（件/小时）', field: 'workingEfficiency', align: 'left', width: "200px;"}
                ];
                var packDetailColumns = [
                    { filterable: false, title: '作业人员', field: 'userName', align: 'left', width: "200px"},
                    { filterable: false, title: '开始作业时间', field: 'startTime', align: 'left', width: "200px;"},
                    { filterable: false, title: '结束作业时间', field: 'endTime   ', align: 'left', width: "200px;"},
                    { filterable: false, title: '作业时长（小时）', field: 'workingTime', align: 'left', width: "200px;"},
                    { filterable: false, title: '作业量', field: 'workload', align: 'left', width: "200px;"},
                    { filterable: false, title: '订单数量', field: 'orderQty', align: 'left', width: "200px;"},
                    { filterable: false, title: '作业效率（件/小时）', field: 'workingEfficiency', align: 'left', width: "200px;"}
                ];
                var pickingColumn = [
                    { filterable: false, title: '波次号', field: 'wareId', align: 'left', width: "200px"},
                    { filterable: false, title: '波次总商品数', field: 'totalQty', align: 'left', width: "200px"},
                    { filterable: false, title: '开始作业时间', field: 'startTime', align: 'left', width: "200px;"},
                    { filterable: false, title: '结束作业时间', field: 'endTime   ', align: 'left', width: "200px;"},
                    { filterable: false, title: '作业时长（小时）', field: 'workingTime', align: 'left', width: "200px;"},
                    { filterable: false, title: '作业量', field: 'workload', align: 'left', width: "200px;"},
                    { filterable: false, title: '作业效率（件/小时）', field: 'workingEfficiency', align: 'left', width: "200px;"},
                    { filterable: false, title: '作业人员', field: 'userName', align: 'left', width: "200px"}
                ];
                $scope.detailGridOptions = WMS.GRIDUTILS.getGridOptions({
                    widgetId: "detail",
                    exportable: true,
                    toolbar: [
                        {template: '<a class="k-button k-grid-print" ng-click="print()" href="\\#">打印</a>', className: "btn-auth-print"}
                    ],
                    dataSource: new kendo.data.DataSource({
                        data: []
                    }),
                    height:"100%",
                    columns: detailColumns,
                    dataBound: function (e) {
                    }
                }, $scope)

                $scope.formatDate=function(date){
                    var myyear = date.getFullYear();
                    var mymonth = date.getMonth()+1;
                    var myweekday = date.getDate();

                    if(mymonth < 10){
                        mymonth = "0" + mymonth;
                    }
                    if(myweekday < 10){
                        myweekday = "0" + myweekday;
                    }
                    return (myyear+"-"+mymonth + "-" + myweekday);
                }

                $scope.searchDetail = function (e,widgets) {
                    e.preventDefault();
                    var dataItem = widgets.dataItem($(e.currentTarget).closest("tr"));
                    var detailUrl = $url. reportEfficiencyControllerUrl+"/"+ dataItem.sectionType
                    var ds = wmsDataSource({
                        url: detailUrl,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "number", editable: false, nullable: true }
                                }
                            }
                        },
                        filter:{"st":dataItem.startTime,"ed":dataItem.endTime}
                    });
//                    $scope.detailGrid.dataSource.filter();
                    if(dataItem.sectionType==="Picking"){//拣货
                        $scope.detailGrid.setOptions({
                            columns: pickingColumn
                        });
                    }else if(dataItem.sectionType==="Pack"||dataItem.sectionType==="Transfer"){
                        $scope.detailGrid.setOptions({
                            columns: packDetailColumns
                        });
                    }else{
                        $scope.detailGrid.setOptions({
                            columns: detailColumns
                        });
                    }

                    var effPopupTitle = "";
                    switch(dataItem.sectionType) {
                        case "Picking":
                            effPopupTitle = "拣货绩效详细";
                            break;
                        case "Rrounding":
                            effPopupTitle = "上架绩效详细";
                            break;
                        case "Pack":
                            effPopupTitle = "包装绩效详细";
                            break;
                        case "Transfer":
                            effPopupTitle = "交接绩效详细";
                            break;
                        case "Receipt":
                            effPopupTitle = "收货绩效详细";
                            break;
                    }
                    $(".k-window-title").html(effPopupTitle);//修改弹出框页面title
                    //这样导致主页面的文件名也变了 $rootScope.title = effPopupTitle;//修改保存文件名字
                    $scope.detailGrid.setDataSource(ds);
                    $scope.effPopup.refresh().open().maximize();

                };


                //重置的时候，给日期默认值
                $(".btn-cancel").on("click",function(){
                    setTimeout(function(){
                        $scope.$apply(function(){
                            var today = new Date();
                            $scope.$$childHead.query.startTime =  $filter("date")(new Date(), "yyyy/MM/dd 00:00:00");
                            $scope.$$childHead.query.endTime =  $filter("date")(today.setTime(today.getTime() + 1000*60*60*24), "yyyy/MM/dd 00:00:00");
                        });
                    },20);
                });




            }]);
})