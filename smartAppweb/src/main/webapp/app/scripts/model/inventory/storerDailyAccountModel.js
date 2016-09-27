/**
 * Created by qingjianwu on 15/09/21
 */
define(['kendo'],
    function(kendo){
        'use strict';

        return {
            storerDailyAccountModel:{
                id: "id",
                fields:{
                    reportDate: {type:"string", nullable: true },
                    storerId: { type: 'number' },
                    poGoodQty: { type: 'number' },
                    poBadQty: { type: 'number' },
                    soReturnGoodQty: { type: 'number' },
                    soReturnBadQty: { type: 'number' },
                    soGoodQty: { type: 'number' },
                    soBadQty: { type: 'number' },
                    poReturnGoodQty: { type: 'number' },
                    poReturnBadQty: { type: 'number' },
                    adjustGoodQty: { type: 'number' },
                    adjustBadQty: { type: 'number' },
                    inventoryGoodQty: { type: 'number' },
                    inventoryBadQty: { type: 'number' }
                }
            }
        };
    }
)