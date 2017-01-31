#!/bin/sh

./scripts/prepublish.sh
node ./benchmark/index.js --completeness | grep failed -A 2 -B 1
