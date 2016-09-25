package com.sin.smart.core.web;

import com.sin.smart.respoes.Response;

public class PageResponse<T> extends Response<T> {

    private Integer totalSize;
    private Integer currentPage = 1;
    private Integer pageSize = 30;

    public PageResponse(){
    }

    public PageResponse(Integer code, Integer totalSize, T data){
        super.setCode(code);
        super.setData(data);
        this.totalSize = totalSize;
    }

    public Integer getTotalSize() {
        return totalSize;
    }

    public void setTotalSize(Integer totalSize) {
        this.totalSize = totalSize;
    }

    public Integer getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(Integer currentPage) {
        this.currentPage = currentPage;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

}
