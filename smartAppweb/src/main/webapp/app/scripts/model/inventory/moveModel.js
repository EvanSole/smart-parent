/**
 * Created by xiagn on 15/3/27.
 */
define(['kendo'],
    function(kendo){
        'use strict';

        return {
            header:{
                id:"id",
                fields: {
                    id: {type:"number", editable: false, nullable: true },
                    warehouseId: { type: 'string' },
                    storerId: { type: 'string' },
                    reasonCode: { type: 'string' },
                    datasourceCode: { type: 'string' },
                    statusCode: { type: 'string' },
                    skuSku: { type:'string' },
                    skuId: { type: 'string' },
                    fromZoneId: { type: 'string' },
                    toZoneId: { type: 'string' },
                    fromLocationId: { type: 'string' },
                    toLocationId: { type: 'string' },
                    fromCartonNo: { type: 'string' },
                    toCartonNo: { type: 'string' },
                    movedQty: { type: 'number' },
                    memo: { type: 'string' },
                    submitUser: { type: 'string' },
                    submitDate: { type: 'string' },
                    referNo: { type: 'string' },
                    isDel: { type: 'string' },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            }
        };
    });