package com.sin.smart.main.mapper;

import com.sin.smart.entity.main.SmartUserEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserMapper {

    SmartUserEntity selectUserById(@Param("userId") Long userId);

    SmartUserEntity selectUser(@Param("userName") String userName,@Param("password") String password);

    SmartUserEntity findByUserName(@Param("userName") String userName);

    List<SmartUserEntity> queryUserPages(SmartUserEntity smartUserEntity);

    Integer queryUserPageCount(SmartUserEntity smartUserEntity);

    Integer insertUser(SmartUserEntity smartUserEntity);

    Integer updateUser(SmartUserEntity  smartUserEntity);

    Integer deleteUser(@Param("userId") Long id);

    List selectUserRolesById(@Param("userId") Long userId);

    List<SmartUserEntity> selectUsersByTenantId(@Param("tenantId") Long tenantId);

}
