/**
 * Created by fuminwang on 15/3/27.
 */
define(['kendo'],
    function(kendo){
        'use strict';
        return {
            entity:{
                id:"id",
                fields: {
                    id: {type:"number", editable: false, nullable: true },
                    strategyName: {type:"string"},
                    isDefault: {type:"boolean"},
                    fieldCode: {type:"string"},
                    directionCode: {type:"string"},
                    cartonFirst: {type:"boolean"},
                    isBulk: {type:"boolean" },
                    isActive: {type:"boolean" },
                    retryInterval: {type: "number" },
                    description: { type: "string" }
                }
            }
        };
    });