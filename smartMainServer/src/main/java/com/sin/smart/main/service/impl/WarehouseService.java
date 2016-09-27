package com.sin.smart.main.service.impl;

import com.sin.smart.entity.CurrentUserEntity;
import com.sin.smart.entity.main.SmartWarehouseEntity;
import com.sin.smart.main.mapper.WarehouseMapper;
import com.sin.smart.main.service.IWarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class WarehouseService implements IWarehouseService {

    @Autowired
    WarehouseMapper warehouseMapper;

    @Override
    public List<SmartWarehouseEntity> searchWarehouseByUser(CurrentUserEntity sessionCurrentUser) {
        return warehouseMapper.selectWarehouseLists(sessionCurrentUser.getUserId(),sessionCurrentUser.getTenantId());
    }

    @Override
    public SmartWarehouseEntity findWarehouseById(Long id) {
        return warehouseMapper.selectWarehouseById(id);
    }

    @Override
    public List<SmartWarehouseEntity> searchWarehouses(Map map, CurrentUserEntity sessionCurrentUser) {
        map.put("tenantId",sessionCurrentUser.getTenantId());
        return warehouseMapper.selectWarehouses(map);
    }
}
