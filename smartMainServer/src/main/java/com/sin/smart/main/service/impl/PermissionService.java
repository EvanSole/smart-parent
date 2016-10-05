package com.sin.smart.main.service.impl;

import com.sin.smart.convert.ListArraysConvert;
import com.sin.smart.core.web.MessageResult;
import com.sin.smart.dto.SmartPermissionDTO;
import com.sin.smart.dto.SmartRolePermissionDTO;
import com.sin.smart.entity.main.SmartPermissionEntity;
import com.sin.smart.main.mapper.PermissionMapper;
import com.sin.smart.main.service.IModuleService;
import com.sin.smart.main.service.IPermissionService;
import com.sin.smart.utils.BeanUtils;
import org.apache.commons.collections.MapUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PermissionService implements IPermissionService {

    @Autowired
    PermissionMapper permissionMapper;

    @Autowired
    IModuleService moduleService;

    @Override
    public MessageResult removeByPrimaryKey(Long id) {
        permissionMapper.deleteByPrimaryKey(id);
        return MessageResult.getSucMessage();
    }

    @Override
    public MessageResult createPermission(SmartPermissionDTO permissionDTO) {
        SmartPermissionEntity permissionEntity = BeanUtils.copyBeanPropertyUtils(permissionDTO,SmartPermissionEntity.class);
        permissionMapper.insertPermission(permissionEntity);
        return MessageResult.getSucMessage();
    }

    @Override
    public MessageResult modifyPermissionEntity(SmartPermissionDTO permissionDTO) {
        SmartPermissionEntity permissionEntity = BeanUtils.copyBeanPropertyUtils(permissionDTO,SmartPermissionEntity.class);
        permissionMapper.updatePermission(permissionEntity);
        return MessageResult.getSucMessage();
    }

    @Override
    public SmartPermissionEntity findByPrimaryKey(Long id) {
        return permissionMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<Map<String, Object>> findPermissionByUserId(Long id) {
        return permissionMapper.selectPermissionByUserId(id);
    }

    @Override
    public List<SmartPermissionEntity> findPermissionByModuleId(Long moduleId) {
        return permissionMapper.selectPermissionByModuleId(moduleId);
    }

    @Override
    public Map queryPermModuleByRoles(Map searchMap) {
        Long roleId = MapUtils.getLong(searchMap,"roleId");
        List<Map<String, Object>> mapList = permissionMapper.selectPermissionModuleByRoleId(roleId);
        //转换
        List<Object[]> list = ListArraysConvert.listMapToArrayConvert(mapList);
        List<SmartRolePermissionDTO> rolePermissionLists = new ArrayList();
        list.forEach(x->{
            SmartRolePermissionDTO rolePermissionDTO = new SmartRolePermissionDTO();
            rolePermissionDTO.setId((Long)x[0]);
            rolePermissionDTO.setRoleId((Long)x[1]);
            rolePermissionDTO.setActionId((Long)x[2]);
            rolePermissionDTO.setRelationType((String)x[3]);
            rolePermissionLists.add(rolePermissionDTO);
        });

        //获得所以模块及操作权限
        List<Map> allModuleList = moduleService.getAllModuleAction();
        rolePermissionLists.forEach(rolePermission->{
            String actionId = String.valueOf(rolePermission.getActionId());
            String type = rolePermission.getRelationType();
            for(Map  map: allModuleList){
                String innerId = MapUtils.getString(map,"id");
                if(type == null){
                    continue;
                }
                if(type.equals("a") && innerId.equals("a_"+actionId)){
                    map.put("checked",true);
                    break;
                }
                if(type.equals("m") && innerId.equals(actionId)){
                    map.put("checked",true);
                    break;
                }
            }
        });
        Map resultMap = new HashMap();
        resultMap.put("rows",allModuleList);
        return resultMap;
    }


    @Override
    public List<SmartPermissionEntity> selectPermissions(Boolean flag) {
        Map map = new HashMap();
        map.put("is_module_default",flag);
        return permissionMapper.selectAllPermissions(map);
    }


    @Override
    public MessageResult saveRoleActionPermission(Map map) {
        Long roleId = MapUtils.getLong(map,"roleId");
        List actionIds = (List) map.get("actions");
        //删除角色对应的权限
        //permissionMapper.deleteRolePermissionByRoleId(roleId);
        List<Long> mList = new ArrayList<>();
        List <SmartRolePermissionDTO>  rolePermissions = new ArrayList();
        for(int i = 0;i < actionIds.size();i++){
            Object objectId = actionIds.get(i);
            SmartRolePermissionDTO rolePermission = new SmartRolePermissionDTO();
            rolePermission.setRoleId(roleId);
            //保存的时候 区分是action / module
            if(objectId instanceof  String){
                String id = objectId.toString();
                id = id.substring(2);
                rolePermission.setActionId(Long.parseLong(id));
                rolePermission.setRelationType("a");
            }else{
                String id = String.valueOf(objectId);
                rolePermission.setActionId(Long.parseLong(id));
                mList.add(Long.parseLong(id));
                rolePermission.setRelationType("m");
            }
            rolePermissions.add(rolePermission);
        }
        permissionMapper.insertBatchRolePermission(rolePermissions);
        return MessageResult.getSucMessage();
    }



}
