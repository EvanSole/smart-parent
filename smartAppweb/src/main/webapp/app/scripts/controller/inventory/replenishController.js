/**
 * Created by xiagn on 15/4/1.
 */
define(['scripts/controller/controller',
  '../../model/inventory/replenishModel'], function (controller, replenishModel) {
  "use strict";
  controller.controller('inventoryReplenishController',
    ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource', '$filter',
      function ($scope, $rootScope, $sync, $url, wmsDataSource, $filter) {
        var replenishHeaderUrl = $url.inventoryReplenishUrl,
          replenishGridName = "补货",
          replenishDetailGridName = "补货明细",
          replenishAllocateGridName = "补货任务",
          replenishGridWidgetId = "replenishHeader",
          replenishDetailGridWidgetId = "replenishDetail",
          replenishAllocateGridWidgetId = "replenishAllocate",
          replenishHeaderColumns = [
            WMS.GRIDUTILS.CommonOptionButton(),
            { field: 'id', title: '补货单号', filterable: false, align: 'left', width: '110px'},
            { field: 'referNo', title: '参考单号', filterable: false, align: 'left', width: '110px'},
            { field: 'typeCode', title: '补货类型', filterable: false, sortable: false, align: 'left', width: '110px', template: WMS.UTILS.codeFormat('typeCode', 'ReplenishType')},
            { field: 'storerId', title: '商家', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.storerFormat},
            { field: 'warehouseId', title: '仓库', filterable: false, align: 'left', width: '100px', template: WMS.UTILS.whFormat},
            { field: 'datasourceCode', title: '数据来源', filterable: false, align: 'left', width: '110px', template: WMS.UTILS.codeFormat('datasourceCode', 'DataSource')},
            { field: 'statusCode', title: '单据状态', filterable: false, align: 'left', width: '110px', template: WMS.UTILS.codeFormat('statusCode', 'TicketStatus')},
            { field: 'totalQty', title: '总数量', filterable: false, align: 'left', width: '100px'},
            { field: 'submitUser', title: '提交人', filterable: false, align: 'left', width: '100px'},
            { field: 'submitDate', title: '提交日期', filterable: false, align: 'left', width: '110px', template: WMS.UTILS.timestampFormat("submitDate")},
            { field: 'zoneTypeCode', title: '目的库区', filterable: false, align: 'left', width: '110px', template: WMS.UTILS.codeFormat('zoneTypeCode', 'ZoneType')}
          ],
          replenishDetailBaseColumns = [
            { field: 'reasonCode', title: '补货原因', filterable: false, align: 'left', width: '110px', template: WMS.UTILS.codeFormat('reasonCode', 'ReplenishReason')},
            { field: 'skuSku', title: 'SKU', filterable: false, align: 'left', width: '100px'},
            { field: 'skuItemName', title: 'SKU名称', filterable: false, align: 'left', width: '100px'},
            { field: 'skuBarcode', title: '条码', filterable: false, align: 'left', width: '100px'},
            { field: 'skuColorCode', title: '颜色', filterable: false, align: 'left', width: '100px'},
            { field: 'skuSizeCode', title: '尺码', filterable: false, align: 'left', width: '100px'},
            { field: 'skuProductNo', title: '货号', filterable: false, align: 'left', width: '100px'},
            { field: 'expectedQty', title: '期望补货数量', filterable: false, align: 'left', width: '150px'},
            { field: 'advicedQty', title: '建议补货数量', filterable: false, align: 'left', width: '150px'},
            { field: 'allocatedQty', title: '实际分配数量', filterable: false, align: 'left', width: '150px'},
            { field: 'description', title: '备注', filterable: false, align: 'left', width: '100px'}
          ],
          replenishAllocateColumns = [
            { field: 'locationId', title: '建议货位', filterable: false, align: 'left', width: '110px', template: WMS.UTILS.locationFormat},
//                        { field: 'palletNo', title: '建议托盘', filterable: false, align:'left', width: '100px'},
            { field: 'cartonNo', title: '建议箱号', filterable: false, align: 'left', width: '110px'},
            { field: 'skuSku', title: 'SKU', filterable: false, align: 'left', width: '100px'},
            { field: 'skuItemName', title: 'SKU名称', filterable: false, align: 'left', width: '100px'},
            { field: 'skuBarcode', title: '条码', filterable: false, align: 'left', width: '100px'},
            { field: 'skuColorCode', title: '颜色', filterable: false, align: 'left', width: '100px'},
            { field: 'skuSizeCode', title: '尺码', filterable: false, align: 'left', width: '100px'},
            { field: 'skuProductNo', title: '货号', filterable: false, align: 'left', width: '100px'},
            { field: 'pickLocationId', title: '实际货位', filterable: false, align: 'left', width: '110px', template: WMS.UTILS.locationFormat},
//                        { field: 'pickPalletNo', title: '实际托盘', filterable: false, align:'left', width: '100px'},
            { field: 'pickCartonNo', title: '实际箱号', filterable: false, align: 'left', width: '110px'},
            { field: 'allocatedQty', title: '实际分配数量', filterable: false, align: 'left', width: '150px'},
            { field: 'pickedQty', title: '捡货数量', filterable: false, align: 'left', width: '110px'},
            { field: 'loginName', title: '操作员编号', filterable: false, align: 'left', width: '150px'},
            { field: 'userName', title: '操作员名', filterable: false, align: 'left', width: '110px'}
          ],
          replenishHeaderDataSource = wmsDataSource({
            url: replenishHeaderUrl,
            schema: {
              model: replenishModel.header
            }
          });

        replenishHeaderColumns = replenishHeaderColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
        replenishDetailBaseColumns = replenishDetailBaseColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
        replenishAllocateColumns = replenishAllocateColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
        // 初始化检索区数据
        $scope.query = {
          replenishDateFrom: $filter('date')(new Date(), 'yyyy/MM/dd 00:00:00'),
          statusCode: 'Initial'
        };
        // 补货GRID定义
        $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
          widgetId: replenishGridWidgetId,
          moduleName: replenishGridName,
          dataSource: replenishHeaderDataSource,
          toolbar: [
            {
              template: '<a class="k-button k-button-icontext k-grid-add" href="\\#"><span class="k-icon k-add"></span>新增</a>',
              className:'btn-auth-add'
            },
            {
              template: '<a class="k-button k-grid-custom-command" ng-click="changeStatus(\'Submitted\')" href="\\#">提交</a>',
              className:'btn-auth-commit'
            },
            {
              template: '<a class="k-button k-grid-custom-command" ng-click="changeStatus(\'Confirmed\')" href="\\#">确认</a>',
              className:'btn-auth-confirm'
            }
          ],
          columns: replenishHeaderColumns,
          dataBound: function (e) {
            var grid = this,
              trs = grid.tbody.find(">tr");
            _.each(trs, function (tr, i) {
              var record = grid.dataItem(tr);
              if (record.statusCode !== "Initial") {
                $(tr).find(".k-button").remove();
              }
            });
          },
//                    detailExpand: function(e) {
////                        $scope.replenishDetailOptions(e.data).dataSource.read();
////                        $scope.replenishAllocateOptions(e.data).dataSource.read();
//                    },
          editable: {
            mode: "popup",
            window: {
              width: "640px"
            },
            template: kendo.template($("#replenish-editor").html())
          },
          selectable: "row"
        }, $scope);
        // 补货明细GRID定义
        $scope.replenishDetailOptions = function (dataItem) {
          var replenishDetailColumns = [],
            toolbar = [],
            editable = "false",
            orgAdviceQty;
          // 未提交状态可以操作
          if (dataItem.statusCode === "Initial") {
            toolbar = [
              { name: "create", text: "新增", className:'btn-auth-add-detail'}
            ];
            replenishDetailColumns = [WMS.GRIDUTILS.CommonOptionButton("detail")];
            editable = {
              mode: "popup",
              window: {
                width: "640px"
              },
              template: kendo.template($("#replenish-detail-editor").html())
            };
          }
          replenishDetailColumns = replenishDetailColumns.concat(replenishDetailBaseColumns);

          return WMS.GRIDUTILS.getGridOptions({
            widgetId: replenishDetailGridWidgetId,
            moduleName: replenishDetailGridName,
            dataSource: wmsDataSource({
              url: replenishHeaderUrl + "/" + dataItem.id + "/detail",
              parseRequestData: function (data, method) {
                if (method === "create") {
                  // todo 多条
                  data.skuIds = data.skuId;
                  data.expectedQtys = data.expectedQty;
                  data.advicedQty = data.advicedQty;
                }
                return data;
              },
              callback: {
                update: function (response, editData) {
                  dataItem.set("totalQty", dataItem.get("totalQty") - orgAdviceQty + editData.advicedQty);
                  $scope.replenishGrid.expandRow($('tr[data-uid=' + dataItem.get('uid') + ']'));
                },
                create: function (response, editData) {
                  dataItem.set("totalQty", dataItem.get("totalQty") + editData.advicedQty);
                  $scope.replenishGrid.expandRow($('tr[data-uid=' + dataItem.get('uid') + ']'));
                },
                destroy: function (response, editData) {
                  dataItem.set("totalQty", dataItem.get("totalQty") - editData.advicedQty);
                  $scope.replenishGrid.expandRow($('tr[data-uid=' + dataItem.get('uid') + ']'));
                }
              },
              schema: {
                model: {
                  id: "id",
                  fields: {
                    id: {type: "number", editable: false, nullable: true }
                  }
                }
              },
              pageSize: 5
            }),
            toolbar: toolbar,
            columns: replenishDetailColumns,
            editable: editable,
            save: function (e) {
              var model = e.model;
              if (model.skuId === undefined) {
                kendo.ui.ExtAlertDialog.showError("请选择商品");
                e.preventDefault();
              }
            },
            edit: function (e) {
              if (!e.model.isNew()) {
                orgAdviceQty = e.model.advicedQty;
              }
            }
          }, $scope);
        };
        // 补货任务GRID定义
        $scope.replenishAllocateOptions = function (dataItem) {
          var toolbar = [];
          if (dataItem.statusCode !== "Confirmed") {
            toolbar = [
              {
                template: '<a class="k-button k-grid-custom-command" ng-click="allocate()" href="\\#">任务分配</a>',
                className:'btn-auth-allocate'
              }
            ];
          }
          return WMS.GRIDUTILS.getGridOptions({
            widgetId: replenishAllocateGridWidgetId,
            moduleName: replenishAllocateGridName,
            dataSource: wmsDataSource({
              url: replenishHeaderUrl + "/" + dataItem.id + "/allocate",
              schema: {
                model: {
                  id: "id",
                  fields: {
                    id: {type: "number", editable: false, nullable: true }
                  }
                }
              },
              pageSize: 5
            }),
            toolbar: toolbar,
            columns: replenishAllocateColumns,
            selectable: "row"
          }, $scope);
        };
        //
        $scope.$on("kendoWidgetCreated", function (event, widget) {
          if (widget.options !== undefined && widget.options.widgetId === replenishGridWidgetId) {
            widget.wrapper.kendoValidator({
              rules: {
                // custom rules
                custom: function (input, params) {
                  if (input.is("[name=StartDate]") || input.is("[name=EndDate]")) {

                    //If the input is StartDate or EndDate
                    var container = $(input).closest("tr");

                    var start = container.find("input[name=StartDate]").data("kendoDatePicker").value();
                    var end = container.find("input[name=EndDate]").data("kendoDatePicker").value();


                    if (start > end) {
                      return false;
                    }
                  }
                  //check for the rule attribute
                  return true;
                }
              },
              messages: {
                custom: function (input) {
                  // return the message text
                  return "Start Date must be greater than End Date!";
                }
              }
            });
          }
        });

        $scope.changeTab = function (tabName) {
          if (tabName === 'allocate') {
            this.replenishAllcateGrid.dataSource.read();
          } else {
            this.replenishDetailGrid.dataSource.read();
          }
        };

        $scope.allocate = function () {
          var replenishAllcateGrid = this.replenishAllcateGrid;
          var currentWarehouseId = this.dataItem.warehouseId;
          if (replenishAllcateGrid) {
            var selectView = replenishAllcateGrid.select();
            var selectData = replenishAllcateGrid.dataItem(selectView);
            if (!selectData) {
              kendo.ui.ExtAlertDialog.showError("请选择一条数据");
              return;
            }
            $scope.userPopup.refresh().open().center();
            $scope.userPopup.initParam = function (subScope) {
              subScope.param = currentWarehouseId;
            };
            $scope.userPopup.setReturnData = function (returnData) {
              if (_.isEmpty(returnData)) {
                return;
              }
              $sync(replenishHeaderUrl + "/" + selectData.replenishId + "/allocate/" + selectData.id, "PUT",
                {data: {userName: returnData.userName, loginName: returnData.loginName}})
                .then(function () {
                  selectData.set("userName", returnData.userName);
                  selectData.set("loginName", returnData.loginName);
                });
            };
          }
        };


        $scope.changeStatus = function (status) {
          var replenishGrid = this.replenishGrid;
          if (replenishGrid) {
            var selectView = replenishGrid.select();
            var selectData = replenishGrid.dataItem(selectView);
            if (!selectData) {
              kendo.ui.ExtAlertDialog.showError("请选择一条数据");
              return;
            }
            if (status === 'Submitted' && selectData.statusCode !== "Initial") {
              kendo.ui.ExtAlertDialog.showError("只能操作未提交的数据");
              return;
            }
            if (status === 'Confirmed' && selectData.statusCode !== "Submitted") {
              kendo.ui.ExtAlertDialog.showError("只能确认已提交的数据");
              return;
            }
            $sync(replenishHeaderUrl + "/" + selectData.id, "PUT",
              {data: {id: selectData.id, statusCode: status}})
              .then(function () {
                selectData.set("statusCode", status);
                $(selectView).find(".k-button").remove();
              });
          }
        };
        $scope.changeExpectedQty = function () {
          var currentDataItem = this.dataItem;
          var expectedQty = currentDataItem.expectedQty,
            skuBoxsize = currentDataItem.skuBoxsize,
            skuReplenishqty = currentDataItem.skuReplenishqty,
            advicedQty = expectedQty;
          // 箱规与最低补货量存在
          if (skuBoxsize > 0 && skuReplenishqty > 0) {
            // 箱规有，去箱规的整数倍
            if (skuBoxsize > 0) {
              advicedQty = Math.ceil(expectedQty % skuBoxsize) * skuBoxsize;
            }
            // 有最低补货量,取最低补货量和箱规整数倍中较大者
            if (skuReplenishqty > 0) {
              advicedQty = advicedQty > skuReplenishqty ? advicedQty : skuReplenishqty;
            }
          }
          currentDataItem.set("advicedQty", advicedQty);
        };

        $scope.windowOpen = function () {
          var currentDataItem = this.dataItem;
          var currentStorerId = this.$parent.dataItem.storerId;
          $scope.skuPopup.initParam = function (subScope) {
            subScope.param = currentStorerId;
          };
          $scope.skuPopup.setReturnData = function (returnData) {
            if (_.isEmpty(returnData)) {
              return;
            }
            currentDataItem.set("skuSku", returnData.sku);
            currentDataItem.set("skuId", returnData.id);
            currentDataItem.set("skuItemName", returnData.itemName);
            currentDataItem.set("skuBarcode", returnData.barcode);
            currentDataItem.set("skuColorCode", returnData.colorCode);
            currentDataItem.set("skuSizeCode", returnData.sizeCode);
            currentDataItem.set("skuProductNo", returnData.productNo);
            currentDataItem.set("skuBoxsize", returnData.boxsize);
            currentDataItem.set("skuReplenishqty", returnData.replenishqty);
          };
          $scope.skuPopup.refresh().open().center();
        };

      }]);
});
