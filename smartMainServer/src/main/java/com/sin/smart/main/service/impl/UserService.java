package com.sin.smart.main.service.impl;

import com.sin.smart.core.web.PageResponse;
import com.sin.smart.dto.SmartUserDTO;
import com.sin.smart.main.mapper.UserMapper;
import com.sin.smart.main.service.IUserService;
import com.sin.smart.core.service.BaseService;
import com.sin.smart.entity.main.SmartUserEntity;
import com.sin.smart.main.validate.PreconditionsUserUtil;
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
    public SmartUserEntity findUserById(Long userId){
        return userMapper.selectUserById(userId);
    }

    @Override
    public SmartUserEntity findUser(String userName, String password) {
        return userMapper.selectUser(userName,password);
    }

    @Override
    public SmartUserEntity findByUserName(String userName) {
        return userMapper.findByUserName(userName);
    }

    @Override
    public Integer removeUser(Long id) {
         return userMapper.deleteUser(id);
    }

    @Override
    public Integer createUser(SmartUserDTO userDTO) {
        //check Param
        PreconditionsUserUtil.createUserValidate(userDTO);
        //DTO转换为VO
        SmartUserEntity smartUserEntity = BeanUtils.copyBeanPropertyUtils(userDTO, SmartUserEntity.class);
        return  userMapper.insertUser(smartUserEntity);
    }

    @Override
    public Integer modifyUser(SmartUserDTO userDTO) {
        //DTO转换为VO
        SmartUserEntity smartUserEntity = BeanUtils.copyBeanPropertyUtils(userDTO, SmartUserEntity.class);
        return  userMapper.updateUser(smartUserEntity);
    }

    @Override
    public PageResponse<List<SmartUserEntity>> queryUserPages(SmartUserDTO userDTO) {
        //DTO转换为VO
        SmartUserEntity smartUserEntity = BeanUtils.copyBeanPropertyUtils(userDTO, SmartUserEntity.class);
        List<SmartUserEntity> smartUserEntityList = userMapper.queryUserPages(smartUserEntity);
        Integer totalSize = userMapper.queryUserPageCount(smartUserEntity);
        PageResponse pageResponse = new PageResponse();
        pageResponse.setTotal(totalSize);
        pageResponse.setRows(smartUserEntityList);
        return pageResponse;
    }

    @Override
    public List getRoleIdListByUserId(Long userId) {
        return userMapper.selectUserRolesById(userId);
    }

    @Override
    public List<SmartUserEntity> queryUsersByWarehouse(Map searchMap) {
        return userMapper.selectUsersByWarehouse(searchMap);
    }

    @Override
    public Set<String> findRoles(String userName) {
        return null;
    }

    @Override
    public Set<String> findPermissions(String userName) {
        return null;
    }


}
