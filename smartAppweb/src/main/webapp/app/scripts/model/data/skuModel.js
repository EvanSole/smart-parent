/**
 * Created by xiagn on 15/4/1.
 */
define(['kendo'],
    function(kendo){
        'use strict';
        return {
            header :{
                id:"id",
                fields:{
                    id: {type:"number", editable: false, nullable: true },
                    isActive: {type: "boolean",defaultValue:true},
                    isMultilot:{type:"number",defaultValue:1},
                    isMultisku:{type:"number",defaultValue:1},
                    warehouseNo:{tyep:"string"},
                    warehouseName:{tyep:"string"},
                    typeCode:{tyep:"string"},
                    imageUrl:{ type:"string"},
                    createUser:{ type:"string"},
                    createTime:{ type:"string"},
                    updateUser:{ type:"string"},
                    updateTime:{ type:"string"}
                }
            }

        };
    });