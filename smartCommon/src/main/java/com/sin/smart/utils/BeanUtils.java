package com.sin.smart.utils;

import net.sf.cglib.beans.BeanCopier;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Evan on 2016/9/19.
 */
public class BeanUtils {
    private static final ThreadLocal<Map<String, BeanCopier>> threadLocal = new ThreadLocal();

    private static BeanCopier getBeanCopier(Class<?> source, Class<?> target){
        Map map = (Map)threadLocal.get();

        if (map == null) {
            map = new HashMap();
            threadLocal.set(map);
        }

        String key = source.getName() + "-" + target.getName();
        BeanCopier ret = (BeanCopier)map.get(key);

        if (ret == null) {
            ret = BeanCopier.create(source, target, false);
            map.put(key, ret);
        }

        return ret;
    }

    public static void copyProperties(Object source, Object target)
    {
        BeanCopier copier = getBeanCopier(source.getClass(), target.getClass());
        copier.copy(source, target, null);
    }

    public static <T> T copyBeanPropertyUtils(Object source,Class<T> desc){
        T obj = null;
        try {
            obj = desc.newInstance();
            org.springframework.beans.BeanUtils.copyProperties(source,obj);
        }catch(Exception ex){
            ex.printStackTrace();
        }
        return obj;
    }

    public static <T> List<T> copyBeanListPropertyUtils(List<Object> sources, Class<T> desc){
        List<T> objs = null;
        try {
            if(!sources.isEmpty()){
                objs = new ArrayList<>();
                for(Object source : sources){
                    T obj = desc.newInstance();
                    org.springframework.beans.BeanUtils.copyProperties(source,obj);
                    objs.add(obj);
                }
            }
        }catch(Exception ex){
            ex.printStackTrace();
        }
        return objs;
    }
}
