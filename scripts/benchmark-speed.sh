#!/bin/sh

./scripts/prepublish.sh
rm -f ./isolate-*-v8.log
node --prof ./benchmark/index.js --speed
node --prof-process ./isolate-*-v8.log > profile.txt
