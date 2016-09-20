package com.sin.smart.client;

public interface IAutoIdClient {

	int getAutoId(int key);

	int getAutoId(int key, int count);

	int getAutoId(int key, int count, int targetTableIndex);
}
