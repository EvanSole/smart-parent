package com.sin.smart.main.dao;

import com.sin.smart.core.formwork.db.dao.BaseDao;
import com.sin.smart.po.main.SmartUserEntity;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;

@Repository
public class UserDao extends BaseDao<SmartUserEntity> {

    public SmartUserEntity getUser(String userName, String password) {
        StringBuilder sb = new StringBuilder(" from SmartUserEntity t where 1=1 and t.isDel=0");
        sb.append(" and t.userName =:userName and t.password =:password");
        Map map = new HashMap();
        map.put("userName", userName);
        map.put("password",password);
        return (SmartUserEntity) this.executeScalarByHql(sb.toString(), map);
    }
}
