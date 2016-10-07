package com.sin.smart.main.mapper;

import com.sin.smart.entity.main.SmartCodeHeaderEntity;

import java.util.List;
import java.util.Map;

public interface CodeHeaderMapper {

    List<SmartCodeHeaderEntity> queryCodeHeaderPages(Map searchMap);

    Integer queryCodeHeaderPageCount(Map searchMap);

    Integer insertCodeHeader(SmartCodeHeaderEntity codeHeaderEntity);

    SmartCodeHeaderEntity selectByPrimaryKey(Long id);

    Integer updateCodeHeader(SmartCodeHeaderEntity codeHeaderEntity);

    Integer deleteCodeHeader(Long id);

    List<SmartCodeHeaderEntity> selectAllCodeHeaders(Map searchMap);
}
