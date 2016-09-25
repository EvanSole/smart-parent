package com.sin.smart.main.service.impl;

import com.sin.smart.core.web.PageResponse;
import com.sin.smart.dto.SmartUserDTO;
import com.sin.smart.enums.ResponseEnum;
import com.sin.smart.main.mapper.UserMapper;
import com.sin.smart.main.service.IUserService;
import com.sin.smart.core.service.BaseService;
import com.sin.smart.entity.main.SmartUserEntity;
import com.sin.smart.utils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class UserService extends BaseService implements IUserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public SmartUserEntity getUserById(Long userId){
        return userMapper.getUserById(userId);
    }

    @Override
    public SmartUserEntity getUser(String userName, String password) {
        return userMapper.getUser(userName,password);
    }

    @Override
    public SmartUserEntity findByUserName(String userName) {
        return userMapper.findByUserName(userName);
    }

    @Override
    public Set<String> findRoles(String userName) {
        return null;
    }

    @Override
    public Set<String> findPermissions(String userName) {
        return null;
    }

    @Override
    public List getUserLists(Map searchMap) {
        return null;
    }

    @Override
    public PageResponse queryPageUsers(SmartUserDTO userDTO) {
        SmartUserEntity smartUserEntity = BeanUtils.copyBeanPropertyUtils(userDTO, SmartUserEntity.class);
        List<SmartUserEntity>  smartUserEntityList = userMapper.queryPageUser(smartUserEntity);
        Integer totalSize = userMapper.queryPageUserCount(smartUserEntity);
        PageResponse pageResponse = new PageResponse();
        pageResponse.setTotalSize(totalSize);
        pageResponse.setData(smartUserEntityList);
        pageResponse.setCode(ResponseEnum.SUCCESS.getCode());
        return pageResponse;
    }

    @Override
    public void deleteUser(long id) {

    }

    @Override
    public void saveUser(SmartUserDTO userDTO) {

    }

    @Override
    public void updateUser(SmartUserDTO userDTO) {

    }
}
