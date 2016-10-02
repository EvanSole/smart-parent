package com.sin.smart.convert;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public class ListArraysConvert {

    /***
     * 集合转换
     * List<Map<String, Object>>  --> List<Object[]>
     * @param mapList
     * @return
     */
    public static List<Object[]> listMapToArrayConvert (List<Map<String, Object>> mapList){
        List<Object[]> list = new ArrayList<Object[]>();
        for (Map<String, Object> map : mapList) {
            Collection values = map.values();
            List listArray = new ArrayList(values);
            list.add(listArray.toArray());
        }
        return list;
    }


}
