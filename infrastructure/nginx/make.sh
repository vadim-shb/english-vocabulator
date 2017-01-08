#!/usr/bin/env bash

docker build -t vdshb/nginx .
docker run --name nginx --net=host -t -d vdshb/nginx
#docker run --name nginx --rm --net=host -t -i vdshb/nginx bash