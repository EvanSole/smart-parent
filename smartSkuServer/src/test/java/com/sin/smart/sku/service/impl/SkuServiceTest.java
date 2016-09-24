package com.sin.smart.sku.service.impl;

import com.sin.smart.sku.common.SpringTxTestCase;
import com.sin.smart.entity.sku.SmartSkuEntity;
import com.sin.smart.sku.service.ISkuService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

/**
 * Created by Evan on 2016/9/21.
 */
public class SkuServiceTest extends SpringTxTestCase {

    @Autowired
    ISkuService skuService;

    @Test
    public void testGetSkuByBarcode(){
      SmartSkuEntity smartUserEntity = skuService.getSkuByBarcode("B68079103",getDbshardVO());
        System.out.println("sku-->"+smartUserEntity.getSku());
    }

    @Test
    public void testSaveSku(){
        try {
            SmartSkuEntity skuEntity = new SmartSkuEntity();
            skuEntity.setWarehouseId(1L);
            skuEntity.setTenantId(88L);
            skuEntity.setStorerId(88L);
            skuEntity.setSku("TERE4531122");
            skuEntity.setItemName("畅青");
            skuEntity.setDatasourceCode("apple");
            skuEntity.setIsActive(new Byte("1"));
            skuEntity.setUpc("AAACFABB47652");
            skuEntity.setBarcode("GFTF24523451122");
            skuService.saveSku(skuEntity,getDbshardVO());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
