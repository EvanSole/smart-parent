package com.sin.smart.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.InterfaceAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.Enumeration;
import java.util.Iterator;

public class IPUtil {
	private static final Logger log = LoggerFactory.getLogger(IPUtil.class);
	public static final String ip = getLocalIpByNetcard();

	public static String getLocalIP(){
		return ip;
	}

	/***
	 *  根据网卡获取IP地址
	 * @return ip
	 */
	public static String getLocalIpByNetcard(){
		try {
			Enumeration e;
			for (e = NetworkInterface.getNetworkInterfaces(); e.hasMoreElements(); ) {
				NetworkInterface item = (NetworkInterface)e.nextElement();
				for (Iterator i$ = item.getInterfaceAddresses().iterator(); i$.hasNext(); ) { InterfaceAddress address = (InterfaceAddress)i$.next();
					if (address.getAddress() instanceof Inet4Address) {
						Inet4Address inet4Address = (Inet4Address)address.getAddress();
						return inet4Address.getHostAddress();
					}
				}
			}
			return InetAddress.getLocalHost().getHostAddress();
		}
		catch (SocketException ex) {
			log.error(" Connection refused. ", ex);
		} catch (UnknownHostException ue) {
			log.error("determines whether a string is a valid ip address. ", ue);
		}
		return null;
	}

	public static final String getIPAddress(HttpServletRequest request) {
		String ip = request.getHeader("x-forwarded-for");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}
		return ip;
	}

	public static final long ipv4ToLong(String ipv4){
		String[] octets = ipv4.split("\\.");
		if (octets.length != 4)
			throw new IllegalArgumentException("IPv4 invalid!");

		long ip = 0L;
		for (int i = 3; i >= 0; --i) {
			long octet = Long.parseLong(octets[(3 - i)]);
			if ((octet > 255L) || (octet < 0L))
				throw new IllegalArgumentException("IPv4 invalid!");

			ip |= octet << i * 8;
		}
		return ip;
	}

	public static final String longToIpv4(long ipv4){
		if ((ipv4 > -1L) || (ipv4 < 0L))
			throw new IllegalArgumentException("IPv4 invalid!");

		StringBuilder ipAddress = new StringBuilder(15);
		for (int i = 3; i >= 0; --i) {
			int shift = i * 8;
			ipAddress.append((ipv4 & 255 << shift) >> shift);
			if (i > 0)
				ipAddress.append(".");
		}

		return ipAddress.toString();
	}
}
