package com.sin.smart.core.formwork.db.vo;


import com.sin.smart.core.formwork.db.util.DbShareField;
import com.sin.smart.entity.CurrentUserEntity;

import java.io.Serializable;

@SuppressWarnings("serial")
public class DbShardVO implements Serializable {
	private String shardDbId;// 分库规则id
	private String shardTableId;// 分表规则id
	private DbShareField source = DbShareField.VEHICLE;

	private CurrentUserEntity currentUser;
	private Long zoneId;

	public String getShardDbId() {
		return shardDbId;
	}

	public void setShardDbId(String shardDbId) {
		this.shardDbId = shardDbId;
	}

	public String getShardTableId() {
		if (null == shardTableId || "".equals(shardTableId)) {
			// 如果分表id没有set，默认使用区域id分表
			long temp = this.getZoneId();
			if (temp > 0) {
				this.setShardTableId(this.getZoneId() + "");
			}
		}
		return shardTableId;
	}

	public void setShardTableId(String shardTableId) {
		this.shardTableId = shardTableId;
	}

	/**
	 * 默认主库
	 *
	 * @return
	 */
	public static DbShardVO getInstance(CurrentUserEntity userEntity) {
		DbShardVO dbShardVO = new DbShardVO();
		dbShardVO.setCurrentUser(userEntity);
		return dbShardVO;
	}

	public DbShareField getSource() {
		return source;
	}

	public void setSource(DbShareField source) {
		this.source = source;
	}

	public CurrentUserEntity getCurrentUser() {
		return currentUser;
	}

	public void setCurrentUser(CurrentUserEntity currentUser) {
		this.currentUser = currentUser;
	}

	public Long getZoneId() {
		return zoneId;
	}

	public void setZoneId(Long zoneId) {
		this.zoneId = zoneId;
	}

}
