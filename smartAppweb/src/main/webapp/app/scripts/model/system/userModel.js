define(['kendo'],
    function(kendo){
        'use strict';
        return {
            header:{
                id:"id",
                fields: {
                    id:         { type: "number", editable: false, nullable: true },
                    userName:     { type: "string" },
                    email: { type: "string" },
                    password:{type:"string",defaultValue:"123456"},
                    telephone: { type: "string" },
                    mobile: { type: "string" },
                    isActive:   { type: "boolean" ,defaultValue:true},
                    isAdmin:   { type: "boolean" },
                    isDel:     { type: "boolean"},
                    isMutiScan:{ type:"boolean"},
                    isKickOff:{type:"boolean"},
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            }
        };
    });