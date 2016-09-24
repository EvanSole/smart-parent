package com.sin.smart.sku.common;

import com.sin.smart.core.formwork.db.util.DbShareField;
import com.sin.smart.core.formwork.db.vo.DbShardVO;
import com.sin.smart.entity.CurrentUserEntity;
import org.junit.runner.RunWith;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;

/*
 * @TransactionConfiguration(transactionManager="transactionManager",defaultRollback=true)
 * transactionManager的默认取值是"transactionManager"，
 * defaultRollback的默认取值是true，当然，你也可以改成false。
 * true表示测试不会对数据库造成污染,false的话当然就会改动到数据库中了。
 * 在方法名上添加@Rollback(false)表示这个测试用例不需要回滚。
 */
@RunWith(value = SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:/sku/spring-core.xml"})
@TransactionConfiguration(defaultRollback = false)
@ActiveProfiles(value = "develop")
public abstract class SpringTxTestCase extends AbstractJUnit4SpringContextTests {
    @org.junit.Before
    public void init(){
        Environment env = applicationContext.getEnvironment();
        String profile = env.getActiveProfiles()[0];
        System.setProperty("spring.profiles.active",profile);
    }

    public DbShardVO getDbshardVO(){
        DbShardVO dbShardVO = new DbShardVO();
        CurrentUserEntity user = new CurrentUserEntity();
        user.setUserName("admin");
        dbShardVO.setCurrentUser(user);
        dbShardVO.setSource(DbShareField.SKU);
        //88取模为0，读取无后缀的Table; 89 取模为1，读取后缀为1的table  Eg:t_smart_sku (88)  t_smart_sku_1 (89)
        dbShardVO.setShardDbId("88");
        dbShardVO.setShardTableId("88");
        dbShardVO.setWarehouseId(89L);
        return dbShardVO;
    }

}
