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

	private static final ThreadLocal<String> contextHolderTable = new ThreadLocal<String>();

	public static void setCustomerTable(String customerTable) {
		contextHolderTable.set(customerTable);
	}

	public static String getCustomerTable() {
		return contextHolderTable.get();
	}

	public static void clearCustomerTable() {
		contextHolderTable.remove();
	}
}
