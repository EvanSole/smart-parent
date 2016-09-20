package com.sin.smart.autoid.server.dao;

import org.springframework.jdbc.core.JdbcTemplate;

public class ResDao {
	
	private JdbcTemplate jdbcTemplate;

    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int insert(int key, int id) {
        return jdbcTemplate.update("replace into res(k,id)values(?,?)", key, id);
    }

    public int updateAndGetLastId(int key, int length) {
        int cnt = jdbcTemplate.update("update res set id=last_insert_id(id+?) where k=?", length, key);
        return cnt == 0 ? -1 : jdbcTemplate.queryForObject("select LAST_INSERT_ID()", Integer.class);
    }
}
