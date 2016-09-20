package com.sin.smart.utils;

import net.sf.cglib.beans.BeanCopier;

import java.util.HashMap;
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
}
