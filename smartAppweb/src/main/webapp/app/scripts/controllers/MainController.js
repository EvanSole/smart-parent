define(['scripts/controllers/controllers','scripts/services/services'], function(controller) {
    "use strict";
    controller.controller('MainController',function ($scope, $rootScope, $timeout, $http, UserService ) {
      console.log(" MainController ... "); 
      $scope.label = "主页";

      //$scope.breadcrumbs = { options: {'path':'index/user','label':'用户管理'}};

      $scope.breadcrumbs = [ {'path':'index/user','label':'System'},
                             {'path':'index/user','label':'Home'} 
                           ];                  
    

    });
})