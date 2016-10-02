package com.sin.smart.enums;

/**
 * Created by Evan on 2016/9/20.
 */
public enum ResponseEnum {
    SUCCESS(1001,"success","执行成功"), FAIL(4003,"fail","执行失败"),
    PARAM_ERROR(4001,"param_error","参数错误"), SQL_ERROR(4002,"sql_error","SQL执行错误");
    private Integer code;
    private String value;
    private String description;

    ResponseEnum(Integer code, String value, String description) {
        this.code = code;
        this.value = value;
        this.description = description;
    }

    public Integer getCode() { return this.code;}

    public String getValue() {
        return this.value;
    }

    public String getDescription() {
        return this.description;
    }

}
