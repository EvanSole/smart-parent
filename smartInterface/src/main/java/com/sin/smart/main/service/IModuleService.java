package com.sin.smart.main.service;

import com.sin.smart.core.web.MessageResult;
import com.sin.smart.dto.SmartModuleDTO;
import com.sin.smart.dto.SmartPermissionDTO;
import com.sin.smart.entity.CurrentUserEntity;
import com.sin.smart.entity.main.SmartModuleEntity;

import java.util.List;
import java.util.Map;

public interface IModuleService {

    /**
     * 根据当前用户获取模块菜单
     * @param sessionCurrentUser
     * @return
     */
    List getModulesByUser(CurrentUserEntity sessionCurrentUser);

    /***
     * 根据当前用户获取模块操作权限
     * @param sessionCurrentUser
     * @return
     */
    Map getAllModuleActionByUser(CurrentUserEntity sessionCurrentUser);

    /***
     * 查询所以模块菜单
     * @return
     */
    Map queryAllMenus();

    List getAllModuleAction();

    MessageResult removeByPrimaryKey(Long id);

    MessageResult createModule(SmartModuleDTO moduleDTO);

    MessageResult modifyModule(Map map);

    SmartModuleEntity findByPrimaryKey(Long id);

    Map queryModuleActions(Map searchMap);

    MessageResult createModuleActions(SmartPermissionDTO permissionDTO);

    MessageResult modifyModuleActions(SmartPermissionDTO permissionDTO);

    MessageResult removeModuleActions(Long id);

}
