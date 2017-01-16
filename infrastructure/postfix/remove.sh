#!/usr/bin/env bash

docker stop postfix
docker rm postfix
docker rmi vdshb/postfix