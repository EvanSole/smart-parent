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
                    samplingRatio: {type:"number"},
//                    isIntCeiling: {type:"boolean",defaultValue:""},
                    isActive: {type:"boolean" },
                    description: { type: "string" }
                }
            }
        };
    });