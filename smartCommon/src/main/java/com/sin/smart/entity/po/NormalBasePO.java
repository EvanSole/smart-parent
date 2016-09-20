package com.sin.smart.entity.po;

import javax.persistence.Column;
import javax.persistence.Id;

public class NormalBasePO extends BasePO{

	private static final long serialVersionUID = 8741539399351260915L;
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
