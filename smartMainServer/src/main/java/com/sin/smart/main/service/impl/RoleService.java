package com.sin.smart.main.service.impl;

import com.sin.smart.core.web.PageResponse;
import com.sin.smart.entity.main.SmartRoleEntity;
import com.sin.smart.main.mapper.RoleMapper;
import com.sin.smart.main.service.IRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class RoleService implements IRoleService {

    @Autowired
    RoleMapper roleMapper;

    @Override
    public Integer removeByPrimaryKey(Long id) {
        return roleMapper.deleteByPrimaryKey(id);
    }

    @Override
    public Integer createRole(SmartRoleEntity roleEntity) {
        return roleMapper.insertRole(roleEntity);
    }

    @Override
    public Integer modifyRoleEntity(SmartRoleEntity roleEntity) {
        return roleMapper.updateRoleEntity(roleEntity);
    }

    @Override
    public List<SmartRoleEntity> findByRoleEntity(SmartRoleEntity roleEntity) {
        return null;
    }

    @Override
    public SmartRoleEntity findByPrimaryKey(Long id) {
        return null;
    }

    @Override
    public PageResponse queryRolePages(Map map) {
        return null;
    }

    @Override
    public Integer queryRolePageCount(SmartRoleEntity roleEntity) {
        return null;
    }

    @Override
    public List<String> getRoleNameByIds(List<Long> roleList) {
        return roleMapper.selectRoleNameByIds(roleList);
    }
}
