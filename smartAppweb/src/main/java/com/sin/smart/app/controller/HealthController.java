package com.sin.smart.app.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
    /**
     * 服务器健康检查路径
     * @return 字符串
     */
    @RequestMapping(value = "/status")
    @ResponseBody
    public String status(){
        return "SUCCESS";
    }
}
