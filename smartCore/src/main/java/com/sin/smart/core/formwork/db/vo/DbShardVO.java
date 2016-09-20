package com.sin.smart.core.formwork.db.vo;

import com.sin.smart.core.formwork.db.util.DbShareField;
import com.sin.smart.entity.CurrentUserEntity;
import org.apache.commons.lang3.StringUtils;

import java.io.Serializable;

@SuppressWarnings("serial")
public class DbShardVO implements Serializable {
	private String shardDbId;// 分库规则id
	private String shardTableId;// 分表规则id
	private DbShareField source = DbShareField.DEFAULT;

	private CurrentUserEntity currentUser;
	private Long warehouseId;//仓库Id

	public String getShardDbId() {
		return shardDbId;
	}

	public void setShardDbId(String shardDbId) {
		this.shardDbId = shardDbId;
	}

	public String getShardTableId() {
		if (StringUtils.isEmpty(shardTableId)) {
			// 如果分表id没有set，默认使用仓库id分表
			long temp = this.getWarehouseId();
			if (temp > 0) {
				this.setShardTableId(this.getWarehouseId() + "");
			} else {
				//如果仓库id没有set，默认使用租户id分表
				this.setShardTableId(this.getCurrentUser().getTenantId() + "");
			}
		}
		return shardTableId;
	}

	public static DbShardVO getInstance(CurrentUserEntity userEntity) {
		DbShardVO dbShardVO = new DbShardVO();
		dbShardVO.setCurrentUser(userEntity);
		dbShardVO.setShardDbId(userEntity.getTenantId() + "");
		return dbShardVO;
	}

	public void setShardTableId(String shardTableId) {
		this.shardTableId = shardTableId;
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

	public Long getWarehouseId() {
		return warehouseId;
	}

	public void setWarehouseId(Long warehouseId) {
		this.warehouseId = warehouseId;
	}
}
