/**
 * Created by qingjianwu on 15/4/13
 */
define(['kendo'],
    function(kendo){
        'use strict';

        return {
            adjustDetail:{
                id:"id",
                fields:{
                    id: {type:"number", editable: false, nullable: true },
                    tenantId: { type: 'number' },
                    adjustId: { type: 'number' },
                    detailLineNo: { type: 'string' },
                    referLineNo: { type: 'string' },
                    zoneId: { type: 'string' },
                    locationId: { type: 'string' },
                    palletNo: { type: 'string' },
                    cartonNo: { type: 'string' },
                    skuId: { type: 'number' },
                    originalQty: { type: 'string' },
                    adjustedQty: { type: 'string' },
                    newInvStatusCode: { type: 'string' },
                    originalPrice: { type: 'string' },
                    newPrice: { type: 'string' },
                    description: { type: 'string' },
                    statusCode: { type: 'string' },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            }
        };
    }
);