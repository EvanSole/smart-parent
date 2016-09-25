define(['app'],function(app){
    "use strict";

     //localUrl
     window.BASEPATH = "http://127.0.0.1:8080";

     app.constant('url', {

            loginUrl : window.BASEPATH + '/api/login',
            logoutUrl: window.BASEPATH + '/api/logout',
            userUrl : window.BASEPATH + '/api/user',
            roleUrl : window.BASEPATH + '/api/role',
            menuUrl : window.BASEPATH + '/api/menu',
            permissionsUrl : window.BASEPATH + '/api/permissions',

            codeDataUrl : window.BASEPATH + '/api/base/codeData'
     });

});