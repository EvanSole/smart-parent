define(['kendo'],
    function(kendo){
        'use strict';

        return {
            header:{
                id:"id",
                fields: {
                    id: {type: "number", editable: false, nullable: true },
                    orderId: { type: 'string' },
                    carrierNo: { type: 'string' },
                    ewaybillNo: { type: 'string' },
                    statusCode: { type: 'string' },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            }
        };
    }
)