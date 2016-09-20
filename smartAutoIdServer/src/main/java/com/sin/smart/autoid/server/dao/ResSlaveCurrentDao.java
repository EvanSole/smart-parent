package com.sin.smart.autoid.server.dao;

import org.springframework.jdbc.core.JdbcTemplate;

public class ResSlaveCurrentDao {
	
	private JdbcTemplate jdbcTemplate;

    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int updateAndGetId(int key, int count, int index) {
        int cnt = jdbcTemplate.update("update " + getResSlaveCurrent(index) + " set  id=last_insert_id(id+?),num=num-? where k=? and num >= ?", count, count, key, count);
        return cnt == 0 ? -1 : jdbcTemplate.queryForObject("select LAST_INSERT_ID()", Integer.class);
    }

    public int saveOrupdate(int key, int id, int num, int index) {
        return jdbcTemplate.update("replace into " + getResSlaveCurrent(index) + " (k,id,num) values (?,?,?)", key, id, num);
    }

    private String getResSlaveCurrent(int index) {
        return " res_slave_current_" + index + " ";
    }
    
}
