package com.sin.smart.entity.po;

import java.io.Serializable;

public class BasePO implements Serializable, Cloneable {

	protected long id;

	private String createUser;
	private Long createTime;
	private String updateUser;
	private Long updateTime;

	private String orderBy;
	private int offset = 0;
	private int pageSize = 15;
	private Integer page = 1;
	private Integer total;

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

	public Integer getOffset() {
		if(pageSize<=0){
			pageSize = 1;
		}

		this.offset = (page-1)*pageSize;
		return offset;
	}

	public Integer getTotal() {
		return total;
	}

	public void setTotal(Integer total) {
		this.total = total;
	}

	public void setOffset(Integer offset) {
		this.offset = offset;
	}


	public String getOrderBy() {
		return orderBy;
	}

	public void setOrderBy(String orderBy) {
		this.orderBy = orderBy;
	}

	public Integer getpage() {
		return page;
	}

	public void setpage(Integer page) {
		this.page = page;
	}

}
