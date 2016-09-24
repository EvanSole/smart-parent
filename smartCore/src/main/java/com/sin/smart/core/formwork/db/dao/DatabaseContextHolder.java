package com.sin.smart.core.formwork.db.dao;

/**
 * 多数据源切换 线程安全设置类
 */
public class DatabaseContextHolder {

	private static final ThreadLocal<String> contextHolder = new ThreadLocal<String>();

	public static void setCustomerType(String customerType) {
		contextHolder.set(customerType);
	}

	public static String getCustomerType() {
		return contextHolder.get();
	}

	public static void clearCustomerType() {
		contextHolder.remove();
	}

}
