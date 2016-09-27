package com.sin.smart.main.service;

import com.sin.smart.core.web.PageResponse;
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

    Integer removeByPrimaryKey(Long id);

    Integer createModule(SmartModuleEntity moduleEntity);

    Integer modifyModuleEntity(SmartModuleEntity moduleEntity);

    List<SmartModuleEntity> findByModuleEntity(SmartModuleEntity moduleEntity);

    SmartModuleEntity findByPrimaryKey(Long id);

    PageResponse queryModulePages(SmartModuleEntity moduleEntity);

    Integer queryModulePageCount(SmartModuleEntity moduleEntity);


}
