package com.sin.smart.core.formwork.db.dao;

import com.sin.smart.client.IAutoIdClient;
import com.sin.smart.constants.AutoIdConstants;
import com.sin.smart.convert.AliasToMapResultTransformer;
import com.sin.smart.core.formwork.db.util.PoUtils;
import com.sin.smart.entity.po.AutoBasePO;
import com.sin.smart.entity.po.BasePO;
import com.sin.smart.entity.po.NormalBasePO;
import com.sin.smart.utils.BeanUtils;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.hibernate.Criteria;
import org.hibernate.LockMode;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.CriteriaSpecification;
import org.hibernate.transform.ResultTransformer;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.Serializable;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.math.BigInteger;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public abstract class BaseDao<T extends BasePO> {

	private final Class<T> entityClass;

	@Autowired
	public IAutoIdClient autoIdClient;
	@Autowired
	private SessionFactory sessionFactory;

	public void flush(String... splitTable){
		this.getSession(splitTable).flush();
	}

	public BaseDao() {
		Type genType = getClass().getGenericSuperclass();
		Type[] params = ((ParameterizedType) genType).getActualTypeArguments();
		entityClass = (Class) params[0];
	}

	void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	SessionFactory getSessionFactory() {
		return sessionFactory;
	}

	Session getSession(String... splitid) {
		if (null != splitid && splitid.length > 0) {
			DatabaseContextHolder.setCustomerTable(splitid[0]);
		}
		return sessionFactory.getCurrentSession();
	}

	public T load(Serializable id, String... splitTable) {
		return (T) getSession(splitTable).load(entityClass, id);
	}

	public T get(Serializable id, String... splitTable) {
		return (T) getSession(splitTable).get(entityClass, id);
	}

	public T getForLock(Serializable id, String... splitTable){
		String hql = " from " + entityClass.getSimpleName() + " lockObj where id = :id";
		Map paramsMap = new HashMap<>();
		paramsMap.put("id",id);

		Query query = null;
		query = createQuery(hql, paramsMap, false, splitTable);
		query.setLockMode("lockObj" , LockMode.PESSIMISTIC_WRITE);
		List list = query.list();

		if(!CollectionUtils.isEmpty(list)){
			return (T)list.get(0);
		}else{
			return null;
		}

	}

	public List findByHql(String hql, Object obj, String... splitTable) {
		Query query = createQuery(hql, obj, false, splitTable);
		return query.list();
	}

	public List findBySql(String sql, Object obj, String... splitTable) {
		Query query = createQuery(sql, obj, true, splitTable);
		return query.list();
	}

	/**
	 * 执行查询,默认执行hql
	 *
	 * @param hql
	 * @param tableAlias 表别名
	 * @param obj 查询条件对象 map或object
	 * @return 查询结果
	 */
	public List findByHqlForLock(String hql,String tableAlias, Object obj, String... splitTable) {
		Query query = createQuery(hql, obj, false, splitTable);
		query.setLockMode(tableAlias, LockMode.PESSIMISTIC_WRITE);
		return query.list();
	}

	/**
	 * 获取PO的所有对象
	 *
	 * @return
	 */
	public List<T> loadAll(String... splitTable) {
		Criteria criteria = getSession(splitTable).createCriteria(entityClass);
		criteria.setResultTransformer(CriteriaSpecification.DISTINCT_ROOT_ENTITY);
		return criteria.list();
	}

	public Map pageQueryByHql(String hql, Object obj, String... splitTable) throws Exception {
		return pagedQuery(hql, obj, false, splitTable);
	}

	public Map pageQueryBySql(String sql, Object obj, String... splitTable) throws Exception {
		return pagedQuery(sql, obj, true, splitTable);
	}


	public T save(T entity, String... splitTable) throws Exception {
		setEntityId(entity);
		PoUtils.setPoDefaultValue(entity);
		getSession(splitTable).save(entity);
		setAutoEntityId(entity);
		return entity;
	}

	public void delete(T entity, String... splitTable) {
		getSession(splitTable).delete(entity);
	}

	public void delete(long id, String... splitTable) {
		String hql = "delete " + entityClass.getName() + " where id = :id";
		Map param = new HashMap();
		param.put("id", id);
		executeByHql(hql, param, splitTable);
	}

	public void update(T entity, String... splitTable) {
		this.ONUpdate(entity);
		getSession(splitTable).update(entity);
	}

	public T saveOrUpdate(T entity, String... splitTable) throws Exception {
		long id = getEntityId(entity);
		if (id == 0) {
			this.save(entity, splitTable);
		} else {
			T target = (T) get(id, splitTable);
			if (target != null) {
				BeanUtils.copyProperties(entity, target);
				this.ONUpdate(target);
				getSession(splitTable).merge(target);
			} else {
				this.save(entity, splitTable);
			}
		}
		return entity;
	}

	public int executeByHql(String hql, Object obj, String... splitTable) {
		Query query = createQuery(hql, obj, true, splitTable);
		return query.executeUpdate();
	}

	public Object executeScalarByHql(String hql, Object obj, String... splitTable) {
		return executeScalar(hql, obj, false, splitTable);
	}


	private String getCountSQL(String sql) {
		String newSql = sql.replaceAll("\\s+", " ");
		return "select count(*) as cnt from ( " + newSql + " ) cntTab";
	}

	private long findForRowCount(final String queryStr, final Object paramMap, boolean nativeFlag, String... splitTable) {
		String countSql = "";
		if (nativeFlag(nativeFlag)) {
			countSql = getCountSQL(queryStr);
		} else {
			countSql = getCountHQL(queryStr);
		}
		return findForLong(countSql, paramMap, nativeFlag(nativeFlag), splitTable);
	}

	private String getCountHQL(String hql) {
		String localObject1 = "*";
		String newHql = hql.replaceAll("\\s+", " ");
		int i = newHql.toLowerCase().indexOf("from ");
		int j = newHql.toLowerCase().indexOf("distinct");
		int k = newHql.toLowerCase().indexOf("select");
		if ((-1 != j) && (i > j) && (j > k)) {
			String localObject2[] = newHql.substring(k + 6, i).split(",");
			String str = "";
			for (int m = 0; m < localObject2.length; m++) {
				str = localObject2[m].trim();
				if (!str.startsWith("distinct"))
					continue;
				localObject1 = str;
				break;
			}
		}
		return  "select count(" + localObject1 + ") " + newHql.substring(i);
	}

	private long findForLong(final String hql, final Object paramMap, boolean flag, String... splitTable) {
		List list = createQuery(hql, paramMap, nativeFlag(flag), splitTable).list();
		if (-1 != hql.toLowerCase().indexOf("group by")){
			return list.size();
		}
		if (list.size() == 1) {
			if (nativeFlag(flag)) {
				return ((BigInteger) ((Map) list.get(0)).get("cnt")).longValue();
			} else {
				return (Long) list.get(0);
			}
		} else if(list!=null){
			return list.size();
		}else {
			return 0l;
		}

	}

	private void setEntityId(T entity) throws Exception {
		if (entity instanceof NormalBasePO) {//只有分库分表的需要setiId
			long id = ((NormalBasePO) entity).getId();
			if (id <= 0) {
				long autoId = getAutoId(entity.getClass().getSimpleName());
				if (autoId <= 0) {
					throw new Exception("BaseDao.setEntityId has error when entity(" + entity.getClass().getSimpleName() + ") to get autoId!");
				}
				((NormalBasePO) entity).setId(autoId);
			}
		}
	}

	/**
	 *
	 * @param entity
	 */
	private void setAutoEntityId(T entity) {
		try {
			if (entity instanceof AutoBasePO) {
				Long id = (Long)getSession().getIdentifier(entity);
				((AutoBasePO) entity).setId(id);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private int getAutoId(String entityName) {
		Integer key = AutoIdConstants.getMap().get(entityName);
		if (null != key && key > 0) {
			return autoIdClient.getAutoId(key);
		}
		return 0;
	}

	private long getEntityId(T entity) {
		long id = 0;
		try {
			if (entity instanceof AutoBasePO) {
				id = ((AutoBasePO) entity).getId();
			} else if (entity instanceof NormalBasePO) {
				id = ((NormalBasePO) entity).getId();
			} else {
				Method method = entity.getClass().getMethod("getId");
				id = (long) method.invoke(entity);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return id;
	}


	private Map pagedQuery(String hql, Object obj, boolean nativeFlag, String... splitTable) throws Exception {
		Map retMap = new HashMap();
		int page = 1, pageSize = 10;
		if (obj != null) {
			int tempNum = 0;
			tempNum = getPageMessage(obj, "page");
			if (tempNum != 0) {
				page = tempNum;
			}
			tempNum = getPageMessage(obj, "pageSize");
			if (tempNum != 0) {
				pageSize = tempNum;
			}

		}
		int startIndex = (page - 1) * pageSize;

		// Count查询
		long total = findForRowCount(hql, obj, nativeFlag(nativeFlag), splitTable);


		Query query = createQuery(hql, obj, nativeFlag(nativeFlag), splitTable);
		List list = query.setFirstResult(startIndex).setMaxResults(pageSize).list();


		retMap.put("rows", list);
		retMap.put("total", total);

		return retMap;
	}


	private int getPageMessage(Object obj, String proName) {
		int num = 0;
		Object numObj;
		if (obj instanceof Map) {
			numObj = ((Map) obj).get(proName);
		} else {
			numObj = net.sf.ehcache.hibernate.management.impl.BeanUtils.getBeanProperty(obj, proName);
		}
		if (numObj != null) {
			num = Integer.parseInt(numObj.toString());
		}
		return num;
	}

	private Class getBasePoClass(Class cls){
		if(cls == BasePO.class){
			return cls;
		}else{
			return getBasePoClass(cls.getSuperclass());
		}
	}


	private void ONUpdate(T entity) {
		try {
			//根据传入的属性名称构造属性的set方法名
			Method method = getBasePoClass(entity.getClass()).getMethod("setUpdateTime",Long.class);
			if (null != method) {
				method.invoke(entity, new Date().getTime());
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private Query createQuery(String hql, Object paramMap, boolean flag, String... splitTable) {
		Query query = null;
		if (nativeFlag(flag)) {
			query = getSession(splitTable).createSQLQuery(hql);
			query.setResultTransformer((ResultTransformer) AliasToMapResultTransformer.readResolve());
		} else {
			query = getSession(splitTable).createQuery(hql);
		}

		if (paramMap != null) {
			if (paramMap instanceof Map) {
				query.setProperties((Map) paramMap);
			} else {
				query.setProperties(paramMap);
			}
		}

		return query;
	}

	private boolean nativeFlag(boolean... nativeFlag) {
		boolean flag = false;
		if(ArrayUtils.isNotEmpty(nativeFlag)){
			flag = nativeFlag[0];
		}
		return flag;
	}



	private Object executeScalar(String sql, Object obj, boolean nativeFlag, String... splitTable) {
		Query query = createQuery(sql, obj, nativeFlag, splitTable);
		List list = query.list();
		if (CollectionUtils.isNotEmpty(list)) {
			Object objtemp = list.get(0);
			if (null != objtemp) {
				if (objtemp instanceof Map) {
					Map map = (Map) objtemp;
					return map.values().toArray()[0];
				}
				return objtemp;
			}
		}
		return null;
	}
}
