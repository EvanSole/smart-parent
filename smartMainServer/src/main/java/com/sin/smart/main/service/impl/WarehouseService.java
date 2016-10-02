package com.sin.smart.main.service.impl;

import com.sin.smart.convert.ListArraysConvert;
import com.sin.smart.core.web.MessageResult;
import com.sin.smart.core.web.PageResponse;
import com.sin.smart.dto.SmartWarehouseDTO;
import com.sin.smart.entity.CurrentUserEntity;
import com.sin.smart.entity.main.SmartUserEntity;
import com.sin.smart.entity.main.SmartWarehouseEntity;
import com.sin.smart.main.mapper.UserMapper;
import com.sin.smart.main.mapper.WarehouseMapper;
import com.sin.smart.main.service.IWarehouseService;
import com.sin.smart.utils.BeanUtils;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WarehouseService implements IWarehouseService {

    @Autowired
    WarehouseMapper warehouseMapper;

    @Autowired
    UserMapper userMapper;

    @Override
    public List<SmartWarehouseEntity> searchWarehouseByUser(CurrentUserEntity sessionCurrentUser) {
        return warehouseMapper.selectWarehouseLists(sessionCurrentUser.getId(),sessionCurrentUser.getTenantId());
    }

    @Override
    public PageResponse<List<SmartWarehouseEntity>> queryWarehousePages(SmartWarehouseDTO warehouseDTO) {
        SmartWarehouseEntity warehouseEntity = BeanUtils.copyBeanPropertyUtils(warehouseDTO,SmartWarehouseEntity.class);
        List<SmartWarehouseEntity> warehouseEntityList = warehouseMapper.queryWarehousePages(warehouseEntity);
        Integer totalSize = warehouseMapper.queryWarehousePageCount(warehouseEntity);
        PageResponse<List<SmartWarehouseEntity>> response = new PageResponse();
        response.setTotal(totalSize);
        response.setRows(warehouseEntityList);
        return  response;
    }


    @Override
    public SmartWarehouseEntity findWarehouseById(Long id) {
        return warehouseMapper.selectByPrimaryKey(id);
    }

    @Override
    public SmartWarehouseEntity findWarehouseByWarehouseNo(String warehouseNo) {
        return warehouseMapper.selectWarehouseByWarehouseNo(warehouseNo);
    }

    @Override
    public MessageResult createWarehouse(SmartWarehouseDTO warehouseDTO) {
        SmartWarehouseEntity warehouseEntity = BeanUtils.copyBeanPropertyUtils(warehouseDTO,SmartWarehouseEntity.class);
        warehouseMapper.insertWarehouse(warehouseEntity);
        return MessageResult.getSucMessage();
    }

    @Override
    public MessageResult modifyWarehouse(SmartWarehouseDTO warehouseDTO) {
        SmartWarehouseEntity warehouseEntity = BeanUtils.copyBeanPropertyUtils(warehouseDTO,SmartWarehouseEntity.class);
        warehouseMapper.updateWarehouse(warehouseEntity);
        return MessageResult.getSucMessage();
    }

    @Override
    public MessageResult removeWarehouse(Long id) {
        //如果仓库存在分配用户，则不能删除
        List list = warehouseMapper.selectUserByWarehouseId(id);
        if(CollectionUtils.isNotEmpty(list)){
           return  MessageResult.getMessage("E10001");
        }
        warehouseMapper.deleteByPrimaryKey(id);
        return MessageResult.getSucMessage();
    }

    @Override
    public PageResponse<List> queryUserByWarehouse(Map searchMap) {
        List<Map<String, Object>> mapList = warehouseMapper.queryUserByWarehousePages(searchMap);
        //转换
        List<Object[]> list = ListArraysConvert.listMapToArrayConvert(mapList);
        List userLists = new ArrayList();
        list.forEach(x->{
            Map userMap = new HashMap();
            userMap.put("userId",x[0]);
            userMap.put("userName",x[1]);
            userMap.put("realName",x[2]);
            userLists.add(userMap);
        });

        Integer totalSize = warehouseMapper.queryUserByWarehousePageCount(searchMap);
        PageResponse<List> response = new PageResponse();
        response.setTotal(totalSize);
        response.setRows(userLists);
//        Map resultMap = new HashMap();
//        resultMap.put("rows",userList);
//        resultMap.put("total",totalSize);
        return  response;
    }


    @Override
    public PageResponse<List> queryAllocatableUser(Map searchMap) {
        List<Map<String, Object>> mapList = warehouseMapper.queryUserByWarehousePages(searchMap);
        List<Object[]> list = ListArraysConvert.listMapToArrayConvert(mapList);

        Long tenantId = 88L;
        List<SmartUserEntity> userEntityList = userMapper.selectUsersByTenantId(tenantId);



        return null;
    }

}
