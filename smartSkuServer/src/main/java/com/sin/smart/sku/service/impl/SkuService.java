package com.sin.smart.sku.service.impl;

import com.sin.smart.core.formwork.db.vo.DbShardVO;
import com.sin.smart.core.service.BaseService;
import com.sin.smart.po.sku.SmartSkuEntity;
import com.sin.smart.sku.dao.SkuDao;
import com.sin.smart.sku.service.ISkuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SkuService extends BaseService implements ISkuService {

    @Autowired
    SkuDao skuDao;

    @Override
    public SmartSkuEntity getSkuByBarcode(String barcode, DbShardVO dbShardVO) {
        return skuDao.getSkuByBarcode(barcode,getSplitTableKey(dbShardVO));
    }

    @Override
    public SmartSkuEntity saveSku(SmartSkuEntity skuEntity, DbShardVO dbshardVO) throws Exception {
        return skuDao.save(skuEntity,getSplitTableKey(dbshardVO));
    }
}
