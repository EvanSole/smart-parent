package com.sin.smart.aspectj.handle.log;

import com.sin.smart.aspectj.handle.HandleRequest;
import com.sin.smart.aspectj.handle.Handler;
import com.sin.smart.aspectj.handle.HandleResponse;
import com.sin.smart.aspectj.handle.util.HandlerUtil;
import org.apache.commons.collections.CollectionUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class LogHandler implements Handler {

    private final Logger logger = LoggerFactory.getLogger(LogHandler.class);
    private List<NeedLogConfig> needLogConfigList;

    @Override
    public HandleResponse handle(HandleRequest handleRequest) {
        ProceedingJoinPoint pjp = handleRequest.getProceedingJoinPoint();
        Class clazz = pjp.getTarget().getClass();

        Map needLogConfigMap = getNeedLogConfigMap(this.needLogConfigList);

        NeedLogConfig needLogConfig = (NeedLogConfig)needLogConfigMap.get(clazz.getName());
        if ((needLogConfig != null) &&
                (needLogConfig.getLogClassName().equals(clazz.getName())))
        {
            String request = "";
            String response = "";
            Long runTime = null;
            if (needLogConfig.isRequest()) {
                request = HandlerUtil.getRequest(pjp);
            }

            if (needLogConfig.isResponse()) {
                response = HandlerUtil.getResponse(handleRequest);
            }

            if (needLogConfig.isRunTime()) {
                runTime = Long.valueOf(new Date().getTime() - handleRequest.getStartTime().longValue());
            }

            logger.info("request:[{}],response:[{}],runtime:[{}]", new Object[] { request, response, runTime });
        }

        return null;
    }

    private Map<String, NeedLogConfig> getNeedLogConfigMap(List<NeedLogConfig> needLogConfigList)
    {
        Map needLogConfigMap = new HashMap();
        if (CollectionUtils.isNotEmpty(needLogConfigList))
            for (Iterator i$ = needLogConfigList.iterator(); i$.hasNext(); ) { NeedLogConfig needLogConfig = (NeedLogConfig)i$.next();
                needLogConfigMap.put(needLogConfig.getLogClassName(), needLogConfig);
            }

        return needLogConfigMap;
    }

    public List<NeedLogConfig> getNeedLogConfigList()
    {
        return this.needLogConfigList;
    }

    public void setNeedLogConfigList(List<NeedLogConfig> needLogConfigList) {
        this.needLogConfigList = needLogConfigList;
    }
}
