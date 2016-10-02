package com.sin.smart.main.mapper;

import com.sin.smart.entity.main.SmartTenantEntity;

import java.util.List;
import java.util.Map;

public interface TenantMapper {

    List<SmartTenantEntity> queryTenantPages(SmartTenantEntity tenantEntity);

    Integer queryTenantPageCount(SmartTenantEntity tenantEntity);

    List<SmartTenantEntity> findByTenantEntity(Map searchMap);

}
