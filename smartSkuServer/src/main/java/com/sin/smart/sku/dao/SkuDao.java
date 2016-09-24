package com.sin.smart.sku.dao;

import org.springframework.stereotype.Repository;

@Repository
public class SkuDao {

   /* public SmartSkuEntity getSkuByBarcode(String barcode, String splitTable) {
        String hql = " from SmartSkuEntity t where t.barcode =:barcode";
        Map paramsMap = new HashMap();
        paramsMap.put("barcode", barcode);
        List<SmartSkuEntity> skuEntityList = this.findByHql(hql, paramsMap, splitTable);
        if (CollectionUtils.isNotEmpty(skuEntityList)) {
            return skuEntityList.get(0);
        }
        return null;
    }*/
}
