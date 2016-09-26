package com.sin.smart.entity.po;

import java.io.Serializable;

public class BasePO implements Serializable{

	private String orderBy;
	private int offset = 0;
	private int pageSize = 15;//每页多少条
	private Integer page = 1; //当前第几页

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


	public Integer getOffset() {
		if(pageSize<=0){
			pageSize = 1;
		}
		this.offset = (page-1)*pageSize;
		return offset;
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


}
