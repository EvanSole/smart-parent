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
                    typeCode: {
                        type: 'string'
                    },
                    storerId: {
                        type: 'number'
                    },
                    warehouseId: { type: 'number' },
                    datasourceCode: { type: 'string' },
                    referNo: {
                        type: 'string'
                    },
                    statusCode: { type: 'string' },
                    memo: { type: 'string' },
                    totalQty: { type: 'number' },
                    submitUser: { type: 'string' },
                    submitDate: { type: 'number' },
                    zoneTypeCode: { type: 'string' },
                    promotionGroupCode: { type: 'string' },
                    isDel: { type: 'string' },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            },
            detail:{
                id:"id",
                fields: {
                    id: {type:"number", editable: false, nullable: true },
                    codeValue: { type: "string" },
                    codeName: { type: "string" },
                    sequence: { type: "string" },
                    isDefault: { type: "string" },
                    isSystem: { type: "string" },
                    description: { type: "string" },
                    isActive: { type: "string" },
                    createUser: { type: "string" },
                    createDate: { type: "string" },
                    updateUser: { type: "string" },
                    updateDate: { type: "string" }

                }
            }
        };
    });