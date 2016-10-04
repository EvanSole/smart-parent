define(['app'], function(app) {
  'use strict';
  app.run(['$rootScope','$location', function($rootScope) {
      $rootScope.app = {
        name: 'WMS',
        settings: {
          headerFixed: true,
          asideFixed: true,
          asideFolded: false,
          asideDock: false,
          container: false
        }
      };
      //全局事件响应 登出
      $rootScope.$on('event:loginRequired',function(){
        window.location='/login';
      });
    }]);
});
