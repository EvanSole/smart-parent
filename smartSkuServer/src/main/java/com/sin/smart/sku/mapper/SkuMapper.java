package com.sin.smart.sku.mapper;

import com.sin.smart.entity.sku.SmartSkuEntity;
import org.apache.ibatis.annotations.Param;

public interface SkuMapper {

    /***
     * 通过barcode获取sku信息
     * @param barcode 条码
     * @param splitTableKey 分表标示
     * @return
     */
    SmartSkuEntity getSkuByBarcode(@Param("barcode") String barcode,@Param("splitTableKey") String splitTableKey);

    SmartSkuEntity saveSku(@Param("skuEntity") SmartSkuEntity skuEntity, @Param("splitTableKey") String splitTableKey);

}