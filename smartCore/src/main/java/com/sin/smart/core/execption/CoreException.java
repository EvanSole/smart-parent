package com.sin.smart.core.execption;

/**
 * Created by Evan on 2016/9/20.
 */
public abstract class CoreException extends RuntimeException {

    public CoreException(String message){
        super(message);
    }
    public CoreException(String message, Throwable cause) {
        super(message, cause);
    }
    public CoreException(Throwable cause) {
        super(cause);
    }

}
