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
                    storerNo:   { type: "string" },
                    shortName: { type: "string" },
                    longName: { type: "string" },
                    typeCode:  { type: "string" },
                    isActive:   { type: "boolean" },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            }
        };
    });