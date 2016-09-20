package com.sin.smart.core.web.message;

public interface Messages {

     String getMessage(String code);

     String getMessage(String code, Object... args);

}
