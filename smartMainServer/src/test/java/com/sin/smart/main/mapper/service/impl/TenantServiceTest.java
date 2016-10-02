package com.sin.smart.main.mapper.service.impl;

import com.sin.smart.dto.SmartTenantDTO;
import com.sin.smart.entity.main.SmartTenantEntity;
import com.sin.smart.main.mapper.common.SpringTxTestCase;
import com.sin.smart.main.service.ITenantService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;



public class TenantServiceTest extends SpringTxTestCase {

    @Autowired
    ITenantService tenantService;

    @Test
    public void testDeleteTenantById(){
        tenantService.removeByPrimaryKey(91L);
        System.out.println("-----");
    }

    @Test
    public void testCreateTenant(){
        SmartTenantDTO tenantEntity = new SmartTenantDTO();
        tenantEntity.setTypeCode("WMS");
        tenantEntity.setTenantNo("ABC");
        tenantEntity.setDescription("红牛");
        tenantService.createTenant(tenantEntity);
        System.out.println("-----");
    }

}
