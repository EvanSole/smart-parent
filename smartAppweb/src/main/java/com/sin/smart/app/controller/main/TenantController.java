package com.sin.smart.app.controller.main;

import com.sin.smart.core.web.BaseController;
import com.sin.smart.core.web.ResponseResult;
import com.sin.smart.dto.SmartTenantDTO;
import com.sin.smart.main.service.ITenantService;
import com.wordnik.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("tenant")
@Api(value = "tenant",description = "租户信息")
public class TenantController extends BaseController {

    @Autowired
    private ITenantService tenantService;

    @RequestMapping(value = "",method = RequestMethod.GET)
    public ResponseResult getTenantList(SmartTenantDTO tenantDTO) throws Exception {
        return  new ResponseResult(tenantService.queryTenantPages(tenantDTO));
    }

    @RequestMapping(value = "",method = RequestMethod.POST)
    public ResponseResult createTenant(@RequestParam Map searchMap) throws Exception {
        return new ResponseResult(tenantService.findByTenantEntity(searchMap));
    }


}
