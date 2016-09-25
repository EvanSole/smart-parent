package com.sin.smart.queue.service;

import com.sin.smart.core.mq.consumer.ConsumeListener;

public interface ISmartConsumerService {

     void registerListenerConsumer(String groupName, String topic, final ConsumeListener consumeListener);

     void registerListenerConsumer(String groupName, String topic, String tag, final ConsumeListener consumeListener);

}

