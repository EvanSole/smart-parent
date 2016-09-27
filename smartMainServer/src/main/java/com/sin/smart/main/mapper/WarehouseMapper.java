package com.sin.smart.main.mapper;

import com.sin.smart.entity.main.SmartWarehouseEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface WarehouseMapper {
    List<SmartWarehouseEntity> selectWarehouseLists(@Param("userId") Long userId,@Param("tenantId") Long tenantId);

    List<SmartWarehouseEntity> selectWarehouses(Map map);

    SmartWarehouseEntity selectWarehouseById(@Param("id") Long id);
}
