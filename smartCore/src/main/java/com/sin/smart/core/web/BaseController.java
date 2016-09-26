package com.sin.smart.core.web;

import com.sin.smart.constants.GlobalConstants;
import com.sin.smart.core.formwork.db.splitdb.ShareDbUtil;
import com.sin.smart.core.formwork.db.util.DbShareField;
import com.sin.smart.core.formwork.db.vo.DbShardVO;
import com.sin.smart.core.web.message.Messages;
import com.sin.smart.entity.CurrentUserEntity;
import com.sin.smart.enums.ResultTypeEnum;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


public class BaseController {

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private HttpServletResponse response;

    @Autowired
    protected Messages messages;


    /**
     * 获取session
     *
     * @return HttpSession
     */
    protected HttpSession getSession() {
        return request.getSession();
    }

    protected HttpServletRequest getRequest() {
        return this.request;
    }

    protected HttpServletResponse getResponse() {
        return this.response;
    }

    protected CurrentUserEntity getCurrentUser() {
       return (CurrentUserEntity)getSession().getAttribute(GlobalConstants.SESSION_USER);
    }
    protected void setCurrentUser(CurrentUserEntity user) {
        getSession().setAttribute(GlobalConstants.SESSION_USER, user);
    }

    protected void setCurrentWarehouseId(long warehouseId) {
        getSession().setAttribute(GlobalConstants.WAREHOUSE_ID, warehouseId);
    }

    protected long getCurrentWarehouseId() {
       Object warehouseId = getSession().getAttribute(GlobalConstants.WAREHOUSE_ID);
        if(warehouseId!=null){
            return Long.parseLong(warehouseId.toString());
        }
       return 0;
    }

    protected void setCurrentTenant(String tenantId) {
        getSession().setAttribute(GlobalConstants.TENAN_ID, tenantId);
    }

    protected String getCurrentTenant() {
        Object tenantId = getSession().getAttribute(GlobalConstants.TENAN_ID);
        if(tenantId!=null){
            return tenantId.toString();
        }
        return "";
    }



    protected ResponseResult getMessage(String messageKey,Object ...params) {
        ResponseResult responseResult = new ResponseResult(messages);
        if(messageKey.startsWith("S")){
            return getSucMessage(messageKey,params);
        }else if(messageKey.startsWith("E")){
            return getFaultMessage(messageKey,params);
        }
        return responseResult;
    }

    protected ResponseResult getMessage(MessageResult mr) {
        String messageKey = mr.getCode();
        ResponseResult responseResult = new ResponseResult(messages);
        if(messageKey.startsWith("S")){
            responseResult = getSucMessage(messageKey,mr.getParams());
            responseResult.setResult(mr.getResult());
            return responseResult;
        }else if(messageKey.startsWith("E")){
            return getFaultMessage(messageKey,mr.getParams());
        }

        return responseResult;
    }
    protected ResponseResult getSucMessage() {
        ResponseResult responseResult = new ResponseResult(messages);
        responseResult.setSucMessage();
        return responseResult;
    }

    protected ResponseResult getSucMessage(String messageKey,Object ...params) {
        ResponseResult responseResult = new ResponseResult(messages);
        responseResult.setSucMessage(messageKey, ResultTypeEnum.POPUP,params);
        return responseResult;
    }

    protected ResponseResult getSucMessage(String messageKey,ResultTypeEnum resultType,Object ...params) {
        ResponseResult responseResult = new ResponseResult(messages);
        responseResult.setSucMessage(messageKey,resultType,params);
        return responseResult;
    }
    protected ResponseResult getFaultMessage() {
        ResponseResult responseResult = new ResponseResult(messages);
        responseResult.setFaultMessage("");
        return responseResult;
    }
    protected ResponseResult getFaultMessage(String messageKey,Object ...params) {
        ResponseResult responseResult = new ResponseResult(messages);
        responseResult.setFaultMessage(messageKey,params);
        return responseResult;
    }

    protected ResponseResult getFaultMessage(String messageKey,ResultTypeEnum resultType,Object ...params) {
        ResponseResult responseResult = new ResponseResult(messages);
        responseResult.setFaultMessage(messageKey,resultType,params);
        return responseResult;
    }

    protected ResponseResult getFaultResultData(Object obj){
        ResponseResult responseResult = new ResponseResult();
        responseResult.setFaultResult(obj);
        return responseResult;
    }
    protected ResponseResult getSucResultData(Object obj){
        ResponseResult responseResult = new ResponseResult();
        responseResult.setResult(obj);
        return responseResult;
    }

    protected ResponseResult chooseMessageByKey(String messageKey) {
        if (StringUtils.isBlank(messageKey)) {
            return getSucMessage();
        } else {
            return getMessage(messageKey);
        }
    }

    /**
     * 主分库分表 根据用户的租户id分库
     * @return
     */
    protected DbShardVO getDbShardVO(DbShareField...source) {
        return ShareDbUtil.getDbShardVO(this.getCurrentUser(),this.getCurrentWarehouseId(),source);
    }

    /**
     * 退出登录
     */
    public void removeSessionAttribute(){
        getSession().removeAttribute(GlobalConstants.SESSION_USER);
        getSession().removeAttribute(GlobalConstants.WAREHOUSE_ID);
        getSession().removeAttribute(GlobalConstants.TENAN_ID);
    }

    public String getBasePath(){
        return getRequest().getScheme() + "://" + getRequest().getServerName() + ":" + getRequest().getServerPort() + getRequest().getContextPath() + "/";
    }

  }
