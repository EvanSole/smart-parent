package com.sin.smart.app.authorization.shiro;

import com.sin.smart.em.LoginSource;
import org.apache.shiro.authc.UsernamePasswordToken;


public class CustomUserToken extends UsernamePasswordToken {

    private LoginSource source;
    private String tenantNo;
    private String warehouseNo;


    public CustomUserToken(final String userName, final String password, boolean rememberMe, final String loginIp,String tenantNo, String warehouseNo, LoginSource source) {
        super(userName, password, rememberMe, loginIp);
        this.tenantNo = tenantNo;
        this.warehouseNo = warehouseNo;
        this.source = source;
    }

    public CustomUserToken(final String userName, final String password, boolean rememberMe, final String loginIp, String warehouseNo, LoginSource source) {
        super(userName, password, rememberMe, loginIp);
        this.warehouseNo = warehouseNo;
        this.source = source;
    }

    public CustomUserToken(final String userName, final String password, String warehouseNo, LoginSource source) {
        super(userName, password, true, null);
        this.warehouseNo = warehouseNo;
        this.source = source;
    }

    public LoginSource getSource() {
        return source;
    }

    public void setSource(LoginSource source) {
        this.source = source;
    }

    public String getTenantNo() {
        return tenantNo;
    }

    public void setTenantNo(String tenantNo) {
        this.tenantNo = tenantNo;
    }

    public String getWarehouseNo() {
        return warehouseNo;
    }

    public void setWarehouseNo(String warehouseNo) {
        this.warehouseNo = warehouseNo;
    }
}
