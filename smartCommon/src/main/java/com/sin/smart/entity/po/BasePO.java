package com.sin.smart.entity.po;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Transient;
import java.io.Serializable;

public class BasePO implements Serializable, Cloneable {

	private static final long serialVersionUID = 4030486044744353522L;
	private int page = 0;
	private int pageSize = 15;
	private String sotrKey;
	private boolean isAsc = true;
	private String createUser;
	private Long createTime;
	private String updateUser;
	private Long updateTime;

	@Transient
	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	@Transient
	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	@Transient
	public String getSotrKey() {
		return sotrKey;
	}

	public void setSotrKey(String sotrKey) {
		this.sotrKey = sotrKey;
	}

	@Transient
	public boolean isAsc() {
		return isAsc;
	}

	public void setAsc(boolean isAsc) {
		this.isAsc = isAsc;
	}

	@Basic
	@Column(name = "create_user", insertable = true, updatable = true, length = 25)
	public String getCreateUser() {
		return createUser;
	}

	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	@Basic
	@Column(name = "create_time", insertable = true, updatable = true)
	public Long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}

	@Basic
	@Column(name = "update_user", insertable = true, updatable = true, length = 25)
	public String getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}

	@Basic
	@Column(name = "update_time", insertable = true, updatable = true)
	public Long getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Long updateTime) {
		this.updateTime = updateTime;
	}

}
