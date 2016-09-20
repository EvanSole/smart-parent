package com.sin.smart.main.service;

import com.sin.smart.po.main.SmartUserEntity;

public interface IUserService {

    SmartUserEntity getUserById(Long userId);

    SmartUserEntity getUser(String userName, String password);

}
