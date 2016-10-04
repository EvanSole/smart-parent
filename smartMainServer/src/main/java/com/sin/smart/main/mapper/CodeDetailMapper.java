package com.sin.smart.main.mapper;


import com.sin.smart.entity.main.SmartCodeDetailEntity;

import java.util.List;
import java.util.Map;

public interface CodeDetailMapper {

    List<SmartCodeDetailEntity> queryCodeDetailPages(Map searchMap);

    Integer queryCodeDetailPageCount(Map searchMap);

    Integer deleteByPrimaryKey(Long detailId);

    Integer insertCodeDetail(SmartCodeDetailEntity codeDetailEntity);

    Integer updateCodeDetail(SmartCodeDetailEntity codeDetailEntity);
}

