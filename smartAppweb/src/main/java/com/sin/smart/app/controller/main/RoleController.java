package com.sin.smart.app.controller.main;

import com.sin.smart.core.web.BaseController;
import com.sin.smart.core.web.ResponseResult;
import com.sin.smart.dto.SmartRoleDTO;
import com.sin.smart.main.service.IPermissionService;
import com.sin.smart.main.service.IRoleService;

import com.sin.smart.main.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("role")
public class RoleController extends BaseController {

    @Autowired
    private IRoleService roleService;

    @Autowired
    private IUserService userService;

    @Autowired
    private IPermissionService permissionService;


    @RequestMapping(value = "", method = RequestMethod.GET)
    public ResponseResult queryRoles(SmartRoleDTO roleDTO){
        roleDTO.setTenantId(getSessionCurrentUser().getTenantId());
        return new ResponseResult(roleService.queryRolePages(roleDTO));
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public ResponseResult createRoles(@RequestBody SmartRoleDTO roleDTO){
        roleDTO.setTenantId(getSessionCurrentUser().getTenantId());
        roleDTO.setCreateUser(this.getSessionCurrentUser().getUserName());
        roleDTO.setCreateTime(new Date().getTime());
        roleDTO.setUpdateUser(this.getSessionCurrentUser().getUserName());
        roleDTO.setUpdateTime(new Date().getTime());
        return new ResponseResult(roleService.createRole(roleDTO));
    }

    @RequestMapping(value = "{id}", method = RequestMethod.PUT)
    public ResponseResult modifyRoles(@PathVariable Long id,@RequestBody SmartRoleDTO roleDTO){
        roleDTO.setUpdateUser(this.getSessionCurrentUser().getUserName());
        roleDTO.setUpdateTime(new Date().getTime());
        return new ResponseResult(roleService.modifyRole(roleDTO));
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE)
    public ResponseResult modifyRoles(@PathVariable Long id){
        return new ResponseResult(roleService.removeByPrimaryKey(id));
    }

    @RequestMapping(value = "{id}/user", method = RequestMethod.GET)
    public ResponseResult queryUserByRoles(@PathVariable Long id,@RequestParam Map searchMap){
        searchMap.put("roleId",id);
        searchMap.put("tenantId",getSessionCurrentUser().getTenantId());
        return new ResponseResult(userService.queryUserByRoles(searchMap));
    }

    @RequestMapping(value = "{id}/module", method = RequestMethod.GET)
    public ResponseResult queryModuleByRoles(@PathVariable Long id,@RequestParam Map searchMap){
        searchMap.put("roleId",id);
        searchMap.put("tenantId",getSessionCurrentUser().getTenantId());
        return new ResponseResult(permissionService.queryPermModuleByRoles(searchMap));
    }

}
