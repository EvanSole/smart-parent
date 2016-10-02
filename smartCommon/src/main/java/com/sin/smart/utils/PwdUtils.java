package com.sin.smart.utils;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 密码加密工具类
 * 现在主要有md5的加密 但不同于普通但md5做了些处理
 */
public class PwdUtils {
    private static final char[] DIGITS = {
            '0', '1', '2', '3', '4', '5', '6', '7',
            '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'
    };

    public static String toMd5(String pwd,String salt,int ...iteratorNum)  {
        int itNum = 12;
        if(iteratorNum != null && iteratorNum.length > 0){
            itNum = iteratorNum[0];
        }

        int iterations = Math.max(1, itNum);


       byte hash[] = new byte[0];
       try {
           hash = hash(pwd.getBytes("utf-8"),salt.getBytes("utf-8"),iterations,"MD5");
       } catch (UnsupportedEncodingException e) {
           e.printStackTrace();
       }

       return encodeToString(hash);
    }



    public static String encodeToString(byte[] bytes) {
        char[] encodedChars = encode(bytes);
        return new String(encodedChars);
    }

    public static char[] encode(byte[] data) {

        int l = data.length;

        char[] out = new char[l << 1];

        // two characters form the hex value.
        for (int i = 0, j = 0; i < l; i++) {
            out[j++] = DIGITS[(0xF0 & data[i]) >>> 4];
            out[j++] = DIGITS[0x0F & data[i]];
        }

        return out;
    }

    protected static byte[] hash(byte[] bytes, byte[] salt, int hashIterations,String algorithmName) {
        MessageDigest digest = getDigest(algorithmName);
        if (salt != null) {
            digest.reset();
            digest.update(salt);
        }
        byte[] hashed = digest.digest(bytes);
        int iterations = hashIterations - 1; //already hashed once above
        //iterate remaining number:
        for (int i = 0; i < iterations; i++) {
            digest.reset();
            hashed = digest.digest(hashed);
        }
        return hashed;
    }


    protected static MessageDigest getDigest(String algorithmName) {
        try {
            return MessageDigest.getInstance(algorithmName);
        } catch (NoSuchAlgorithmException e) {
            String msg = "No native '" + algorithmName + "' MessageDigest instance available on the current JVM.";
            throw new RuntimeException(msg, e);
        }
    }

    public static void main(String a[]) throws UnsupportedEncodingException {
        System.out.println(toMd5("123456", "test", 12));
    }
}
