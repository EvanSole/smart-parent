require.config({
    baseUrl: './',
    waitSeconds: 60,
    urlArgs: 'V2.1.01.21.1',
    paths: {
        'jquery': 'bower_components/jquery/jquery-latest.min',
        'angular': 'bower_components/angular/angular',
        'angular-locale': 'bower_components/angular/angular-locale_zh-cn',
        'angular-route': 'bower_components/angular-route/angular-route.min',
        'angular-resource': 'bower_components/angular-resource/angular-resource.min',
        'angular-sanitize': 'bower_components/angular-sanitize/angular-sanitize.min',
        'angular-cookies': 'bower_components/angular-cookies/angular-cookies.min',
        'angular-mocks': 'bower_components/angular-mocks/angular-mocks',
        'angular-animate': 'bower_components/angular-animate/angular-animate.min',

        'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap.min',
//      'ui-bootstrap-tpls': 'scripts/directives/ui-bootstrap-tpl.min',
        'ui-bootstrap-tpls': 'scripts/common/ui-bootstrap-tpls',

        'ui-utils': 'bower_components/angular-ui-utils/ui-utils.min',

        'ui-router': 'bower_components/angular-ui-router/release/angular-ui-router',
        'ui-select': 'bower_components/angular-ui-select/dist/select.min',
        'ui-breadcrumbs': 'bower_components/angular-utils-ui-breadcrumbs/uiBreadcrumbs',
        'angular-file-upload': 'bower_components/angular-file-upload/angular-file-upload',
        'underscore': 'bower_components/underscore/underscore-min',
        'kendo': 'bower_components/kendo/kendo.all.min',
        'kendo-directives': 'bower_components/kendo/kendo.directives',
        'requirejs-domReady': 'bower_components/requirejs-domReady/domReady',

        'ui-utils-ieshiv': 'bower_components/angular-ui-utils/ui-utils-ieshiv.min',
        'utils': 'scripts/common/utils',
        'app': 'scripts/app'

    },
    shim: {
        'angular': {
            exports: 'angular',
            deps: ['jquery']
        },
        'angular-resource': {
            deps: ['angular']
        },
        'angular-locale': {
            deps: ['angular']
        },
        'angular-route': {
            deps: ['angular']
        },
        'angular-cookies': {
            deps: ['angular']
        },
        'angular-sanitize': {
            deps: ['angular']
        },
        'ui-router': {
            deps: ['angular']
        },
        'ui-breadcrumbs': {
            deps: ['angular']
        },
        'ui-select': {
            deps: ['angular']
        },
        'angular-file-upload': {
            deps: ['angular']
        },
        'kendo': {
            deps: ['jquery'],
            exports: 'kendo'
        },
        'ui-utils': {
            deps: ['angular', 'ui-utils-ieshiv']
        },
        'ui-bootstrap-tpls': {
            deps: ['angular']
        },
        'utils': {
            deps: ['jquery', 'kendo', 'underscore'],
            exports: 'WMS'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'ui-bootstrap': {
            deps: ['angular']
        },
        'kendo-directives': {
            deps: ['kendo','angular','jquery']
        }
    }
});
define([
    'require',
    'angular',
    'scripts/common/config',
    'app',
    'scripts/common/kendo.web.ext',
    'scripts/common/kendo.validator',
    'scripts/common/config.base',
    'scripts/common/const',
    'scripts/common/directive',
    'scripts/common/naviDirective',
    'scripts/common/filters',
    'scripts/common/stateRoutes',
    'scripts/common/sync',
    'scripts/common/baseDataEnum',
    'scripts/common/wmsPrint',
    'scripts/common/wmsReportPrint',
    'scripts/common/wmsDataSource',
    'scripts/common/kendo.messages.zh-CN',
    'scripts/main',
    'scripts/common/wmsLog'
], function (require, angular) {
    'use strict';
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
    });
});

