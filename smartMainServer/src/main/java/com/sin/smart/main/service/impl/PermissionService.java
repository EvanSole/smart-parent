package com.sin.smart.main.service.impl;

import com.sin.smart.core.web.PageResponse;
import com.sin.smart.entity.main.SmartPermissionEntity;
import com.sin.smart.main.mapper.PermissionMapper;
import com.sin.smart.main.service.IPermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PermissionService implements IPermissionService {

    @Autowired
    PermissionMapper permissionMapper;

    @Override
    public Integer removeByPrimaryKey(Long id) {
        return null;
    }

    @Override
    public Integer createPermission(SmartPermissionEntity permissionEntity) {
        return null;
    }

    @Override
    public Integer modifyPermissionEntity(SmartPermissionEntity permissionEntity) {
        return null;
    }

    @Override
    public List<SmartPermissionEntity> findByPermissionEntity(SmartPermissionEntity permissionEntity) {
        return null;
    }

    @Override
    public SmartPermissionEntity findByPrimaryKey(Long id) {
        return null;
    }

    @Override
    public PageResponse queryPermissionPages(SmartPermissionEntity permissionEntity) {
        return null;
    }

    @Override
    public Integer queryPermissionPageCount(SmartPermissionEntity permissionEntity) {
        return null;
    }

    @Override
    public List<Map<String, Object>> findPermissionMapperByUserId(Long id) {
        return permissionMapper.selectPermissionMapperByUserId(id);
    }
}
