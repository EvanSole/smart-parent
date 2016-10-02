package com.sin.smart.main.service.impl;

import com.sin.smart.core.web.MessageResult;
import com.sin.smart.core.web.PageResponse;
import com.sin.smart.dto.SmartTenantDTO;
import com.sin.smart.entity.main.SmartTenantEntity;
import com.sin.smart.main.mapper.TenantMapper;
import com.sin.smart.main.service.ITenantService;
import com.sin.smart.utils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
    public SmartTenantEntity findByPrimaryKey(Long id) {
        return tenantMapper.selectByPrimaryKey(id);
    }

    @Override
    public MessageResult removeByPrimaryKey(Long id) {
         tenantMapper.deleteByPrimaryKey(id);
         return MessageResult.getSucMessage();
    }

    @Override
    public MessageResult createTenant(SmartTenantDTO tenantDTO) {
        SmartTenantEntity entity = BeanUtils.copyBeanPropertyUtils(tenantDTO,SmartTenantEntity.class);
        Integer number = tenantMapper.insertTenant(entity);
        if(number>0)
            return MessageResult.getSucMessage();
        else
            return MessageResult.getFailMessage();
    }

    @Override
    public MessageResult modifyTenant(SmartTenantDTO tenantDTO) {
        SmartTenantEntity entity = BeanUtils.copyBeanPropertyUtils(tenantDTO,SmartTenantEntity.class);
        Integer number = tenantMapper.updateTenant(entity);
        if(number>0)
            return MessageResult.getSucMessage();
        else
            return MessageResult.getFailMessage();

    }

}
