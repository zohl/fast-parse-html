#!/bin/sh
./scripts/test.sh
./scripts/docs.sh
babel ./src -d ./lib
