package com.sin.smart.main.service;

import com.sin.smart.core.web.MessageResult;
import com.sin.smart.core.web.PageResponse;
import com.sin.smart.dto.SmartUserDTO;
import com.sin.smart.entity.CurrentUserEntity;
import com.sin.smart.entity.main.SmartUserEntity;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface IUserService {

    SmartUserEntity findUserById(Long userId);

    SmartUserEntity findUser(String userName, String password);

    SmartUserEntity findByUserName(String userName);

    PageResponse<List<SmartUserEntity>> queryUserPages(SmartUserDTO userDTO);

    MessageResult removeUser(Long id);

    MessageResult createUser(SmartUserDTO userDTO);

    MessageResult modifyUser(SmartUserDTO userDTO);

    List getRoleIdListByUserId(Long userId);

    List<SmartUserEntity> queryUsersByWarehouse(Map searchMap);

    PageResponse<List> queryUserByRoles(Map searchMap);

    MessageResult modifyResetUserPwd(Long id,CurrentUserEntity userEntity);

}
