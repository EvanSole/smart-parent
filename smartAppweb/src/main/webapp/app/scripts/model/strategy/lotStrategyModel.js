/**
 * Created by songwu on 15/3/27.
 */
define(['kendo'],
    function(kendo){
        'use strict';

        return {
            lotstrategyHeader:{
                id:"id",
                fields: {
                    id: {type:"number", editable: false, nullable: true },
                    strategyName: { type: "string",validation:{required:true} },
                    isActive: { type: "boolean" },
                    isDefault: { type: "boolean"},
                    description: { type: "textarea" },
                    isByAsn: { type: "boolean" },
                    isByReceipt: { type: "boolean" },
                    isByProductionTime: { type: "boolean" }

                }
            },
            lotstrategyHeaderDetail:{
                id:"id",
                fields: {
                    id: {type:"number", editable: false, nullable: true },
                    lotAttributeCode: { type: "string" },
                    skuCategoryCode: { type: "string" },
                    displayName: { type: "string" },
                    displayOrder: { type: "string" },
                    isActive: { type: "boolean" },
                    isMust: { type: "boolean" },
                    defaultValue: { type: "string" }


                }
            }
        };
    });