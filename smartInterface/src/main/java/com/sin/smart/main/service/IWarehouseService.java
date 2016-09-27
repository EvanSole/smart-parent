package com.sin.smart.main.service;

import com.sin.smart.entity.CurrentUserEntity;
import com.sin.smart.entity.main.SmartWarehouseEntity;

import java.util.List;
import java.util.Map;

public interface IWarehouseService {

    List<SmartWarehouseEntity> searchWarehouseByUser(CurrentUserEntity sessionCurrentUser);

    SmartWarehouseEntity findWarehouseById(Long id);

    List<SmartWarehouseEntity> searchWarehouses(Map map, CurrentUserEntity sessionCurrentUser);


}
