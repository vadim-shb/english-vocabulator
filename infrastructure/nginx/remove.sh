#!/usr/bin/env bash

docker stop nginx
docker rm nginx
docker rmi vdshb/nginx