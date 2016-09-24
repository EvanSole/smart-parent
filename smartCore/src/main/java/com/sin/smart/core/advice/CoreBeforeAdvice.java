package com.sin.smart.core.advice;

import com.sin.smart.core.formwork.db.dao.DatabaseContextHolder;
import com.sin.smart.core.formwork.db.splitdb.ShardTableUtil;
import com.sin.smart.core.formwork.db.util.DbShareField;
import com.sin.smart.core.formwork.db.vo.DbShardVO;
import org.springframework.aop.MethodBeforeAdvice;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

public class CoreBeforeAdvice implements MethodBeforeAdvice {

    private static List<String> readMethodList;

    static{
        readMethodList = new ArrayList<String>();
        readMethodList.add("list");
        readMethodList.add("find");
        readMethodList.add("get");
        readMethodList.add("search");
        readMethodList.add("query");
    }

    @Override
    public void before(Method m, Object[] arg, Object paramObject) throws Throwable {
        DatabaseContextHolder.clearCustomerType();
        //处理切换数据源
        handleDataSourceSwitch(m, arg);
    }

    void handleDataSourceSwitch(Method m,Object[] arg) throws Exception {

        Class[] types = m.getParameterTypes();
        DbShardVO dbShardVO = null;
        for (int j = types.length - 1; j >= 0; j--) {
            Class cls = types[j];
            if ("DbShardVO[]".equals(cls.getSimpleName())) {
                DbShardVO[] dbs = (DbShardVO[]) arg[j];
                if (null != dbs && dbs.length > 0) {
                    dbShardVO = dbs[0];
                    break;
                }
            } else if ("DbShardVO".equals(cls.getSimpleName())) {
                dbShardVO = (DbShardVO) arg[j];
            }

        }
        String ms ="_w";
        if(isHaveReadMethodName(m.getName())){
            ms = "_r";
        }

        //如果dbShardVO为空 说明不分库 则默认main库
        if(dbShardVO == null){
            DatabaseContextHolder.setCustomerType(DbShareField.DEFAULT + ms);
        }else{
            DatabaseContextHolder.setCustomerType(getDbName(dbShardVO)+ ms);
        }

    }

    private boolean isHaveReadMethodName(String method){
        for(String str:readMethodList){
            if(method.toLowerCase().contains(str)){
                return true;
            }
        }
        return false;
    }


    private String getDbName(DbShardVO dbShardVO) {
        String dbName = "";
        Integer packageStr = ShardTableUtil.getJdbcIndex(dbShardVO.getShardDbId());
        dbName += dbShardVO.getSource().toString() + packageStr;
        return dbName;
    }
}
