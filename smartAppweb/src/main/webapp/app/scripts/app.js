define([
    'angular',
    'kendo',
    'scripts/services/defineServices',
    'scripts/controllers/defineControllers',
    'scripts/directives/defineDirectives',
    'scripts/filters/defineFilters'
], function(angular) {
    "use strict"
     return angular.module('app',['ui.router','ng-breadcrumbs','kendo.directives','ui.bootstrap','app.controllers','app.services']);
});

