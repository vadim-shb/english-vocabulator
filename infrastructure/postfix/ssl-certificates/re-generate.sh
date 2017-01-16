#!/usr/bin/env bash

#openssl genrsa -out privkey.pem 2048
#openssl req -new -key privkey.pem -out csr.pem
#openssl x509 -req -days 365 -in csr.pem -signkey privkey.pem -out cert.pem

OPENSSLCONFIG=${OPENSSLCONFIG-openssl-config.cnf}

openssl req -new -x509 -nodes -config $OPENSSLCONFIG -out cert.pem -keyout privkey.pem -days 365
openssl x509 -subject -fingerprint -noout -in cert.pem
rm -rf csr.pem
