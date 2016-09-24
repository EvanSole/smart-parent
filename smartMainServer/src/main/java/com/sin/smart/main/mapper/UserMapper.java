package com.sin.smart.main.mapper;

import com.sin.smart.entity.main.SmartUserEntity;
import org.apache.ibatis.annotations.Param;

public interface UserMapper {

    SmartUserEntity getUserById(@Param("userId") Long userId);

    SmartUserEntity getUser(@Param("userName") String userName,@Param("password") String password);
}
