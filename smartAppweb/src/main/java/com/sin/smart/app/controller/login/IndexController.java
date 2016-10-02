package com.sin.smart.app.controller.login;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sin.smart.constants.GlobalConstants;
import com.sin.smart.core.web.BaseController;
import com.sin.smart.core.web.ResponseResult;
import com.sin.smart.entity.main.SmartWarehouseEntity;
import com.sin.smart.main.service.IModuleService;
import com.sin.smart.main.service.IRoleService;
import com.sin.smart.main.service.IWarehouseService;
import com.sin.smart.utils.BeanUtils;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/index")
public class IndexController extends BaseController {

    @Autowired
    private IWarehouseService warehouseService;

    @Autowired
    private IModuleService moduleService;

    @Autowired
    private IRoleService roleService;

    /**
     * 根据用户获取操作权限
     * @return
     */
    @RequestMapping(value="perm",method = RequestMethod.GET)
    public ResponseResult getPermission(){
        Map map = moduleService.getAllModuleActionByUser(this.getSessionCurrentUser());
        map.put("userName",this.getSessionCurrentUser().getUserName());
        List<Long> roleList = (List<Long>) this.getSession().getAttribute(GlobalConstants.ROLE_IDS);
        List <String> roleNameList = roleService.getRoleNameByIds(roleList);
        map.put("roleName",roleNameList.stream().collect(Collectors.joining(",")));
        return getSucResultData(map);
    }

    /***
     * 根据用户获取菜单
     * @return
     */
    @RequestMapping(value="menu",method = RequestMethod.GET)
    public ResponseResult getMenuLists(){
        List list = moduleService.getModulesByUser(this.getSessionCurrentUser());
        return getSucResultData(list);
    }



    /**
     * 根据租户查询所有仓库
     * @return
     */
    @RequestMapping(value = "warehouse/combox",method = RequestMethod.GET)
    public ResponseResult searchWarehouseByTenantIdForCombox(){
        List<SmartWarehouseEntity> warehouses = warehouseService.searchWarehouseByUser(this.getSessionCurrentUser());
        Map map = new HashMap();
        map.put("list", BeanUtils.convertListToKeyValues(warehouses, SmartWarehouseEntity.class, "warehouseName", "id"));
        long whId = this.getCurrentWarehouseId();
        if( whId != 0){
            map.put("selected",whId);
        }
        return getSucResultData(map);
    }


    @RequestMapping(value = "warehouse",method = RequestMethod.GET)
    public ResponseResult searchWarehouseByTenantId(){
        List<SmartWarehouseEntity> warehouses = warehouseService.searchWarehouseByUser(getSessionCurrentUser());
        return getSucResultData(BeanUtils.convertListToKeyValues(warehouses, SmartWarehouseEntity.class, "warehouseName", "id"));
    }


    /**
     * 设置当前仓库
     * @return
     */
    @RequestMapping(value = "warehouse/current/{warehouseId}",method = RequestMethod.PUT)
    public ResponseResult setDefaultWh(@PathVariable Long warehouseId){
        this.setCurrentWarehouseId(warehouseId);
        return getSucMessage();
    }


    /**
     * 深度遍历菜单信息
     * @param menu
     * @param menuKeyList
     * @param permsMap
     * @return
     */
    public List deepParse(JSONObject menu, List<Map> menuKeyList, Map<String, List> permsMap) {
        JSONArray children = (JSONArray) menu.get("children");
        List<Map> currentLevelMenuList = new ArrayList<>();
        if (children != null && children.size() > 0) {
            for (int i = 0; i < children.size(); i++) {
                JSONObject childrenMenu = (JSONObject) children.get(i);
                childrenMenu.put("parentId", childrenMenu.get("parent_id"));

                String type = childrenMenu.getString("type");

                if (StringUtils.isNotBlank(type)) {
                    if ("MENU".equals(type)) {

                        String path = childrenMenu.getString("value");
                        if (path.endsWith("html")) {
                            path = path.substring(0, path.indexOf('.'));
                        }

                        childrenMenu.put("path", path);
                        Map menuMap = copyFromJson(childrenMenu);
                        addMenuKey(childrenMenu, menuKeyList);

                        List subList = deepParse(childrenMenu, menuKeyList, permsMap);
                        menuMap.put("children", subList);
                        currentLevelMenuList.add(menuMap);
                    } else if ("ACTION".equals(type)) {
                        makePermList(childrenMenu, menuKeyList, permsMap);
                    }
                }


            }
        }

        return currentLevelMenuList;
    }

    /**
     * 形成权限列表
     * @param permMap
     * @param menuKeyList
     * @param permsMap
     */
    private void makePermList(JSONObject permMap, List<Map> menuKeyList,Map<String, List> permsMap) {
        String parentId = permMap.getString("parentId");

        Map htmlPath = null;
        for(Map temp:menuKeyList){
            if(temp.get(parentId) != null){
                htmlPath = temp;
                break;
            }
        }
        if (htmlPath != null) {
            final String matchStr = htmlPath.get(parentId).toString();

            List matchList = permsMap.get(matchStr);
            Map permNewMap = new HashMap();
            if (CollectionUtils.isNotEmpty(matchList)) {


                permNewMap.put("path", permMap.getString("value"));
                permNewMap.put("buttonName", permMap.getString("name"));
                permNewMap.put("buttonId", permMap.getString("code"));

                matchList.add(permNewMap);
                permsMap.put(matchStr, matchList);
            } else {

                matchList = new ArrayList();
                permNewMap.put("path", permMap.getString("value"));
                permNewMap.put("buttonName", permMap.getString("name"));
                permNewMap.put("buttonId", permMap.getString("code"));

                matchList.add(permNewMap);
                permsMap.put(matchStr, matchList);
            }
        }

    }

    /**
     * 添加菜单key
     * @param menu
     * @param menuKeyList
     */
    private void addMenuKey(JSONObject menu, List<Map> menuKeyList) {
        Map menuKey = new HashMap<>();
        menuKey.put(menu.get("id"), menu.get("path"));
        menuKeyList.add(menuKey);
    }


    /**
     * 拷贝json
     * @param menuJson
     * @return
     */
    private Map copyFromJson(JSONObject menuJson) {
        Map menuMap = new HashMap();
        menuMap.put("id", menuJson.get("id"));
        menuMap.put("parentId", menuJson.get("parentId"));
        menuMap.put("path", menuJson.get("path"));
        menuMap.put("name", menuJson.get("name"));
        return menuMap;
    }

}
