package com.sin.smart.app.controller.main;

import com.sin.smart.core.web.BaseController;
import com.sin.smart.core.web.ResponseResult;
import com.sin.smart.dto.SmartCodeDetailDTO;
import com.sin.smart.dto.SmartCodeHeaderDTO;
import com.sin.smart.entity.main.SmartCodeHeaderEntity;
import com.sin.smart.main.service.ICodeService;
import org.apache.commons.collections.MapUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.Map;

@RequestMapping("/code")
@RestController
public class CodeController extends BaseController {

    @Autowired
    private ICodeService codeService;

    @RequestMapping(value = "/header", method = RequestMethod.GET)
    public ResponseResult getHeaderList(SmartCodeHeaderDTO codeHeaderDTO) throws Exception {
        return getSucResultData(codeService.getCodeHeaderLists(codeHeaderDTO));
    }



    @RequestMapping(value = "/header/{id}/detail", method = RequestMethod.GET)
    public ResponseResult getAllCodeDetailList(@PathVariable Long id,@RequestParam Map map) throws Exception {
        map.put("codeId",id);
        map.put("offset",getOffset(MapUtils.getInteger(map,"page"),MapUtils.getInteger(map,"pageSize")));
        return getSucResultData(codeService.getCodeDetailLists(map));
    }

    @RequestMapping(value = "/header", method = RequestMethod.POST)
    public ResponseResult createCodeHeader(@RequestBody SmartCodeHeaderDTO codeHeaderDTO) throws Exception {
        codeHeaderDTO.setCreateUser(this.getSessionCurrentUser().getUserName());
        codeHeaderDTO.setCreateTime(new Date().getTime());
        codeHeaderDTO.setUpdateUser(this.getSessionCurrentUser().getUserName());
        codeHeaderDTO.setUpdateTime(new Date().getTime());
        return getMessage(codeService.createCodeHeader(codeHeaderDTO));
    }

    @RequestMapping(value = "/header/{id}", method = RequestMethod.PUT)
    public ResponseResult modifyCodeHeader(@PathVariable Long id,@RequestBody SmartCodeHeaderDTO codeHeaderDTO) throws Exception {
        codeHeaderDTO.setUpdateUser(this.getSessionCurrentUser().getUserName());
        codeHeaderDTO.setUpdateTime(new Date().getTime());
        return getMessage(codeService.modifyCodeHeader(codeHeaderDTO));
    }

    @RequestMapping(value = "/header/{id}", method = RequestMethod.DELETE)
    public ResponseResult removeCodeHeader(@PathVariable Long id) throws Exception {
        return getMessage(codeService.removeCodeHeader(id));
    }


    @RequestMapping(value = "/header/{id}/detail", method = RequestMethod.POST)
    public ResponseResult createCodeDetail(@PathVariable Long id,@RequestBody SmartCodeDetailDTO codeDetailDTO) throws Exception {
        codeDetailDTO.setCodeId(id);
        codeDetailDTO.setCreateUser(this.getSessionCurrentUser().getUserName());
        codeDetailDTO.setCreateTime(new Date().getTime());
        codeDetailDTO.setUpdateUser(this.getSessionCurrentUser().getUserName());
        codeDetailDTO.setUpdateTime(new Date().getTime());
        return getMessage(codeService.createCodeDetail(codeDetailDTO));
    }

    @RequestMapping(value = "/header/{id}/detail/{detailId}", method = RequestMethod.DELETE)
    public ResponseResult removeCodeDetail(@PathVariable Long id,@PathVariable Long detailId) throws Exception {
        return getMessage(codeService.removeCodeDetail(detailId));
    }

    @RequestMapping(value = "/header/{id}/detail/{detailId}", method = RequestMethod.PUT)
    public ResponseResult modifyCodeDetail(@PathVariable Long id,@PathVariable Long detailId,@RequestBody SmartCodeDetailDTO codeDetailDTO) throws Exception {
        codeDetailDTO.setCodeId(id);
        codeDetailDTO.setId(detailId);
        codeDetailDTO.setUpdateUser(this.getSessionCurrentUser().getUserName());
        codeDetailDTO.setUpdateTime(new Date().getTime());
        return getMessage(codeService.modifyCodeDetail(codeDetailDTO));
    }

    @RequestMapping(value = "/all/details", method = RequestMethod.GET)
    public ResponseResult getAllCodeLists(@RequestParam Map searchMap) throws Exception {
        return getSucResultData(codeService.getAllCodeDatas(searchMap));
    }




}
