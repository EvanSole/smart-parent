/**
 * Created by a2015-217 on 15/5/20.
 */
/**
 * Created by zw on 15/3/31.
 */
define(['kendo'],
    function(kendo){
        'use strict';

        return {
            associateEntity:{
                id:"id",
                fields: {
                    id: {type:"number", editable: false, nullable: true },
                    vehicleno: { type: "string" },
                    carrierCode: { type: "string" },
                    deliveryTime: { type: "string" }
                }
            }
        };
    });
