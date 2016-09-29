package com.sin.smart.main.mapper;

import com.sin.smart.entity.main.SmartModuleEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ModuleMapper {

    List<SmartModuleEntity> selectAllModules(@Param("moduleType") String moduleType);

    List<SmartModuleEntity> selectAllModuleByPermission(@Param("userId") Long userId, @Param("moduleType")String moduleType);

    List<SmartModuleEntity> selectModuleByIds(List moduleIdList);
}
