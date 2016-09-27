define(['kendo'],
    function(kendo){
        'use strict';

        return {
            header:{
                id:"id",
                fields: {
                    id: {type: "number", editable: false, nullable: true },
                    datasourceCode: { type: 'string' },
                    operationCode: { type: 'string' },
                    orderNo: { type: 'string' },
                    locationNo: { type: 'string' },
                    palletNo: { type: 'string' },
                    barcode: { type: 'string' },
                    qty: { type: 'string' },
                    exceptionMessage: { type: 'string' },
                    statusCode: { type: 'string' },
                    deviceNo: { type: 'string' },
                    memo: { type: 'string' },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            }
        };
    }
)