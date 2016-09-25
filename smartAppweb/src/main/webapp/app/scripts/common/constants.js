define(['app'], function (app) {
    "use strict";
    app
        .constant('tmpl', {})
        .constant('datepickerConfig', {
            formatDay: 'dd',
            formatMonth: 'MMMM',
            formatYear: 'yyyy',
            formatDayHeader: 'EEE',
            formatDayTitle: 'MMMM yyyy',
            formatMonthTitle: 'yyyy',
            datepickerMode: 'day',
            minMode: 'day',
            maxMode: 'year',
            showWeeks: false,
            startingDay: 0,
            yearRange: 20,
            minDate: null,
            maxDate: null
        })
        .constant('datepickerPopupConfig', {
            datepickerPopup: 'yyyy/MM/dd 00:00:00',
            showWeeks: false,
            currentText: '今天',
            clearText: '清除',
            closeText: '关闭',
            showButtonBar: true,
            closeOnDateSelection: true
        });

});
