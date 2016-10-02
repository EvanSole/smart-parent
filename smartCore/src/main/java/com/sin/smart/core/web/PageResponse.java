package com.sin.smart.core.web;

import java.io.Serializable;

public class PageResponse<T> implements Serializable {

    private T rows;
    private Integer total;

    public PageResponse(){
    }

    public PageResponse(T rows, Integer total) {
        this.rows = rows;
        this.total = total;
    }

    public T getRows() {
        return rows;
    }

    public void setRows(T rows) {
        this.rows = rows;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }
}
