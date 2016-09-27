package com.sin.smart.main.service;

import com.sin.smart.core.web.PageResponse;
import com.sin.smart.entity.main.SmartRoleEntity;

import java.util.List;
import java.util.Map;

public interface IRoleService {

    Integer removeByPrimaryKey(Long id);

    Integer createRole(SmartRoleEntity roleEntity);

    Integer modifyRoleEntity(SmartRoleEntity roleEntity);

    List<SmartRoleEntity> findByRoleEntity(SmartRoleEntity roleEntity);

    SmartRoleEntity findByPrimaryKey(Long id);

    PageResponse queryRolePages(Map map);

    Integer queryRolePageCount(SmartRoleEntity roleEntity);

    /***
     * 根据角色id获取角色名称
     * @param roleList
     * @return
     */
    List<String> getRoleNameByIds(List<Long> roleList);
}
