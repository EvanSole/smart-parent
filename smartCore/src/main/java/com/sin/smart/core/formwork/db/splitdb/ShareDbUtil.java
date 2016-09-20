package com.sin.smart.core.formwork.db.splitdb;

import com.sin.smart.core.formwork.db.util.DbShareField;
import com.sin.smart.core.formwork.db.vo.DbShardVO;
import com.sin.smart.entity.CurrentUserEntity;

public class ShareDbUtil {

	public static DbShardVO getDbShardVO(CurrentUserEntity user, long warehouseId, DbShareField...source){
		DbShardVO dbShardVO = DbShardVO.getInstance(user);
		dbShardVO.setWarehouseId(warehouseId);
		if(null != source && source.length > 0 ){
			dbShardVO.setSource(source[0]);
			if(source[0] == DbShareField.DEFAULT){
				dbShardVO.setShardTableId(user.getTenantId()+"");
			}
		}
		return dbShardVO;
	}

	public static DbShardVO getNewDbsharedVO(DbShardVO dbShardVO,
											 DbShareField source, String splietDbKey, String splitTableKey) {
		DbShardVO dbShardVONew = new DbShardVO();
		dbShardVONew.setCurrentUser(dbShardVO.getCurrentUser());
		dbShardVONew.setShardTableId(splitTableKey);
		dbShardVONew.setSource(source);
		dbShardVONew.setShardDbId(splietDbKey);
		dbShardVONew.setWarehouseId(dbShardVO.getWarehouseId());
		return dbShardVONew;
	}
}
