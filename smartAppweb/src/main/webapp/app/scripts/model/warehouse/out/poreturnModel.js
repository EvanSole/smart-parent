define(['kendo'],
    function(kendo){
        'use strict';

        return {
            poreturnHeader:{
                id:"id",
                fields:{
                    id:{type:"number", editable:false, nullable:true},
                    poreturnKey:{type: "string" },
                    reasonCode:{type: "string" },
                    supplierId:{type: "number"},
                    statusCode:{type: "string"},
                    totalCategoryQty:{type: "number"},
                    totalQty:{type: "number"},
                    totalNetWeight:{type: "string"},
                    totalGrossWeight:{type: "string"},
                    totalCube:{type: "string"},
                    returnDate:{ type: "string"},
                    warehouseId:{ type: "number"},
                    storerId:{ type: "number"},
                    createUser:{type: "string"},
                    createTime:{type:"number"},
                    updateTime:{type:"number"}
                }
            },
            poreturnDetail:{
                id:"id",
                fields:{
                    id: {type:"number", editable: false, nullable: true },
                    poreturnId:{ type: "number" },
                    detailLineNo:{ type: "string"},
                    skuId:{ type: "number" },
                    zoneId:{ type: "number" },
                    locationId:{ type: "number" },
                    orderedQty:{ type: "number"},
                    grossWeight:{ type: "string"},
                    netWeight:{ type: "string"},
                    cube:{ type: "string"},
                    palletNo:{ type: "string"}
                }
            }
        };
    }
);