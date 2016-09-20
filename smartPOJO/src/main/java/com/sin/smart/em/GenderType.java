package com.sin.smart.em;

public enum GenderType {

	MALE("1","男"),FEMALE("0","女");
	
	private String value;
	private String cnValue;

	private GenderType(String value, String cnValue) {
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
