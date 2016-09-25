package com.sin.smart.mq.consumer.listener;

import com.alibaba.fastjson.JSON;
import com.alibaba.rocketmq.client.consumer.listener.ConsumeConcurrentlyContext;
import com.alibaba.rocketmq.client.consumer.listener.ConsumeConcurrentlyStatus;
import com.alibaba.rocketmq.common.message.MessageExt;
import com.sin.smart.core.mq.consumer.ConsumeListener;
import com.sin.smart.utils.SerializationUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class OrderConsumerListener extends ConsumeListener {

    public static final Logger log = LoggerFactory.getLogger(OrderConsumerListener.class);

    @Override
    public ConsumeConcurrentlyStatus consumeMessage(List<MessageExt> messageExts, ConsumeConcurrentlyContext consumeConcurrentlyContext) {

        try {

            Map map = (Map) SerializationUtils.H2Deserialize(messageExts.get(0).getBody(), Map.class);

            System.out.println("Message content : " + JSON.toJSONString(map));

        } catch (Exception e) {
            log.error("mq:exec mq message is{} ex:{} ",messageExts.get(0),e.getMessage());
            return ConsumeConcurrentlyStatus.RECONSUME_LATER;
        }
        return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
    }
}
