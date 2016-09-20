package com.sin.smart.utils;

import com.sin.smart.constants.GlobalConstants;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;

public class URLUtil {

    public static String encode(String url) {
        try {
            return URLEncoder.encode(url, GlobalConstants.ENCODING_UTF_8);
        } catch (UnsupportedEncodingException e) {
            return url;
        }
    }

    public static String decode(String url) {
        try {
            return URLDecoder.decode(url, GlobalConstants.ENCODING_UTF_8);
        } catch (UnsupportedEncodingException e) {
            return url;
        }
    }

}
