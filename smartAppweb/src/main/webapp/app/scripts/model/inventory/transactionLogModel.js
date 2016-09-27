define(['kendo'],
    function(kendo){
        'use strict';

        return {
            header:{
                id:"id",
                fields: {
                    id: {type: "number", editable: false, nullable: true },
                    tenantId: { type: 'number' },
                    warehouseId: { type: 'number' },
                    storerId: { type: 'number' },
                    skuId: { type: 'number' },
                    typeCode: { type: 'string' },
                    orderId: { type: 'number' },
                    fromZoneId: { type: 'number' },
                    toZoneId: { type: 'number' },
                    fromLocationId: { type: 'number' },
                    toLocationId: { type: 'number' },
                    fromPalletNo: { type: 'string' },
                    toPalletNo: { type: 'string' },
                    fromCartonNo: { type: 'string' },
                    toCartonNo: { type: 'string' },
                    fromLotKey: { type: 'string' },
                    toLotKey: { type: 'string' },
                    fromIsHold: { type: 'string' },
                    toIsHold: { type: 'string' },
                    fromQty: { type: 'number' },
                    toQty: { type: 'number' },
                    fromPrice: { type: 'number' },
                    toPrice: { type: 'number' },
                    referNo: { type: 'string' },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            }
        };
    }
)