package com.sin.smart.main.mapper;

import com.sin.smart.entity.main.SmartUserEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserMapper {

    SmartUserEntity getUserById(@Param("userId") Long userId);

    SmartUserEntity getUser(@Param("userName") String userName,@Param("password") String password);

    SmartUserEntity findByUserName(@Param("userName") String userName);

    List<SmartUserEntity> queryPageUser(@Param("smartUserEntity") SmartUserEntity smartUserEntity);

    Integer queryPageUserCount(@Param("smartUserEntity") SmartUserEntity smartUserEntity);
}
