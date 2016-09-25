package com.sin.smart.main.service;


import com.sin.smart.core.web.PageResponse;
import com.sin.smart.dto.SmartUserDTO;
import com.sin.smart.entity.main.SmartUserEntity;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface IUserService {

    SmartUserEntity getUserById(Long userId);

    SmartUserEntity getUser(String userName, String password);

    SmartUserEntity findByUserName(String userName);

    Set<String> findRoles(String userName);

    Set<String> findPermissions(String userName);

    PageResponse queryPageUsers(SmartUserDTO userDTO);

    List getUserLists(Map searchMap);

    void deleteUser(long id);

    void saveUser(SmartUserDTO userDTO);

    void updateUser(SmartUserDTO userDTO);
}
