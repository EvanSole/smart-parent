#!/bin/sh
cd bin
nohup sh mqnamesrv &
sleep 10
nohup sh mqbroker -n "10.0.18.40:9876" -c ../conf/2m-2s-async/broker-a.properties &
sleep 10
