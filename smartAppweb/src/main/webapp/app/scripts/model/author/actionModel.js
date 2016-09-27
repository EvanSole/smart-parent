/**
 * Created by zw on 15/3/31.
 */
define(['kendo'],
    function(kendo){
        'use strict';
        return {
            id:"id",
            fields: {
                id: {type: "number", editable: false, nullable: true },
                moduleId: {type:"number"},
                actionName: { type: "string" },
                actionCode: { type: "string" },
                url: { type: "string" },
                httpMethod: { type: "string" },
                relationUrl: { type: "string" },
                isActive: { type: "boolean",defaultValue:true },
                isModuleDefault :{type:"boolean"},
                createUser: { type: "string" },
                createTime: { type: "string" },
                updateUser: { type: "string" },
                updateTime: { type: "string" }
            }
        };
    });