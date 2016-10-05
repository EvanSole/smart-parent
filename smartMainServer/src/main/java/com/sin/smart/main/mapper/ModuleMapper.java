package com.sin.smart.main.mapper;

import com.sin.smart.entity.main.SmartModuleEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface ModuleMapper {

    //管理员获取菜单
    List<SmartModuleEntity> selectAllModulesAdmin(@Param("moduleType") String moduleType);

    //普通用户根据权限获取菜单
    List<SmartModuleEntity> selectAllModuleNormal(@Param("userId") Long userId, @Param("moduleType")String moduleType);

    List<SmartModuleEntity> selectModuleByIds(List moduleIdList);

    Integer deleteByPrimaryKey(Long id);

    SmartModuleEntity selectByPrimaryKey(Long id);

    Integer insertModule(SmartModuleEntity moduleEntity);

    Integer updateModule(SmartModuleEntity moduleEntity);

    List<SmartModuleEntity> selectAllModules(Map paramsMap);

}
