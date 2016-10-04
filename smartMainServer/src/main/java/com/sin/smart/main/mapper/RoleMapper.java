package com.sin.smart.main.mapper;

import com.sin.smart.dto.SmartUserRoleDTO;
import com.sin.smart.entity.main.SmartRoleEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface RoleMapper {

    List<SmartRoleEntity> queryRolePages(SmartRoleEntity roleEntity);

    Integer queryRolePageCount(SmartRoleEntity roleEntity);

    Integer deleteByPrimaryKey(Long id);

    Integer insertRole(SmartRoleEntity roleEntity);

    Integer updateRole(SmartRoleEntity roleEntity);

    SmartRoleEntity selectByPrimaryKey(Long id);

    List<String> selectRoleNameByIds(List<Long> roleList);

    List<Map<String,Object>> queryRolesByUserPages(Map searchMap);

    Integer queryRolesByUserPageCount(Map searchMap);

    List<SmartRoleEntity> selectRolesByUser(Map searchMap);

    Integer insertBatchUserRole(List<SmartUserRoleDTO> userWarehouseDTOList);

    Integer deleteBatchUserRole(@Param("ids") Long[] ids);
}
