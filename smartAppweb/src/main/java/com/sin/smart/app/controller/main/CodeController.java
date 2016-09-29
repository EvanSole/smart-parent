package com.sin.smart.app.controller.main;

import com.sin.smart.core.web.BaseController;
import com.sin.smart.core.web.ResponseResult;
import com.sin.smart.main.service.ICodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequestMapping("/code")
@RestController
public class CodeController extends BaseController {

    @Autowired
    private ICodeService codeService;

    @RequestMapping(value = "/header", method = RequestMethod.GET)
    public ResponseResult getHeaderList(@RequestParam Map searchMap) throws Exception {
        return new ResponseResult(codeService.getCodeLists(searchMap));
    }

    @RequestMapping(value = "/all/details", method = RequestMethod.GET)
    public ResponseResult getAllCodeDetailMap(@RequestParam Map map) throws Exception {
        return new ResponseResult(codeService.searchCodesAndHeader());
    }
}
