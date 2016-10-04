package com.sin.smart.mq.producer.order;

import com.alibaba.dubbo.config.annotation.Service;
import com.alibaba.rocketmq.client.producer.SendResult;
import com.sin.smart.constants.MqConstants;
import com.sin.smart.mq.producer.SmartProducer;
import org.apache.commons.collections.MapUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

@Service
public class LogProducer {

    @Autowired
    SmartProducer producer;

    public SendResult sendNeedLog(Map requstMap) throws Exception {
        if (MapUtils.isEmpty(requstMap)) {
            return null;
        }
        String queueId= MapUtils.getString(requstMap,"userId");
        return producer.send(MqConstants.CONSUMER_TOPIC_LOG,MqConstants.CONSUMER_TAG_LOG,requstMap,null,queueId);
    }

}
