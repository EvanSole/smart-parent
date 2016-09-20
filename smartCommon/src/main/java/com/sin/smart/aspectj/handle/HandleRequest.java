package com.sin.smart.aspectj.handle;

import org.aspectj.lang.ProceedingJoinPoint;

/**
 * Created by Evan on 2016/9/20.
 */
public class HandleRequest {

    private ProceedingJoinPoint proceedingJoinPoint;
    private Exception exception;
    private Long startTime;
    private Object result;

    public ProceedingJoinPoint getProceedingJoinPoint() {
        return proceedingJoinPoint;
    }

    public void setProceedingJoinPoint(ProceedingJoinPoint proceedingJoinPoint) {
        this.proceedingJoinPoint = proceedingJoinPoint;
    }

    public Exception getException() {
        return exception;
    }

    public void setException(Exception exception) {
        this.exception = exception;
    }

    public Long getStartTime() {
        return startTime;
    }

    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    public Object getResult() {
        return result;
    }

    public void setResult(Object result) {
        this.result = result;
    }
}
