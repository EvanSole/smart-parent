package com.sin.smart.main.mapper.service.impl;

import com.alibaba.fastjson.JSON;
import com.sin.smart.core.web.PageResponse;
import com.sin.smart.dto.SmartUserDTO;
import com.sin.smart.entity.main.SmartUserEntity;
import com.sin.smart.main.mapper.common.SpringTxTestCase;
import com.sin.smart.main.service.IUserService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import java.util.List;


public class UserServiceTest extends SpringTxTestCase {

    @Autowired
    IUserService userService;

    @Test
    public void testGetUserById(){
      SmartUserEntity smartUserEntity = userService.findUserById(1L);
      Assert.notNull(smartUserEntity);
    }

    @Test
    public void testGetUserByUserName(){
        SmartUserEntity smartUserEntity = userService.findByUserName("test");
        System.out.println(smartUserEntity.getRealName());
    }

    @Test
    public void testGetUser(){
        SmartUserEntity smartUserEntity = userService.findUser("test","2580ae4196df174e1d6f736f54281db8");
        System.out.println(smartUserEntity.getRealName());
    }

    @Test
    public void testQueryUserPages(){
        SmartUserDTO userDTO = new SmartUserDTO();
        userDTO.setPage(1);
        userDTO.setPageSize(15);
        PageResponse pageResponse = userService.queryUserPages(userDTO);
        System.out.println(JSON.toJSONString(pageResponse.getRows()));
    }

    @Test
    public void testRoleIdListByUserId(){
        List  list = userService.getRoleIdListByUserId(1L);
        System.out.println(JSON.toJSONString(list));
    }

}
