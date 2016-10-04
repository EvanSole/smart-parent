package com.sin.smart.main.mapper;

import com.sin.smart.entity.main.SmartTenantEntity;

import java.util.List;

public interface TenantMapper {

    List<SmartTenantEntity> queryTenantPages(SmartTenantEntity tenantEntity);

    Integer queryTenantPageCount(SmartTenantEntity tenantEntity);

    SmartTenantEntity selectByPrimaryKey(Long id);

    Integer deleteByPrimaryKey(Long id);

    Integer insertTenant(SmartTenantEntity entity);

    Integer updateTenant(SmartTenantEntity entity);

}
