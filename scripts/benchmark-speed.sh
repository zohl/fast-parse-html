#!/bin/sh

source ./scripts/constants.sh

rm -f ./isolate-*-v8.log
node --prof ./benchmark/index.js --speed
node --prof-process ./isolate-*-v8.log > profile.txt
