package com.sin.smart.autoid.server;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.concurrent.CountDownLatch;

public class AutoIdDubboProviderMain {

	public static final Logger _logger = LoggerFactory.getLogger(AutoIdDubboProviderMain.class);

	public static void main(String[] args) throws Exception {
		ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("classpath:autoId/spring-core.xml");
		context.start();
		System.out.println(context.getBean("autoIdClient"));
		System.out.println("AutoIdServer start success. spring profile active ------ " + System.getProperty("spring.profiles.active"));
		_logger.info(""+context.getBean("autoIdClient"));
		_logger.info("AutoIdServer start success. spring profile active ------ {}",System.getProperty("spring.profiles.active"));
		new CountDownLatch(1).await();
	}
}
