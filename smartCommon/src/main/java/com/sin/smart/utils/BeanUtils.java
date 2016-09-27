package com.sin.smart.utils;

import net.sf.cglib.beans.BeanCopier;
import org.apache.commons.collections.CollectionUtils;

import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
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

    public static List<Map> convertListToKeyValues(List datas, Class orgClass, String key, String value) {
        List<Map> retList = null;
        try {
            if (CollectionUtils.isNotEmpty(datas)) {
                retList = new ArrayList<Map>();
                for (int i = 0, j = datas.size(); i < j; i++) {
                    Object data = datas.get(i);
                    BeanInfo beanInfo = Introspector.getBeanInfo(orgClass);
                    PropertyDescriptor[] pds = beanInfo.getPropertyDescriptors();
                    int size = 0;
                    Map codeMap = new HashMap();
                    for (PropertyDescriptor pd : pds) {
                        if (pd.getName().equals(key)) {
                            size++;
                            codeMap.put("key", pd.getReadMethod().invoke(data));
                        }
                        if (pd.getName().equals(value)) {
                            size++;
                            codeMap.put("value", pd.getReadMethod().invoke(data));
                        }
                        if (size >= 2) {
                            break;
                        }
                    }
                    retList.add(codeMap);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return retList;
    }

    /**
     * List<T>转换成List<Map>
     *
     * @param data
     * @param orgClass
     * @return
     */
    public static List<Map> convertListToKeyValueList(List data, Class orgClass) {
        List<Map> retList = null;
        try {
            if (CollectionUtils.isNotEmpty(data)) {
                retList = new ArrayList<Map>();
                for (int i = 0; i < data.size(); i++) {
                    Object entity = data.get(i);
                    BeanInfo beanInfo = Introspector.getBeanInfo(orgClass);
                    PropertyDescriptor[] pds = beanInfo.getPropertyDescriptors();
                    Map codeMap = new LinkedHashMap<>();
                    for (PropertyDescriptor pd : pds) {
                        codeMap.put(pd.getName(), pd.getReadMethod().invoke(entity));
                    }
                    retList.add(codeMap);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return retList;
    }
}
