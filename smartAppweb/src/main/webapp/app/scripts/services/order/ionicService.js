define(['scripts/services/services',''], function(service) {
    "use strict";
     service.factory('ionicService',['$scope', '$rootScope','$timeout','sync', 'url',
        function ($scope, $rootScope, $timeout, $sync, $url) {
            return {
                getIonic:function(){

                },
                updateIonic:function(){

                },
                saveIonic:function(){

                }
            }
        }
    ])
})
