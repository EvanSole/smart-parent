requirejs.config({
  baseUrl: './',
  waitSeconds: 60,
  paths: {
    //定义基础路径，其他的path等路径是基于基础路径进行引入的。如果不配置，默认为引入requireJS页面所在的位置
    'jquery': 'bower_components/jquery/dist/jquery.min',
    'angular': 'bower_components/angular/angular.min',
    'angular-resource': 'bower_components/angular-resource/angular-resource.min',
    'angular-cookies': 'bower_components/angular-cookies/angular-cookies.min',
    'angular-sanitize': 'bower_components/angular-sanitize/angular-sanitize.min',
    'angular-async-loader':'bower_components/angular-async-loader/dist/angular-async-loader.min',
    'ui-router': 'bower_components/angular-ui-router/release/angular-ui-router',
    'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap.min',
    'bootstrap-hover-dropdown':'scripts/assets/bootstrap-hover-dropdown.min',
    'ui-bootstrap': 'bower_components/angular-bootstrap/ui-bootstrap.min',
    'ui-bootstrap-tpls': 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
    'ng-breadcrumbs':'bower_components/ng-breadcrumbs/ng-breadcrumbs.min',
    'require':'bower_components/requirejs/require',
    'blockui':'scripts/assets/jquery.blockui.min',
    'global-app':'scripts/assets/global.app.min',
    'layout':'scripts/assets/layout.min',
    'quick-sidebar':'scripts/assets/quick-sidebar.min',
    'kendo': 'bower_components/kendo/js/kendo.all.min',
    'kendo-directives': 'bower_components/kendo/js/kendo.directives',
    'underscore':'bower_components/underscore/underscore-min',
    'app':'scripts/app',
    'sync':'scripts/common/sync'
  },
  shim: {
  	/*** shim 用来处理一些没有遵守requirejs规范的js库,可在里面对它们进行一些依赖声明、初始化操作等*/
    'angular' : { exports :'angular',deps: ['jquery']},
    'angular-resource': {deps: ['angular']},
    'ui-router': {deps: ['angular'], exports: 'angular-route'},
    'angular-cookies': {deps: ['angular']},
    'ng-breadcrumbs': {deps: ['angular']},
    'bootstrap': {deps: ['jquery']},
    'ui-bootstrap': {deps: ['angular']},
    'bootstrap-hover-dropdown' :{deps: ['jquery']},
    'layout' :{deps: ['jquery','global-app']},
    'quick-sidebar' :{deps: ['jquery','global-app']},
    'kendo' : { exports :'kendo' ,deps: ['angular','jquery']},
    'kendo-directives': {deps: ['kendo','angular','jquery']},
    'sync': { exports :'sync' , deps: ['underscore','jquery']}

  },
  deps:['bootstrap'],
  urlArgs: "bust=" + (new Date()).getTime()  //防止读取缓存，调试用
});


require([
    'jquery',
    'angular',
    'app',
    'bootstrap',
    'ui-router',
    'ui-bootstrap',
    'underscore',
    'scripts/config',
    'ng-breadcrumbs',
    'bower_components/kendo/js/custom/kendo.web.ext',
    'bower_components/kendo/js/custom/kendo.validator',
    'bower_components/kendo/js/custom/kendo.messages.zh-CN',
    'bootstrap-hover-dropdown',
    'blockui',
    'quick-sidebar',
    'global-app',
    'layout',
    'kendo',
    'sync',
    'scripts/common/constants',
    'scripts/common/codeData',
    'scripts/common/utils',
    'scripts/common/router',
    'scripts/common/commDataSource',
    'scripts/common/directive',
    'scripts/common/filters'

], function (require,angular) {
    'use strict';
    $(document).ready(function () {
        App.init();   //初始化
        Layout.init();
        //启动angularjs
        angular.bootstrap(document, ['app']);
    });
});
