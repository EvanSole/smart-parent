/**
 * Created by zw on 15/3/31.
 */
define(['kendo'],
    function(kendo){
        'use strict';

        return {
            header:{
                id:"id",
                fields: {
                    id:         { type: "number", editable: false, nullable: true },
                    storerId:   { type: "number" },
                    supplierNo: { type: "string" },
                    shortName:  { type: "string" },
                    longName:   { type: "string" },
                    country:{ type: "string" },
                    isActive:   { type: "boolean" ,defaultValue:true},
                    isNeedQc:   { type: "boolean" },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            }
        };
    });