/**
 * Created by fuminwang on 15/3/27.
 */
define(['kendo'],
    function(kendo){
        'use strict';
        return {
            cycleHeader:{
                id:"id",
                fields: {
                    id: {type:"number", editable: false, nullable: true },
                    strategyName: {type:"string",  nullable: true },
                    isDefault: {type:"string",  nullable: true },
                    deliveryTagCode: {type:"string",  nullable: true },
                    allocateRuleCode: {type:"string", nullable: true },
                    weightErrorMax: {type:"string", nullable: true },
                    weightErrorMin: { type: "string" },
                    description: { type: "string" },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            }
        };
    });