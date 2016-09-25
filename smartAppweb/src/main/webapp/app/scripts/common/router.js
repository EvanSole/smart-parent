define( ['app'],function (app) {
  
  'use strict';
   
        app.run(['$rootScope', '$state', '$window','$stateParams', function($rootScope, $state, $window, $stateParams){
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.user = null;

            $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
                // 如果是进入登录界面则允许
                if(toState.name == 'login')
                    return;
                // 如果用户不存在
                if(JSON.parse($window.sessionStorage["userInfo"]) == null){
                    event.preventDefault();// 取消默认跳转行为
                    $state.go("login",{from:fromState.name,w:'notLogin'});//跳转到登录界面
                }
            });

            $rootScope.$on('$stateChangeSuccess',function (event, current, toParams, fromState, fromParams) {

            });

        }])

        .config(['$stateProvider', '$urlRouterProvider','$httpProvider',function ($stateProvider, $urlRouterProvider,$httpProvider) {
        
          //用户登陆拦截器
          //$httpProvider.interceptors.push('UserInterceptor');
      
          $urlRouterProvider.otherwise('/login');

          $stateProvider
              .state('login',{
                  url : '/login',
                  views : {
                      '': {
                        templateUrl : 'login.html'
                      }
                  }
              })
              .state('index',{
                 url : '/index',
                 views :{
                     '' : {
                         templateUrl : 'views/layout/nav.html'
                     },
                     'header@index' : {
                         templateUrl : 'views/layout/header.html'
                     },
                     'sidebar@index' : {
                         templateUrl : 'views/layout/sidebar.html',
                         controller  : 'MainController',
                         label: 'Home'
                     },
                     'main@index' : {
                         templateUrl : 'views/layout/sidebar_portlet.html'
                     }
                 }
             })
             .state('index.user',{
                 url : '/user',
                 views : {
                      'main@index' : {
                         templateUrl : 'views/system/user.html'
                      }
                 }
             })
             .state('index.role',{
                  url : '/role',
                  views : {
                      'main@index' : {
                         templateUrl : 'views/system/role.html'
                      }
                  }
             })
             .state('index.permission',{
                  url : '/permission',
                  views : {
                      'main@index' : {
                         templateUrl : 'views/system/permission.html'
                      }
                  }
             })
      }]);



});

