#!/bin/bash

docker run \
  --rm \
  -v $PWD/:/app \
  -w /app \
  node:20-alpine sh -c "npm i node-jose && node ./scripts/jwk/create_jwk_access.js > ./src/public/.well-known/jwks_access.json"

docker run \
  --rm \
  -v $PWD/:/app \
  -w /app \
  node:20-alpine sh -c "npm i node-jose && node ./scripts/jwk/create_jwk_refresh.js > ./src/public/.well-known/jwks_refresh.json"

docker run \
  --rm \
  -v $PWD/:/app \
  -w /app \
  node:20-alpine sh -c "npm i node-jose && node ./scripts/jwk/create_jwk_recovery.js > ./src/public/.well-known/jwks_recovery.json"