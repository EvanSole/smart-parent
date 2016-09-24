package com.sin.smart.main.service.impl;

import com.sin.smart.main.mapper.UserMapper;
import com.sin.smart.main.service.IUserService;
import com.sin.smart.core.service.BaseService;
import com.sin.smart.entity.main.SmartUserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService extends BaseService implements IUserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public SmartUserEntity getUserById(Long userId){
        return userMapper.getUserById(userId);
    }

    @Override
    public SmartUserEntity getUser(String userName, String password) {
        return userMapper.getUser(userName,password);
    }
}
