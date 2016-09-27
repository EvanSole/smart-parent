define(['kendo'],
    function(kendo){
        'use strict';

        return {
            shipmentHeader:{
                id:"id",
                fields:{
                    id: {type:"number", editable: false, nullable: true},
                    shipmentId: { type: 'number' },
                    fromErpNo:{type:'string'},
                    waveId: { type: 'number' },
                    carrierNo:{type:'string'},
                    carrierReferNo:{type:'string'},

                    zoneTypeCode: { type: 'string' },
                    zoneId: { type: 'number' },
                    locationId: { type: 'number' },
                    shopName: { type:'string'},
                    palletNo: { type: 'string' },
                    cartonNo: { type: 'string' },
                    stateName: { type: 'string' },
                    orderedQty: { type: 'number' },
                    allocatedQty: { type: 'number' },
                    pickedQty: { type: 'number' },
                    shippedQty: { type: 'number' },
                    grossweight: { type: 'number' },
                    netweight: { type: 'number' },
                    cube: { type: 'number' },
                    description: { type: 'string' },
                    amount: { type: 'number' },
                    price: { type: 'number' },
                    discountAmount: { type: 'number' },
                    promotionAmount: { type: 'number' },
                    linePayment: { type: 'number' },
                    isGift: { type: 'string' },


                    warehouseId: { type: 'number' },
                    storerId: { type: 'number' },
                    deliveryTime: { type: 'number' },
                    deliveryTimeFrom: { type: 'number' },
                    deliveryTimeTo: { type: 'number' },
                    fromtypeCode: { type: 'string' },
                    createTime:{type:"number"},
                    updateTime:{type:"number"}
                }
            }
        };
    }
)