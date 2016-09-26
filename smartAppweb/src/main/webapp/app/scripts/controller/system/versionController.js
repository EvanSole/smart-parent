/**
 * Created by a2015-217 on 15/7/8.
 */
define(['scripts/controller/controller',''], function(controller) {
    "use strict";
    controller.controller('versionController',
        ['$scope', '$rootScope',
            function($scope, $rootScope) {

                    var versionDes = $rootScope.versionDes;

                    var historyVersion = "";
                    for (var i = 0; i < versionDes.length; i++) {
                        historyVersion = historyVersion + "<li><h2><span>" + versionDes[i].releasedTime + "</span><em></em></h2><div class='detail'><em></em>";
                        historyVersion = historyVersion + "<div class='detail_span1'><span style='font-size: 24px;font-family:-webkit-pictograph;'>"+versionDes[i].versionNo+"</span></div><p class='detail_bt'></p><ul>";
                        var detailLi = "";
                        var contentDatas = versionDes[i].content;
                        for (var j = 0; j < contentDatas.length; j++) {
                            detailLi = detailLi + "<li >" +(j+1)+"."+ contentDatas[j] + "</li>";
                        }
                        historyVersion = historyVersion + detailLi + "</ul></div></li>";
                    }
                    $("#versionDes").after(historyVersion);
            }
        ])
})