package com.sin.smart.constants;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Evan on 2016/9/19.
 */
public class AutoIdConstants {

    /**
     * ******************** db_wms_sku数据库里的表******
     */
    public static final int TWmsSkuBarcodeEntity = 1001;
    public static final int TWmsSkuEntity = 1002;
    public static final int TWmsSkuLocationEntity = 1003;

    /**
     * ******************** db_wms_outwh数据库里的表******
     */
    public static final int TWmsDnDetailEntity = 2001;
    public static final int TWmsDnHeaderEntity = 2003;
    public static final int TWmsDnInvoiceEntity = 2004;
    public static final int TWmsDnOrderEntity = 2005;
    public static final int TWmsShipmentDetailEntity = 2006;
    public static final int TWmsShipmentHeaderEntity = 2007;
    public static final int TWmsShipmentSerialnoEntity = 2008;
    public static final int TWmsShipmentStrategyEntity = 2009;
    public static final int TWmsWaveEntity = 2010;
    public static final int TWmsWaveStrategyEntity = 2011;
    public static final int TWmsOperationLogEntity = 2012;
    public static final int TWmsServiceLogEntity = 2013;
    /**
     * ******************** db_wms_inwh数据库里的表******
     */
    public static final int TWmsAdjustmentDetailEntity = 3001;
    public static final int TWmsAdjustmentHeaderEntity = 3002;
    public static final int TWmsAsnDetailEntity = 3003;
    public static final int TWmsAsnHeaderEntity = 3004;
    public static final int TWmsCycleCountDetailEntity = 3005;
    public static final int TWmsCycleCountHeaderEntity = 3006;
    public static final int TWmsReceiptDetailEntity = 3007;
    public static final int TWmsReceiptHeaderEntity = 3008;

    public static final int TWmsCartonEntity = 3009;
    public static final int TWmsCartonSkuEntity = 3010;
    public static final int TWmsHoldDetailEntity = 3011;
    public static final int TWmsHoldHeaderEntity = 3012;
    public static final int TWmsInventoryLogEntity = 3013;
    public static final int TWmsMoveEntity = 3014;
    public static final int TWmsPoreturnDetailEntity = 3015;
    public static final int TWmsPoreturnHeaderEntity = 3016;
    public static final int TWmsPoreturnNoticeDetailEntity = 3017;
    public static final int TWmsPoreturnNoticeHeaderEntity = 3018;
    public static final int TWmsPutawayAdviceEntity = 3019;
    public static final int TWmsReceiptHistoryEntity = 3020;
    public static final int TWmsReplenishAllocateEntity = 3021;
    public static final int TWmsReplenishDetailEntity = 3022;
    public static final int TWmsReplenishHeaderEntity = 3023;
    public static final int TWmsTransactionEntity = 3024;
    public static final int TWmsSoreturnAsnHeaderEntity = 3025;
    public static final int TWmsSoreturnAsnDetailEntity = 3026;
    public static final int TWmsSoreturnReceiptDetailEntity = 3027;
    public static final int TWmsSoreturnReceiptHeaderEntity = 3028;
    public static final int TWmsPackageEntity = 3029;
    public static final int TWmsInventoryEntity = 3030;
    public static final int TWmsAllocateEntity = 3031;

    /**
     * 获取需要到autoid服务中得到id的表
     *
     * @return
     */
    public static final Map<String, Integer> getMap() {//每添加一个
        Map<String, Integer> map = new HashMap<>();
        /**
         * ******************** db_wms_sku数据库里的表******
         */
        map.put("TWmsSkuBarcodeEntity", TWmsSkuBarcodeEntity);
        map.put("TWmsSkuEntity", TWmsSkuEntity);
        map.put("TWmsSkuLocationEntity", TWmsSkuLocationEntity);

        /**
         * ******************** db_wms_outwh数据库里的表******
         */
        map.put("TWmsDnDetailEntity", TWmsDnDetailEntity);
        map.put("TWmsDnHeaderEntity", TWmsDnHeaderEntity);
        map.put("TWmsDnInvoiceEntity", TWmsDnInvoiceEntity);
        map.put("TWmsDnOrderEntity", TWmsDnOrderEntity);
        map.put("TWmsShipmentDetailEntity", TWmsShipmentDetailEntity);
        map.put("TWmsShipmentHeaderEntity", TWmsShipmentHeaderEntity);
        map.put("TWmsShipmentSerialnoEntity", TWmsShipmentSerialnoEntity);
        map.put("TWmsShipmentStrategyEntity", TWmsShipmentStrategyEntity);
        map.put("TWmsWaveEntity", TWmsWaveEntity);
        map.put("TWmsWaveStrategyEntity", TWmsWaveStrategyEntity);
        map.put("TWmsOperationLogEntity", TWmsOperationLogEntity);
        map.put("TWmsServiceLogEntity", TWmsServiceLogEntity);

        /**
         * ******************** db_wms_inwh数据库里的表******
         */
        map.put("TWmsAdjustmentDetailEntity", TWmsAdjustmentDetailEntity);
        map.put("TWmsAdjustmentHeaderEntity", TWmsAdjustmentHeaderEntity);
        map.put("TWmsAsnDetailEntity", TWmsAsnDetailEntity);
        map.put("TWmsAsnHeaderEntity", TWmsAsnHeaderEntity);
        map.put("TWmsCycleCountDetailEntity", TWmsCycleCountDetailEntity);
        map.put("TWmsCycleCountHeaderEntity", TWmsCycleCountHeaderEntity);
        map.put("TWmsReceiptDetailEntity", TWmsReceiptDetailEntity);
        map.put("TWmsReceiptHeaderEntity", TWmsReceiptHeaderEntity);

        map.put("TWmsCartonEntity", TWmsCartonEntity);
        map.put("TWmsCartonSkuEntity", TWmsCartonSkuEntity);
        map.put("TWmsHoldDetailEntity", TWmsHoldDetailEntity);
        map.put("TWmsHoldHeaderEntity", TWmsHoldHeaderEntity);
        map.put("TWmsMoveEntity", TWmsMoveEntity);
        map.put("TWmsInventoryLogEntity", TWmsInventoryLogEntity);
        map.put("TWmsInventoryEntity", TWmsInventoryEntity);
        map.put("TWmsPoreturnDetailEntity", TWmsPoreturnDetailEntity);
        map.put("TWmsPoreturnHeaderEntity", TWmsPoreturnHeaderEntity);
        map.put("TWmsPoreturnNoticeDetailEntity", TWmsPoreturnNoticeDetailEntity);
        map.put("TWmsPutawayAdviceEntity", TWmsPutawayAdviceEntity);
        map.put("TWmsReceiptHistoryEntity", TWmsReceiptHistoryEntity);
        map.put("TWmsPoreturnNoticeHeaderEntity", TWmsPoreturnNoticeHeaderEntity);
        map.put("TWmsReplenishAllocateEntity", TWmsReplenishAllocateEntity);
        map.put("TWmsReplenishDetailEntity", TWmsReplenishDetailEntity);
        map.put("TWmsReplenishHeaderEntity", TWmsReplenishHeaderEntity);
        map.put("TWmsTransactionEntity", TWmsTransactionEntity);
        map.put("TWmsSoreturnAsnHeaderEntity", TWmsSoreturnAsnHeaderEntity);
        map.put("TWmsSoreturnAsnDetailEntity", TWmsSoreturnAsnDetailEntity);
        map.put("TWmsSoreturnReceiptDetailEntity", TWmsSoreturnReceiptDetailEntity);
        map.put("TWmsSoreturnReceiptHeaderEntity", TWmsSoreturnReceiptHeaderEntity);
        map.put("TWmsPackageEntity", TWmsPackageEntity);
        map.put("TWmsAllocateEntity", TWmsAllocateEntity);

        return map;
    }

}
