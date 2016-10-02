package com.sin.smart.dto;

import com.sin.smart.entity.po.BasePO;

import java.io.Serializable;

public class SmartTenantDTO extends BasePO implements Serializable {

    private Long id;

    private String typeCode;

    private String tenantNo;

    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTypeCode() {
        return typeCode;
    }

    public void setTypeCode(String typeCode) {
        this.typeCode = typeCode;
    }

    public String getTenantNo() {
        return tenantNo;
    }

    public void setTenantNo(String tenantNo) {
        this.tenantNo = tenantNo;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "SmartTenantDTO{" +
                "id=" + id +
                ", typeCode='" + typeCode + '\'' +
                ", tenantNo='" + tenantNo + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
