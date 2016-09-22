package com.sin.smart.core.formwork.db.dao;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

/**
 * spring动态数据源实现类
 */
public class DynamicDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        return DatabaseContextHolder.getCustomerType();
    }
}
