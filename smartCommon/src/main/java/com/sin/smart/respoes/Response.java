package com.sin.smart.respoes;

/**
 * Created by Evan on 2016/9/20.
 */
public class Response<T> {
    private Integer code;
    private T data;
    private String message;

    public Response(Integer code, T data, String message)
    {
        this.code = code;
        this.data = data;
        this.message = message;
    }

    public Response(Integer code, T data) {
        this.code = code;
        this.data = data;
    }

    public Response(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "Response{" +
                "code=" + code +
                ", data=" + data +
                ", message='" + message + '\'' +
                '}';
    }
}
