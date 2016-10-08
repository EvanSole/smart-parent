package com.sin.smart.entity.po;

import java.io.Serializable;

public class BasePO implements Serializable {

	private String orderBy;
	private Integer offset = 0;  //从第几条开始
	private Integer pageSize = 30;//每页多少条
	private Integer page = 1; //当前第几页

	public Integer getPage() {
		return page;
	}

	public void setPage(Integer page) {
		this.page = page;
	}

	public Integer getPageSize() {
		return pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

	public void setOffset(Integer offset) {
		this.offset = offset;
	}

	public Integer getOffset() {
		if(pageSize<=0){
			pageSize = 1;
		}
		this.offset = (page-1)*pageSize;
		return offset;
	}

	public String getOrderBy() {
		return orderBy;
	}

	public void setOrderBy(String orderBy) {
		this.orderBy = orderBy;
	}

}
