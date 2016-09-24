package com.sin.smart.app.interceptor;

import com.sin.smart.constants.GlobalConstants;
import com.sin.smart.entity.main.SmartUserEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ContextInterceprot extends HandlerInterceptorAdapter {

	private static final Logger log = LoggerFactory.getLogger(ContextInterceprot.class);

	@Override
	public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response, Object handler) throws Exception {
		response.setContentType("application/json;charset=UTF-8");
		printAccessLog(request, response);// print login logger
		return tokenInterceprot(request, response, handler);
	}

	@Override
	public void postHandle(HttpServletRequest request,
                           HttpServletResponse response, Object handler,
                           ModelAndView modelAndView) throws Exception {

	}

	@Override
	public void afterCompletion(HttpServletRequest request,
                                HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		request.getSession(false).removeAttribute("token");
	}

	boolean tokenInterceprot(HttpServletRequest request,
                             HttpServletResponse response, Object handler) throws Exception {
		if (!request.getMethod().equalsIgnoreCase("get")) {
			if (null != request.getSession(false).getAttribute("token")) {
				return false;
			}
			request.getSession(false).setAttribute("token", "1");
		}

		return super.preHandle(request, response, handler);
	}

	void printAccessLog(HttpServletRequest request, HttpServletResponse response) {
		SmartUserEntity user = (SmartUserEntity) request.getSession().getAttribute(GlobalConstants.SESSION_USER);
		String userName = "";
		if (user != null) {
			userName = user.getUserName();
		}
		log.info("[user]:"+userName +",[ip]:"+request.getRemoteAddr()+",[URL]:"+request.getRequestURI()+",[Method]:"+ request.getMethod());
	}

}
