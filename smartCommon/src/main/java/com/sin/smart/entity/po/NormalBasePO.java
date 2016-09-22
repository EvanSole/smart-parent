package com.sin.smart.entity.po;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

/***
 * 主键自定义使用NormalBasePO
 */
@MappedSuperclass
public class NormalBasePO extends BasePO {
	protected long id;

	@Id
	@Column(name = "id")
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

}
