#!/bin/bash

openssl genrsa -out ./certs/private.pem 3072
openssl rsa -in ./certs/private.pem -pubout -out ./certs/public.pem