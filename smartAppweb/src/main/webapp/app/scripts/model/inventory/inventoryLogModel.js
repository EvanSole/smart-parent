define(['kendo'],
    function(kendo){
        'use strict';

        return {
            header:{
                id:"id",
                fields: {
                    id: {type: "number", editable: false, nullable: true },
                    tenantId: { type: 'number' },
                    inventoryId: { type: 'number' },
                    skuId: { type: 'number' },
                    typeCode: { type: 'string' },
                    orderId: { type: 'number' },
                    detailId: { type: 'number' },
                    qty: { type: 'number' },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            }
        };
    }
)