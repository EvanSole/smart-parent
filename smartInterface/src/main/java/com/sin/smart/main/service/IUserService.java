package com.sin.smart.main.service;

import com.sin.smart.core.web.PageResponse;
import com.sin.smart.dto.SmartUserDTO;
import com.sin.smart.entity.main.SmartUserEntity;

import java.util.Set;

public interface IUserService {

    SmartUserEntity findUserById(Long userId);

    SmartUserEntity findUser(String userName, String password);

    SmartUserEntity findByUserName(String userName);

    PageResponse queryUserPages(SmartUserDTO userDTO);

    Integer removeUser(Long id);

    Integer createUser(SmartUserDTO userDTO);

    Integer modifyUser(SmartUserDTO userDTO);

    Set<String> findRoles(String userName);

    Set<String> findPermissions(String userName);
}
