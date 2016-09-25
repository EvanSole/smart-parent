package com.sin.smart.app.authorization.shiro;

import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;


public class CustomCredentialsMatcher  extends HashedCredentialsMatcher {
    @Override
    public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {
        Object tokenCredentials = token.getCredentials();
        Object accountCredentials = getCredentials(info);
        return equals(tokenCredentials,accountCredentials.toString());
    }


}