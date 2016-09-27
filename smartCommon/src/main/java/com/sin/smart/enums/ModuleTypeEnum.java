package com.sin.smart.enums;

public enum ModuleTypeEnum {

    WEB("Web","web程序"),RF("Rf","手持设备");

    private String value;
    private String chValue;
    private ModuleTypeEnum(String value, String chValue){
        this.value = value;
        this.chValue = chValue;
    }
    public String toString(){
        return this.value;
    }
    public String toCn(){
        return this.chValue;
    }
}
