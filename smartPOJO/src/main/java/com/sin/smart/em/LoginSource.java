package com.sin.smart.em;


/***
 * 登录数据来源
 * @author Administrator
 *
 */
public enum LoginSource {

	PC("PC", "PC端"), MT("MT", "移动端");

	private String value;
	private String cnValue;

	private LoginSource(String value, String cnValue) {
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
