package com.sin.smart.core.formwork.db.util;


/****
 * 数据源划分
 */
public enum DbShareField {

	DEFAULT("main"),SKU("sku"), ORDER("order"), IN_WH("inwh"), OUT_WH("outwh");

	private String value;

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	private DbShareField(String value) {
		this.value = value;
	}

	public String toString() {
		return this.value;
	}

}
