package com.sin.smart.main.mapper;

import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PermissionMapper {

    List selectPermissionMapperByUserId(@Param("userId") Long userId);

}
