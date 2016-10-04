package com.sin.smart.main.service;

import com.sin.smart.core.web.MessageResult;
import com.sin.smart.core.web.PageResponse;
import com.sin.smart.dto.SmartRoleDTO;
import com.sin.smart.entity.main.SmartRoleEntity;

import java.util.List;
import java.util.Map;

public interface IRoleService {

    PageResponse queryRolePages(SmartRoleDTO roleDTO);

    Integer removeByPrimaryKey(Long id);

    Integer createRole(SmartRoleDTO roleDTO);

    Integer modifyRole(SmartRoleDTO roleDTO);

    SmartRoleEntity findByPrimaryKey(Long id);

    List<String> getRoleNameByIds(List<Long> roleList);

    PageResponse<List> queryRolesByUserPages(Map searchMap);

    Map queryAllocatableRoles(Map searchMap);

    MessageResult saveAllocatableRoles(Map searchMap);

    MessageResult removeAllocatableRole(Map searchMap);
}
