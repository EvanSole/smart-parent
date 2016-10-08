package com.sin.smart.app.controller.main;

import com.sin.smart.constants.GlobalConstants;
import com.sin.smart.core.web.BaseController;
import com.sin.smart.core.web.ResponseResult;
import com.sin.smart.dto.SmartTenantDTO;
import com.sin.smart.main.service.ITenantService;
import com.wordnik.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
@RequestMapping("tenant")
@Api(value = "tenant",description = "租户信息")
public class TenantController extends BaseController {

    @Autowired
    private ITenantService tenantService;

    @RequestMapping(value = "",method = RequestMethod.GET)
    public ResponseResult getTenantList(SmartTenantDTO tenantDTO) throws Exception {
        return  getSucResultData(tenantService.queryTenantPages(tenantDTO));
    }

    @RequestMapping(value = "/{id}",method = RequestMethod.PUT)
    public ResponseResult modifyTenant(@RequestBody SmartTenantDTO tenantDTO) throws Exception {
        tenantDTO.setUpdateUser(this.getSessionCurrentUser().getUserName());
        tenantDTO.setUpdateTime(new Date().getTime());
        return getMessage(tenantService.modifyTenant(tenantDTO));
    }

    @RequestMapping(value = "",method = RequestMethod.POST)
    public ResponseResult createTenant(@RequestBody SmartTenantDTO tenantDTO) throws Exception {
        tenantDTO.setTypeCode(GlobalConstants.DEFAULT_TENANT_TYPE);
        tenantDTO.setCreateUser(this.getSessionCurrentUser().getUserName());
        tenantDTO.setCreateTime(new Date().getTime());
        tenantDTO.setUpdateUser(this.getSessionCurrentUser().getUserName());
        tenantDTO.setUpdateTime(new Date().getTime());
        return getMessage(tenantService.createTenant(tenantDTO));
    }

    @RequestMapping(value = "/{id}",method = RequestMethod.DELETE)
    public ResponseResult removeTenant(@PathVariable Long id) throws Exception {
        return getMessage(tenantService.removeByPrimaryKey(id));
    }

}
