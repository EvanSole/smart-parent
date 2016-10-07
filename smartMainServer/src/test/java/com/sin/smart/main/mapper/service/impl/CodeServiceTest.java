package com.sin.smart.main.mapper.service.impl;

import com.alibaba.fastjson.JSON;
import com.sin.smart.main.mapper.common.SpringTxTestCase;
import com.sin.smart.main.service.impl.CodeService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.Map;


public class CodeServiceTest extends SpringTxTestCase {

     @Autowired
     CodeService codeService;

    @Test
    public void testGetAllCodeDatas(){
        Map mapList = codeService.getAllCodeDatas(new HashMap());
        System.out.println("JSON-->"+ JSON.toJSONString(mapList));
    }

}
