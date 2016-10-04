package com.sin.smart.app.controller.main;

import com.sin.smart.core.web.BaseController;
import com.sin.smart.core.web.ResponseResult;
import com.sin.smart.dto.SmartWarehouseDTO;
import com.sin.smart.main.service.IWarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/warehouse")
public class WarehouseController extends BaseController {

    @Autowired
    IWarehouseService warehouseService;

    @RequestMapping(value = "",method = RequestMethod.GET)
    public ResponseResult getTenantList(SmartWarehouseDTO warehouseDTO) throws Exception {
        return  new ResponseResult(warehouseService.queryWarehousePages(warehouseDTO));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseResult findWarehouse(@PathVariable Long id) {
        return new ResponseResult(warehouseService.findWarehouseById(id));
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public ResponseResult createWarehouse(@RequestBody SmartWarehouseDTO warehouseDTO) {
        warehouseDTO.setTenantId(this.getCurrentTenantId());
        warehouseDTO.setCreateUser(this.getSessionCurrentUser().getUserName());
        warehouseDTO.setCreateTime(new Date().getTime());
        warehouseDTO.setUpdateUser(this.getSessionCurrentUser().getUserName());
        warehouseDTO.setUpdateTime(new Date().getTime());
        return getMessage(warehouseService.createWarehouse(warehouseDTO));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseResult modifyWarehouse(@RequestBody SmartWarehouseDTO warehouseDTO) {
        warehouseDTO.setUpdateUser(this.getSessionCurrentUser().getUserName());
        warehouseDTO.setUpdateTime(new Date().getTime());
        return getMessage(warehouseService.modifyWarehouse(warehouseDTO));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseResult removeWarehouse(@PathVariable Long id) {
        return getMessage(warehouseService.removeWarehouse(id));
    }

    //查询已分配用户
    @RequestMapping(value = "/{id}/user", method = RequestMethod.GET)
    public ResponseResult queryUserByWarehouseId(@PathVariable Long id,@RequestParam Map map) {
        map.put("warehouseId", id);
        return getSucResultData(warehouseService.queryUserByWarehouse(map));
    }

    //删除已分配用户
    @RequestMapping(value = "/{id}/user/{userWarehouseId}", method = RequestMethod.DELETE)
    public ResponseResult queryUserByWarehouseId(@PathVariable Long id,@PathVariable String userWarehouseId) {
        Map map = new HashMap();
        map.put("warehouseId", id);
        map.put("userWhIds", userWarehouseId);
        return getMessage(warehouseService.removeAllocatableUser(map));
    }


    //查询未分配用户
    @RequestMapping(value = "/{id}/allocatable/user", method = RequestMethod.GET)
    public ResponseResult queryAllocatableUser(@PathVariable Long id,@RequestParam Map map) {
        map.put("warehouseId", id);
        return getSucResultData(warehouseService.queryAllocatableUser(map));
    }

    //保存分配用户
    @RequestMapping(value = "/{id}/allocatable/user", method = RequestMethod.POST)
    public ResponseResult saveAllocatableUser(@PathVariable Long id,@RequestBody Map map) {
        map.put("warehouseId", id);
        map.put("createUser",this.getSessionCurrentUser().getId());
        return getMessage(warehouseService.saveAllocatableUser(map));
    }

    //批量删除分配用户
    @RequestMapping(value = "/{id}/allocated/user/{userWhIds}", method = RequestMethod.DELETE)
    public ResponseResult remaveAllocatableUser(@PathVariable Long id, @PathVariable String userWhIds) {
        Map map = new HashMap();
        map.put("warehouseId", id);
        map.put("userWhIds", userWhIds);
        return getMessage(warehouseService.removeAllocatableUser(map));
    }

}
