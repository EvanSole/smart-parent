package com.sin.smart.entity.po;

import java.io.Serializable;

public class BasePO implements Serializable, Cloneable {

	protected long id;
	private boolean isAsc = true;
	private String createUser;
	private Long createTime;
	private String updateUser;
	private Long updateTime;
	private int page = 0;
	private int pageSize = 15;
	private String sotrKey;

	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public String getSotrKey() {
		return sotrKey;
	}

	public void setSotrKey(String sotrKey) {
		this.sotrKey = sotrKey;
	}

	public boolean isAsc() {
		return isAsc;
	}

	public void setAsc(boolean isAsc) {
		this.isAsc = isAsc;
	}

	public String getCreateUser() {
		return createUser;
	}

	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	public Long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}

	public String getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}

	public Long getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Long updateTime) {
		this.updateTime = updateTime;
	}

}
