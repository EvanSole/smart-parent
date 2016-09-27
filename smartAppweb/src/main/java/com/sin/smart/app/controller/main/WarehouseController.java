package com.sin.smart.app.controller.main;

import com.sin.smart.core.web.BaseController;
import com.sin.smart.core.web.ResponseResult;
import com.sin.smart.main.service.IWarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/warehouse")
public class WarehouseController extends BaseController {

    @Autowired
    IWarehouseService warehouseService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public ResponseResult searchWarehouse(@RequestParam Map map) {
        return new ResponseResult(warehouseService.searchWarehouses(map, this.getSessionCurrentUser()));
    }

    @RequestMapping(value = "{id}", method = RequestMethod.GET)
    public ResponseResult findWarehouse(@PathVariable Long id) {
        return new ResponseResult(warehouseService.findWarehouseById(id));
    }

}
