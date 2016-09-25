package com.sin.smart.core.redis;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.ScanParams;
import redis.clients.jedis.ScanResult;
import redis.clients.jedis.ShardedJedis;
import redis.clients.jedis.ShardedJedisPool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class RedisTemplate {

        private static transient Logger logger = LoggerFactory.getLogger(RedisTemplate.class);

        @Autowired
        private ShardedJedisPool shardedJedisPool;

        /**
         * 设置一个key的过期时间（单位：秒）
         * @param key key值
         * @param seconds 多少秒后过期
         * @return 1：设置了过期时间  0：没有设置过期时间/不能设置过期时间
         */
        public long expire(String key, int seconds) {
            if (StringUtils.isEmpty(key)) {
                return 0;
            }
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                return shardedJedis.expire(key, seconds);
            } catch (Exception ex) {
                logger.error("EXPIRE ERROR[key=" + key + " seconds=" + seconds + "]" + ex.getMessage(), ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return 0;
        }

        /**
         * 设置一个key在某个时间点过期
         * @param key key值
         * @param unixTimestamp unix时间戳，从1970-01-01 00:00:00开始到现在的秒数
         * @return 1：设置了过期时间  0：没有设置过期时间/不能设置过期时间
         */
        public long expireAt(String key, int unixTimestamp) {
            if (StringUtils.isEmpty(key)) {
                return 0;
            }

            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                return shardedJedis.expireAt(key, unixTimestamp);
            } catch (Exception ex) {
                logger.error("EXPIRE ERROR[key=" + key + " unixTimestamp=" + unixTimestamp + "]" + ex.getMessage(), ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return 0;
        }

        /**
         * 截断一个List
         * @param key 列表key
         * @param start 开始位置 从0开始
         * @param end 结束位置
         * @return 状态码
         */
        public String trimList(String key, long start, long end) {
            if (StringUtils.isEmpty(key)) {
                return "-";
            }
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                return shardedJedis.ltrim(key, start, end);
            } catch (Exception ex) {
                logger.error("LTRIM ERROR[key=" + key + " start=" + start + " end=" + end + "]" + ex.getMessage() , ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return "-";
        }
        /**
         * 检查Set长度
         * @param key
         * @return
         */
        public long countSet(String key){
            if (StringUtils.isEmpty(key)) {
                return 0;
            }
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                return shardedJedis.scard(key);
            } catch (Exception ex) {
                logger.error("countSet error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return 0;
        }
        /**
         * 添加到Set中（同时设置过期时间）
         * @param key key值
         * @param seconds 过期时间 单位s
         * @param value
         * @return
         */
        public boolean addSet(String key,int seconds, String... value) {
            boolean result = addSet(key, value);
            if(result){
                long i = expire(key, seconds);
                return i==1;
            }
            return false;
        }
        /**
         * 添加到Set中
         * @param key
         * @param value
         * @return
         */
        public boolean addSet(String key, String... value) {
            if(key == null || value == null){
                return false;
            }
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                shardedJedis.sadd(key, value);
                return true;
            } catch (Exception ex) {
                logger.error("setList error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return false;
        }


        /**
         * @param key
         * @param value
         * @return 判断值是否包含在set中
         */
        public boolean containsInSet(String key, String value) {
            if(key == null || value == null){
                return false;
            }
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                return shardedJedis.sismember(key, value);
            } catch (Exception ex) {
                logger.error("setList error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return false;
        }
        /**
         * 获取Set
         * @param key
         * @return
         */
        public Set<String> getSet(String key){
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                return shardedJedis.smembers(key);
            } catch (Exception ex) {
                logger.error("getList error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return null;
        }

        /**
         * 从set中删除value
         * @param key
         * @return
         */
        public  boolean removeSetValue(String key,String... value){
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                shardedJedis.srem(key, value);
                return true;
            } catch (Exception ex) {
                logger.error("getList error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return false;
        }



        /**
         * 从list中删除value 默认count 1
         * @param key
         * @param values 值list
         * @return
         */
        public  int removeListValue(String key,List<String> values){
            return removeListValue(key, 1, values);
        }
        /**
         * 从list中删除value
         * @param key
         * @param count
         * @param values 值list
         * @return
         */
        public  int removeListValue(String key,long count,List<String> values){
            int result = 0;
            if(CollectionUtils.isNotEmpty(values)){
                for(String value : values){
                    if(removeListValue(key, count, value)){
                        result++;
                    }
                }
            }
            return result;
        }
        /**
         *  从list中删除value
         * @param key
         * @param count 要删除个数
         * @param value
         * @return
         */
        public  boolean removeListValue(String key,long count,String value){
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                shardedJedis.lrem(key, count, value);
                return true;
            } catch (Exception ex) {
                logger.error("getList error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return false;
        }

        /**
         * 截取List
         * @param key
         * @param start 起始位置
         * @param end 结束位置
         * @return
         */
        public List<String> rangeList(String key, long start, long end) {
            if (key == null || key.equals("")) {
                return null;
            }
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                return shardedJedis.lrange(key, start, end);
            } catch (Exception ex) {
                logger.error("rangeList error [key=" + key + " start=" + start + " end=" + end + "]" + ex.getMessage() , ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return null;
        }

        /**
         * 检查List长度
         * @param key
         * @return
         */
        public long countList(String key){
            if(key == null ){
                return 0;
            }
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                return shardedJedis.llen(key);
            } catch (Exception ex) {
                logger.error("countList error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return 0;
        }

        /**
         * 添加到List中（同时设置过期时间）
         * @param key key值
         * @param seconds 过期时间 单位s
         * @param value
         * @return
         */
        public boolean addList(String key,int seconds, String... value){
            boolean result = addList(key, value);
            if(result){
                long i = expire(key, seconds);
                return i==1;
            }
            return false;
        }
        /**
         * 添加到List
         * @param key
         * @param value
         * @return
         */
        public boolean addList(String key, String... value) {
            if(key == null || value == null){
                return false;
            }
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                shardedJedis.lpush(key, value);
                return true;
            } catch (Exception ex) {
                logger.error("setList error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return false;
        }
        /**
         * 添加到List(只新增)
         * @param key
         * @param list
         * @return
         */
        public boolean addList(String key, List<String> list) {
            if(StringUtils.isEmpty(key) || CollectionUtils.isEmpty(list)){
                return false;
            }
            for(String value : list){
                addList(key, value);
            }
            return true;
        }

        /**
         * 获取List
         * @param key
         * @return
         */
        public  List<String> lrange(String key){
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                return shardedJedis.lrange(key, 0, -1);
            } catch (Exception ex) {
                logger.error("getList error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return null;
        }


        public Map hgetAll(String key){
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                return shardedJedis.hgetAll(key);
            } catch (Exception ex) {
                logger.error(" hgetAll error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return null;
        }

        public List<Map> hgetAll(String ...keys){
            List<Map> ret = new ArrayList();
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                Map map;
                for(int i = 0;i < keys.length;i++){
                    map = shardedJedis.hgetAll(keys[i]);
                    ret.add(map);
                }
                return ret;
            } catch (Exception ex) {
                logger.error(" hgetAll error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return null;
        }





        /**
         * 设置HashSet对象
         *
         * @param key    键值
         * @param value  Json String or String value
         * @return
         */
        public boolean hset(String key,String fields, String value) {
            if (value == null) return false;
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                shardedJedis.hset(key, fields, value);
                return true;
            } catch (Exception ex) {
                logger.error("setHSet error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return false;
        }

        /**
         * 获得HashSet对象
         *
         * @param key    键值
         * @return Json String or String value
         */
        public String hget(String key,String field) {
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                return shardedJedis.hget(key, field);
            } catch (Exception ex) {
                logger.error("getHSet error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return null;
        }

        /**
         * 删除HashSet对象
         *
         * @param key    键值
         * @return 删除的记录数
         */
        public long hdel(String key,String field) {
            ShardedJedis shardedJedis = null;
            long count = 0;
            try {
                shardedJedis = shardedJedisPool.getResource();
                count = shardedJedis.hdel(key,field);
            } catch (Exception ex) {
                logger.error("delHSet error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return count;
        }

        /**
         * 删除HashSet对象
         * @param key    键值
         * @return 删除的记录数
         */
        public long hdel(String key, String... field) {
            ShardedJedis shardedJedis = null;
            long count = 0;
            try {
                shardedJedis = shardedJedisPool.getResource();
                count = shardedJedis.hdel(key,field);
            } catch (Exception ex) {
                logger.error("delHSet error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return count;
        }

        /**
         * 判断key是否存在
         *
         * @param key    键值
         * @return
         */
        public boolean hexists(String key,String field) {
            ShardedJedis shardedJedis = null;
            boolean isExist = false;
            try {
                shardedJedis = shardedJedisPool.getResource();
                isExist = shardedJedis.hexists(key,field);
            } catch (Exception ex) {
                logger.error("existsHSet error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return isExist;
        }

        /**
         * 全局扫描hset
         *
         * @param match field匹配模式
         * @return
         */
        public List<Map.Entry<String, String>> scanHSet(String key, String match) {
            ShardedJedis shardedJedis = null;
            try {
                int cursor = 0;
                shardedJedis = shardedJedisPool.getResource();
                ScanParams scanParams = new ScanParams();
                scanParams.match(match);
                Jedis jedis = shardedJedis.getShard(key);
                ScanResult<Map.Entry<String, String>> scanResult;
                List<Map.Entry<String, String>> list = new ArrayList<Map.Entry<String, String>>();
                do {
                    scanResult = jedis.hscan(key, String.valueOf(cursor), scanParams);
                    list.addAll(scanResult.getResult());
                    cursor = Integer.parseInt(scanResult.getStringCursor());
                } while (cursor > 0);
                return list;
            } catch (Exception ex) {
                logger.error("scanHSet error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return null;
        }


        /**
         * 返回 key 指定的哈希集中所有字段的value值
         *
         * @param key
         * @return
         */

        public List<String> hvals(String key) {
            ShardedJedis shardedJedis = null;
            List<String> retList = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                retList = shardedJedis.hvals(key);
            } catch (Exception ex) {
                logger.error("hvals error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return retList;
        }

        /**
         * 返回 domain 指定的哈希集中所有字段的key值
         *
         * @param key
         * @return
         */

        public Set<String> hkeys(String key) {
            ShardedJedis shardedJedis = null;
            Set<String> retList = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                retList = shardedJedis.hkeys(key);
            } catch (Exception ex) {
                logger.error("hkeys error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return retList;
        }

        /**
         * 返回 key 指定的哈希key值总数
         *
         * @param key
         * @return
         */
        public long lenHset(String key) {
            ShardedJedis shardedJedis = null;
            long retList = 0;
            try {
                shardedJedis = shardedJedisPool.getResource();
                retList = shardedJedis.hlen(key);
            } catch (Exception ex) {
                logger.error("hkeys error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return retList;
        }

        /**
         * 设置排序集合
         *
         * @param key
         * @param score
         * @param value
         * @return
         */
        public boolean setSortedSet(String key, long score, String value) {
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                shardedJedis.zadd(key, score, value);
                return true;
            } catch (Exception ex) {
                logger.error("setSortedSet error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return false;
        }

        /**
         * 获得排序集合
         *
         * @param key
         * @param startScore
         * @param endScore
         * @param orderByDesc
         * @return
         */
        public Set<String> getSoredSet(String key, long startScore, long endScore, boolean orderByDesc) {
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                if (orderByDesc) {
                    return shardedJedis.zrevrangeByScore(key, endScore, startScore);
                } else {
                    return shardedJedis.zrangeByScore(key, startScore, endScore);
                }
            } catch (Exception ex) {
                logger.error("getSoredSet error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return null;
        }

        /**
         * 计算排序长度
         *
         * @param key
         * @param startScore
         * @param endScore
         * @return
         */
        public long countSoredSet(String key, long startScore, long endScore) {
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                Long count = shardedJedis.zcount(key, startScore, endScore);
                return count == null ? 0L : count;
            } catch (Exception ex) {
                logger.error("countSoredSet error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return 0L;
        }

        /**
         * 删除排序集合
         *
         * @param key
         * @param value
         * @return
         */
        public boolean delSortedSet(String key, String value) {
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                long count = shardedJedis.zrem(key, value);
                return count > 0;
            } catch (Exception ex) {
                logger.error("delSortedSet error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return false;
        }

        /**
         * 获得排序集合
         *
         * @param key
         * @param startRange
         * @param endRange
         * @param orderByDesc
         * @return
         */
        public Set<String> getSoredSetByRange(String key, int startRange, int endRange, boolean orderByDesc) {
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                if (orderByDesc) {
                    return shardedJedis.zrevrange(key, startRange, endRange);
                } else {
                    return shardedJedis.zrange(key, startRange, endRange);
                }
            } catch (Exception ex) {
                logger.error("getSoredSetByRange error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return null;
        }

        /**
         * 获得排序打分
         *
         * @param key
         * @return
         */
        public Double getScore(String key, String member) {
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                return shardedJedis.zscore(key, member);
            } catch (Exception ex) {
                logger.error("getSoredSet error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return null;
        }

        public boolean set(String key, String value, int second) {
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                shardedJedis.setex(key, second, value);
                return true;
            } catch (Exception ex) {
                logger.error("set error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return false;
        }

        public boolean set(String key, String value) {
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                shardedJedis.set(key, value);
                return true;
            } catch (Exception ex) {
                logger.error("set error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return false;
        }

        public String get(String key) {
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                return shardedJedis.get(key);
            } catch (Exception ex) {
                logger.error("get error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return null;
        }

        public String get(String key, String defaultValue) {
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                return shardedJedis.get(key) == null?defaultValue:shardedJedis.get(key);
            } catch (Exception ex) {
                logger.error("get error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return defaultValue;
        }

        public boolean del(String key) {
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                shardedJedis.del(key);
                return true;
            } catch (Exception ex) {
                logger.error("del error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return false;
        }

        public long incr(String key) {
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                return shardedJedis.incr(key);
            } catch (Exception ex) {
                logger.error("incr error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return 0;
        }

        public long decr(String key) {
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                return shardedJedis.decr(key);
            } catch (Exception ex) {
                logger.error("incr error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return 0;
        }

        /**
         * 向存于 key 的列表的尾部插入所有指定的值。如果 key 不存在，那么会创建一个空的列表然后再进行 push 操作。 当 key
         * 保存的不是一个列表，那么会返回一个错误。
         *
         * 可以使用一个命令把多个元素打入队列，只需要在命令后面指定多个参数。元素是从左到右一个接一个从列表尾部插入。 比如命令 RPUSH mylist a
         * b c 会返回一个列表，其第一个元素是 a ，第二个元素是 b ，第三个元素是 c。
         *
         * @param key
         * @param value
         * @return 在 push 操作后的列表长度。
         */
        public long rpush(String key,String... value) {
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                return shardedJedis.rpush(key,value);
            } catch (Exception ex) {
                logger.error("incr error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return 0;
        }

        /**
         * 将所有指定的值插入到存于 key 的列表的头部。如果 key 不存在，那么在进行 push 操作前会创建一个空列表。 如果 key
         * 对应的值不是一个 list 的话，那么会返回一个错误。
         *
         * 可以使用一个命令把多个元素 push 进入列表，只需在命令末尾加上多个指定的参数。元素是从最左端的到最右端的、一个接一个被插入到 list
         * 的头部。 所以对于这个命令例子 LPUSH mylist a b c，返回的列表是 c 为第一个元素， b 为第二个元素， a 为第三个元素。
         *
         * @param key
         * @param value
         * @return 在 push 操作后的列表长度。
         */
        public long lpush(String key,String... value) {
            ShardedJedis shardedJedis = null;
            try {
                shardedJedis = shardedJedisPool.getResource();
                return shardedJedis.lpush(key, value);
            } catch (Exception ex) {
                logger.error("incr error.", ex);
                returnBrokenResource(shardedJedis);
            } finally {
                returnResource(shardedJedis);
            }
            return 0;
        }

        private void returnBrokenResource(ShardedJedis shardedJedis) {
            try {
                //shardedJedisPool.returnBrokenResource(shardedJedis);
                shardedJedis.close();
            } catch (Exception e) {
                logger.error("returnBrokenResource error.", e);
            }
        }

        private void returnResource(ShardedJedis shardedJedis) {
            try {
                //shardedJedisPool.returnResource(shardedJedis);
                shardedJedis.close();
            } catch (Exception e) {
                logger.error("returnResource error.", e);
            }
        }

        public ShardedJedisPool getShardedJedisPool() {
            return shardedJedisPool;
        }

        public void setShardedJedisPool(ShardedJedisPool shardedJedisPool) {
            this.shardedJedisPool = shardedJedisPool;
        }


}
