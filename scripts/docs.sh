#!/bin/sh
documentation lint ./src/index.js \
  && documentation build -f md ./src/index.js > ./API.md
