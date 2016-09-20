package com.sin.smart.aspectj.handle.util;

import com.alibaba.fastjson.JSON;
import com.sin.smart.aspectj.handle.HandleRequest;
import org.apache.commons.lang3.ArrayUtils;
import org.aspectj.lang.ProceedingJoinPoint;

/**
 * Created by Evan on 2016/9/20.
 */
public class HandlerUtil {
    public static String getRequest(ProceedingJoinPoint pjp)
    {
        String method = getMethodString(pjp);
        String params = getParamsString(pjp);
        return new StringBuilder().append(method).append(params).toString();
    }

    public static String getMethodString(ProceedingJoinPoint pjp) {
        return new StringBuilder().append(pjp.getTarget().getClass().getName()).append("[").append(pjp.getSignature().getName()).append("]:").toString();
    }

    public static String getParamsString(ProceedingJoinPoint pjp) {
        Object[] args = pjp.getArgs();
        if (ArrayUtils.isEmpty(args))
            return "";
        StringBuilder sb = new StringBuilder(512);
        int i = 0; for (int len = args.length; i < len; ++i) {
            sb.append(JSON.toJSONString(args[i])).append("&");
        }
        return ((sb.length() > 0) ? sb.substring(0, sb.length() - 1) : sb.toString());
    }

    public static String getResponse(HandleRequest request) {
        return JSON.toJSONString(request.getResult());
    }
}
