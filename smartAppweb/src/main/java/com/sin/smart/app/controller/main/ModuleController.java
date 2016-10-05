package com.sin.smart.app.controller.main;

import com.sin.smart.core.web.BaseController;
import com.sin.smart.core.web.ResponseResult;
import com.sin.smart.dto.SmartModuleDTO;
import com.sin.smart.dto.SmartPermissionDTO;
import com.sin.smart.main.service.IModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/module")
public class ModuleController extends BaseController {

    @Autowired
    IModuleService moduleService;

    //加载所有模块菜单
    @RequestMapping(value = "", method = RequestMethod.GET)
    public ResponseResult queryModules(){
        return getSucResultData(moduleService.queryAllMenus());
    }

    //加载模块信息
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseResult queryModulesById(@PathVariable Long id){
        return getSucResultData(moduleService.findByPrimaryKey(id));
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public ResponseResult createModules(@RequestBody SmartModuleDTO moduleDTO){
        moduleDTO.setCreateUser(this.getSessionCurrentUser().getUserName());
        moduleDTO.setCreateTime(new Date().getTime());
        moduleDTO.setUpdateUser(this.getSessionCurrentUser().getUserName());
        moduleDTO.setUpdateTime(new Date().getTime());
        return getMessage(moduleService.createModule(moduleDTO));
    }

    @RequestMapping(value = "", method = RequestMethod.PUT)
    public ResponseResult modifyModules(@RequestBody Map map){
        map.put("updateUser",this.getSessionCurrentUser().getUserName());
        return getMessage(moduleService.modifyModule(map));
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE)
    public ResponseResult removeModules(@PathVariable Long id){
        return getMessage(moduleService.removeByPrimaryKey(id));
    }


    //加载模块对应操作信息
    @RequestMapping(value = "/actions", method = RequestMethod.GET)
    public ResponseResult queryModuleActions(@RequestParam Map searchMap){
        return getSucResultData(moduleService.queryModuleActions(searchMap));
    }

    @RequestMapping(value = "/actions", method = RequestMethod.POST)
    public ResponseResult createModuleActions(@RequestBody SmartPermissionDTO permissionDTO){
        permissionDTO.setCreateUser(this.getSessionCurrentUser().getUserName());
        permissionDTO.setCreateTime(new Date().getTime());
        permissionDTO.setUpdateUser(this.getSessionCurrentUser().getUserName());
        permissionDTO.setUpdateTime(new Date().getTime());
        return getMessage(moduleService.createModuleActions(permissionDTO));
    }

    @RequestMapping(value = "/actions/{id}", method = RequestMethod.PUT)
    public ResponseResult modifyModuleActions(@PathVariable Long id,@RequestBody SmartPermissionDTO permissionDTO){
        permissionDTO.setUpdateUser(this.getSessionCurrentUser().getUserName());
        permissionDTO.setUpdateTime(new Date().getTime());
        return getMessage(moduleService.modifyModuleActions(permissionDTO));
    }

    @RequestMapping(value = "/actions/{id}", method = RequestMethod.DELETE)
    public ResponseResult removeModuleActions(@PathVariable Long id){
        return getMessage(moduleService.removeModuleActions(id));
    }

}
