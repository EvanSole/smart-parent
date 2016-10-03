package com.sin.smart.main.service;

import com.sin.smart.core.web.MessageResult;
import com.sin.smart.core.web.PageResponse;
import com.sin.smart.core.web.message.Messages;
import com.sin.smart.dto.SmartWarehouseDTO;
import com.sin.smart.entity.CurrentUserEntity;
import com.sin.smart.entity.main.SmartWarehouseEntity;

import java.util.List;
import java.util.Map;

public interface IWarehouseService {

    List<SmartWarehouseEntity> searchWarehouseByUser(CurrentUserEntity sessionCurrentUser);

    PageResponse<List<SmartWarehouseEntity>> queryWarehousePages(SmartWarehouseDTO warehouseDTO);

    SmartWarehouseEntity findWarehouseById(Long id);

    SmartWarehouseEntity findWarehouseByWarehouseNo(String warehouseNo);

    MessageResult createWarehouse(SmartWarehouseDTO warehouseDTO);

    MessageResult modifyWarehouse(SmartWarehouseDTO warehouseDTO);

    MessageResult removeWarehouse(Long id);

    PageResponse<List> queryUserByWarehouse(Map searchMap);

    Map queryAllocatableUser(Map map);

    MessageResult saveAllocatableUser(Map map);

    MessageResult removeAllocatableUser(Map map);
}
