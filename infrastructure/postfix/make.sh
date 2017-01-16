#!/usr/bin/env bash

docker build -t vdshb/postfix .
docker run --name postfix -h localhost.com -p 25:25 -p 587:587 -p 143:143 -p 993:993 -t -d vdshb/postfix