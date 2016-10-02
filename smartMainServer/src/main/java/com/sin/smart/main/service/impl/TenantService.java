package com.sin.smart.main.service.impl;

import com.sin.smart.core.web.PageResponse;
import com.sin.smart.dto.SmartTenantDTO;
import com.sin.smart.entity.main.SmartTenantEntity;
import com.sin.smart.main.mapper.TenantMapper;
import com.sin.smart.main.service.ITenantService;
import com.sin.smart.utils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class TenantService implements ITenantService {

    @Autowired
    TenantMapper tenantMapper;

    @Override
    public PageResponse<List<SmartTenantEntity>> queryTenantPages(SmartTenantDTO tenantDTO) {
        SmartTenantEntity tenantEntity = BeanUtils.copyBeanPropertyUtils(tenantDTO,SmartTenantEntity.class);
        List<SmartTenantEntity> tenantEntityList = tenantMapper.queryTenantPages(tenantEntity);
        Integer totalSize = tenantMapper.queryTenantPageCount(tenantEntity);
        PageResponse<List<SmartTenantEntity>> response = new PageResponse();
        response.setTotal(totalSize);
        response.setRows(tenantEntityList);
        return  response;
    }


    @Override
    public List<SmartTenantEntity> findByTenantEntity(Map searchMap) {
        return tenantMapper.findByTenantEntity(searchMap);
    }

    @Override
    public Integer removeByPrimaryKey(Long id) {
        return null;
    }

    @Override
    public Integer createTenant(SmartTenantEntity tenantEntity) {
        return null;
    }

    @Override
    public Integer modifyTenantEntity(SmartTenantEntity tenantEntity) {
        return null;
    }

    @Override
    public SmartTenantEntity findByPrimaryKey(Long id) {
        return null;
    }



}
