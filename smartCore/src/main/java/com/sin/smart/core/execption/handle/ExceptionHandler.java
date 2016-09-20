package com.sin.smart.core.execption.handle;

import com.alibaba.fastjson.JSON;
import com.sin.smart.core.execption.SmartException;
import com.sin.smart.enums.ResponseEnum;
import com.sin.smart.aspectj.handle.HandleRequest;
import com.sin.smart.aspectj.handle.HandleResponse;
import com.sin.smart.aspectj.handle.Handler;
import com.sin.smart.aspectj.handle.util.ExceptionParseUtil;
import com.sin.smart.aspectj.handle.util.HandlerUtil;
import com.sin.smart.respoes.Response;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExceptionHandler implements Handler {

    private final Logger logger = LoggerFactory.getLogger(ExceptionHandler.class);

    @Override
    public HandleResponse handle(HandleRequest handleRequest) {
        Exception e = handleRequest.getException();
        String trace = RandomStringUtils.randomNumeric(36);
        Object result = null;
        String method = HandlerUtil.getMethodString(handleRequest.getProceedingJoinPoint());
        String params = HandlerUtil.getParamsString(handleRequest.getProceedingJoinPoint());
        String clazzName = e.getClass().getName();
        String message = e.getMessage();
        String exceptionString = ExceptionParseUtil.paraseErrorExceptionStack2String(e);
        if (e instanceof NullPointerException) {
            result = new Response(ResponseEnum.PARAM_ERROR.getCode(), ResponseEnum.PARAM_ERROR.getDescription());
            this.logger.error("method: {}||| execute error!||| params: {}||| result: {}||| exception: {}||| message: {}||| stackTrace: {} ||| stringTrace: {} ", new Object[] { method, params, JSON.toJSONString(result), clazzName, message, exceptionString, trace });
        } else if (e instanceof IllegalArgumentException) {
            result = new Response(ResponseEnum.PARAM_ERROR.getCode(), e.getMessage());
            this.logger.error("method: {}||| execute error!||| params: {}||| result: {}||| exception: {}||| message: {}||| stackTrace: {} ||| stringTrace: {} ", new Object[] { method, params, JSON.toJSONString(result), clazzName, message, exceptionString, trace });
        } else if (e instanceof SmartException) {
            String errorMsg = "";
            Integer code = ((SmartException)e).getCode();
            if (code == null) {
                errorMsg = e.getMessage();
                result = new Response(ResponseEnum.PARAM_ERROR.getCode(), errorMsg);
            } else {
                errorMsg = ((SmartException)e).getErrorMessage();
                if (StringUtils.isNotEmpty(errorMsg)) {
                    result = new Response(code, errorMsg);
                } else {
                    errorMsg = e.getMessage();
                    result = new Response(code, errorMsg);
                }

            }
            this.logger.warn("method: {}||| execute error!||| params: {}||| result: {}||| exception: {}||| code: {} |||message: {}||| stackTrace: {} ||| stringTrace: {} ", new Object[] { method, params, JSON.toJSONString(result), clazzName, code, errorMsg, exceptionString, trace });
        }
        else {
            result = new Response(ResponseEnum.FAIL.getCode(), e.getMessage());
            this.logger.error("method: {}||| execute error!||| params: {}||| result: {}||| exception: {}||| message: {}||| stackTrace: {} ||| stringTrace: {} ", new Object[] { method, params, JSON.toJSONString(result), clazzName, message, exceptionString, trace });
        }

        HandleResponse response = new HandleResponse();
        response.setResult(result);
        return response;
    }
}
