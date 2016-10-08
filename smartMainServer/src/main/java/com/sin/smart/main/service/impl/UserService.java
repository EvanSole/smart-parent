package com.sin.smart.main.service.impl;

import com.sin.smart.constants.GlobalConstants;
import com.sin.smart.convert.ListArraysConvert;
import com.sin.smart.core.web.MessageResult;
import com.sin.smart.core.web.PageResponse;
import com.sin.smart.dto.SmartUserDTO;
import com.sin.smart.entity.CurrentUserEntity;
import com.sin.smart.main.mapper.UserMapper;
import com.sin.smart.main.service.IUserService;
import com.sin.smart.core.service.BaseService;
import com.sin.smart.entity.main.SmartUserEntity;
import com.sin.smart.main.validate.PreconditionsUserUtil;
import com.sin.smart.utils.BeanUtils;
import com.sin.smart.utils.PwdUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;
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
    public MessageResult removeUser(Long id) {
        userMapper.deleteUser(id);
        return MessageResult.getSucMessage();
    }

    @Override
    public MessageResult createUser(SmartUserDTO userDTO) {
        //check Param
        PreconditionsUserUtil.createUserValidate(userDTO);
       //DTO转换为VO
        SmartUserEntity smartUserEntity = BeanUtils.copyBeanPropertyUtils(userDTO, SmartUserEntity.class);
        smartUserEntity.setPassword(PwdUtils.toMd5(StringUtils.isEmpty(userDTO.getPassword()) ? GlobalConstants.DEFAULT_PASSWORD :userDTO.getPassword() ,userDTO.getUserName()));
        userMapper.insertUser(smartUserEntity);
        return MessageResult.getSucMessage();
    }

    @Override
    public MessageResult modifyUser(SmartUserDTO userDTO) {
        //DTO转换为VO
        SmartUserEntity smartUserEntity = BeanUtils.copyBeanPropertyUtils(userDTO, SmartUserEntity.class);
        userMapper.updateUser(smartUserEntity);
        return MessageResult.getSucMessage();
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
    public MessageResult modifyResetUserPwd(Long id,CurrentUserEntity currenUserEntity) {
        if( 1 != currenUserEntity.getIsAdmin()){
            return MessageResult.getMessage("E00013");
        }
        SmartUserEntity userEntity = this.findUserById(id);
        userEntity.setUpdateUser(currenUserEntity.getUserName());
        userEntity.setUpdateTime(new java.util.Date().getTime());
        userEntity.setPassword(PwdUtils.toMd5(GlobalConstants.DEFAULT_PASSWORD,userEntity.getUserName()));
        userMapper.updateUserPwd(userEntity);
        return MessageResult.getSucMessage();
    }

    @Override
    public PageResponse<List> queryUserByRolesPage(Map searchMap) {
        List<Map<String, Object>> mapList = userMapper.queryUserByRolePages(searchMap);
        //转换
        List<Object[]> list = ListArraysConvert.listMapToArrayConvert(mapList);
        List roleUsersLists = new ArrayList();
        list.forEach(x->{
            Map userMap = new HashMap();
            userMap.put("id",x[0]);
            userMap.put("userId",x[1]);
            userMap.put("userName",x[2]);
            userMap.put("realName",x[3]);
            userMap.put("isAdmin",x[4]);
            roleUsersLists.add(userMap);
        });
        Integer totalSize = userMapper.queryUserByRolePageCount(searchMap);
        PageResponse<List> response = new PageResponse();
        response.setTotal(totalSize);
        response.setRows(roleUsersLists);
        return  response;
    }



}
