package com.sin.smart.mq.consumer;

import com.sin.smart.constants.MqConstants;
import com.sin.smart.mq.consumer.listener.BusinessLogListener;
import com.sin.smart.mq.consumer.listener.OrderConsumerListener;
import com.sin.smart.mq.consumer.listener.OrderDelayConsumerListener;
import com.sin.smart.mq.consumer.service.SmartConsumerService;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class MQConsumerMain {

    public static void main(String[] args) {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("classpath:mq/spring-core.xml");
        context.start();

        SmartConsumerService smartConsumerService = context.getBean(SmartConsumerService.class);

        //注册Order消息队列
        smartConsumerService.registerListenerConsumer(MqConstants.CONSUMER_GROUP_NAME_ORDER,
                MqConstants.CONSUMER_TOPIC_ORDER,MqConstants.CONSUMER_TAG_ORDER , new OrderConsumerListener());

        //注册OrderDelay消息队列
        smartConsumerService.registerListenerConsumer(MqConstants.CONSUMER_GROUP_NAME_ORDER_DELAY,
                MqConstants.CONSUMER_TOPIC_ORDER_DELAY,MqConstants.CONSUMER_TAG_ORDER , new OrderDelayConsumerListener());

        //注册LOG消息队列
        smartConsumerService.registerListenerConsumer(MqConstants.CONSUMER_GROUP_NAME_LOG,
                MqConstants.CONSUMER_TOPIC_LOG,MqConstants.CONSUMER_TAG_LOG, new BusinessLogListener());

    }
}
