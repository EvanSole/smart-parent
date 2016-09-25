define(['kendo'],
    function(kendo){
        'use strict';
        return {
            user:{
                id: "id",
                fields: {
                    id: {type: "number", editable: false, nullable: true},
                    userName: {type: "string"},
                    realName: {type: "string"}
                }
            }
        };
    });