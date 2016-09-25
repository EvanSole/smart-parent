define(['jquery', 'underscore', 'kendo'], function ($, _) {
    /**
     * Created by MLS on 15/3/5.
     */
    "use strict";
    var MLS = MLS === undefined ? {} : MLS;
    MLS.WMS = MLS.WMS === undefined ? {} : MLS.WMS;
    MLS.WMS.UTILS = (function () {
        var columnEditor = {
            hidden: function (container, options) {
                container.prev().hide();
                container.hide();
            },
            readOnly: function (container, options) {
                var input = $("<input/>", {readOnly: "readOnly"});
                input.attr("name", options.field);
                input.appendTo(container);
            }
        };
        var CommonColumns = {
            checkboxColumn: {
                width: "30px",
                align: 'center',
                menu: false,
                filterable: false,
                sortable: false,
                template: '<input class="commonColumns_sub_checkbox" ng-click="selectSingleRow($event)" isCheck type="checkbox"/>',
                headerTemplate: '<label><input titleCheck ng-click="selectAllRow($event)" type="checkbox" id="checkAll"/></label>'
            },
            defaultColumns: [
                { editor: columnEditor.hidden, filterable: false, title: '创建人', field: 'createUser', align: 'left', width: "100px"} ,
                { editor: columnEditor.hidden, filterable: false, title: '创建时间', field: 'createTime', align: 'left', width: "150px", template: timestampFormat("createTime")} ,
                { editor: columnEditor.hidden, filterable: false, title: '修改人', field: 'updateUser', align: 'left', width: "100px"} ,
                { editor: columnEditor.hidden, filterable: false, title: '修改时间', field: 'updateTime', align: 'left', width: "150px", template: timestampFormat("updateTime")}
            ]
        };

        function setValueInModel(model, key, value) {
            $("#" + key).val(value);
            $("#" + key).trigger("mls:setValue");
            model.set(key, value);
        }

        function tooLongContentFormat(dataItem, value) {
            if (dataItem[value] === undefined || dataItem[value] === null) {
                return "";
            }
            return "<span title=" + dataItem[value] + " class='text-ellipsis'>" + dataItem[value] + "</span>";
        }

        function timestampFormat(tempstamp, format) {
            var dateFormat = "yyyy/MM/dd HH:mm:ss";
            if (format === undefined) {
                format = dateFormat;
            }
            return "<span ng-bind=\"dataItem." + tempstamp + "|dateFilter|date:'" + format + "'\"></span>";
        }

        function codeFormat(field, codeType) {
            return"<span ng-bind=dataItem." + field + "|codeFormat:'" + codeType + "'></span>";
        }

        function whFormat(field) {
            if (field === undefined || !_.isString(field)) {
                field = 'warehouseId';
            }
            return"<span ng-bind=dataItem." + field + "|whFormat></span>";
        }

        function storerFormat(field) {
            if (field === undefined || !_.isString(field)) {
                field = 'storerId';
            }
            return"<span ng-bind=dataItem." + field + "|storerFormat></span>";
        }

        function shopFormat(field) {
            if (field === undefined || !_.isString(field)) {
                field = 'shopId';
            }
            return"<span ng-bind=dataItem." + field + "|shopFormat></span>";
        }

        function vendorFormat(field) {
            if (field === undefined || !_.isString(field)) {
                field = 'vendorId';
            }
            return"<span ng-bind=dataItem." + field + "|vendorFormat></span>";
        }

        function locationFormat(field) {
            if (field === undefined || !_.isString(field)) {
                field = 'locationId';
            }
            return"<span ng-bind=dataItem." + field + "|locationFormat></span>";
        }

        function zoneTypeFormat(field) {
            if (field === undefined || !_.isString(field)) {
                field = 'zoneId';
            }
            return"<span ng-bind=dataItem." + field + "|zoneTypeFormat></span>";
        }

        function zoneNoFormat(field) {
            if (field === undefined || !_.isString(field)) {
                field = 'zoneId';
            }
            return"<span ng-bind=dataItem." + field + "|zoneNoFormat></span>";
        }

        function carrierFormat(field) {
            if (field === undefined || !_.isString(field)) {
                field = 'carrierNo';
            }
            return"<span ng-bind=dataItem." + field + "|carrierFormat></span>";
        }

        //是/否
        //yesOrNoFormat:是|否
        //yesOrNoHoldFormat:已冻结|未冻结
        //yesOrNoCycleFormat:已盘点|未盘点
        //yesOrNoAuthFormat:已授权|未授权
        function yesOrNoFormat(field) {
            if (field === undefined || !_.isString(field)) {
                field = 'isNeedQc';
            }
            return"<span ng-bind=dataItem." + field + "|yesOrNoFormat></span>";
        }

        function checkboxTmp(field, format) {
            if (format === undefined || !_.isString(format)) {
                format = "yesOrNoFormat";
            }
            return '<input type="checkbox" #= ' + field + ' == 1 ? "checked=checked" : "" # format="|' + format + '"></input>';
        }

        function checkboxDisabledTmp(field, format) {
            if (format === undefined || !_.isString(format)) {
                format = "yesOrNoFormat";
            }
            return '<input disabled="disabled" type="checkbox" #= (' + field + ' == 1 || ' + field + ' == "true") ? "checked=checked" : "" # format="|' + format + '"></input>';
        }

        //授权专用
        function checkboxAuthTmp(field, format) {
            if (format === undefined || !_.isString(format)) {
                format = "yesOrNoFormat";
            }
            return '<input disabled="disabled" type="checkbox" #= ' + field + ' != "" ? "checked=checked" : "" # format="|' + format + '"></input>';
        }

        function processTreeData(data, idField, foreignKey, rootLevel, isKendoTree) {
            var hash = {};

            function clearLeafNodeItems(rootNode) {
                _.each(rootNode, function (node) {
                    if (node.items.length > 0) {
                        clearLeafNodeItems(node.items);
                    } else {
                        node.items = "";
                    }
                });
                return rootNode;
            }

            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var id = item[idField];
                var parentId = item[foreignKey];

                hash[id] = hash[id] || [];
                hash[parentId] = hash[parentId] || [];

                item.items = hash[id];
                hash[parentId].push(item);
            }
            if (isKendoTree) {
                return clearLeafNodeItems(hash[rootLevel]);
            } else {
                return hash[rootLevel];
            }
        }

        function headerTap() {
            var panelGroups, oPgParent, oPgWidth, oPgHeight, rol;
            var sBoolen = true;

            hideMorePg();

            $(window).resize(function () {
                if (sBoolen) {
                    hideMorePg();
                }
            });

            function hideMorePg() {
                var panel = $('.panel-heading .panel-group');
                panelGroups = panel.length;
                oPgParent = $('.panel-box-left').width();
                oPgWidth = panel.eq(0).width();
                oPgHeight = panel.eq(0).height();
                rol = parseInt(oPgParent / oPgWidth);

                if (panelGroups <= rol) {
                    $('#J_seachToggle').hide();
                } else {
                    $('#J_seachToggle').show();
                }

                for (var i = 0; i < panelGroups; i++) {
                    if (i >= rol) {
                        panel.eq(i).hide();
                    } else {
                        panel.eq(i).show();
                    }
                }
            }

            $('#J_seachToggle').on('click', function (ev) {
                //alert(Math.ceil(panelGroups/rol));
                if (sBoolen) {
                    $(this).find('i').removeClass('fa-angle-double-down');
                    $(this).find('i').addClass('fa-angle-double-up');
                    for (var i = 0; i < panelGroups; i++) {
                        if (i >= rol) {
                            $('.panel-heading .panel-group').eq(i).show();
                        }
                    }
                } else {
                    $(this).find('i').removeClass('fa-angle-double-up');
                    $(this).find('i').addClass('fa-angle-double-down');
                    hideMorePg();
                }
                sBoolen = !sBoolen;
            });
        }

        return {
            headerTap: headerTap,
            resetTableHeight: function (hasToobar, hasFooter, hasTabHeader) {
                var hasHeader = false;
                if ($('.panel-heading .panel-group').length > 0) {
                    hasHeader = true;
                    headerTap();
                }
                var oPanelBodyHeight = 0;
                var oNavBar = 36;
                var oGridToolbar = hasToobar === false ? 0 : 37;//$('.k-grid-toolbar').outerHeight()
                var oBreadTitle = 46;//$('.k-grid-header').outerHeight()
                var oGridHeader = 34;
                var oGridFooter = hasFooter === true ? 37 : 0;
                var oPagerWrap = 50;//footer page
                var oTabWrap = hasTabHeader === true ? 28 : 0;
                var totalHeightWithoutGrid = oGridToolbar + oPagerWrap + oGridHeader + oGridFooter + oTabWrap;

                function resetPbm() {
                    var oPanelBmHeight = hasHeader === false ? parseInt($('.app-content').css('padding-top')) :
                        $('.panel-box-main').outerHeight() + parseInt($('.panel-heading').css('margin-bottom')) + parseInt($('.app-content').css('padding-top'));
                    oPanelBodyHeight = parseInt($(window).height() - (oNavBar + oPanelBmHeight + oBreadTitle));
                    $('.panel-body').css('height', oPanelBodyHeight);
                }

                resetPbm();

                var isGridContent = null;
                if ($('.k-grid-content').get(0)) {
                    //clearInterval(isGridContent);
                    $('.k-grid-content').on('mousemove', function () {
                        $(this).off('mousemove');
                    });
                    $('.k-grid-content').eq(0).css('height', oPanelBodyHeight - totalHeightWithoutGrid);
                    $('.equal-height-grid-tab .k-grid-content').css('height', oPanelBodyHeight - totalHeightWithoutGrid);
                }

                $(window).resize(function () {
                    resetPbm();
                    $('.k-grid-content').eq(0).css('height', oPanelBodyHeight - totalHeightWithoutGrid);
                    $('.equal-height-grid-tab .k-grid-content').css('height', oPanelBodyHeight - totalHeightWithoutGrid);
                });

                $('#J_seachToggle').click(function () {
                    resetPbm();
                    $('.k-grid-content').eq(0).css('height', oPanelBodyHeight - totalHeightWithoutGrid);
                    $('.equal-height-grid-tab .k-grid-content').css('height', oPanelBodyHeight - totalHeightWithoutGrid);
                });
            },
            processTreeData: processTreeData,
            tooLongContentFormat: tooLongContentFormat,
            timestampFormat: timestampFormat,
            codeFormat: codeFormat,
            whFormat: whFormat,
            storerFormat: storerFormat,
            vendorFormat: vendorFormat,
            locationFormat: locationFormat,
            zoneTypeFormat: zoneTypeFormat,
            zoneNoFormat: zoneNoFormat,
            yesOrNoFormat: yesOrNoFormat,
            checkboxTmp: checkboxTmp,
            checkboxDisabledTmp: checkboxDisabledTmp,
            checkboxAuthTmp: checkboxAuthTmp,
            shopFormat: shopFormat,
            carrierFormat: carrierFormat,
            setValueInModel: setValueInModel,
            columnEditor: columnEditor,
            CommonColumns: CommonColumns
        };

    }());
    function getButtonIds(userInfo, pagePath) {
        var isAdmin = userInfo.authority.isAdmin,
            perm = userInfo.authority.perm,
            buttonIds = 'All';
        if (isAdmin === undefined && perm === undefined) {
            return buttonIds;
        }
        if (!isAdmin) {
            var buttons = perm[pagePath];
            if (_.isArray(buttons)) {
                buttonIds = _.map(buttons, function (record) {
                    return 'btn-auth-' + record.buttonId;
                });
            }
        }
        return buttonIds;
    }

    function removeBtn(userInfo, pagePath, element) {
        var buttonIds = getButtonIds(userInfo, pagePath);
        if (_.isArray(buttonIds)) {
            element.find(".k-button").each(function () {
                var $el = $(this);
                if (_.intersection(buttonIds, $el.attr("class").split(" ")).length === 0) {
                    $el.remove();
                }
            });
        }
    }

    var gridDefaultOptions = {
        sortable: true,
        resizable: true,
        pageable: {
            refresh: true,
            pageSizes: [30, 50, 100, 200, 300, 500],
            buttonCount: 5,
            input: true,
            numeric: false,
            messages: {
                page: '',
                of: '/{0}',
                itemsPerPage: '条',
                display: "{0}-{1} 条 &nbsp;共{2}条",
                refresh: '',
                empty: '暂无数据'
            }
        },
        editable: {
            mode: "popup"
        },
        filterable: false,
//    reorderable: true,
//    filterable: {
//      extra: false,
//      operators: {
//        string: {
//          contains: "模糊查询"
//        }
//      }
//    },
        columnMenu: {
            sortable: false,
            messages: {
                columns: "显示"
//        ,filter: "搜索"
            }
        },
        // selectable: "multiple rows",
        edit: function (e) {
            var editWindow = e.container.data("kendoWindow");
            var moduleName = e.sender.options.moduleName;
            var title = '';

            if (moduleName !== undefined) {
                title += moduleName;
            }
            if (e.model.isNew()) {
                e.container.data("kendoWindow").title('新增' + title);
                $(".k-grid-update").html("<span class='k-icon k-add'></span>保存");
            }
            else {
                e.container.data("kendoWindow").title('编辑' + title);
            }
        },
        detailExpand: function (e) {
            var navLeft = 150,
                masterRowWidth = e.masterRow.width(),
                maxDetailRowWidth = $(window).width() - navLeft - 100;
            e.detailRow.find("div:first").css('width', Math.min(masterRowWidth, maxDetailRowWidth));
        },
        dataBound: function (e) {
            var grid = e.sender,
                scope = grid.$angular_scope,
                userInfo = scope.user,
                path = scope.location.path().substring(1);
//      removeBtn(userInfo, path, grid.element);
        }
    };
    MLS.WMS.GRIDUTILS = (function () {
        /**
         * 获得grid中行记录
         * @param grid
         * @returns {Array}
         */
        var getSelectedData = function (grid) {
            var selectedRow = grid.select();
            var selectedData = [];
            selectedRow.each(function (index, row) {
                selectedData.push(grid.dataItem(row));
            });
            return selectedData;
        };

        /**
         * 获得grid中行记录
         * @param grid
         * @returns {Array}
         */
        var getCustomSelectedData = function (grid) {
            //var rows = $('[kendo-grid]').find(".k-state-selected[role='row']");
            var rows = grid.element.find(".k-state-selected[role='row']");//5.5 解决多个kendo-grid，选中后有多个rows
            var selectedData = [];
            _.each(rows, function (row) {
                if ($(row).find('.commonColumns_sub_checkbox').length > 0) {
                    if (grid.dataItem(row)) {
                        selectedData.push(grid.dataItem(row));
                    }
                }
            });
            return selectedData;
        };

        var selectSingleRow = function (e) {
            var element = $(e.currentTarget);
            var checked = element.is(':checked'),
                flag = true,
                isChecks = element.closest('[kendo-grid]').find("[isCheck]"),
                titleCheck = element.closest('[kendo-grid]').find("[titleCheck]"),
                row = element.closest("tr"),
                grids = element.closest('[kendo-grid]').data("kendoGrid");
            titleCheck.attr("checked", false);
            if (checked) {
                //grids.select(row);
                row.addClass("k-state-selected");
                $.each(isChecks, function (index) {
                    if (index !== 0 && !$(this).is(':checked')) {
                        flag = false;
                    }
                });
                if (flag) {
                    titleCheck.attr("checked", true);
                }
            } else {
                row.removeClass("k-state-selected");
            }
            if (grids.options.customChange) {
                grids.options.customChange(grids);
            }
        };

        var selectAllRow = function (e) {
            var element = $(e.currentTarget);
            var checked = element.is(':checked'),
                isChecks = element.closest('[kendo-grid]').find("[isCheck]"),
                rows = element.closest('[kendo-grid]').find("tr"),
                grid = element.closest('[kendo-grid]').data("kendoGrid");
            if (checked) {
                $.each(rows, function (index) {
                    if (index !== 0)
                        $(this).addClass("k-state-selected");

                    // grid.select($(this));
                    //$(this).addClass("k-state-selected");
                });
                $.each(isChecks, function () {
                    $(this)[0].checked = true;
                });
            } else {
                $.each(rows, function (index) {
                    if (index !== 0)
                        $(this).removeClass("k-state-selected");
                    //grid.clearSelection($(this));

                });
                $.each(isChecks, function () {
                    $(this).attr("checked", false);
                });
            }
            if (grid.options.customChange) {
                grid.options.customChange(grid);
            }
        };
        var getGridOptions = function (options, scope) {
            var functionOptions = ['edit', 'dataBound', 'detailExpand'];
            _.each(functionOptions, function (optionKey) {
                if (_.isFunction(options[optionKey])) {
                    var newOptions = _.clone(options);
                    options[optionKey] = function (e) {
                        newOptions[optionKey].call(e.sender, e);
                        gridDefaultOptions[optionKey].call(e.sender, e);
                    };
                }
            });
            _.defaults(options, gridDefaultOptions);

            // 所有页面添加导出按钮
            if(options.exportable){
                options.toolbar =  options.toolbar || [];
                options.toolbar.push({template: '<kendo-button class="k-primary" ng-click="exportExcelAll($event)">导出所有</kendo-button>'
                });
            }

            // 弹出window统一设置成不能修改大小
            if (_.isObject(options.editable) && options.editable.mode === "popup") {
                if (!_.isObject(options.editable.window)) {
                    options.editable.window = {};
                }
                options.editable.window.resizable = false;
            }
            if (scope !== undefined) {
                var btnIds = getButtonIds(scope.user, scope.location.path().substring(1));
                if (_.isArray(btnIds)) {
                    // 根据权限过滤toolbar的操作Btn
                    if (_.isArray(options.toolbar)) {
                        options.toolbar = _.filter(options.toolbar, function (btn) {
                            if (btn.className === undefined) {
                                return true;
                            }
                            if (_.intersection(btnIds, btn.className.split(" ")).length !== 0) {
                                return true;
                            }
                        });

                    }
                    // 根据权限过滤操作
                    if (_.isArray(options.columns)) {
                        _.each(options.columns, function (column) {
                            if (column.title === "操作") {
                                column.command = _.filter(column.command, function (command) {
                                    if (command.className !== undefined &&
                                        _.intersection(btnIds, command.className.split(" ")).length !== 0) {
                                        return true;
                                    }
                                });
                            }
                        });
                    }
                }
            }
            return options;
        };

        var customButton = function (name, text, callback) {
            this.name = name;
            this.text = text;
            this.callback = callback;
        };
        customButton.prototype = {
            init: function (options, callback) {
                if (!_.isFunction(callback)) {
                    callback = this.callback;
                }
                return { name: this.name, text: this.text, className: options.className,
                    click: function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        var tr = $(e.target).closest("tr"),
                            grid = this;
                        var data = grid.dataItem(tr);
                        callback(grid, data);
                    }};
            }
        };
        var deleteButton = new customButton("Delete", "<span class='k-icon k-delete'></span><span ng-hide='dataItem.deleteHide'>删除</span></a>", function (grid, data) {
            $.when(kendo.ui.ExtOkCancelDialog.show({
                    title: "确认",
                    message: "是否确定删除数据",
                    icon: 'k-ext-question'})
            ).done(function (resp) {
                    if (resp.button === "OK") {
                        if (_.isFunction(grid.dataSource.transport.preDestroy)) {
                            grid.dataSource.transport.preDestroy(data, grid);
                        } else {
                            if (_.isFunction(grid.options.customerRemove)) {
                                grid.options.customerRemove.apply(grid, [data]);
                            }
                            grid.dataSource.remove(data);
                        }
                    }
                });
        });


        var CommonOptionButton = function (type) {
            var editBtn = 'btn-auth-edit',
                deleteBtn = 'btn-auth-delete';
            if (type !== undefined) {
                editBtn = editBtn + "-" + type;
                deleteBtn = deleteBtn + "-" + type;
            }
            return { title: '操作', command: [
                { name: "edit", className: editBtn, template: "<a class='k-button k-button-icontext k-grid-edit' href='\\#'><span class='k-icon k-edit'></span>编辑</a>",
                    text: { edit: "编辑", cancel: "取消", update: "更新" } },
                deleteButton.init({className: deleteBtn})
            ],
                width: "100px"
            };
        };

        var editOptionButton = function (type) {
            var editBtn = 'btn-auth-edit';
            if (type !== undefined) {
                editBtn = editBtn + "cancel-" + type;
            }
            return { title: '操作', command: [
                { name: "edit", className: editBtn, template: "<a class='k-button k-button-icontext k-grid-edit' href='\\#'><span class='k-icon k-edit'></span>编辑</a>",
                    text: { edit: "编辑", cancel: "取消", update: "更新" } }
            ],
                width: "100px"
            };
        };

        var deleteOptionButton = function (type) {
            var deleteBtn = 'btn-auth-delete';
            if (type !== undefined) {
                deleteBtn = deleteBtn + "-" + type;
            }
            return { title: '操作', command: [
                deleteButton.init({className: deleteBtn})
            ],
                width: "100px"
            };
        };

        return {
            getSelectedData: getSelectedData,
            getGridOptions: getGridOptions,
            CommonOptionButton: CommonOptionButton,
            editOptionButton: editOptionButton,
            deleteOptionButton: deleteOptionButton,
            deleteButton: deleteButton.init({className: 'btn-auth-delete'}),
            getCustomSelectedData: getCustomSelectedData,
            selectSingleRow: selectSingleRow,
            selectAllRow: selectAllRow
        };
    }());


    window.WMS = MLS.WMS;
});