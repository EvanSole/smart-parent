package com.sin.smart.main.mapper;

import com.sin.smart.entity.main.SmartRoleEntity;

import java.util.List;

public interface RoleMapper {

    Integer deleteByPrimaryKey(Long id);

    Integer insertRole(SmartRoleEntity roleEntity);

    Integer updateRoleEntity(SmartRoleEntity roleEntity);

    List<SmartRoleEntity> selectByRoleEntity(SmartRoleEntity roleEntity);

    SmartRoleEntity selectByPrimaryKey(Long id);

    List<SmartRoleEntity> queryRolePages(SmartRoleEntity roleEntity);

    Integer queryRolePageCount(SmartRoleEntity roleEntity);

    List<String> selectRoleNameByIds(List<Long> roleList);

}
