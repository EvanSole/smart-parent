package com.sin.smart.aspectj.handle;

/**
 * Created by Evan on 2016/9/20.
 */
public abstract interface Handler {
     HandleResponse handle(HandleRequest paramHandleRequest);
}
