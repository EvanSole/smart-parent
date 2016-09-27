/**
 * Created by fuminwang on 15/3/27.
 */
define(['kendo'],
    function(kendo){
        'use strict';

        return {
            frozeHeader:{
                id:"id",
                fields: {
                    id: {type:"number", editable: false, nullable: true },
                    referNo: {type:"string"},
                    reasonCode: {type:"string",editable: true},
                    isHold: { type: "string",editable: false},
                    sourceHoldId: { type: "number",defaultValue:null},
                    skuId: { type: "number" ,defaultValue:null},
                    zoneId: { type: "number",defaultValue:null },
                    locationId: { type: "number",defaultValue:null },
                    palletNo: { type: "string" },
                    cartonNo: { type: "string" },
                    lotKey: { type: "string" },
                    receiptId: { type: "number" },
                    memo: { type: "string" },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            }
        };
    });