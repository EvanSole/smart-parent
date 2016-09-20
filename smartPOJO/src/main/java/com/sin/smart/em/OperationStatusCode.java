package com.sin.smart.em;

public enum OperationStatusCode {

	Doing("Doing", "操作中"), Failed("Failed", "已失败"), Finished("Finished", "已完成"), None("None", "未操作");

	private String value;
	private String cnValue;

	private OperationStatusCode(String value, String cnValue) {
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
