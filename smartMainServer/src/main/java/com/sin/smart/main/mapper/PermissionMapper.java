package com.sin.smart.main.mapper;

import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Evan on 2016/9/27.
 */
public interface PermissionMapper {

    List selectPermissionMapperByUserId(@Param("userId") Long userId);

}
