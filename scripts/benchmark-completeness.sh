#!/bin/sh

./scripts/prepublish.sh
node ./benchmark/index.js --completeness

