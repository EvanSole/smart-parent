
define(['kendo'],
    function(kendo){
        'use strict';
        return {
            header:{
                id:"id",
                fields: {
                    id: { type: "number", editable: false, nullable: true },
                    warehouseNo:   { type: "string" },
                    warehouseName: { type: "string" },
                    typeCode:  { type: "string" },
                    isActive:   { type: "boolean" ,defaultValue:true},
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            }
        };
    });