package com.sin.smart.core.interceptor;

import org.aspectj.lang.ProceedingJoinPoint;

public abstract interface AbstractExceptionInterceptor {
    Object intercept(ProceedingJoinPoint paramProceedingJoinPoint) throws Throwable;
}
