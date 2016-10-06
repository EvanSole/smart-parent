
define(['scripts/controller/controller',''], function(controller) {
    "use strict";
    controller.controller('portletController',
        ['$scope', '$rootScope', 'sync', 'url', 'wmsDataSource', '$timeout',
            function ($scope, $rootScope, $sync, $url, wmsDataSource, $timeout) {
                console.log(" PortletController ... ");

              function createChart(){

                    $("#chart").kendoChart({
                        title: {
                            text: "作业绩效报表"
                        },
                        legend: {
                            visible: false
                        },
                        seriesDefaults: {
                            type: "bar"
                        },
                        series: [{
                            name: "Total Visits",
                            data: [56000, 63000, 74000, 91000, 117000, 138000]
                        }, {
                            name: "Unique visitors",
                            data: [52000, 34000, 23000, 48000, 67000, 83000]
                        }],
                        valueAxis: {
                            max: 140000,
                            line: {
                                visible: false
                            },
                            minorGridLines: {
                                visible: true
                            },
                            labels: {
                                rotation: "auto"
                            }
                        },
                        categoryAxis: {
                            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                            majorGridLines: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true,
                            template: "#= series.name #: #= value #"
                        }
                    });
             }
             $(document).ready(createChart);
             $(document).bind("kendo:skinChange", createChart);
            }
        ])
});