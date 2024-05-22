#!/bin/bash

openssl genrsa -out ./certs/private_access.pem 3072
openssl rsa -in ./certs/private_access.pem -pubout -out ./certs/public_access.pem

openssl genrsa -out ./certs/private_refresh.pem 3072
openssl rsa -in ./certs/private_refresh.pem -pubout -out ./certs/public_refresh.pem

openssl genrsa -out ./certs/private_recovery.pem 3072
openssl rsa -in ./certs/private_recovery.pem -pubout -out ./certs/public_recovery.pem