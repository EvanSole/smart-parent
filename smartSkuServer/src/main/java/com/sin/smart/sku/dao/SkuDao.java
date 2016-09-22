package com.sin.smart.sku.dao;

import com.sin.smart.core.formwork.db.dao.BaseDao;
import com.sin.smart.po.sku.SmartSkuEntity;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class SkuDao extends BaseDao<SmartSkuEntity> {

    public SmartSkuEntity getSkuByBarcode(String barcode, String splitTable) {
        String hql = " from SmartSkuEntity t where t.barcode =:barcode";
        Map paramsMap = new HashMap();
        paramsMap.put("barcode", barcode);
        List<SmartSkuEntity> skuEntityList = this.findByHql(hql, paramsMap, splitTable);
        if (CollectionUtils.isNotEmpty(skuEntityList)) {
            return skuEntityList.get(0);
        }
        return null;
    }
}
