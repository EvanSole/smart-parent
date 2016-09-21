package com.sin.smart.po.main;

import com.sin.smart.entity.po.AutoBasePO;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by Evan on 2016/9/19.
 */
@Entity
@Table(name = "t_smart_user")
public class SmartUserEntity extends AutoBasePO {

    private String userName;
    private String password;
    private String realName;
    private String email;
    private String telephone;
    private String mobile;
    private Byte isAdmin;
    private Byte isActive;
    private Byte isDel;

    @Basic
    @Column(name = "user_name", nullable = false, insertable = true, updatable = true, length = 25)
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    @Basic
    @Column(name = "password", nullable = false, insertable = true, updatable = true, length = 100)
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Basic
    @Column(name = "real_name", nullable = true, insertable = true, updatable = true, length = 25)
    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    @Basic
    @Column(name = "email", nullable = true, insertable = true, updatable = true, length = 50)
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Basic
    @Column(name = "telephone", nullable = true, insertable = true, updatable = true, length = 25)
    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    @Basic
    @Column(name = "mobile", nullable = true, insertable = true, updatable = true, length = 25)
    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    @Basic
    @Column(name = "is_admin", nullable = false, insertable = true, updatable = true)
    public Byte getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(Byte isAdmin) {
        this.isAdmin = isAdmin;
    }

    @Basic
    @Column(name = "is_active", nullable = false, insertable = true, updatable = true)
    public Byte getIsActive() {
        return isActive;
    }

    public void setIsActive(Byte isActive) {
        this.isActive = isActive;
    }

    @Basic
    @Column(name = "is_del", nullable = false, insertable = true, updatable = true)
    public Byte getIsDel() {
        return isDel;
    }

    public void setIsDel(Byte isDel) {
        this.isDel = isDel;
    }
}
