package com.sin.smart.main.service;

import com.sin.smart.core.web.PageResponse;
import com.sin.smart.entity.main.SmartTenantEntity;

import java.util.List;
import java.util.Map;

public interface ITenantService {

    List<SmartTenantEntity> findByTenantEntity(Map searchMap);

    Integer removeByPrimaryKey(Long id);

    Integer createTenant(SmartTenantEntity tenantEntity);

    Integer modifyTenantEntity(SmartTenantEntity tenantEntity);

    SmartTenantEntity findByPrimaryKey(Long id);

    PageResponse queryTenantPages(SmartTenantEntity tenantEntity);

    Integer queryTenantPageCount(SmartTenantEntity tenantEntity);


}
