package com.sin.smart.convert;

import org.hibernate.transform.BasicTransformerAdapter;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class AliasToMapResultTransformer extends BasicTransformerAdapter implements Serializable {

	private static final AliasToMapResultTransformer INSTANCE = new AliasToMapResultTransformer();

	/**
	 * {@inheritDoc}
	 */
	@Override
	public Object transformTuple(Object[] tuple, String[] aliases) {
		Map result = new HashMap(tuple.length);
		for ( int i=0; i<tuple.length; i++ ) {
			String alias = aliases[i];
			if ( alias!=null ) {
				result.put( alias.toLowerCase(), tuple[i]== null ? "":tuple[i]);
			}
		}
		return result;
	}

	public static Object readResolve() {
		return INSTANCE;
	}
}
