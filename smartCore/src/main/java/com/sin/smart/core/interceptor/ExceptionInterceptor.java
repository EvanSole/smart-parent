package com.sin.smart.core.interceptor;

import com.sin.smart.core.execption.handle.ExceptionHandler;
import com.sin.smart.aspectj.handle.HandleRequest;
import com.sin.smart.aspectj.handle.HandleResponse;
import com.sin.smart.aspectj.handle.log.LogHandler;
import org.aspectj.lang.ProceedingJoinPoint;

import java.util.Date;

/***
 * 统一异常处理拦截器，通过spring aop 方式切入
 */
public class ExceptionInterceptor implements AbstractExceptionInterceptor {

    private LogHandler logHandler;
    private ExceptionHandler exceptionHandler;

    @Override
    public Object intercept(ProceedingJoinPoint paramProceedingJoinPoint) throws Throwable {
        HandleRequest request = buildHandleRequest(paramProceedingJoinPoint);
        Object re = null;
        try {
            re = paramProceedingJoinPoint.proceed();
            request.setResult(re);
            this.logHandler.handle(request);
        } catch (Exception e) {
            request.setException(e);
            HandleResponse response = this.exceptionHandler.handle(request);
            re = response.getResult();
        }
        return re;
    }

    private HandleRequest buildHandleRequest(ProceedingJoinPoint pjp){
        long startTime = new Date().getTime();
        HandleRequest request = new HandleRequest();
        request.setStartTime(Long.valueOf(startTime));
        request.setProceedingJoinPoint(pjp);
        return request;
    }

    public LogHandler getLogHandler(){
        return this.logHandler;
    }

    public void setLogHandler(LogHandler logHandler) {
        this.logHandler = logHandler;
    }

    public ExceptionHandler getExceptionHandler() {
        return this.exceptionHandler;
    }

    public void setExceptionHandler(ExceptionHandler exceptionHandler) {
        this.exceptionHandler = exceptionHandler;
    }
}