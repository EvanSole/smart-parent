package com.sin.smart.core.service;

import com.sin.smart.core.formwork.db.splitdb.ShareDbUtil;
import com.sin.smart.core.formwork.db.util.DbShareField;
import com.sin.smart.core.formwork.db.vo.DbShardVO;
import com.sin.smart.core.web.MessageResult;
import org.springframework.stereotype.Service;


@Service
public class BaseService {

    /**
     * 占位方法 用于解决spring在添加切面的时候需要有一个方法为public的问题
     */
    public void occupyingMehtod() {
    }

    public MessageResult getMessageResult(String code, Object ...param){
        return MessageResult.getMessage(code,param);
    }

    public String getSplitTableKey(DbShardVO dbShardVO) {
        return dbShardVO.getShardTableId();
    }

    /**
     * 获取默认分库对象,分表属性为租户id
     * @param dbShardVO
     * @return
     */
    protected DbShardVO getDefaultDbShareVO(DbShardVO dbShardVO){
        //获得基础数据相关数据库分库对象 分库id为租户id
        return ShareDbUtil.getNewDbsharedVO(dbShardVO, DbShareField.DEFAULT,dbShardVO.getShardDbId(),dbShardVO.getCurrentUser().getTenantId()+"");
    }

    /**
     * 获得入库/库内分库对象，分表属性仓库Id
     * @param dbShardVO
     * @return
     */
    protected DbShardVO getInwhDbShareVO(DbShardVO dbShardVO){
        return ShareDbUtil.getNewDbsharedVO(dbShardVO, DbShareField.IN_WH,dbShardVO.getShardDbId(),dbShardVO.getWarehouseId()+"");
    }

    /**
     * 获得出库分库对象，分表属性仓库Id
     * @param dbShardVO
     * @return
     */
    protected DbShardVO getOutwhDbShareVO(DbShardVO dbShardVO){
        return ShareDbUtil.getNewDbsharedVO(dbShardVO, DbShareField.OUT_WH,dbShardVO.getShardDbId(),dbShardVO.getWarehouseId()+"");
    }

}
