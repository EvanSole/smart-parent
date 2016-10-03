package com.sin.smart.main.mapper;

import com.sin.smart.dto.UserWarehouseDTO;
import com.sin.smart.entity.main.SmartWarehouseEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface WarehouseMapper {

    List<SmartWarehouseEntity> selectWarehouseLists(@Param("userId") Long userId,@Param("tenantId") Long tenantId);

    SmartWarehouseEntity selectByPrimaryKey(@Param("id") Long id);

    SmartWarehouseEntity selectWarehouseByWarehouseNo(@Param("warehouseNo") String warehouseNo);

    List<SmartWarehouseEntity> queryWarehousePages(SmartWarehouseEntity warehouseEntity);

    Integer queryWarehousePageCount(SmartWarehouseEntity warehouseEntity);

    Integer insertWarehouse(SmartWarehouseEntity warehouseEntity);

    Integer updateWarehouse(SmartWarehouseEntity warehouseEntity);

    Integer deleteByPrimaryKey(@Param("id") Long id);

    List selectUserByWarehouseId(@Param("id") Long id);

    List queryUserByWarehousePages(Map searchMap);

    Integer queryUserByWarehousePageCount(Map searchMap);

    Integer insertBatchUserWarehouse(List<UserWarehouseDTO> userWarehouseDTOList);

    Integer deleteBatchUserWarehouse(@Param("ids") Long[] ids);
}
