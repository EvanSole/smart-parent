define(['kendo'],
    function(kendo){
        'use strict';

        return {
            poreturnNoticeHeader:{
                id:"id",
                fields:{
                    id: {type:"number", editable: false, nullable: true},
                    poreturnNoticeKey:{type: "string"},
                    referNo:{type: "string"},
                    reasonCode:{type: "string"},
                    supplierId:{type: "number"},
                    statusCode:{type: "string"},
                    ticketStatusCode:{type: "string"},
                    returnDate:{type: "string"},
                    totalCategoryQty:{type: "number"},
                    totalQty:{type: "number"},
                    totalNetWeight:{type: "string"},
                    totalGrossWeight:{type: "string"},
                    totalCube:{type: "string"},
                    createUser:{type: "string"},
                    createTime:{type:"number"},
                    updateTime:{type:"number"}
                }
            },
            poreturnNoticeDetail:{
                id:"id",
                fields:{
                    id: {type:"number", editable: false, nullable: true },
                    poreturnNoticeId: {type: "number"},
                    detailLineNo:{type: "string"},
                    statusCode:{type: "string"},
                    skuId:{type: "number"},
                    orderedQty:{type: "number"},
                    price:{type: "number"},
                    grossWeight:{type: "string"},
                    netWeight:{type: "string"},
                    cube:{type: "string"},
                    returnQty:{type: "number"},
                    createUser:{type: "string"},
                    createTime:{type: "number"},
                    updateTime:{type: "number"}
                }
            }
        };
    }
)