package com.sin.smart.main.service.impl;

import com.sin.smart.main.common.SpringTxTestCase;
import com.sin.smart.main.service.IUserService;
import com.sin.smart.po.main.SmartUserEntity;
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
    public void testGetUser(){
      SmartUserEntity smartUserEntity = userService.getUserById(1L);
      Assert.notNull(smartUserEntity);
    }

}
