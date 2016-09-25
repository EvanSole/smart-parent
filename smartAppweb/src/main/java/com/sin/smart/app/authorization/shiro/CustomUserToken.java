package com.sin.smart.app.authorization.shiro;

import com.sin.smart.em.LoginSource;
import org.apache.shiro.authc.UsernamePasswordToken;


public class CustomUserToken extends UsernamePasswordToken {

    private LoginSource source;
    private String tenantNo;

    public CustomUserToken(final String userName, final String password, boolean rememberMe, final String loginIp, String tenantNo, LoginSource source) {
        super(userName, password, rememberMe, loginIp);
        this.tenantNo = tenantNo;
        this.source = source;
    }

    public CustomUserToken(final String userName, final String password, String tenantNo, LoginSource source) {
        super(userName, password, false, null);
        this.tenantNo = tenantNo;
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
}
