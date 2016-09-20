package com.sin.smart.aspectj.handle.log;

/**
 * Created by Evan on 2016/9/20.
 */
public class NeedLogConfig {

    private String logClassName;
    private boolean runTime;
    private boolean request;
    private boolean response;

    public NeedLogConfig()
    {
        this.runTime = true;
        this.request = true;
        this.response = false; }

    public String getLogClassName() {
        return this.logClassName;
    }

    public void setLogClassName(String logClassName) {
        this.logClassName = logClassName;
    }

    public boolean isRunTime() {
        return this.runTime;
    }

    public void setRunTime(boolean runTime) {
        this.runTime = runTime;
    }

    public boolean isRequest() {
        return this.request;
    }

    public void setRequest(boolean request) {
        this.request = request;
    }

    public boolean isResponse() {
        return this.response;
    }

    public void setResponse(boolean response) {
        this.response = response;
    }

}
