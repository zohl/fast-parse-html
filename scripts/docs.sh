#!/bin/sh

source ./scripts/constants.sh

documentation lint "$BUILD_DIR/index.js" \
  && documentation build -f md "$BUILD_DIR/index.js" > ./API.md
