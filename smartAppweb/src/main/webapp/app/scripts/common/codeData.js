define(['app'], function (app) {
    'use strict';
    app.factory('initializeData', ['sync', function ($sync) {
        return {
            init: function (func) {
                console.log("initializeData...");
            }
        }
    }]);
});