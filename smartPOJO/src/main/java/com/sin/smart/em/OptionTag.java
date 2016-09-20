package com.sin.smart.em;

public enum OptionTag {

	TRUE(new Byte("1"), "是"), FALSE(new Byte("0"), "否");

	private Byte value;
	private String cnValue;

	private OptionTag(Byte value, String cnValue) {
		this.value = value;
		this.cnValue = cnValue;
	}

	public String toCn() {
		return this.cnValue;
	}

	public Byte toValue() {
		return this.value;
	}
}
