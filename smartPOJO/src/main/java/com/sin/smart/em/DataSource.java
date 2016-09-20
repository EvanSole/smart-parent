package com.sin.smart.em;


/***
 * 数据来源
 * @author Administrator
 *
 */
public enum DataSource {

	SYS("System", "系统生成"), MANUAL("Manual", "手工创建");

	private String value;
	private String cnValue;

	private DataSource(String value, String cnValue) {
		this.value = value;
		this.cnValue = cnValue;
	}

	public String toCn() {
		return this.cnValue;
	}

	public String toString() {
		return this.value;
	}

}
