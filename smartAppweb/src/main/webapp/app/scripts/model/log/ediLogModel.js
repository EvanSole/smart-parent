define(['kendo'],
    function (kendo) {
        'use strict';

        return {
            header: {
                id: "id",
                fields: {
                    id: {type: "number", editable: false, nullable: true },
                    tenantId: { type: 'number' },
                    interfaceName: { type: 'string' },
                    interfaceToken: { type: 'string' },
                    warehouseId: { type: 'number' },
                    orderId: { type: 'number' },
                    operationType: {type: 'string'},
                    isResultSuc: { type: 'number' },
                    inMessage: { type: 'string' },
                    dealMessage: { type: "string" },
                    bizKey: { type: "string" },
                    messageId: { type: "string" },
                    messageProperty: {type: "string"},
                    createTime: { type: "string" },
                    createUser: { type: "string" },
                    updateTime: { type: "string" },
                    updateUser: { type: "string" }
                }
            }
        };
    }
)