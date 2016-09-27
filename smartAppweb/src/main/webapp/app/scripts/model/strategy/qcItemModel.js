/**
 * Created by fuminwang on 15/3/27.
 */
define(['kendo'],
    function(kendo){
        'use strict';
        return {
            entity:{
                id:"id",
                fields: {
                    id: {type:"number", editable: false, nullable: true },
                    name: {type:"string"}
                }
            }
        };
    });