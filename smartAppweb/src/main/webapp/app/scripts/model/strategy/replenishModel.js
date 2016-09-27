/**
 * Created by xiagn on 15/4/2.
 */
define(['kendo'],
    function(kendo){
        'use strict';
        return {
            header:{
                id:"id",
                fields: {
                    id: {type:"number", editable: false, nullable: true },
                    strategyName: { type: 'string' },
                    isActive:  { type: 'boolean' },
                    isDefault: { type: 'boolean' },
                    isByAllocation: { type: 'boolean' },
                    isByLowerLimit: { type: 'boolean' },
                    description: { type: 'string' },
                    createUser: { type: "string" },
                    createTime: { type: "string" },
                    updateUser: { type: "string" },
                    updateTime: { type: "string" }
                }
            }
        };
    });
