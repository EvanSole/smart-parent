package com.sin.smart.app.controller.main;

import com.sin.smart.core.web.BaseController;
import com.sin.smart.core.web.ResponseResult;
import com.sin.smart.dto.SmartUserDTO;
import com.sin.smart.main.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/user")
public class UserController extends BaseController {

    @Autowired
    private IUserService userService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public ResponseResult searchUsersPage(@RequestBody SmartUserDTO userDTO) throws Exception {
         return getSucResultData(userService.queryUserPages(userDTO));
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public ResponseResult addUser(@RequestBody SmartUserDTO userDTO) throws Exception {
        userService.createUser(userDTO);
        return getSucMessage();
    }

    @RequestMapping(value = "", method = RequestMethod.PUT)
    public ResponseResult updateUser(@RequestBody SmartUserDTO userDTO) throws Exception {
        userService.modifyUser(userDTO);
        return getSucMessage();
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE)
    public ResponseResult deleteUser(@PathVariable Long id) throws Exception {
        userService.removeUser(id);
        return getSucMessage();
    }


}
