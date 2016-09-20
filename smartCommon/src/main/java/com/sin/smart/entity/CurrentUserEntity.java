package com.sin.smart.entity;

public class CurrentUserEntity {
    private String userName;
    private String password;
    private Long tenantId; //租户Id

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getTenantId() {
        return tenantId;
    }

    public void setTenantId(Long tenantId) {
        this.tenantId = tenantId;
    }

    @Override
    public String toString() {
        return "CurrentUserEntity{" +
                "userName='" + userName + '\'' +
                ", password='" + password + '\'' +
                ", tenantId='" + tenantId + '\'' +
                '}';
    }
}
