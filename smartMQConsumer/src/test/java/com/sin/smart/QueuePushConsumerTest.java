package com.sin.smart;

import com.alibaba.rocketmq.client.consumer.DefaultMQPushConsumer;
import com.alibaba.rocketmq.client.consumer.listener.ConsumeConcurrentlyContext;
import com.alibaba.rocketmq.client.consumer.listener.ConsumeConcurrentlyStatus;
import com.alibaba.rocketmq.client.consumer.listener.MessageListenerConcurrently;
import com.alibaba.rocketmq.client.exception.MQClientException;
import com.alibaba.rocketmq.common.message.MessageExt;
import com.sin.smart.constants.MqConstants;
import junit.framework.TestCase;

import java.util.List;

/**
 * Created by Evan on 2016/9/25.
 */
public class QueuePushConsumerTest extends TestCase {

    public void testPushConsumer()throws InterruptedException, MQClientException {
        /**
         * 一个应用创建一个Consumer，由应用来维护此对象，可以设置为全局对象或者单例<br>
         * 注意：ConsumerGroupName需要由应用来保证唯一
         */
        DefaultMQPushConsumer consumer = new DefaultMQPushConsumer(MqConstants.CONSUMER_GROUP_NAME_ORDER);
        consumer.setNamesrvAddr("127.0.0.1:9876");
        consumer.setInstanceName(MqConstants.CONSUMER_INSTANCENAME);

        /**
         * 订阅指定topic下tags分别等于TagA或TagC或TagD
         */
        consumer.subscribe(MqConstants.CONSUMER_TOPIC_ORDER,MqConstants.CONSUMER_TAG_ORDER + " || TagC || TagD");
        /**
         * 订阅指定topic下所有消息<br>
         * 注意：一个consumer对象可以订阅多个topic
         */
        consumer.subscribe(MqConstants.CONSUMER_TOPIC_LOG,"*");

        consumer.registerMessageListener(new MessageListenerConcurrently() {

            public ConsumeConcurrentlyStatus consumeMessage(
                    List<MessageExt> msgs, ConsumeConcurrentlyContext context) {
                System.out.println(Thread.currentThread().getName() +" Receive New Messages: " + msgs.size());
                MessageExt msg = msgs.get(0);
                if((MqConstants.CONSUMER_TOPIC_ORDER.equals(msg.getTopic()))) {
                    //执行Topic的消费逻辑
                    if(msg.getTags() != null && MqConstants.CONSUMER_TAG_ORDER.equals( msg.getTags())) {
                        //执行Tag的消费
                        System.out.println(new String(msg.getBody()));
                    }else if (msg.getTags() != null && msg.getTags().equals("TagC")) {
                        //执行TagC的消费
                        System.out.println(new String(msg.getBody()));
                    }else if (msg.getTags() != null && msg.getTags().equals("TagD")) {
                        //执行TagD的消费
                        System.out.println(new String(msg.getBody()));
                    }
                }
                return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
            }
        });

        /**
         * Consumer对象在使用之前必须要调用start初始化，初始化一次即可<br>
         */
        consumer.start();
        System.out.println("ConsumerStarted.");
    }
}
