define(['scripts/controller/controller'], function(controller) {
    "use strict";
    controller.controller('problemTicklingController',
        ['$scope', '$rootScope', 'sync', 'url', '$state', 'wmsDataSource',
            function ($scope, $rootScope, $sync, $url, $state, wmsDataSource) {
                var  problemTicklingColumns = [
                 { title: '操作', name: " editProblem", width: "50px",className:"btn-edit-problem",template: "<a class='k-button k-button-custom-command'  name='editProblem' href='\\#' ng-click='editProblem(this);' >编辑</a>"},
                 { field: 'key', title: '问题编号',filterable: false, align: 'left', width: '100px',template: "<a class='k-button k-button-custom-command' name='showProblemDetail' href='\\#' ng-click='showProblemDetail(this);' ><span ng-bind='dataItem.key'></span></a> "},
                 {filterable: false, title: '问题标题', field: 'summary', align: 'left', width: "200px",template: function (dataItem) {return WMS.UTILS.tooLongContentFormat(dataItem, 'summary');}},
                 {filterable: false, title: '问题内容', field: 'description', align: 'left', width: "300px",template: function (dataItem) {return WMS.UTILS.tooLongContentFormat(dataItem, 'description');}},
                 {filterable: false, title: '所属模块', field: 'components', align: 'left', width: "100px"},
                 {filterable: false, title: '创建人', field: 'problemCreateUser', align: 'left', width: "100px"},
                 {filterable: false, title: '创建时间', field: 'created', align: 'left', width: "150px",template: WMS.UTILS.timestampFormat("created", "yyyy-MM-dd HH:mm:ss")},
                 {filterable: false, title: '状态', field: 'status', align: 'left', width: "100px"},
                 {filterable: false, title: '处理结果', field: 'resolutionStatus', align: 'left', width: "100px"},
                 {filterable: false, title: '处理人', field: 'assignee', align: 'left', width: "100px"}
                ];

                var problemTicklingDataSource = wmsDataSource({
                    url: $url.problemTicklinglistUrl,
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                key: { type: "string"},
                                summary: { type: "string"},
                                created: { type: "String"},
                                status: { type: "string"},
                                description: { type: "string"},
                                assignee: { type: "string"},
                                problemCreateUser: { type: "string"},
                                resolutionStatus: { type: "string"}
                            }
                        }
                    }
                });

            $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                dataSource: problemTicklingDataSource,
                columns: problemTicklingColumns,
                toolbar: [{ name: "createProblemTickling", text: "新增", className:'btn-auth-add'}],
                autoBind: true,
                pageable:false
            }, $scope);

            //打开问题新增弹出层
            $(".k-grid-createProblemTickling").on("click", function () {
                $scope.problemTicklingPopup.refresh().open().center();
            });

            //关闭弹出层
            $scope.problemTicklingClose = function () {
                $scope.problemTicklingPopup.close();
            };

            //问题提交
            $scope.problemTicklingConfirm = function () {

                var summary = $("#summary").val();
                if (summary === '') {
                    kendo.ui.ExtAlertDialog.showError("问题标题不能为空!");
                    return;
                }
                var description = $("#description").val();
                if (description === '') {
                    kendo.ui.ExtAlertDialog.showError("问题描述不能为空!");
                    return;
                }
                var issuetype = $("#issuetype").val();

                var components = $("#components").val();

                var userName = $rootScope.user.userName;
                    description = description + "["+userName+"]";
                var params = { "fields":
                                 {"project": {"id": "11400"},
                                  "summary": summary,
                                  "description": description,
                                  "components":[{"id" : components}],
                                  "issuetype": { "name": issuetype }
                                 }
                             };
                $sync($url.problemTicklingissueUrl, "POST", {data: params})
                    .then(function (data) {
                        //刷新页面
                        //$state.reload();
                        $scope.problemTicklingGrid.dataSource.read({});
                        $scope.problemTicklingPopup.close();
                    }, function () {
                        //$state.reload();
                        $scope.problemTicklingGrid.dataSource.read({});
                        $scope.problemTicklingPopup.close();
                    });
            }

            //显示详情
            $scope.showProblemDetail = function (data) {
                 $scope.problemPopup.refresh().open().center();
                 $scope.summaryDetail = data.dataItem.summary;
                 $scope.descriptionDetail = data.dataItem.description;
                 $scope.keyDetail = data.dataItem.key;
            };

            //关闭
            $scope.closeProblemWindow = function(){
                $scope.problemPopup.close();
            }


            //编辑问题
            $scope.editProblem = function (data) {
                $scope.editProblemTicklingPopup.refresh().open().center();
                $("#problemKey").val(data.dataItem.key);
                $("#problemSummary").val(data.dataItem.summary);
                $("#problemDescription").val(data.dataItem.description);
                var components = data.dataItem.components;
                if(components === "出库") {
                    $("#problemComponents").val(11100);
                }else if (components === "入库") {
                    $("#problemComponents").val(11101);
                }else if (components === "库内") {
                    $("#problemComponents").val(11102);
                }else if (components === "公共") {
                    $("#problemComponents").val(11103);
                }else {
                    $("#problemComponents").val("");
                }
            };
            //关闭
            $scope.editProblemTicklingClose = function(){
                $scope.editProblemTicklingPopup.close();
            }

            //编辑问题确认
            $scope.editProblemTicklingConfirm = function () {

                var problemKey = $("#problemKey").val();

                var problemSummary = $("#problemSummary").val();
                if (problemSummary === '') {
                    kendo.ui.ExtAlertDialog.showError("问题标题不能为空!");
                    return;
                }
                var problemDescription = $("#problemDescription").val();
                if (problemDescription === '') {
                    kendo.ui.ExtAlertDialog.showError("问题描述不能为空!");
                    return;
                }
                var userName = $rootScope.user.userName;
                problemDescription = problemDescription + "["+userName+"]";

                var problemComponents = $("#problemComponents").val();

                $sync($url.problemTicklingissueUrl+"/"+problemKey, "PUT", {data: { "fields": {"project": {"id": "11400"}, "summary": problemSummary, "description": problemDescription,"components":[{"id" : problemComponents}] }}})
                    .then(function (data) {
                        //刷新页面
                        //$state.reload();
                        $scope.problemTicklingGrid.dataSource.read({});
                        $scope.editProblemTicklingPopup.close();
                    }, function () {
                        //$state.reload();
                        $scope.problemTicklingGrid.dataSource.read({});
                        $scope.editProblemTicklingPopup.close();
                    });
            }


        }]
    )
});

