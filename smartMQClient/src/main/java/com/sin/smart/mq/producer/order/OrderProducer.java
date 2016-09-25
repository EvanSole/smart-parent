package com.sin.smart.mq.producer.order;

import com.alibaba.dubbo.config.annotation.Service;
import com.alibaba.rocketmq.client.producer.SendResult;
import com.sin.smart.constants.MqConstants;
import com.sin.smart.mq.producer.SmartProducer;
import org.apache.commons.collections.MapUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

@Service
public class OrderProducer {

    @Autowired
    SmartProducer producer;

    /**
     * order producer
     * @param requstMap 消息体
     * @return
     * @throws Exception
     */
    public SendResult sendOrder(Map requstMap) throws Exception {
        if (MapUtils.isEmpty(requstMap)) {
            return null;
        }
        String queueId= MapUtils.getString(requstMap,"whcode");
        return producer.send(MqConstants.CONSUMER_TOPIC_ORDER,MqConstants.CONSUMER_TAG_ORDER,requstMap,null,queueId);
    }

    /**
     * order producer delay
     * @param requstMap 消息体
     * @param priority true 优先级为高
     * @param delayLevel 延时级别
     */
    public SendResult sendOrder(Map requstMap,boolean priority,int ...delayLevel) {
        if (MapUtils.isNotEmpty(requstMap)) {
            return null;
        }
        String topic = MqConstants.CONSUMER_TOPIC_ORDER;
        if(priority){
            topic = MqConstants.CONSUMER_TOPIC_ORDER_DELAY;
        }
        int delay =0;
        if(delayLevel != null && delayLevel.length>0){
            delay = delayLevel[0];
        }
        return producer.sendByDelay(topic,MqConstants.CONSUMER_TAG_ORDER,requstMap,delay);
    }

}
