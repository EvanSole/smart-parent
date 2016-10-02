package com.sin.smart.core.web;

import org.apache.commons.lang3.StringUtils;

import java.io.Serializable;

public class MessageResult implements Serializable {

    private String code;
    private Object [] params;
    private String message;
    private Object result;

    public static MessageResult getMessage(String code){
        return getMessage(code,null);
    }

    public static MessageResult getMessage(String code,Object [] params){
        MessageResult mr = new MessageResult();
        mr.setCode(code);
        mr.setParams(params);
        return mr;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Object[] getParams() {
        return params;
    }

    public void setParams(Object[] params) {
        this.params = params;
    }

    public boolean isSuc(){
        if(StringUtils.isNotBlank(this.code) && this.code.startsWith("S")){
            return true;
        }
        return false;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public static MessageResult getSucMessage(){
        return MessageResult.getMessage("S00001",null);
    }
    public static MessageResult getFailMessage(){
        return MessageResult.getMessage("E00001",null);
    }

    public Object getResult() {
        return result;
    }

    public void setResult(Object result) {
        this.result = result;
    }
}
