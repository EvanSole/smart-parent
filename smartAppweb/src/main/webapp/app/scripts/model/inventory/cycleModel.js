/**
 * Created by fuminwang on 15/3/27.
 */
define(['kendo'],
    function(kendo){
        'use strict';

        return {
            cycleHeader:{
                id:"id",
                fields: {
                    id: {type:"number", editable: false, nullable: true },
                    tenantId: {type:"number",  nullable: true },
                    warehouseId: {type:"number",  nullable: true },
                    storerId: {type:"number",  nullable: true },
                    typeCode: {type:"string", nullable: true },
                    statusCode: { type: "string" },
                    totalCategoryQty: { type: "number" },
                    totallOcationQty: { type: "number"},
                    sku:{type:"string"},
                    memo: { type: "string" },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            }
        };
    });