package com.sin.smart.main.service.impl;

import com.sin.smart.core.web.PageResponse;
import com.sin.smart.entity.CurrentUserEntity;
import com.sin.smart.entity.MenuTreeNode;
import com.sin.smart.entity.main.SmartModuleEntity;
import com.sin.smart.enums.ModuleTypeEnum;
import com.sin.smart.main.mapper.ModuleMapper;
import com.sin.smart.main.mapper.PermissionMapper;
import com.sin.smart.main.service.IModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class ModuleService implements IModuleService{

    @Autowired
    ModuleMapper moduleMapper;

    @Autowired
    PermissionMapper permissionMapper;

    @Override
    public List getModulesByUser(CurrentUserEntity sessionCurrentUser) {
        List <SmartModuleEntity> list = null;
        List <MenuTreeNode> retList = new ArrayList<MenuTreeNode>();
        if(sessionCurrentUser.getIsAdmin() != null && sessionCurrentUser.getIsAdmin() == 1){
            //如果是管理员获得所有模块菜单
            list = moduleMapper.selectAllModulesAdmin(ModuleTypeEnum.WEB.toString());
        }else{
            //如果是普通用户则根据登录用户权限获取模块
            list = moduleMapper.selectAllModuleNormal(sessionCurrentUser.getId(),ModuleTypeEnum.WEB.toString());
        }
        // 组合成树状
        list.forEach( x->{
            if(x.getParentId() == 0){
                MenuTreeNode menuTreeNode = new MenuTreeNode();
                copyEntity2Node(menuTreeNode,x);
                retList.add(menuTreeNode);
            }
        });

        for(MenuTreeNode menuTreeNode:retList){
            makeMenuTree(menuTreeNode,list);
        }
        return retList;
    }

    @Override
    public Map getAllModuleActionByUser(CurrentUserEntity sessionCurrentUser) {
        Map retMap = new HashMap();
        if( 1 == sessionCurrentUser.getIsAdmin()){
            retMap.put("isAdmin",true);
            return retMap;
        }
        //根据当前用户Id获取用户的模块及模块对应操作权限
        List<Map<String, Object>> mapList = permissionMapper.selectPermissionMapperByUserId(sessionCurrentUser.getId());
        List<Object[]> list = new ArrayList<Object[]>();
        for (Map<String, Object> map : mapList) {
            Collection values = map.values();
            List listArray = new ArrayList(values);
            list.add(listArray.toArray());
        }
        //获取模块Id
        List moduleIdList = new ArrayList();
        list.forEach(x-> {
            moduleIdList.add(x[0]);
        });
        if(moduleIdList.size() == 0){
            retMap.put("isAdmin",false);
            return retMap;
        }
        //过滤
        List<SmartModuleEntity> mList = moduleMapper.selectModuleByIds(moduleIdList);
        list.forEach(x-> {
            Optional<SmartModuleEntity> optional= mList.stream().filter(y->y.getId() == (Long)x[0]).findFirst();
            if(optional.isPresent()){
                x[0]=optional.get().getModulePath();
            }
        });

        Map map = list.stream().collect(Collectors.groupingBy(x->x[0],Collectors.toList()));
        Map permMap = new HashMap();
        for (Object key : map.keySet()) {
            List <Object[]>tempList = (List) map.get(key);
            List buttonList = new ArrayList();
            tempList.forEach(x->{
                Map buttonMap = new HashMap();
                buttonMap.put("buttonId",x[1]);
                buttonMap.put("buttonName",x[2]);
                buttonList.add(buttonMap);
            });
            permMap.put(key,buttonList);
        }
        retMap.put("isAdmin",false);
        retMap.put("perm",permMap);
        return retMap;
    }

    private void copyEntity2Node(MenuTreeNode menuTreeNode,SmartModuleEntity moduleEntity){
        menuTreeNode.setId(String.valueOf(moduleEntity.getId()));
        menuTreeNode.setName(moduleEntity.getModuleName());
        menuTreeNode.setParentId(String.valueOf(moduleEntity.getParentId()));
        menuTreeNode.setPath(moduleEntity.getModulePath());
    }

    private void makeMenuTree(MenuTreeNode menuTreeNode,List<SmartModuleEntity> moduleList){
        List<MenuTreeNode> list = new ArrayList<MenuTreeNode>();
        moduleList.forEach(x->{
            if(menuTreeNode.getId().equals(String.valueOf(x.getParentId()))){
                MenuTreeNode menuTreeNodeSon = new MenuTreeNode();
                copyEntity2Node(menuTreeNodeSon,x);
                makeMenuTree(menuTreeNodeSon,moduleList);
                list.add(menuTreeNodeSon);
            }
        });
        menuTreeNode.setChildren(list);
    }

    @Override
    public Integer removeByPrimaryKey(Long id) {
        return null;
    }

    @Override
    public Integer createModule(SmartModuleEntity moduleEntity) {
        return null;
    }

    @Override
    public Integer modifyModuleEntity(SmartModuleEntity moduleEntity) {
        return null;
    }

    @Override
    public List<SmartModuleEntity> findByModuleEntity(SmartModuleEntity moduleEntity) {
        return null;
    }

    @Override
    public SmartModuleEntity findByPrimaryKey(Long id) {
        return null;
    }

    @Override
    public PageResponse queryModulePages(SmartModuleEntity moduleEntity) {
        return null;
    }

    @Override
    public Integer queryModulePageCount(SmartModuleEntity moduleEntity) {
        return null;
    }


}
