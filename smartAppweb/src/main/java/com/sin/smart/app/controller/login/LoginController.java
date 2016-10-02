package com.sin.smart.app.controller.login;

import com.sin.smart.app.authorization.shiro.CustomUserToken;
import com.sin.smart.constants.GlobalConstants;
import com.sin.smart.core.execption.BusinessException;
import com.sin.smart.core.redis.RedisTemplate;
import com.sin.smart.core.web.BaseController;
import com.sin.smart.core.web.ResponseResult;
import com.sin.smart.em.LoginSource;
import com.sin.smart.entity.CurrentUserEntity;
import com.sin.smart.entity.main.SmartWarehouseEntity;
import com.sin.smart.inner.SmartConfigUtil;
import com.sin.smart.main.service.IUserService;
import com.sin.smart.main.service.IWarehouseService;
import com.sin.smart.utils.IPUtil;
import com.sin.smart.utils.PwdUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.ExcessiveAttemptsException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("/")
@RestController
public class LoginController extends BaseController {

    private static final Logger _LOG = LoggerFactory.getLogger(LoginController.class);

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private IWarehouseService warehouseService;

    @Autowired
    private IUserService userService;

    @RequestMapping(value = "login", method = RequestMethod.GET)
    public void login(HttpServletResponse response) throws IOException {
        String basePath = SmartConfigUtil.get("local.basePath")+ "app/login.html";
        response.sendRedirect(basePath);
    }

    /****
     * 用户登录
     * @param warehouseNo 仓库
     * @param userName 用户名
     * @param password 登录密码
     * @param rememberMe 是否记住
     * @param captcha 验证码
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "login", method = RequestMethod.POST)
    public ResponseResult login(@RequestParam String userName, @RequestParam String password,
                                @RequestParam String warehouseNo, @RequestParam boolean rememberMe,
                                @RequestParam String captcha) throws Exception {

        String loginIp = IPUtil.getIPAddress(this.getRequest());

        _LOG.info(" user {} login ,this login ip is {}  ", userName,loginIp);

        if (StringUtils.isBlank(userName)) {
            return getFaultMessage("E00100");
        }
        if (StringUtils.isBlank(password)) {
            return getFaultMessage("E00101");
        }
        if (StringUtils.isBlank(warehouseNo)) {
            return getFaultMessage("E00106");
        }
//        if (StringUtils.isBlank(captcha)) {
//            return getFaultMessage("E00103");
//        }
        //验证登陆次数
        String lockKey = getLockKey(warehouseNo,userName);
        int expiryCount = Integer.parseInt(redisTemplate.get(lockKey) == null ? "0" : redisTemplate.get(lockKey));
        if (expiryCount >= GlobalConstants.MAX_EXPIRY_COUNT) {
            return getFaultMessage("E00104");
        }

        if (expiryCount > 0 && StringUtils.isNotEmpty(captcha)) {
            String validateCodeExpected = String.valueOf(getSession().getAttribute("validateKey"));
            if (captcha == null || !captcha.equalsIgnoreCase(validateCodeExpected)) {
                return getFaultMessage("E00110");
            }
        }
        //加密
        password = PwdUtils.toMd5(password, userName);
        //设置token
        CustomUserToken token = new CustomUserToken(userName, password, rememberMe ? true : false , loginIp, warehouseNo, LoginSource.PC);
        ResponseResult responseResult  = execShiroLogin(token);
        if (responseResult.getSuc()){
            if (expiryCount > 0) {
                redisTemplate.set(lockKey,"0",1);
            }
        } else {
            if (!responseResult.getCode().equals(GlobalConstants.MSG_E00111) &&
                !responseResult.getCode().equals(GlobalConstants.MSG_E00112) &&
                !responseResult.getCode().equals(GlobalConstants.MSG_E00113)) {
                //修改验证信息并设置过期时间
                updateValidate(responseResult, lockKey, expiryCount);
            }
            return responseResult;
        }

        //验证成功将用户信息返回给前端
        Map map =new HashMap<>();
        //将基础信息存储到session
        initBaseSession(map,warehouseNo);
        map.put("userName",userName);
        responseResult.setResult(map);
       //把项目host放入cookie中
        this.putDepoHostToCookie();
        return responseResult;
    }


    /***
     * 用户登出
     * @return
     */
    @RequestMapping(value = "logout", method = RequestMethod.GET)
    @ResponseBody
    public void logout(HttpServletResponse response) throws IOException {
        getRequest().getSession().removeAttribute(GlobalConstants.SESSION_KEY);
        this.removeSessionAttribute();
        response.sendRedirect(SmartConfigUtil.get("redirect.url"));
    }


    /**
     * 使用shiro登录
     * @param token
     * @return
     */
    private ResponseResult execShiroLogin(CustomUserToken token) {
        //获取当前的Subject
        Subject currentUser = SecurityUtils.getSubject();
        try {
            //在调用了login方法后,SecurityManager会收到AuthenticationToken,并将其发送给已配置的Realm执行必须的认证检查
            //每个Realm都能在必要时对提交的AuthenticationTokens作出反应
            //所以这一步在调用login(token)方法时,它会走到MyRealm.doGetAuthenticationInfo()方法中,具体验证方式详见此方法
            currentUser.login(token);

        } catch (UnknownAccountException uae) {
            return getFaultMessage("E00004");
        } catch (IncorrectCredentialsException ice) {
            return getFaultMessage("E00005");
        } catch (LockedAccountException lae) {
            return getFaultMessage("E00006");
        } catch (ExcessiveAttemptsException eae) {
            return getFaultMessage("E00007");
        } catch (AuthenticationException ae) {
            _LOG.error(" user login validation exception ."+ ae.getMessage() );
            //通过处理Shiro的运行时AuthenticationException就可以控制用户登录失败或密码错误时的情景
            if (ae.getCause() instanceof BusinessException) {
                BusinessException ce = (BusinessException) ae.getCause();
                if (GlobalConstants.MSG_E00111.equals(ce.getCode())) {
                    String message = ce.getMessage();
                    String messages[] = message.split("\\|");
                    return getFaultMessage(ce.getCode(), (Object[])messages);
                } else {
                    return getFaultMessage(ce.getMessage());
                }
            } else {
                return getFaultMessage("E00008");
            }
        }
        return getSucMessage();
    }


    /***
     * 设置验证码显示 和 设置登陆错误次数
     * @param responseResult
     * @param lockKey
     * @param expiryCount
     */
    private void updateValidate(ResponseResult responseResult, String lockKey, int expiryCount) {
        int count = expiryCount + 1;
        ResponseResult innerResponseResult = getFaultMessage("E00105", (GlobalConstants.MAX_EXPIRY_COUNT - count));
        responseResult.mergeMessage("," + innerResponseResult.getMessage());
        redisTemplate.set(lockKey,count +"",GlobalConstants.EXPIRY_TIME);
    }

    private String getLockKey(String warehouseNo,String userName) {
        return "login_" + warehouseNo + "_" + userName;
    }

    private void putDepoHostToCookie() {
        Cookie cookie = new Cookie("basePath", this.getBasePath());
        this.getResponse().addCookie(cookie);
    }

    private void initBaseSession(Map resultMap,String warehouseNo) {
        CurrentUserEntity userEntity = this.getSessionCurrentUser();
        SmartWarehouseEntity warehouseEntity = warehouseService.findWarehouseByWarehouseNo(warehouseNo);
        if (warehouseEntity != null ) {
            this.setCurrentWarehouseId(warehouseEntity.getId());
            this.setCurrentTenantId(warehouseEntity.getTenantId());
            resultMap.put("warehouseId",warehouseEntity.getId());
            resultMap.put("tenantId",warehouseEntity.getTenantId());
        }
        List roleList = userService.getRoleIdListByUserId(userEntity.getId());
        getSession().setAttribute(GlobalConstants.ROLE_IDS,roleList);
    }

}
