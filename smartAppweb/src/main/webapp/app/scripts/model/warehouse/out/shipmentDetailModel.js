define(['kendo'],
    function(kendo){
        'use strict';

        return {
            shipmentDetail:{
                id:"id",
                fields:{
                    id: {type:"number", editable: false, nullable: true},
                    shipmentId: { type: 'number' },
                    detailLineNo: { type: 'string' },
                    referLineNo: { type: 'string' },
                    fromErpNo:{type:'string'},
                    skuId: { type: 'number' },
                    waveId: { type: 'number' },
                    carrierNo:{type:'string'},
                    carrierReferNo:{type:'string'},

                    dnDetailId: { type: 'number' },
                    zoneTypeCode: { type: 'string' },
                    zoneId: { type: 'number' },
                    locationId: { type: 'number' },
                    shopName: { type:'string'},
                    palletNo: { type: 'string' },
                    cartonNo: { type: 'string' },
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

                    itemName: { type: 'string' },
                    sku: { type: 'string' },
                    colorCode: { type: 'string' },
                    sizeCode: { type: 'string' },
                    productNo: { type: 'string' },
                    model: { type: 'string' },
                    barcode: { type: 'string' },
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