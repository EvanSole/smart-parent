package com.sin.smart.main.mapper.service.impl;

import com.sin.smart.entity.main.SmartUserEntity;
import com.sin.smart.main.mapper.common.SpringTxTestCase;
import com.sin.smart.main.service.IUserService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

/**
 * Created by Evan on 2016/9/21.
 */
public class UserServiceTest extends SpringTxTestCase {

    @Autowired
    IUserService userService;

    @Test
    public void testGetUserById(){
      SmartUserEntity smartUserEntity = userService.getUserById(1L);
      Assert.notNull(smartUserEntity);
    }

    @Test
    public void testGetUser(){
        SmartUserEntity smartUserEntity = userService.getUser("admin","admin");
        System.out.println(smartUserEntity.getRealName());
    }

}
