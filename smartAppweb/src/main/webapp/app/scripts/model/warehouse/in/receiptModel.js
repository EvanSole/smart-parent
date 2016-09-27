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
                    locationId:{type: "number"},
                    receiptTypeCode:    { type: "string",defaultValue:"CheckByLot"},
                    fromTypeCode:     { type: "string" },
                    statusCode:   { type: "string" },
                    totalQty:   { type: "number" },
                    totalCartonQty:   { type: "number" },
                    totalPalletQty:   { type: "number" },
                    totalNetWeight:   { type: "number" },
                    totalGrossWeight:   { type: "number" },
                    totalCube:   { type: "number" },
                    receiptDate:{type:"string"},
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            }
        };
    });