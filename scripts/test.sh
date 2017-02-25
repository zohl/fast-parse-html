#!/bin/sh

source ./scripts/constants.sh

mocha --compilers js:babel-core/register ./test/index.js

