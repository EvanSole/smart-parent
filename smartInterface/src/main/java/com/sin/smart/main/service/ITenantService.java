package com.sin.smart.main.service;

import com.sin.smart.core.web.MessageResult;
import com.sin.smart.core.web.PageResponse;
import com.sin.smart.dto.SmartTenantDTO;
import com.sin.smart.entity.main.SmartTenantEntity;

import java.util.List;


public interface ITenantService {

    PageResponse<List<SmartTenantEntity>> queryTenantPages(SmartTenantDTO tenantDTO);

    SmartTenantEntity findByPrimaryKey(Long id);

    MessageResult removeByPrimaryKey(Long id);

    MessageResult createTenant(SmartTenantDTO tenantDTO);

    MessageResult modifyTenant(SmartTenantDTO tenantDTO);

}
