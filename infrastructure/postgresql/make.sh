#!/usr/bin/env bash

docker build -t vdshb/postgres .
docker run --name postgres -t -d -p 5432:5432 vdshb/postgres