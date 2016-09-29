define(['jquery', 'underscore', 'kendo'], function ($, _) {

    "use strict";
    var exportOperator = {};

    exportOperator.makePara = function (grid, url, fileName) {
        if (!grid._data) {
            kendo.ui.ExtAlertDialog.showError("数据还未加载完，请稍后操作!");
            return false;
        }
        if (grid._data.length === 0) {
            kendo.ui.ExtAlertDialog.showError("表格没有数据 ,无法执行导出操作!");
            return false;
        }
        //获取列定义
        var subCols = getCols(grid);
        //组织参数
        var paras = makeExpObj(grid, subCols, url, fileName);

        return paras;
    };

    /**
     * 返回Excel导出请求数据格式
     * @param colDefine 列定义json
     * @param url
     * @param fileName
     * @param page
     * @param pageSize
     * @param total
     * @param filter  键值对json对象，用来拼接在url上面过滤数据,var filter = {receivedQty: 1, lotKey: "A_5054_6159", "locationId": 1};
     * @returns {*}
     */
    exportOperator.makePara_Detail = function (colDefine, url, fileName, page, pageSize, total, filter) {
        if (fileName == null || fileName.length == 0) {
            kendo.ui.ExtAlertDialog.showError("导出文件名未指定!");
            return false;
        }
        if (colDefine == null || colDefine.length == 0) {
            kendo.ui.ExtAlertDialog.showError("导出数据列未定义!");
            return false;
        }
        if (url == null || url.length == 0) {
            kendo.ui.ExtAlertDialog.showError("数据url未指定!");
            return false;
        }
        if (page == null || page <= 0) {
            page = 1;
        }
        if (pageSize == null || pageSize <= 0) {
            pageSize = 30;
        }
        if (total == null || total <= 0) {
            total = 100000;
        }

        //获取列定义
        var subCols = getCols_Detail(colDefine);
        var obj = {
            page: page, pageSize: pageSize, total: total, url: url,rowsSizePerRequest:0,
            cols: JSON.stringify(subCols), filter: JSON.stringify(filter), fileName: fileName
        };
        return obj;
    };

    /**
     * 设置列参数
     * @param grid 表格
     * @returns {Array}
     */
    function getCols(grid) {
        var patt = new RegExp('\\|[^>]+', 'g');


        var subCols = [];
        grid.columns.forEach(function (col) {
            if (col.field !== undefined && col.field !== null) {
                var format = "",
                    rtn = "";

                if (col.excelExport !== undefined && col.excelExport !== null && jQuery.type(col.excelExport) == "string") {
                    format = col.excelExport
                } else if (col.template !== undefined && col.template !== null && jQuery.type(col.template) == "string") {
                    rtn = col.template.match(patt);
                    var reportText = col.reportText;


                    if (rtn !== null && rtn.length > 0) {
                        format = parseFormat(rtn[0]);
                    }
                } else if (col.template !== undefined && col.template !== null && jQuery.type(col.template) == "function") {
                    try {
                        //只考虑storerFormat类似的函数,tooLongContentFormat不作处理
                        var executeRtn = col.template.call(col.field);
                        rtn = executeRtn.match(patt);
                        if (rtn !== null && rtn.length > 0) {
                            format = parseFormat(rtn[0]);
                        }
                    } catch (e) {
                    }
                }

                var subCol = {
                    field: col.field, title: col.title
                };

                if (col.hidden !== undefined) {
                    subCol.hidden = col.hidden;
                }
                if (format != "") {
                    subCol.format = format;
                }
                subCols.push(subCol);
            }
        });

        return subCols;
    }

    function getCols_Detail(colDefine) {
        var patt = new RegExp('\\|[^>]+', 'g');

        var subCols = [];
        colDefine.forEach(function (col) {
            if (col.field !== undefined && col.field !== null) {
                var format = "",
                    rtn = "";

                if (col.excelExport !== undefined && col.excelExport !== null && jQuery.type(col.excelExport) == "string") {
                    format = col.excelExport
                } else if (col.template !== undefined && col.template !== null && jQuery.type(col.template) == "string") {
                    rtn = col.template.match(patt);
                    var reportText = col.reportText;


                    if (rtn !== null && rtn.length > 0) {
                        format = parseFormat(rtn[0]);
                    }
                } else if (col.template !== undefined && col.template !== null && jQuery.type(col.template) == "function") {
                    try {
                        //只考虑storerFormat类似的函数,tooLongContentFormat不作处理
                        var executeRtn = col.template.call(col.field);
                        rtn = executeRtn.match(patt);
                        if (rtn !== null && rtn.length > 0) {
                            format = parseFormat(rtn[0]);
                        }
                    } catch (e) {
                    }
                }

                var subCol = {
                    field: col.field, title: col.title
                };

                if (col.hidden !== undefined) {
                    subCol.hidden = col.hidden;
                }
                if (format != "") {
                    subCol.format = format;
                }
                subCols.push(subCol);
            }
        });

        return subCols;
    }

    function parseFormat(str) {
        var reg1 = new RegExp('\\|', 'g');//去掉|
        var reg2 = new RegExp("'", 'g');//去掉'
        var reg3 = new RegExp('"', 'g');//去掉"

        var newStr = str.replace(reg1, "").replace(reg2, "").replace(reg3, "").replace("Format", "");

        return newStr;
    }

    /**
     * 组织参数
     * @param grid
     * @param subCols
     * @param url
     * @returns {{col: *, page: (_page|DataSource._page|Q._page), total: (DataSource._total|*|number|qt._total|Q._total), pageSize: (DataSource._pageSize|*|Q._pageSize), url: *}}
     */
    function makeExpObj(grid, subCols, url, fileName) {
        var page = grid.pager.dataSource._page;
        var pageSize = grid.pager.dataSource._pageSize;
        var total = grid.pager.dataSource._total;
        var rowsSizePerRequest = grid.options.rowsSizePerRequest;
        if (rowsSizePerRequest == null || rowsSizePerRequest == undefined || isNaN(rowsSizePerRequest) || rowsSizePerRequest < 0) {
            rowsSizePerRequest = 0;
        } else {
            rowsSizePerRequest = parseInt(rowsSizePerRequest);
        }
        var filter = null;
        if (grid.options.customerFilter) {
            filter = grid.options.customerFilter;
        } else if (grid.dataSource._filter !== undefined && grid.dataSource._filter !== null) {
            filter = grid.dataSource._filter.filters[0];//数组类型
        }

        if (fileName === undefined || fileName === null) {
            fileName = '';
        }
        var obj = {
            page: page, pageSize: pageSize, total: total, url: url, rowsSizePerRequest: rowsSizePerRequest,
            //cols: encodeURI(JSON.stringify(subCols)), filter: encodeURI(JSON.stringify(filter)),fileName:encodeURI(fileName)};
            cols: JSON.stringify(subCols), filter: JSON.stringify(filter), fileName: fileName
        };


        return obj;
    }

    return {
        exportOperator: exportOperator
    };
});