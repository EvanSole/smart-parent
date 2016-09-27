/**
 * Created by MLS on 15/3/31.
 */

define(['scripts/controller/controller', '../../model/warehouse/in/receiptModel'], function (controller, receiptModel) {
    "use strict";
    controller.controller('reportQcReportController',
        ['$scope', '$rootScope', '$http', 'url', 'wmsDataSource', 'wmsLog', 'sync',
            function ($scope, $rootScope, $http, $url, wmsDataSource, wmsLog, $sync) {
                var headerUrl = $url.qcReport,
                    headerColumns = [
                        { filterable: false, title: '收货日期', field: 'updateTime', align: 'left', width: "150px",template: WMS.UTILS.timestampFormat("updateTime", "yyyy/MM/dd")},
                        { filterable: false, title: '商家编码', field: 'storer', align: 'left', width: "100px"},
                        { filterable: false, title: '商家', field: 'storerId', align: 'left', width: "100px", template: WMS.UTILS.storerFormat('storerId')},
                        { filterable: false, title: 'ERP单号', field: 'fromErpNo', align: 'left', width: "100px;"},
                        { filterable: false, title: '质检单号', field: 'id', align: 'left', width: "100px;"},
                        { filterable: false, title: '实收品数', field: 'totalCategoryQty', align: 'left', width: "100px;"},
                        { filterable: false, title: '实收总数量', field: 'totalQtyReal', align: 'left', width: "100px;"},
                        { filterable: false, title: '正品数量', field: 'qualifiedQty', align: 'left', width: "100px;"},
                        { filterable: false, title: '残品数量', field: 'unqualifiedQty', align: 'left', width: "100px;"},
                        { filterable: false, title: '残品率', field: 'qualityRatio', align: 'left', width: "100px;"}
                    ],
                    qcDetailColumns = [
                        { filterable: false, title: 'SKU', field: 'skuSku', align: 'left', width: "120px"},
                        { filterable: false, title: '商品条码', field: 'skuBarcode', align: 'left',width:"160px;"},
                        { filterable: false, title: '商品名称', field: 'skuItemName', align: 'left',width:"120px;"},
                        { filterable: false, title: '颜色', field: 'skuColorCode', template: WMS.UTILS.codeFormat('skuColorCode', 'SKUColor'), align: 'left', width: "120px;"},
                        { filterable: false, title: '尺码', field: 'skuSizeCode', align: 'left', width: "120px;", template: WMS.UTILS.codeFormat('skuSizeCode', 'SKUSize')},
                        { filterable: false, title: '货号', field: 'skuProductNo', align: 'left', width: "120px;"},
                        { filterable: false, title: '残品数量', field: 'noQualityQty', align: 'left',width:"120px;"},
                        { filterable: false, title: '质检问题说明 ', field: 'qcItem', align: 'left',width:"120px;",template: function (dataItem) {
                            return WMS.UTILS.tooLongContentFormat(dataItem, 'qcItem');
                        }}
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
                        }
                    });
                qcDetailColumns = qcDetailColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
//                headerColumns = headerColumns.concat(WMS.UTILS.CommonColumns.defaultColumns);
                $scope.mainGridOptions = WMS.GRIDUTILS.getGridOptions({
                    hasFooter: true,
                    widgetId: "header",
                    dataSource: headerDataSource,
                    columns: headerColumns,
                    toolbar: [
                        {template: '<a class="k-button k-grid-report" ng-click="exportExcel()" href="\\#">导出所有</a>', className: "btn-auth-qcReport"}
                    ],
                    dataBound: function (e) {

                    }
                }, $scope);

                $scope.qcDetailOptions = function(dataItem) {
                    //质检明细信息
                    return WMS.GRIDUTILS.getGridOptions({
                        widgetId:"detail",
                        dataSource: wmsDataSource({
                            url: headerUrl+"/"+dataItem.id+"/detail",
                            schema: {
                                model: {
                                    id:"id",
                                    fields: {
                                        id: {type:"number", editable: false, nullable: true },
                                        skuId:{type:"number"}
                                    }
                                }
                            }
                        }),
                        columns: qcDetailColumns
                    }, $scope);
                };

                $scope.selectSingleRow = WMS.GRIDUTILS.selectSingleRow;
                $scope.selectAllRow = WMS.GRIDUTILS.selectAllRow;
                //导出Excel

                //过滤条件
                var filter ;

                //拼接列头
                var colDefine=[];
                headerColumns.forEach(function(v, i) {
                    colDefine.push(headerColumns[i]);
                })
                qcDetailColumns.forEach(function(v, i) {
                    colDefine.push(qcDetailColumns[i]);
                })

                $scope.exportExcel = function () {
                    if ( $scope.qcHeaderGrid.options.customerFilter) {
                        filter =  $scope.qcHeaderGrid.options.customerFilter;
                    } else if ( $scope.qcHeaderGrid.dataSource._filter !== undefined &&  $scope.qcHeaderGrid.dataSource._filter !== null) {
                        filter =  $scope.qcHeaderGrid.dataSource._filter.filters[0];//数组类型
                    }
//                    filter = JSON.stringify(filter)
                    $rootScope.exportExcelAll_Detail(colDefine, $url.qcReport+"/print",'质检报告.xls', filter);
                };
            }]);
})