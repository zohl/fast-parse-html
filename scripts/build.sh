#!/bin/sh

source ./scripts/constants.sh

mkdir -p "$BUILD_DIR"
cp "$SOURCE_DIR/index.js" "$BUILD_DIR/index.js"
c-preprocessor "$SOURCE_DIR/fast-parse-html.js" "$BUILD_DIR/fast-parse-html.js"
