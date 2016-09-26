/**
 * Created by zw on 16/4/7.
 */

define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('qcEfficiencyController',
        ['$scope', '$rootScope', '$http', 'url','wmsDataSource', 'sync', '$filter',
            function($scope, $rootScope, $http, url, wmsDataSource, $sync, $filter) {

                var  efficiencyColumns = [
                    { title: '操作', command: [
                        { name: "serachDetail", text: "详细", className: "btn-auth-detail", click: function (e) {
                            $scope.searchDetail(e,this);
                        } }
                    ],
                        width: "50px"
                    },
                    {filterable: false, title: '工段', field: 'businessType', align: 'left', width: "100px", template: WMS.UTILS.statesFormat('businessType', 'BussessLogTypeEnum') },
                    {filterable: false, title: '统计开始时间', field: 'startTime', align: 'left', width: "150px", template: WMS.UTILS.timestampFormat("startTime", "yyyy-MM-dd HH:mm:ss")},
                    {filterable: false, title: '统计结束时间', field: 'endTime', align: 'left', width: "150px", template: WMS.UTILS.timestampFormat("endTime", "yyyy-MM-dd HH:mm:ss")},
                    {filterable: false, title: '作业时长(小时)', field: 'workTime', align: 'left', width: "100px"},
                    {filterable: false, title: '作业量', field: 'workQty', align: 'left', width: "100px"}
                    //{filterable: false, title: '作业效率(件/小时)', field: 'efficiency', align: 'left', width: "100px"}
                ];

                var efficiencyDataSource = wmsDataSource({
                    url: url.efficiencyUrl,
                    schema: {
                        model: {
                            id:"logId",
                            fields: {
                                
                            }
                        }
                    },
                    parseRequestData:function(data){
                        data.startTime = $scope.query.startTime2;
                        data.endTime = $scope.query.endTime2;
                        return data;
                    }
                });

                $scope.efficiencyGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: efficiencyDataSource,
                    columns: efficiencyColumns,
                    autoBind: true
                }, $scope);


                var detailColumns = [
                    { filterable: false, title: '作业人员', field: 'optUserName', align: 'left', width: "200px"},
                    { filterable: false, title: '开始作业时间', field: 'startTime', align: 'left', width: "200px;", template: WMS.UTILS.timestampFormat("startTime", "yyyy-MM-dd HH:mm:ss")},
                    { filterable: false, title: '结束作业时间', field: 'endTime   ', align: 'left', width: "200px;", template: WMS.UTILS.timestampFormat("endTime", "yyyy-MM-dd HH:mm:ss")},
                    { filterable: false, title: '作业时长（小时）', field: 'workTime', align: 'left', width: "200px;"},
                    { filterable: false, title: '作业量', field: 'workQty', align: 'left', width: "200px;"}
                    //{ filterable: false, title: '作业效率（件/小时）', field: 'efficiency', align: 'left', width: "200px;"}
                ];

                $scope.detailGridOptions = WMS.GRIDUTILS.getGridOptions({
                    widgetId: "detail",
                    //exportable: true,
                    dataSource: new kendo.data.DataSource({
                        data: []
                    }),
                    height:"100%",
                    columns: detailColumns,
                    dataBound: function (e) {
                    }
                }, $scope);


                $scope.setDefaultTime = function(){
                    //赋值时间默认值
                    var today = new Date();
                    $scope.query = {};
                    $scope.query.startTime2 =  $filter("date")(new Date(), "yyyy/MM/dd 00:00:00");
                    $scope.query.endTime2 =  $filter("date")(today.setTime(today.getTime() + 1000*60*60*24), "yyyy/MM/dd 00:00:00");
                };

                $scope.setDefaultTime();


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
                    $scope.query.startTime2 =  $filter("date")(now, "yyyy/MM/dd 00:00:00");
                    $("#startTime").val($scope.query.startTime2);
                    $scope.query.endTime2 =  $filter("date")(today.setTime(today.getTime() + 1000*60*60*24), "yyyy/MM/dd 00:00:00");
                    $("#endTime").val($scope.query.endTime2);
                };

                //重置的时候，给日期默认值
                $(".btn-cancel").on("click",function(){
                    setTimeout(function(){
                        $scope.$apply(function(){
                            var today = new Date();
                            $scope.$$childHead.query.startTime2 =  $filter("date")(new Date(), "yyyy/MM/dd 00:00:00");
                            $scope.$$childHead.query.endTime2 =  $filter("date")(today.setTime(today.getTime() + 1000*60*60*24), "yyyy/MM/dd 00:00:00");
                        });
                    },20);
                });


                $scope.searchDetail = function (e,widgets) {
                    e.preventDefault();
                    var dataItem = widgets.dataItem($(e.currentTarget).closest("tr"));
                    var detailUrl = url.efficiencyUrlDetail
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
                        //filter:{"st":dataItem.startTime,"ed":dataItem.endTime},
                        parseRequestData:function(data){
                            data.businessType = dataItem.businessType;
                            data.startTime = $scope.query.startTime2;
                            data.endTime = $scope.query.endTime2;
                            return data;
                        }
                    });
                    //$scope.detailGrid.dataSource.filter();
                    /*if(dataItem.sectionType==="Picking"){//拣货
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
                    }*/

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








                

            }]);





})