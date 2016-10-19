package com.sin.smart.sku.service.impl;

import com.sin.smart.core.formwork.db.vo.DbShardVO;
import com.sin.smart.core.service.BaseService;
import com.sin.smart.entity.sku.SmartSkuEntity;
import com.sin.smart.sku.mapper.SkuMapper;
import com.sin.smart.sku.service.ISkuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SkuService extends BaseService implements ISkuService {

    @Autowired
    SkuMapper skuMapper;

    @Override
    public SmartSkuEntity getSkuByBarcode(String barcode, DbShardVO dbShardVO) {
        return skuMapper.getSkuByBarcode(barcode,getSplitTableKey(dbShardVO));
    }

    @Override
    public Integer saveSku(SmartSkuEntity skuEntity, DbShardVO dbshardVO) throws Exception {
        return skuMapper.saveSku(skuEntity,getSplitTableKey(dbshardVO));
    }
}
