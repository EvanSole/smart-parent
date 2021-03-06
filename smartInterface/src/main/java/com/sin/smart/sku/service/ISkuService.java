package com.sin.smart.sku.service;

import com.sin.smart.core.formwork.db.vo.DbShardVO;
import com.sin.smart.po.sku.SmartSkuEntity;

public interface ISkuService {

    SmartSkuEntity getSkuByBarcode(String barcode, DbShardVO dbShardVO);

    SmartSkuEntity saveSku(SmartSkuEntity skuEntity, DbShardVO dbshardVO) throws Exception;
}
