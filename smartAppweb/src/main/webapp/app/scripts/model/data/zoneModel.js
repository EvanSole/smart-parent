/**
 * Created by songwu on 15/3/27.
 */
define(['kendo'],
    function(kendo){
        'use strict';

        return {
            zone:{
                id:"id",
                fields: {
                    warehouseId: {type:"number" },
                    locationNo: { type: "string" },
                    typeCode: { type: "string" },
                    priority: { type: "string" },
                    description: { type: "string" },
                    isOnsale: { type: "boolean", defaultValue: true},
                    isActive: { type: "boolean", defaultValue: true }
//                    createUser: { type: "string" },
//                    createTime: { type: "string" },
//                    updateUser: { type: "string" },
//                    updateTime: { type: "string" }
                }
            },
            location:{
                id:"id",
                fields: {
                    warehouseId: {type:"number"},
                    locationNo: { type: "string" },
                    typeCode: { type: "string" },
                    classCode: { type: "string" },
                    categoryCode: { type: "string" },
                    isMultilot: { type: "boolean", defaultValue: true },
                    isMultisku: { type: "boolean", defaultValue: true },
                    description: { type: "string" },

                    putaway_seq: {type:"number"} ,
                    pickup_seq: {type:"number"} ,
                    cube: {type:"number"} ,
                    length: {type:"number"} ,
                    width: {type:"number"} ,
                    height: {type:"number"},
                    weightcapacity: {type:"number"} ,
                    xcoord: {type:"number"} ,
                    ycoord: {type:"number"} ,
                    zcoord: {type:"number"} ,
                    maxCategoryQty: {type:"number"} ,
                    maxQty: {type:"number"} ,

                    isActive: { type: "boolean", defaultValue: true },
                    isDefault: { type: "boolean" }
//                    createUser: { type: "string" },
//                    createTime: { type: "string" },
//                    updateUser: { type: "string" },
//                    updateTime: { type: "string" }
                }
            }
        };
    });