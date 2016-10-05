package com.sin.smart.main.service;

import com.sin.smart.core.web.MessageResult;
import com.sin.smart.dto.SmartPermissionDTO;
import com.sin.smart.entity.main.SmartPermissionEntity;

import java.util.List;
import java.util.Map;

public interface IPermissionService {

    MessageResult removeByPrimaryKey(Long id);

    MessageResult createPermission(SmartPermissionDTO permissionDTO);

    MessageResult modifyPermissionEntity(SmartPermissionDTO permissionDTO);

    SmartPermissionEntity findByPrimaryKey(Long id);

    List<Map<String,Object>> findPermissionByUserId(Long id);

    Map queryPermModuleByRoles(Map searchMap);

    List<SmartPermissionEntity> findPermissionByModuleId(Long moduleId);

    MessageResult saveRoleActionPermission(Map map);

    List<SmartPermissionEntity> selectPermissions(Boolean flag);
}
