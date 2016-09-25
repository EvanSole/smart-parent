define(['scripts/controller/controllers','scripts/services/service'], function(controller) {
    "use strict";
    controller.controller('ionicController',
        ['$scope', '$rootScope','$timeout', 'sync', 'url',
            function ($scope, $rootScope, $timeout, $sync, $url, ionicService) {

                ionicService.getIonic();

            }
        ])
})