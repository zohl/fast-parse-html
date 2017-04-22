#!/bin/sh

source ./scripts/constants.sh

babel "$BUILD_DIR" -d "$PUBLISH_DIR"
uglifyjs -m -c \
  -o "$PUBLISH_DIR/$PACKAGE.min.js" \
  -- "$PUBLISH_DIR/$PACKAGE.js"     \
     "$PUBLISH_DIR/index.js"
