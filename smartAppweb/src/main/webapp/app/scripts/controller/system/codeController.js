
define(['scripts/controller/controller', '../../model/system/codeModel'], function(controller,codeModel) {
    "use strict";
    controller.controller('codeController', ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource',
            function($scope, $rootScope, $sync, $url, wmsDataSource) {
                var codeHeaderUrl = $url.systemCodeHeaderUrl,
                    codeHeaderColumns = [
                        WMS.GRIDUTILS.CommonOptionButton(),
                        { title: '列表名称', field: 'listName',align: 'left', width: "200px",
                            filterable: {cell: {
                                enabled: true,
                                delay: 1500
                            }}},
                        { filterable: false, title: '只读', field: 'isReadOnly', template: WMS.UTILS.checkboxDisabledTmp("isReadOnly"), align: 'left', width: "75px"},
                        { filterable: false, title: '系统', field: 'isSystem', template: WMS.UTILS.checkboxDisabledTmp("isSystem"), align: 'left', width: "75px"},
                        { filterable: {cell: {
                            enabled: true,
                            delay: 1500
                        }}, title: '列表说明', field: 'description', align: 'left', width: "200px"}
                    ],

                    codeDetailColumns = [
                        WMS.GRIDUTILS.CommonOptionButton("detail"),
                        {filterable: false, title: '选项实际值', field: 'codeValue', align: 'left', width: "200px"},
                        {filterable: false, title: '选项显示值', field: 'codeName', align: 'left', width: "200px"},
                        {filterable: false, title: '显示顺序', field: 'sequence', align: 'left', width: "100px"},
                        {filterable: false, title: '默认选项', field: 'isDefault', align: 'left', width: "100px",template: WMS.UTILS.checkboxDisabledTmp('isDefault')},
                        {filterable: false, title: '系统选项', field: 'isSystem', align: 'left', width: "100px",template: WMS.UTILS.checkboxDisabledTmp('isSystem')},
                        {filterable: false, title: '可用', field: 'isActive', align: 'left', width: "100px",template: WMS.UTILS.checkboxDisabledTmp('isActive')},
                        {filterable: false, title: '描述', field: 'description', align: 'left', width: "200px"}
                    ],
                    codeHeaderDataSource = wmsDataSource({
                        url: codeHeaderUrl,
                        schema: {
                            model: codeModel.codeHeader
                        }
                    });
                codeHeaderColumns = codeHeaderColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                codeDetailColumns = codeDetailColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    dataSource: codeHeaderDataSource,
                    toolbar: [{ name: "create", text: "新增", className:'btn-auth-add'}],
                    columns: codeHeaderColumns,
                    editable: {
                        mode: "popup",
                        template: kendo.template($("#codeHeaderEditor").html())
                    },
                    dataBound: function(e){
                      var grid = e.sender,
                          trs = grid.tbody.find(">tr");
                            _.each(trs, function(tr,i){
                           var record = grid.dataItem(tr);
                           if (record.isSystem) {
                              $(tr).find(".k-button").remove();
                           }
                        });
                    }
                }, $scope);

                $scope.codeDetailOptions = function (dataItem) {

                    var defaultOptions = {
                      dataSource: wmsDataSource({
                        url: codeHeaderUrl + "/" + dataItem.id + "/detail",
                        schema: {
                          model: codeModel.codeDetail
                        },
                        pageSize: 10
                      }),
                      columns: codeDetailColumns,
                      editable: {
                        mode: "popup",
                        window: {
                          width: "640px"
                        },
                        template: kendo.template($("#codeDetailEditor").html())
                      },
                      dataBound: function(e){
                        var grid = e.sender,
                          trs = grid.tbody.find(">tr");
                        _.each(trs, function(tr,i){
                          var record = grid.dataItem(tr);
                          if (record.isSystem) {
                            $(tr).find(".k-button").remove();
                          }
                        });
                      }
                    };
                    if (!dataItem.isReadOnly) {
                      defaultOptions.toolbar =  [
                        { name: "create", text: "新增", className:'btn-auth-add-detail'}
                      ];
                    }
                    return WMS.GRIDUTILS.getGridOptions(defaultOptions, $scope);
                };

                $scope.search = function() {
                    var condition = {"listName":$scope.listName, "description":$scope.description};
                    $scope.codeHeaderGrid.dataSource.filter(condition);
                    $scope.codeHeaderGrid.refresh();
                };


            }]);

})