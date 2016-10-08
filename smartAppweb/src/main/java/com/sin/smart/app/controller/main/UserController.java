package com.sin.smart.app.controller.main;

import com.sin.smart.core.web.BaseController;
import com.sin.smart.core.web.ResponseResult;
import com.sin.smart.dto.SmartUserDTO;
import com.sin.smart.entity.CurrentUserEntity;
import com.sin.smart.main.service.IRoleService;
import com.sin.smart.main.service.IUserService;
import com.sin.smart.main.service.IWarehouseService;
import org.apache.commons.collections.MapUtils;
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
@RequestMapping("/user")
public class UserController extends BaseController {

    @Autowired
    private IUserService userService;

    @Autowired
    private IRoleService roleService;

    @Autowired
    private IWarehouseService warehouseService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public ResponseResult searchUsersPage(SmartUserDTO userDTO) throws Exception {
         return getSucResultData(userService.queryUserPages(userDTO));
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public ResponseResult addUser(@RequestBody SmartUserDTO userDTO) throws Exception {
        userDTO.setTenantId(this.getSessionCurrentUser().getTenantId());
        userDTO.setCreateUser(this.getSessionCurrentUser().getUserName());
        userDTO.setCreateTime(new Date().getTime());
        userDTO.setUpdateUser(this.getSessionCurrentUser().getUserName( ));
        userDTO.setUpdateTime(new Date().getTime());
        return getMessage(userService.createUser(userDTO));
    }

    @RequestMapping(value = "{id}", method = RequestMethod.PUT)
    public ResponseResult updateUser(@PathVariable Long id,@RequestBody SmartUserDTO userDTO) throws Exception {
        userDTO.setId(id);
        userDTO.setUpdateUser(this.getSessionCurrentUser().getUserName());
        userDTO.setUpdateTime(new Date().getTime());
        return getMessage(userService.modifyUser(userDTO));
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE)
    public ResponseResult deleteUser(@PathVariable Long id) throws Exception {
        return getMessage(userService.removeUser(id));
    }

    @RequestMapping(value = "/{id}/defaultPwd", method = RequestMethod.PUT)
    public ResponseResult resetUserPwd(@PathVariable Long id) throws Exception {
       CurrentUserEntity  userEntity = this.getSessionCurrentUser();
       return getMessage(userService.modifyResetUserPwd(id,userEntity));
    }


    @RequestMapping(value = "/{id}/warehouse", method = RequestMethod.GET)
    public ResponseResult queryWarehouseByUser(@PathVariable Long id,@RequestParam Map searchMap) throws Exception {
        searchMap.put("userId",id);
        searchMap.put("tenantId",this.getSessionCurrentUser().getTenantId());
        searchMap.put("offset",getOffset(MapUtils.getInteger(searchMap,"page"),MapUtils.getInteger(searchMap,"pageSize")));
        return getSucResultData(warehouseService.findWarehouseByUserPage(searchMap));
    }

    //查询已分配角色
    @RequestMapping(value = "/{id}/role", method = RequestMethod.GET)
    public ResponseResult queryRolesByUser(@PathVariable Long id,@RequestParam Map searchMap) throws Exception {
        searchMap.put("userId",id);
        searchMap.put("tenantId",this.getSessionCurrentUser().getTenantId());
        searchMap.put("offset",getOffset(MapUtils.getInteger(searchMap,"page"),MapUtils.getInteger(searchMap,"pageSize")));
        return getSucResultData(roleService.queryRolesByUserPages(searchMap));
    }

    //查询未分配角色
    @RequestMapping(value = "/{id}/allocatable/role", method = RequestMethod.GET)
    public ResponseResult queryAllocatableRoles(@PathVariable Long id,@RequestParam Map searchMap) throws Exception {
        searchMap.put("userId",id);
        searchMap.put("tenantId",this.getSessionCurrentUser().getTenantId());
        return getSucResultData(roleService.queryAllocatableRoles(searchMap));
    }

    //保存用户角色
    @RequestMapping(value = "/{id}/allocatable/role", method = RequestMethod.POST)
    public ResponseResult saveUserRoles(@PathVariable Long id,@RequestBody Map searchMap) throws Exception {
        searchMap.put("userId",id);
        searchMap.put("createUser",this.getSessionCurrentUser().getId());
        return getMessage(roleService.saveAllocatableRoles(searchMap));
    }

    //删除用户角色
    @RequestMapping(value = "/{id}/allocatable/role/{userRoleIds}", method = RequestMethod.DELETE)
    public ResponseResult removeUserRoles(@PathVariable Long id,@PathVariable String userRoleIds) throws Exception {
        Map paramMap = new HashMap();
        paramMap.put("userId", id);
        paramMap.put("userRoleIds", userRoleIds);
        return getMessage(roleService.removeAllocatableRole(paramMap));
    }

}
