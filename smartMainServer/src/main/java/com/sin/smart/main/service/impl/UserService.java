package com.sin.smart.main.service.impl;

import com.sin.smart.main.dao.UserDao;
import com.sin.smart.main.service.IUserService;
import com.sin.smart.core.service.BaseService;
import com.sin.smart.po.main.SmartUserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService extends BaseService implements IUserService {

    @Autowired
    private UserDao userDao;

    @Override
    public SmartUserEntity getUserById(Long userId) {
        return userDao.get(userId);
    }

    @Override
    public SmartUserEntity getUser(String userName, String password) {
        return userDao.getUser(userName,password);
    }
}
