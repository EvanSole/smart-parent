package com.sin.smart.main.mapper.service.impl;

import com.alibaba.fastjson.JSON;
import com.sin.smart.entity.CurrentUserEntity;
import com.sin.smart.main.mapper.common.SpringTxTestCase;
import com.sin.smart.main.service.IModuleService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class ModuleServiceTest extends SpringTxTestCase {

    @Autowired
    IModuleService moduleService;

    @Test
    public void testGetModelByUser(){
        CurrentUserEntity entity = new CurrentUserEntity();
        entity.setUserId(1L);
        entity.setTenantId(88L);
        entity.setUserName("admin");
        entity.setIsAdmin(new Byte("1"));
        List list = moduleService.getModulesByUser(entity);
        System.out.println("JSON-->"+JSON.toJSONString(list));
    }

}
