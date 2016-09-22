package com.sin.smart.core.interceptor;

import com.sin.smart.core.formwork.db.dao.DatabaseContextHolder;
import com.sin.smart.core.formwork.db.splitdb.ShardTableUtil;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.EmptyInterceptor;

public class SplitTableInterceptor extends EmptyInterceptor {

    @Override
    public String onPrepareStatement(String sql) {
        String splitFlag = DatabaseContextHolder.getCustomerTable();
        if (StringUtils.isEmpty(splitFlag)) {
            return sql;
        }
        return ShardTableUtil.parseSql(sql, splitFlag);
    }

}
