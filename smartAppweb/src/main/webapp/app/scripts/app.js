define([
    'angular',
    'jquery',
    'utils',
    'angular-route',
    'angular-locale',
    'angular-sanitize',
//    'ui-bootstrap',
    'ui-bootstrap-tpls',
    'ui-router',
    'ui-select',
    'ui-breadcrumbs',
    'angular-file-upload',
    'scripts/controller/define',
    'kendo-directives'
], function(angular) {
    "use strict";
    return angular.module('app', ['ngLocale', 'ngRoute',
      'kendo.directives', 'ui.bootstrap', 'ui.router','ui.select',
        'ngSanitize',
      'angularUtils.directives.uiBreadcrumbs', 'angularFileUpload', 'app.controllers']);

});
