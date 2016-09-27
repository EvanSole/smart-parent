package com.sin.smart.main.service;

import com.sin.smart.core.web.PageResponse;
import com.sin.smart.entity.main.SmartTenantEntity;

import java.util.List;

public interface ITenantService {

    Integer removeByPrimaryKey(Long id);

    Integer createTenant(SmartTenantEntity tenantEntity);

    Integer modifyTenantEntity(SmartTenantEntity tenantEntity);

    List<SmartTenantEntity> findByTenantEntity(SmartTenantEntity tenantEntity);

    SmartTenantEntity findByPrimaryKey(Long id);

    PageResponse queryTenantPages(SmartTenantEntity tenantEntity);

    Integer queryTenantPageCount(SmartTenantEntity tenantEntity);
    
}
