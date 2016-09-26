package com.sin.smart.core.interceptor;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.sin.smart.constants.GlobalConstants;
import com.sin.smart.core.formwork.db.splitdb.ShardTableUtil;
import com.sin.smart.utils.ReflectionUtils;
import org.apache.ibatis.executor.statement.RoutingStatementHandler;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.sql.Connection;
import java.util.Properties;

/**
 *  分表拦截器，对执行的sql进行拦截,通过传入的splitTableKey标示切换到目的table
 */
@Intercepts({ @Signature(type = StatementHandler.class, method = "prepare", args = { Connection.class,Integer.class }) })
public class SplitTableInterceptor implements Interceptor {

    private final static Logger _Logger = LoggerFactory.getLogger(SplitTableInterceptor.class);

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        _Logger.info(" splitTableInterceptor  interceptor .....");
        if(invocation.getTarget() instanceof RoutingStatementHandler) {
            /**
             * 对于StatementHandler其实只有两个实现类，一个是RoutingStatementHandler，另一个是抽象类BaseStatementHandler，
             * BaseStatementHandler有三个子类，分别是SimpleStatementHandler，PreparedStatementHandler和CallableStatementHandler，
             * SimpleStatementHandler是用于处理Statement的，PreparedStatementHandler是处理PreparedStatement的，而CallableStatementHandler是
             * 处理CallableStatement的。Mybatis在进行Sql语句处理的时候都是建立的RoutingStatementHandler，而在RoutingStatementHandler里面拥有一个
             * StatementHandler类型的delegate属性，RoutingStatementHandler会依据Statement的不同建立对应的BaseStatementHandler，即SimpleStatementHandler、
             * PreparedStatementHandler或CallableStatementHandler，在RoutingStatementHandler里面所有StatementHandler接口方法的实现都是调用的delegate对应的方法。
             * 我们在PageInterceptor类上已经用@Signature标记了该Interceptor只拦截StatementHandler接口的prepare方法，又因为Mybatis只有在建立RoutingStatementHandler的时候
             * 是通过Interceptor的plugin方法进行包裹的，所以我们这里拦截到的目标对象肯定是RoutingStatementHandler对象。
             */
            RoutingStatementHandler handler = (RoutingStatementHandler) invocation.getTarget();
            //通过反射获取到当前RoutingStatementHandler对象的delegate属性,RoutingStatementHandler实现的所有StatementHandler接口方法里面都是调用的delegate对应的方法
            StatementHandler delegate = (StatementHandler) ReflectionUtils.getFieldValue(handler, "delegate");
            //获取到当前StatementHandler的 boundSql，这里不管是调用handler.getBoundSql()还是直接调用delegate.getBoundSql()结果是一样的，因为之前已经说过了
            BoundSql boundSql = delegate.getBoundSql();
            JSONObject jsonObject = (JSONObject) JSON.toJSON(boundSql.getParameterObject());
            //判断是否存在分表标示GlobalConstants.SPLIT_TABLE_KEY = "splitTableKey"
            if(jsonObject.containsKey(GlobalConstants.SPLIT_TABLE_KEY)) {
                String newSql = ShardTableUtil.parseSql(boundSql.getSql(), jsonObject.get(GlobalConstants.SPLIT_TABLE_KEY).toString());
                //利用反射设置当前BoundSql对应的sql属性为我们修改最终执行的Sql
                ReflectionUtils.setFieldValue(boundSql, "sql", newSql);
            }else{
                return invocation.proceed();
            }
        }
        return invocation.proceed();
    }

    @Override
    public Object plugin(Object target) {
        //当目标类是StatementHandler类型时，才包装目标类，否者直接返回目标本身,减少目标被代理的次数
        if (target instanceof StatementHandler) {
            return Plugin.wrap(target, this);
        } else {
            return target;
        }
    }

    @Override
    public void setProperties(Properties properties) {
    }
}
