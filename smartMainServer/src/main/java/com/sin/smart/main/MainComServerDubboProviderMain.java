package com.sin.smart.main;

import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.File;
import java.util.concurrent.CountDownLatch;

/**
 * MainServer 服务开启
 */
public class MainComServerDubboProviderMain {

    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("classpath:main"+ File.separator + "spring-core.xml");
        context.start();
        System.out.println("smartMainServer start------" + System.getProperty("spring.profiles.active"));
        new CountDownLatch(1).await();
    }
}  