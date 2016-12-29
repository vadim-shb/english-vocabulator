#!/usr/bin/env bash

rm -rf angular-cli.json
cp angular-cli.json.template angular-cli.json
sed -i 's/${main-script}/mobile.main.ts/' angular-cli.json

ng serve --port=3333 --proxy-config proxy.conf.json
