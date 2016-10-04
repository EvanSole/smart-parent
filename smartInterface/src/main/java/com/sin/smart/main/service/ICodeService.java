package com.sin.smart.main.service;

import com.sin.smart.core.web.MessageResult;
import com.sin.smart.core.web.PageResponse;
import com.sin.smart.dto.SmartCodeDetailDTO;
import com.sin.smart.dto.SmartCodeHeaderDTO;
import com.sin.smart.entity.main.SmartCodeDetailEntity;
import com.sin.smart.entity.main.SmartCodeHeaderEntity;

import java.util.List;
import java.util.Map;

public interface ICodeService {

     PageResponse<List<SmartCodeHeaderEntity>> getCodeHeaderLists(Map searchMap);

     PageResponse<List<SmartCodeDetailEntity>>  getCodeDetailLists(Map searchMap);

     MessageResult createCodeHeader(SmartCodeHeaderDTO codeHeaderDTO);

     MessageResult modifyCodeHeader(SmartCodeHeaderDTO codeHeaderDTO);

     MessageResult removeCodeHeader(Long id);

     MessageResult removeCodeDetail(Long detailId);

     MessageResult createCodeDetail(SmartCodeDetailDTO codeDetailDTO);

     MessageResult modifyCodeDetail(SmartCodeDetailDTO codeDetailDTO);
}
