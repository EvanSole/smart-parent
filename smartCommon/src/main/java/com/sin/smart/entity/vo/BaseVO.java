package com.sin.smart.entity.vo;

import org.apache.commons.beanutils.ConvertUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.MappedSuperclass;
import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@MappedSuperclass
public class BaseVO implements java.io.Serializable, Cloneable {

	private static final long serialVersionUID = 264765786896335032L;
	protected transient Logger log = LoggerFactory.getLogger(this.getClass());

	/**
	 * map to bean
	 * 
	 * @param map
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public void fromMap(Map<String, Object> map) {
		if (map == null || map.isEmpty()) {
			return;
		}
		try {
			for (PropertyDescriptor pd : descriptProperty()) {
				Method method = pd.getWriteMethod();
				if (method != null) {
					String name = pd.getName();
					if (map.containsKey(name)) {
						Object value = map.get(name);
						if (value != null) {
							Class t = method.getParameterTypes()[0];
							if (!t.isAssignableFrom(value.getClass())) {
								try {
									value = ConvertUtils.convert(value, t);
								} catch (Exception e) {
									value = null;
								}
							}
						}
						try {
							method.invoke(this, value);
						} catch (Exception e) {
							log.error("ERROR in convert po to map", e);
						}
					}
				}
			}
		} catch (Exception e) {
			if (log.isDebugEnabled()) {
				log.debug("ERROR in convert map {} to {}", map, this.getClass());
			}
			log.error("ERROR in convert map to po", e);
		}
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Map<String, Object> toMap() {
		Map map = new HashMap();
		try {
			for (PropertyDescriptor pd : descriptProperty()) {
				Method method = pd.getReadMethod();
				if (method != null) {
					map.put(pd.getName(), method.invoke(this));
				}
			}
		} catch (Exception e) {
			log.error("ERROR in convert po to map", e);
		}
		return map;
	}

	public void init() {
	}

	public void clear() {
		try {
			for (PropertyDescriptor pd : descriptProperty()) {
				Method method = pd.getWriteMethod();
				if (method != null) {
					method.invoke(this, (Object) null);
				}
			}
		} catch (Exception e) {
			log.error("ERROR in clear po", e);
		}
	}

	@Override
	public Object clone() {
		Object obj = null;
		try {
			obj = super.clone();
		} catch (Exception e) {
			log.error("ERROR in clone", e);
			try {
				BaseVO po = this.getClass().newInstance();
				po.fromMap(this.toMap());
				obj = po;
			} catch (Exception ex) {
				log.error("ERROR in convert po to map", ex);
			}
		}
		return obj;
	}

	private List<PropertyDescriptor> descriptProperty() throws Exception {
		BeanInfo beanInfo = Introspector.getBeanInfo(this.getClass());
		PropertyDescriptor[] pp = beanInfo.getPropertyDescriptors();
		List<PropertyDescriptor> list = new ArrayList<>();
		for (PropertyDescriptor pd : pp) {
			if (!(pd.getName().equals("serialVersionUID"))) {
				list.add(pd);
			}
		}
		return list;
	}

}
