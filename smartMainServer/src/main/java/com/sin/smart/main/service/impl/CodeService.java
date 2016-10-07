package com.sin.smart.main.service.impl;

import com.alibaba.fastjson.JSON;
import com.sin.smart.core.redis.RedisTemplate;
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
import com.sin.smart.vo.CodeDetailVO;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.MapUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Service
public class CodeService implements ICodeService {

     @Autowired
     CodeHeaderMapper codeHeaderMapper;

     @Autowired
     CodeDetailMapper codeDetailMapper;

    @Autowired
    RedisTemplate redisTemplate;

    public static final String CODE_HEADER_KEY = "codeHeaderKey";

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
        redisTemplate.lpush(CODE_HEADER_KEY,codeHeaderEntity.getListName());
        return MessageResult.getSucMessage();
    }

    @Override
    public MessageResult modifyCodeHeader(SmartCodeHeaderDTO codeHeaderDTO) {
        SmartCodeHeaderEntity codeHeaderEntity = BeanUtils.copyBeanPropertyUtils(codeHeaderDTO,SmartCodeHeaderEntity.class);
        codeHeaderMapper.updateCodeHeader(codeHeaderEntity);
        redisTemplate.lpush(CODE_HEADER_KEY,codeHeaderEntity.getListName());
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
        SmartCodeHeaderEntity codeHeaderEntity = codeHeaderMapper.selectByPrimaryKey(codeDetailDTO.getCodeId());
        redisTemplate.hset(codeHeaderEntity.getListName(), codeDetailEntity.getCodeName(), JSON.toJSONString(BeanUtils.copyBeanPropertyUtils(codeDetailEntity, CodeDetailVO.class)));
        return MessageResult.getSucMessage();
    }

    @Override
    public MessageResult modifyCodeDetail(SmartCodeDetailDTO codeDetailDTO) {
        SmartCodeDetailEntity codeDetailEntity = BeanUtils.copyBeanPropertyUtils(codeDetailDTO,SmartCodeDetailEntity.class);
        codeDetailMapper.updateCodeDetail(codeDetailEntity);
        SmartCodeHeaderEntity codeHeaderEntity = codeHeaderMapper.selectByPrimaryKey(codeDetailDTO.getCodeId());
        redisTemplate.hset(codeHeaderEntity.getListName(), codeDetailEntity.getCodeName(), JSON.toJSONString(BeanUtils.copyBeanPropertyUtils(codeDetailEntity, CodeDetailVO.class)));
        return MessageResult.getSucMessage();
    }

    /***
     * 从redis获取数据字典信息，如果不存在则查询数据库
     * @param searchMap
     * @return
     */
    @Override
    public Map getAllCodeDatas(Map searchMap) {
        List<String> listNames = redisTemplate.lrange(CODE_HEADER_KEY);
        Map<String, List<CodeDetailVO>> codeMap = new HashMap<>();
        if(CollectionUtils.isNotEmpty(listNames)) {
            listNames.forEach(listName ->{
                Map detailMap = redisTemplate.hgetAll(listName);
                List<CodeDetailVO>  codeDetailVOList= new ArrayList();
                Iterator it = detailMap.keySet().iterator();
                while (it.hasNext()){
                    String key = it.next().toString();
                    codeDetailVOList.add((CodeDetailVO) detailMap.get(key));
                }
                codeMap.put(listName,codeDetailVOList);
            });
        }
        if(MapUtils.isNotEmpty(codeMap) && codeMap.size() != 0){
            return codeMap;
        }
        List<SmartCodeHeaderEntity> codeHeaderEntityList = codeHeaderMapper.selectAllCodeHeaders(searchMap);
        if (CollectionUtils.isNotEmpty(codeHeaderEntityList)) {
                codeHeaderEntityList.forEach(codeHeaderEntity -> {
                    List<SmartCodeDetailEntity> codeDetailEntityList = codeDetailMapper.selectAllCodeDetails(codeHeaderEntity.getId());
                    List<CodeDetailVO> codeDetailVOList = codeDetailEntityList.stream()
                            .filter(codeDetailEntity -> codeDetailEntity != null )
                            .collect(() -> new ArrayList<CodeDetailVO>(),
                                    (list, item) -> list.add(BeanUtils.copyBeanPropertyUtils(item, CodeDetailVO.class)),
                                    (list1, list2) -> list1.addAll(list2)
                            );
                    codeMap.put(codeHeaderEntity.getListName(), codeDetailVOList);
                });
        }
        return codeMap;
    }
}
