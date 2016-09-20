package com.sin.smart.autoid.client;

import com.sin.smart.autoid.common.SpringTxTestCase;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class AutoIdClientTest extends SpringTxTestCase {

    @Autowired
    AutoIdClient autoIdClient;

    @Test
    public void testGetAutoId() throws Exception {
      System.out.println("id  ----  " + autoIdClient.getAutoId(1000, 1));
    }
}