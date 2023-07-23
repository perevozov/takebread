#!/bin/sh

curl -X POST http://localhost:8080/register \
   -H 'Content-Type: application/json' \
   -d '{"email":"demo@takebread.xyz","password":"demo1234"}'