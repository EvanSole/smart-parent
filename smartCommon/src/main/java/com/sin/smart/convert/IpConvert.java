package com.sin.smart.convert;

import ch.qos.logback.classic.pattern.ClassicConverter;
import ch.qos.logback.classic.spi.ILoggingEvent;
import com.sin.smart.utils.IPUtil;
import org.apache.commons.lang3.StringUtils;

public class IpConvert extends ClassicConverter{
    @Override
    public String convert(ILoggingEvent iLoggingEvent) {
        return StringUtils.isEmpty(IPUtil.getLocalIP()) ? "" : IPUtil.getLocalIP();
    }
}
