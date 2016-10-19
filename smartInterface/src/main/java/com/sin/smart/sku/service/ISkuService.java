package com.sin.smart.sku.service;

import com.sin.smart.core.formwork.db.vo.DbShardVO;
import com.sin.smart.entity.sku.SmartSkuEntity;

public interface ISkuService {

    SmartSkuEntity getSkuByBarcode(String barcode, DbShardVO dbShardVO);

    Integer saveSku(SmartSkuEntity skuEntity, DbShardVO dbshardVO) throws Exception;
}
