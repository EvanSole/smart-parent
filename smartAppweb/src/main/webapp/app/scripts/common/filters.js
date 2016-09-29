define(['app'], function (app) {
    'use strict';
    app.filter('codeFormat', function () {
        return function (input, codeType) {
            var codeArr = window.WMS.CODE_SELECT_DATA[codeType];
            var txt = '';

            if (codeArr !== undefined) {
                for (var i = 0; i < codeArr.length; i++) {
                    var data = codeArr[i];
                    if (data.value == input) {
                        txt = data.key;
                    }
                }
            }
            return txt;
        };
    });

    app.filter('whFormat', function () {
        return function (input) {
            var whArr = window.WMS.WAREHOUSE_DATA;
            var txt = input;
            if (whArr !== undefined) {
                for (var i = 0; i < whArr.length; i++) {
                    if (whArr[i].value == input) {
                        txt = whArr[i].key;
                    }
                }
            }
            return txt;
        };
    });


    app.filter('storerFormat', function () {
        return function (input) {
            var stArr = window.WMS.STORER_DATA;
            var txt = input;
            if (stArr !== undefined) {
                for (var i = 0; i < stArr.length; i++) {
                    if (stArr[i].value == input) {
                        txt = stArr[i].key;
                    }
                }
            }
            return txt;
        };
    });

    app.filter('shopFormat', function () {
        return function (input) {
            var stArr = window.WMS.SHOP_DATA;
            var txt = input;
            if (stArr !== undefined) {
                for (var i = 0; i < stArr.length; i++) {
                    if (stArr[i].value == input) {
                        txt = stArr[i].key;
                    }
                }
            }
            return txt;
        };
    });

    app.filter('receiptStrategyFormat', function () {
        return function (input) {
            var stArr = window.WMS.RECEIPT_STRATEGY_DATA;
            var txt = input;
            if (stArr !== undefined) {
                for (var i = 0; i < stArr.length; i++) {
                    if (stArr[i].value == input) {
                        txt = stArr[i].key;
                    }
                }
            }
            return txt;
        };
    });

    app.filter('commodityTypeFormat', function () {
        return function (input) {
            var stArr = window.WMS.COMMODITY_TYPE_DATA;
            var txt = input;
            if (stArr !== undefined) {
                for (var i = 0; i < stArr.length; i++) {
                    if (stArr[i].value == input) {
                        txt = stArr[i].key;
                    }
                }
            }
            return txt;
        };
    });


    app.filter('qcStrategyFormat', function () {
        return function (input) {
            var stArr = window.WMS.QC_STRATEGY_DATA;
            var txt = input;
            if (stArr !== undefined) {
                for (var i = 0; i < stArr.length; i++) {
                    if (stArr[i].value == input) {
                        txt = stArr[i].key;
                    }
                }
            }
            return txt;
        };
    });



    app.filter('vendorFormat', function () {
        return function (input) {
            var stArr = window.WMS.SUPPLIER_DATA;
            var txt = input;

            if (stArr !== undefined) {
                for (var i = 0; i < stArr.length; i++) {
                    if (stArr[i].value == input) {
                        txt = stArr[i].key;
                    }
                }
            }
            return txt;
        };
    });

    app.filter('dateFilter', function () {
        return function (input) {
            if(input == 0){
                return null;
            }

            return input;
        };
    });

    app.filter('locationFormat', function () {
        return function (input) {
            var stArr = window.WMS.LOCATION_DATA;
            var txt = input;

            if (stArr !== undefined) {
                for (var i = 0; i < stArr.length; i++) {
                    if (stArr[i].value == input) {
                        txt = stArr[i].key;
                    }
                }
            }
            return txt;
        };
    });
    app.filter('carrierFormat', function () {
        return function (input) {
            var stArr = window.WMS.CARRIER_DATA;
            var txt = input;

            if (stArr !== undefined) {
                for (var i = 0; i < stArr.length; i++) {
                    if (stArr[i].value == input) {
                        txt = stArr[i].key;
                    }
                }
            }
            return txt;
        };
    });
    app.filter('zoneTypeFormat', ['$filter', function ($filter) {
        return function (input) {
            var stArr = window.WMS.ZONE_DATA;
            var txt = input;


            if (stArr !== undefined) {
                for (var i = 0; i < stArr.length; i++) {
                    if (stArr[i].id == input) {
                        txt = stArr[i].typeCode;
                    }
                }
            }
            return $filter('codeFormat')(txt, 'ZoneType');
        };
    }]);

    app.filter('zoneNoFormat', ['$filter', function ($filter) {
        return function (input) {
            var stArr = window.WMS.ZONE_DATA;
            var txt = input;

            if (stArr !== undefined) {
                for (var i = 0; i < stArr.length; i++) {
                    if (stArr[i].id == input) {
                        txt = stArr[i].zoneNo;
                    }
                }
            }
            return txt;
        };
    }]);

    app.filter('yesOrNoFormat', ['$filter', function ($filter) {
        return function (input) {
            var txt = "否";
            if (input === '1' || input === true) {
                txt = "是";
            }
            return txt;
        };
    }]);

    app.filter('dataIgnore', ['$filter', function ($filter) {
        return function (input) {
            if(input === '1970-01-01 08:00:00'){
                return "";
            }
            return input;
        };
    }]);
});