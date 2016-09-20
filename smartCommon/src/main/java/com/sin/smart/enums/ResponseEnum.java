package com.sin.smart.enums;

/**
 * Created by Evan on 2016/9/20.
 */
public enum ResponseEnum {
    SUCCESS, PARAM_ERROR, SQL_ERROR, FAIL;
    private Integer code;
    private String value;
    private String description;

    public Integer getCode() {
        return this.code;
    }

    public String getValue() {
        return this.value;
    }

    public String getDescription() {
        return this.description;
    }

}
