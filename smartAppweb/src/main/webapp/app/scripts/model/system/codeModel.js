
define(['kendo'],
    function(kendo){
        'use strict';

        return {
            codeHeader:{
                id:"id",
                fields: {
                    id: {type:"number", editable: false, nullable: true },
                    isReadOnly: { type: "boolean" },
                    isSystem: { type: "boolean" },
                    listName: { type: "string", validation: { required: true }},
                    description: { type: "string" },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            },
            codeDetail:{
                id:"id",
                fields: {
                    id: {type:"number", editable: false, nullable: true },
                    codeValue: { type: "string" },
                    codeName: { type: "string" },
                    sequence: { type: "string" },
                    isDefault: { type: "boolean" },
                    isSystem: { type: "boolean" },
                    description: { type: "string" },
                    isActive: { type: "boolean", defaultValue : true },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }

                }
            }
        };
    });