package com.sin.smart.app.authorization.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Enumeration;

public class XssFilter implements Filter {

    public static final Logger _logger = LoggerFactory.getLogger(XssFilter.class);

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        _logger.info("Xss filter inited.");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        XssHttpWrapper xssRequest = new XssHttpWrapper((HttpServletRequest) request);
        Enumeration<String> names = ((HttpServletRequest) request).getParameterNames();
        while(names.hasMoreElements()){
            String name = names.nextElement();
            _logger.info("Xss names {}",names);
            if("moudleId".equals(name)){
                _logger.info("request parameter {} || xssRequest parameter {} ", name, name);
                request.setAttribute(name,"");
            }

        }
        chain.doFilter(xssRequest, response);

    }

    @Override
    public void destroy() {
        _logger.info("Xss filter destroyed.");
    }
}
