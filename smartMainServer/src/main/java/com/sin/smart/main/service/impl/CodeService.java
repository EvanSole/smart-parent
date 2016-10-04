package com.sin.smart.main.service.impl;

import com.sin.smart.core.web.MessageResult;
import com.sin.smart.core.web.PageResponse;
import com.sin.smart.dto.SmartCodeDetailDTO;
import com.sin.smart.dto.SmartCodeHeaderDTO;
import com.sin.smart.entity.main.SmartCodeDetailEntity;
import com.sin.smart.entity.main.SmartCodeHeaderEntity;
import com.sin.smart.main.mapper.CodeDetailMapper;
import com.sin.smart.main.mapper.CodeHeaderMapper;
import com.sin.smart.main.service.ICodeService;
import com.sin.smart.utils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CodeService implements ICodeService {

     @Autowired
     CodeHeaderMapper codeHeaderMapper;

     @Autowired
     CodeDetailMapper codeDetailMapper;

    @Override
    public PageResponse<List<SmartCodeHeaderEntity>> getCodeHeaderLists(Map searchMap) {
        List<SmartCodeHeaderEntity> codeHeaderEntities = codeHeaderMapper.queryCodeHeaderPages(searchMap);
        Integer totalSize = codeHeaderMapper.queryCodeHeaderPageCount(searchMap);
        PageResponse<List<SmartCodeHeaderEntity>> response = new PageResponse();
        response.setTotal(totalSize);
        response.setRows(codeHeaderEntities);
        return  response;
    }

    @Override
    public PageResponse<List<SmartCodeDetailEntity>> getCodeDetailLists(Map searchMap) {
        List<SmartCodeDetailEntity> codeDetailEntities = codeDetailMapper.queryCodeDetailPages(searchMap);
        Integer totalSize = codeDetailMapper.queryCodeDetailPageCount(searchMap);
        PageResponse<List<SmartCodeDetailEntity>> response = new PageResponse();
        response.setTotal(totalSize);
        response.setRows(codeDetailEntities);
        return  response;
    }

    @Override
    public MessageResult createCodeHeader(SmartCodeHeaderDTO codeHeaderDTO) {
        SmartCodeHeaderEntity codeHeaderEntity = BeanUtils.copyBeanPropertyUtils(codeHeaderDTO,SmartCodeHeaderEntity.class);
        codeHeaderMapper.insertCodeHeader(codeHeaderEntity);
        return MessageResult.getSucMessage();
    }

    @Override
    public MessageResult modifyCodeHeader(SmartCodeHeaderDTO codeHeaderDTO) {
        SmartCodeHeaderEntity codeHeaderEntity = BeanUtils.copyBeanPropertyUtils(codeHeaderDTO,SmartCodeHeaderEntity.class);
        codeHeaderMapper.updateCodeHeader(codeHeaderEntity);
        return MessageResult.getSucMessage();
    }

    @Override
    public MessageResult removeCodeHeader(Long id) {
        codeHeaderMapper.deleteCodeHeader(id);
        return MessageResult.getSucMessage();
    }

    @Override
    public MessageResult removeCodeDetail(Long detailId) {
        codeDetailMapper.deleteByPrimaryKey(detailId);
        return MessageResult.getSucMessage();
    }

    @Override
    public MessageResult createCodeDetail(SmartCodeDetailDTO codeDetailDTO) {
        SmartCodeDetailEntity codeDetailEntity = BeanUtils.copyBeanPropertyUtils(codeDetailDTO,SmartCodeDetailEntity.class);
        codeDetailMapper.insertCodeDetail(codeDetailEntity);
        return MessageResult.getSucMessage();
    }

    @Override
    public MessageResult modifyCodeDetail(SmartCodeDetailDTO codeDetailDTO) {
        SmartCodeDetailEntity codeDetailEntity = BeanUtils.copyBeanPropertyUtils(codeDetailDTO,SmartCodeDetailEntity.class);
        codeDetailMapper.updateCodeDetail(codeDetailEntity);
        return MessageResult.getSucMessage();
    }


}
