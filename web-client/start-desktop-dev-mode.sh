#!/usr/bin/env bash

rm -rf angular-cli.json
cp angular-cli.json.template angular-cli.json
sed -i 's/${main-script}/desktop.main.ts/' angular-cli.json

ng serve --port=4444 --proxy-config proxy.conf.json
