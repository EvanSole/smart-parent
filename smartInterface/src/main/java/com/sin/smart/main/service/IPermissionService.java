package com.sin.smart.main.service;

import com.sin.smart.core.web.PageResponse;
import com.sin.smart.entity.main.SmartPermissionEntity;

import java.util.List;
import java.util.Map;

public interface IPermissionService {

    Integer removeByPrimaryKey(Long id);

    Integer createPermission(SmartPermissionEntity permissionEntity);

    Integer modifyPermissionEntity(SmartPermissionEntity permissionEntity);

    List<SmartPermissionEntity> findByPermissionEntity(SmartPermissionEntity permissionEntity);

    SmartPermissionEntity findByPrimaryKey(Long id);

    PageResponse queryPermissionPages(SmartPermissionEntity permissionEntity);

    Integer queryPermissionPageCount(SmartPermissionEntity permissionEntity);

    List<Map<String,Object>> findPermissionMapperByUserId(Long id);

    Map queryPermModuleByRoles(Map searchMap);
}
