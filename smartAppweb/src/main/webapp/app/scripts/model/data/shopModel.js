/**
 * Created by songwu on 15/3/27.
 */
define(['kendo'],
    function(kendo){
        'use strict';
        return {
            shop:{
                id: "id",
                fields: {
                    id: {type: "number", editable: false, nullable: true},
                    shopNo: {type: "string"},
                    shopName: {type: "string"},
                    platformCode: {type: "string"},
                    description: {type: "string"},
                    token: {type: "string"},
                    country: {type: "string"},
                    state: {type: "string"},
                    city: {type: "string"},
                    outboundStrategyid:{type:"number"},
                    tokenStrategyid:{type:"number"},
                    isActive:{type:"boolean", defaultValue: true},
                    createUser: {type: "string"},
                    createTime: {type: "string"},
                    updateUser: {type: "string"},
                    updateTime: {type: "string"}
                }
            }
        };
    });