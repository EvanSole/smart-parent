/**
 * Created by qingjianwu on 15/09/21
 */
define(['kendo'],
    function(kendo){
        'use strict';

        return {
            transferHeader:{
                id: "id",
                fields:{
                    id: {type:"number", editable: false, nullable: true },
                    tenantId: { type: 'number' },
                    statusCode: { type: 'string' },
                    typeCode: { type: 'string' },
                    isReverse: { type: 'boolean' },
                    referNo: { type: 'string' },
                    fromStorerId: { type: 'number' },
                    toStorerId: { type: 'number' },
                    noticeTime: { type: 'string' },
                    memo: { type: 'string' },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            },
            transferDetail:{
                id: "id",
                fields:{
                    id: {type:"number", editable: false, nullable: true },
                    transferId: { type: 'number' },
                    fromSkuId: { type: 'number' },
                    fromLocationId: { type: 'number' , nullable: true },
                    transferQty: { type: 'number' , nullable: true },
                    toSkuId: { type: 'number' },
                    toLocationId: { type: 'number', nullable: true  },
                    barcode: { type: 'string' },
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