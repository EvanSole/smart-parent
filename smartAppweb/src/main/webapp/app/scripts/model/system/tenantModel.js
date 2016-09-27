/**
 * Created by wenchangwang on 15/5/12.
 */
define(['kendo'],
    function(kendo){
        'use strict';
        return {
            tenantHeader:{
                id:"id",
                fields: {
                    id: {type:"number", editable: false, nullable: true },
                    tenantNo: {type:"string"},
                    description: {type:"string",editable: true}
                    //typeCode: { type: "string",editable: false}
                }
            }
        };
    });
