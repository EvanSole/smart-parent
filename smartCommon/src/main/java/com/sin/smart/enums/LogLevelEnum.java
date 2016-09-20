package com.sin.smart.enums;

/**
 * Created by Evan on 2016/9/20.
 */
public enum  LogLevelEnum {

    LOG_LEVEL_WARN("WARN","WARN",1),
    LOG_LEVEL_ERROR("ERROR","ERROR",2),
    LOG_LEVEL_INFO("INFO","INFO",3);

    private String value;
    private String cnValue;
    private Integer code;

    private LogLevelEnum(String value, String cnValue,Integer code) {
        this.value = value;
        this.cnValue = cnValue;
        this.code = code;
    }

    public String toCn() {
        return this.cnValue;
    }

    public String toString() {
        return this.value;
    }

    public Integer getCode() { return this.code;}
}
