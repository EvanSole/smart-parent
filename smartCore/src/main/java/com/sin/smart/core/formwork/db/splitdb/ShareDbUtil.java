package com.sin.smart.core.formwork.db.splitdb;


import com.sin.smart.core.formwork.db.util.DbShareField;
import com.sin.smart.core.formwork.db.vo.DbShardVO;

public class ShareDbUtil {

	public static DbShardVO getNewDbsharedVO(DbShardVO dbShardVO,
											 DbShareField source, String splietDbKey, String splitTableKey) {

		DbShardVO dbShardVONew = new DbShardVO();
		dbShardVONew.setCurrentUser(dbShardVO.getCurrentUser());
		dbShardVONew.setShardTableId(splitTableKey);
		dbShardVONew.setSource(source);
		dbShardVONew.setShardDbId(splietDbKey);
		dbShardVONew.setZoneId(dbShardVO.getZoneId());
		return dbShardVONew;
	}
}
