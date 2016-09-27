package com.sin.smart.main.service;

import com.sin.smart.core.web.PageResponse;
import com.sin.smart.entity.main.SmartPermissionEntity;

import java.util.List;

public interface IPermissionService {

    Integer removeByPrimaryKey(Long id);

    Integer createPermission(SmartPermissionEntity permissionEntity);

    Integer modifyPermissionEntity(SmartPermissionEntity permissionEntity);

    List<SmartPermissionEntity> findByPermissionEntity(SmartPermissionEntity permissionEntity);

    SmartPermissionEntity findByPrimaryKey(Long id);

    PageResponse queryPermissionPages(SmartPermissionEntity permissionEntity);

    Integer queryPermissionPageCount(SmartPermissionEntity permissionEntity);

}
