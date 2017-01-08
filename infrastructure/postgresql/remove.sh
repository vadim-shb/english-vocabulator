#!/usr/bin/env bash

docker stop postgres
docker rm postgres
docker rmi vdshb/postgres