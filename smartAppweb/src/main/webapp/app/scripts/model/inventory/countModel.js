define(['kendo'],
    function(kendo){
        'use strict';

        return {
            invCount:{
                id:"id",
                fields:{
                    id: {type:"number", editable: false, nullable: true },
                    typeCode: { type: 'string' },
                    modeCode: { type: 'string' },
                    percent: { type: 'number' },
                    countBeginTime: { type: 'string' },
                    countEndTime: { type: 'string' },
                    isNullLoc: { type: 'string' },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            },
            invCountLoc:{
                id:"id",
                fields:{
                    id: {type:"number", editable: false, nullable: true },
                    inventoryCountId: { type: 'number' },
                    zoneId: { type: 'number' },
                    locationId: { type: 'number' },
                    locationNo: { type: 'string' },
                    statusCode: { type: 'string' },
                    systemQty: { type: 'number' },
                    countQty: { type: 'number' },
                    assignUser: { type: 'string' },
                    realUser: { type: 'string' },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            },
            invCountInv:{
                id:"id",
                fields:{
                    id: {type:"number", editable: false, nullable: true },
                    inventoryCountId: { type: 'number' },
                    zoneId: { type: 'number' },
                    locationId: { type: 'number' },
                    locationNo: { type: 'string' },
                    statusCode: { type: 'string' },
                    systemQty: { type: 'number' },
                    countQty: { type: 'number' },
                    assignUser: { type: 'string' },
                    realUser: { type: 'string' },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            },
            invCountDiff:{
                fields:{
                    inventoryLocId: {type:"number", editable: false, nullable: true },
                    inventoryInvId: {type:"number", editable: false, nullable: true },
                    inventoryCountId: { type: 'number' },
                    locationId: { type: 'number' },
                    locationNo: { type: 'string' },
                    systemQty: { type: 'number' },
                    countQty: { type: 'number' },
                    diffQty: { type: 'number' },
                    assignUser: { type: 'string' },
                    realUser: { type: 'string' }
                }
            }
        };
    });