package com.sin.smart.core.mq.producer;

import com.alibaba.rocketmq.client.producer.DefaultMQProducer;
import com.sin.smart.constants.MqConstants;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;

public class MqProducerFactory implements FactoryBean<DefaultMQProducer>,DisposableBean,InitializingBean {

    private DefaultMQProducer producer;

    public boolean isSingleton(){
        return true;
    }

    public void destroy()throws Exception{
        this.producer.shutdown();
    }

    /***
     * rocketMQ address
     */
    @Value("#{smartConfig['rocketmq.address']}")
    private String rocketmqAddress;

    public DefaultMQProducer getObject(){
         return this.producer;
    }
    
    @Override
    public Class<?>getObjectType(){
        return DefaultMQProducer.class;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        this.producer = new DefaultMQProducer(MqConstants.PRODUCER_INSTANCENAME);
        this.producer.setDefaultTopicQueueNums(8);
        this.producer.setNamesrvAddr(rocketmqAddress);
        this.producer.start();
    }
}
