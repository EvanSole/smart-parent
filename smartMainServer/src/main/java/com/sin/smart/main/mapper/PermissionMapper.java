package com.sin.smart.main.mapper;

import com.sin.smart.dto.SmartRolePermissionDTO;
import com.sin.smart.entity.main.SmartPermissionEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface PermissionMapper {

    List selectPermissionByUserId(@Param("userId") Long userId);

    SmartPermissionEntity selectByPrimaryKey(Long id);

    Integer deleteByPrimaryKey(Long id);

    Integer insertPermission(SmartPermissionEntity permissionEntity);

    Integer updatePermission(SmartPermissionEntity permissionEntity);

    List<SmartPermissionEntity> selectPermissionByModuleId(@Param("moduleId") Long moduleId);

    List<Map<String,Object>> selectPermissionModuleByRoleId(Long roleId);

    List<SmartPermissionEntity> selectAllPermissions(Map map);

    Integer deleteRolePermissionByRoleId(Long roleId);

    Integer insertBatchRolePermission(List<SmartRolePermissionDTO> rolePermissionList);

}
