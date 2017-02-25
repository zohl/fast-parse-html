#!/bin/sh

source ./scripts/constants.sh

(node ./benchmark/index.js --completeness | grep failed -A 2 -B 1) || echo "OK"
