/**
 * Created by zw on 15/3/31.
 */
define(['kendo'],
    function(kendo){
        'use strict';

        return {
            header:{
                id:"id",
                fields: {
                    id:         { type: "number", editable: false, nullable: true },
                    //referNo:   { type: "number" },
                    //asnId: { type: "number" },
                    storerId:  { type: "number" },
                    supplierId:  { type: "number" },
                    warehouseId:   { type: "number" },
                    tenantId:{ type: "number" },
                    receiptTypeCode:    { type: "string" },
                    fromTypeCode:     { type: "string" },
//                    isNeedQc:{type:"boolean"},
                    statusCode:   { type: "string" },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" },
                    totalPalletQty: { type: "number" },
                    totalQty: { type: "number" },
                    expectedQty:{type:"number"},
                    totalCartonQty: { type: "number" },
                    totalNetWeight: { type: "number" },
                    totalGrossWeight: { type: "number" },
                    totalCube: { type: "number" },
                    expectedDate: { type: "string" }
                }
            }
        };
    });