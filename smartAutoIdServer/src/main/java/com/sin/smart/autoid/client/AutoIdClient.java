package com.sin.smart.autoid.client;


import com.sin.smart.autoid.server.dao.ResDao;
import com.sin.smart.autoid.server.dao.ResSlaveCurrentDao;
import com.sin.smart.client.IAutoIdClient;

import java.util.Map;
import java.util.Random;

public class AutoIdClient implements IAutoIdClient {

	private ResDao resDao;
	private ResSlaveCurrentDao resSlaveCurrentDao;

	private int slaveCount;// slave子表个数，默认10个

	private Map<Integer, Integer> allotLengthMap;// 每个slave表的分配步长

	/**
	 * 获取单个主键id，如果返回id为-1，表示失败
	 * 
	 * @param key
	 *            业务表key
	 * @return 返回-1表示失败
	 */
	public int getAutoId(int key) {
		return getAutoId(key, 1, -1);
	}

	/**
	 * 获取多个主键id，如果返回id为-1，表示失败
	 * 
	 * @param key
	 *            业务表key
	 * @param count
	 *            获取几个id
	 * @return 返回-1表示失败
	 */
	public int getAutoId(int key, int count) {
		return getAutoId(key, count, -1);
	}

	/**
	 * 获取主键id，如果返回id为-1，表示失败
	 * 
	 * @param key
	 *            业务表key
	 * @param count
	 *            获取几个id
	 * @param targetTableIndex
	 *            指定slave表的下标
	 * @return 返回-1表示失败
	 */
	public int getAutoId(int key, int count, int targetTableIndex) {
		// 根据权重随机分配权限到slave表，目前按照平均分配，后续把权重陪着到文件中
		int index = 0;
		if (targetTableIndex < 0) {
			index = new Random().nextInt(slaveCount == 0 ? 10 : slaveCount);
		} else {
			index = targetTableIndex;
		}
		int id = resSlaveCurrentDao.updateAndGetId(key, count, index);
		// 找不到id，并且slave中id池中已经没有id，到master库中去申请资源
		if (id == -1) {
			id = allotAutoId(key, count, index);// 这里只尝试1次，不采用递归，防止死循环
		}
		return id;
	}

	private int allotAutoId(int key, int count, int index) {
		// 先分配资源
		int[] r = this.getAllotAutoId(key, count, index);
		// 资源分配成功后，再获得id
		if (resSlaveCurrentDao.saveOrupdate(key, r[0], r[1], index) > 0) {
			return resSlaveCurrentDao.updateAndGetId(key, count, index);
		}
		return -1;
	}

	/**
	 * 根据key请求res表，获得1000个预先id池
	 * 
	 * @param key
	 */
	private int[] getAllotAutoId(int key, int count, int index) {
		int[] result = new int[2];
		result[0] = -1;// 起始id
		Integer len = allotLengthMap.get(index);
		result[1] = len == null || len == 0 ? 1000 : len + count - 1;// 分配长度
		int lastId = resDao.updateAndGetLastId(key, result[1]);
		if (lastId == -1) {
			resDao.insert(key, 1000);// 首次创建资源res中的记录，默认从1000开始，如果需要自定义请手动插入原始记录到res表
			lastId = resDao.updateAndGetLastId(key, result[1]);
		}
		if (lastId != -1) {
			result[0] = lastId - result[1];
		}
		return result;
	}

	public void setSlaveCount(int slaveCount) {
		this.slaveCount = slaveCount;
	}

	public void setAllotLengthMap(Map<Integer, Integer> allotLengthMap) {
		this.allotLengthMap = allotLengthMap;
	}

	public void setResSlaveCurrentDao(ResSlaveCurrentDao resSlaveCurrentDao) {
		this.resSlaveCurrentDao = resSlaveCurrentDao;
	}

	public void setResDao(ResDao resDao) {
		this.resDao = resDao;
	}

}
