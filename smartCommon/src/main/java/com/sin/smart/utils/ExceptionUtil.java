package com.sin.smart.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * Created by Evan on 2016/9/20.
 */
public class ExceptionUtil {

    private static Logger logger = LoggerFactory.getLogger(ExceptionUtil.class);

    public static String paraseErrorExceptionStack2String(Exception e)
    {
        StringWriter stackTraceStringWriter;
        try
        {
            stackTraceStringWriter = new StringWriter();
            PrintWriter stackTracePrinterWriter = new PrintWriter(stackTraceStringWriter);
            e.printStackTrace(stackTracePrinterWriter);
            char[] stackTraceArr = stackTraceStringWriter.toString().toCharArray();
            StringBuilder stackTraceStringBuilder = new StringBuilder("");
            for (int i = 0; i < stackTraceArr.length; ++i) {
                if (stackTraceArr[i] == '\n')
                    stackTraceStringBuilder.append(" ");
                else
                    stackTraceStringBuilder.append(stackTraceArr[i]);

            }

            return stackTraceStringBuilder.toString();
        } catch (Exception e2) {
            logger.error("paraseErrorExceptionStack2String error", e2);
        }

        return "Exception:" + e.getClass().getName() + ",Message:" + e.getMessage();
    }
}
