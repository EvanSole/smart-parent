package com.sin.smart.constants;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Evan on 2016/9/19.
 */
public class AutoIdConstants {

    /**
     * ******************** db_csmart_sku数据库里的表******
     */
    public static final int SmartSkuEntity = 1000;

    /**
     * 获取需要到autoid服务中得到id的表
     * @return
     */
    public static final Map<String, Integer> getMap() {//每添加一个
        Map<String, Integer> map = new HashMap<>();
        map.put("SmartSkuEntity", SmartSkuEntity);
        return map;
    }

}
