package com.sin.smart.main.mapper.service.impl;

import com.sin.smart.dto.SmartWarehouseDTO;
import com.sin.smart.main.mapper.common.SpringTxTestCase;
import com.sin.smart.main.service.IWarehouseService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.Map;

public class WarehouseServiceTest  extends SpringTxTestCase {

    @Autowired
    IWarehouseService warehouseService;

    @Test
    public void testCreateWarehouse(){
        SmartWarehouseDTO  warehouseDTO = new SmartWarehouseDTO();
        warehouseDTO.setTenantId(88L);
        warehouseDTO.setTypeCode("RDC");
        warehouseDTO.setWarehouseNo("TJ1");
        warehouseDTO.setWarehouseName("天津仓");
        warehouseService.createWarehouse(warehouseDTO);
    }

    @Test
    public void testDeleteWarehouse(){
        warehouseService.removeWarehouse(2L);
    }

    @Test
    public void testGetWarehouse(){
        Map map = new HashMap<>();
        //map.put("offset",1);
        map.put("page","1");
        map.put("pageSize",20);
        warehouseService.queryUserByWarehousePage(map);
    }

}
