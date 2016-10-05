define(['app'], function (app) {
  'use strict';

  var $stateProviderRef = null;

  app.config(function ($locationProvider, $urlRouterProvider, $stateProvider) {
    $urlRouterProvider.deferIntercept();
    $urlRouterProvider.otherwise('/');

//    $locationProvider.html5Mode({enabled: true});
    $stateProviderRef = $stateProvider;
  });

  app.run(['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.$on('$stateChangeStart', function (event, current, toParams, fromState, fromParams, error) {
        if (current.code === "system.reportTmpSetting") {
          event.preventDefault();
          $state.go('system');
        }
      });
      $rootScope.$on('$stateChangeSuccess',
        function (event, current, toParams, fromState, fromParams, error) {
          $rootScope.title = current.title;
          var currentLeftMenu = _.find($rootScope.menu, function(record){
            return current.code.indexOf(record.code) === 0;
          });
          if (currentLeftMenu) {
            $rootScope.navList = currentLeftMenu.children;
          }
        });
        $rootScope.$on('$viewContentLoaded',
        function(event){
          WMS.UTILS.headerTap();
        });
    }]);
  app.run(['$q', '$rootScope','$http', '$urlRouter', 'url', 'sync',
    function ($q, $rootScope, $http, $urlRouter, url , sync)
    {
      var menu_url = url.menu;
      function addState(states) {
        _.each(states, function (value, key) {
          var state = {
            "id": value.id,
            "url": "^/" + value.path,
            "title": value.name
          };
          state.code = value.code = value.path.replace(/\//g,'.');

          if (_.isArray(value.children) && value.children.length > 0) {
            state.template = "<ui-view/>";
            $stateProviderRef.state(value.code, state);
            addState(value.children);
          } else {
            state.templateUrl = "/app/tmpl/" + value.path + ".html";
            $stateProviderRef.state(value.code, state);
          }
        });
      }

      kendo.ui.ExtWaitDialog.show({
        title: "处理中",
        message: "数据加载中,请稍后..." });
        if ($rootScope.user === undefined || $rootScope.user.authority === undefined) {
           $rootScope.user = {
              authority: {},
              roleName :"",
              userName:""
            };
           //初始化权限
           sync(url.permUrl, 'GET',{wait:false}).then(function (resp) {
              $rootScope.user.authority = resp.result;
              $rootScope.user.roleName = resp.result.roleName;
              $rootScope.user.userName = resp.result.userName;
              //初始化菜单
              sync(url.naviUrl, 'GET',{wait:false}).then(function (resp) {
                  var menu = resp.result;
                  if (_.isArray(menu) && menu.length > 0) {
                    //添加module元素
                    addState(menu);
                    // 版本更新LINK补充
                    $stateProviderRef.state("version", {
                      "code":"system.version",
                      "url": "^/system/version",
                      "title": "更新历史",
                      "templateUrl": "/app/tmpl/system/version.html"
                    });
                    $urlRouter.sync();
                    $urlRouter.listen();
                    $rootScope.menu = menu;
                    $rootScope.navList = $rootScope.menu[0].children;
                     kendo.ui.ExtWaitDialog.hide();
                  }
              });
           });
        }
    }]);
});
