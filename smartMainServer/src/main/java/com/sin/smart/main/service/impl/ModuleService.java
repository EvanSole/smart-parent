package com.sin.smart.main.service.impl;

import com.sin.smart.constants.GlobalConstants;
import com.sin.smart.convert.ListArraysConvert;
import com.sin.smart.core.web.MessageResult;
import com.sin.smart.dto.SmartModuleDTO;
import com.sin.smart.dto.SmartPermissionDTO;
import com.sin.smart.entity.CurrentUserEntity;
import com.sin.smart.entity.MenuTreeNode;
import com.sin.smart.entity.TreeNode;
import com.sin.smart.entity.main.SmartModuleEntity;
import com.sin.smart.entity.main.SmartPermissionEntity;
import com.sin.smart.enums.ModuleTypeEnum;
import com.sin.smart.main.mapper.ModuleMapper;
import com.sin.smart.main.service.IModuleService;
import com.sin.smart.main.service.IPermissionService;
import com.sin.smart.utils.BeanUtils;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
    IPermissionService permissionService;

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
        List<Map<String, Object>> mapList = permissionService.findPermissionByUserId(sessionCurrentUser.getId());
        List<Object[]> list = ListArraysConvert.listMapToArrayConvert(mapList);
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

    @Override
    public Map queryAllMenus() {
        //查询所有模块
        List<SmartModuleEntity> moduleEntityList = moduleMapper.selectAllModulesAdmin(ModuleTypeEnum.WEB.toString());
        List<TreeNode> treeNodes = conventTreeNodeListFromModuleList(moduleEntityList,false,true);
        TreeNode treeNode = new TreeNode();
        treeNode.setId("0");
        treeNode.setParentId(-1);
        treeNode.setName("");
        treeNodes.add(treeNode);
        Map resultMap = new HashMap();
        resultMap.put("rows",treeNodes);
        return resultMap;
    }


    private List<TreeNode> conventTreeNodeListFromModuleList(List<SmartModuleEntity> moduleEntityList,boolean isUrl,boolean isClick){
        if(CollectionUtils.isNotEmpty(moduleEntityList)){
            List<TreeNode> treeNodes = new ArrayList<TreeNode>();
            for(SmartModuleEntity module : moduleEntityList){
                treeNodes.add(getTreeNodeFromModule(module,isUrl,isClick));
            }
            return treeNodes;
        }
        return null;
    }

    private TreeNode getTreeNodeFromModule(SmartModuleEntity module,boolean isUrl,boolean isClick){
        TreeNode node = new TreeNode();
        node.setId(module.getId()+"");
        node.setName(module.getModuleName());
        node.setParentId(module.getParentId());
        if(isUrl){
            node.setUrl(module.getModulePath());
            if(!node.getUrl().equals("")){
                node.setUrl(addMoudleId2Url(node.getUrl(),node.getId()));
            }
        }
        if(isClick){
            node.setClick("treeNodeClick('"+module.getId()+"')");
        }
        node.setSortindex(module.getPosition());
        return node;
    }

    private String addMoudleId2Url(String url,String moudleId){
        if(url.contains("?")){
            url += "&";
        }else{
            url +="?";
        }
        url += "moudleId="+ moudleId;
        return url;
    }

    private void copyEntity2Node(MenuTreeNode menuTreeNode,SmartModuleEntity moduleEntity){
        menuTreeNode.setId(String.valueOf(moduleEntity.getId()));
        menuTreeNode.setName(moduleEntity.getModuleName());
        menuTreeNode.setParentId(String.valueOf(moduleEntity.getParentId()));
        menuTreeNode.setPath(moduleEntity.getModulePath());
        menuTreeNode.setIcons(moduleEntity.getIcons());
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
    public MessageResult removeByPrimaryKey(Long id) {
        //TODO
        //删除前验证是否存在子级菜单
        moduleMapper.deleteByPrimaryKey(id);
        return MessageResult.getSucMessage();
    }

    @Override
    public SmartModuleEntity findByPrimaryKey(Long id) {
        return  moduleMapper.selectByPrimaryKey(id);
    }

    @Override
    public Map queryModuleActions(Map searchMap) {
        Long moduleId = MapUtils.getLong(searchMap,"moduleId");
        List<SmartPermissionEntity> permissionEntityList = permissionService.findPermissionByModuleId(moduleId);
        if(CollectionUtils.isNotEmpty(permissionEntityList)) {
            Map resultMap = new HashMap();
            resultMap.put("rows", permissionEntityList);
            resultMap.put("total", permissionEntityList.size());
            return resultMap;
        }
        return null;
    }

    @Override
    public MessageResult createModuleActions(SmartPermissionDTO permissionDTO) {
        return permissionService.createPermission(permissionDTO);
    }

    @Override
    public MessageResult modifyModuleActions(SmartPermissionDTO permissionDTO) {
        return permissionService.modifyPermissionEntity(permissionDTO);
    }

    @Override
    public MessageResult removeModuleActions(Long id) {
        return permissionService.removeByPrimaryKey(id);
    }

    @Override
    public MessageResult createModule(SmartModuleDTO moduleDTO) {
        SmartModuleEntity moduleEntity = BeanUtils.copyBeanPropertyUtils(moduleDTO, SmartModuleEntity.class);
        moduleEntity.setTypeCode("WMS");
        moduleEntity.setIsVisible(true);
        if(StringUtils.isEmpty(moduleDTO.getIcons())) {
            moduleEntity.setIcons(GlobalConstants.DEFAULT_MENU_ICONS);
        }
        if (StringUtils.isEmpty(moduleEntity.getModuleType())) {
            moduleEntity.setModuleType("Web");
        }
        moduleMapper.insertModule(moduleEntity);
        return MessageResult.getSucMessage();
    }

    @Override
    public MessageResult modifyModule(Map map) {
        Long moduleId = MapUtils.getLong(map,"id");
        if(moduleId == 0 ){
            return MessageResult.getMessage("E10006");
        }
        String updateUser = MapUtils.getString(map,"moduleName");
        String moduleName = MapUtils.getString(map,"moduleName");
        String modulePath = MapUtils.getString(map,"modulePath");
        Integer position = MapUtils.getInteger(map,"position");
        String moduleType = MapUtils.getString(map,"moduleType");
        String description = MapUtils.getString(map,"description");
        String icons = MapUtils.getString(map,"icons");

        SmartModuleEntity moduleEntity = this.findByPrimaryKey(moduleId);
        moduleEntity.setModuleName(moduleName);
        moduleEntity.setModuleType(moduleType);
        moduleEntity.setModulePath(modulePath);
        moduleEntity.setModuleType(moduleType);
        moduleEntity.setPosition(position);
        moduleEntity.setIcons(StringUtils.isEmpty(icons) ? GlobalConstants.DEFAULT_MENU_ICONS : icons);
        moduleEntity.setDescription(description);
        moduleEntity.setUpdateTime(new java.util.Date().getTime());
        moduleEntity.setUpdateUser(updateUser);
        moduleMapper.updateModule(moduleEntity);
        return MessageResult.getSucMessage();
    }

    @Override
    public List getAllModuleAction() {
        Map paramsMap = new HashMap();
        paramsMap.put("isVisible",new Byte("1"));
        List <SmartModuleEntity> moduleList = moduleMapper.selectAllModules(paramsMap);
        List <SmartPermissionEntity> actionList  = permissionService.selectPermissions(Boolean.TRUE);
        List <Map> resultList = new ArrayList<>();
        moduleList.forEach(moudle->{
            Map moduleMap = new HashMap();
            moduleMap.put("id",moudle.getId());
            moduleMap.put("name",moudle.getModuleName());
            moduleMap.put("parentId",moudle.getParentId());
            resultList.add(moduleMap);
        });
        actionList.forEach(action->{
            Map actionMap = new HashMap();
            actionMap.put("id","a_"+action.getId());
            String actionName = action.getDescription();
            if(StringUtils.isBlank(actionName)){
                if(StringUtils.isNotBlank(action.getActionName())){
                    actionName = action.getActionName();
                }else{
                    actionName = "未配置";
                }
            }
            actionMap.put("name",actionName);
            actionMap.put("parentId",action.getModuleId());
            resultList.add(actionMap);
        });
        return resultList;
    }

}
