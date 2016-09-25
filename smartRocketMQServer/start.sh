#!/bin/sh
cd bin
nohup sh mqnamesrv &
sleep 10
nohup sh mqbroker -n "127.0.0.1:9876" -c ../conf/2m-2s-async/broker-a.properties &
sleep 10
