package com.sin.smart.core.mq.producer;

import com.alibaba.rocketmq.client.producer.SendResult;

public abstract class AbstractProducer {

     public abstract SendResult send(String topic, String tags, Object body, String keys, String queueId) throws Exception;

     public abstract SendResult sendByDelay(String topic, String tags, Object body, int delayLevel)throws Exception;
}
