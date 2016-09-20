package com.sin.smart.aspectj.handle.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.PrintWriter;
import java.io.StringWriter;

public class ExceptionParseUtil {

    private static final Logger logger = LoggerFactory.getLogger(ExceptionParseUtil.class);

    public static String paraseErrorExceptionStack2String(Exception e) {
        StringWriter e2;
        try{
            e2 = new StringWriter();
            PrintWriter stackTracePrinterWriter = new PrintWriter(e2);
            e.printStackTrace(stackTracePrinterWriter);
            char[] stackTraceArr = e2.toString().toCharArray();
            StringBuilder stackTraceStringBuilder = new StringBuilder("");

            for (int i = 0; i < stackTraceArr.length; ++i) {
                if (stackTraceArr[i] == '\n')
                    stackTraceStringBuilder.append(" ");
                else
                    stackTraceStringBuilder.append(stackTraceArr[i]);

            }
            return stackTraceStringBuilder.toString();
        } catch (Exception var6) {
            logger.error("paraseErrorExceptionStack2String error", var6); }
        return new StringBuilder().append("Exception:").append(e.getClass().getName()).append(",Message:").append(e.getMessage()).toString();
    }

}
