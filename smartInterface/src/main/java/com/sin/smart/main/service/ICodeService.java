package com.sin.smart.main.service;

import com.sin.smart.core.web.MessageResult;
import com.sin.smart.core.web.PageResponse;
import com.sin.smart.dto.CodeDetailDTO;
import com.sin.smart.dto.CodeHeaderDTO;
import com.sin.smart.entity.main.SmartCodeDetailEntity;
import com.sin.smart.entity.main.SmartCodeHeaderEntity;

import java.util.List;
import java.util.Map;

public interface ICodeService {

     PageResponse<List<SmartCodeHeaderEntity>> getCodeHeaderLists(Map searchMap);

     PageResponse<List<SmartCodeDetailEntity>>  getCodeDetailLists(Map searchMap);

     MessageResult createCodeHeader(CodeHeaderDTO codeHeaderDTO);

     MessageResult modifyCodeHeader(CodeHeaderDTO codeHeaderDTO);

     MessageResult removeCodeHeader(Long id);

     MessageResult removeCodeDetail(Long detailId);

     MessageResult createCodeDetail(CodeDetailDTO codeDetailDTO);

     MessageResult modifyCodeDetail(CodeDetailDTO codeDetailDTO);
}
