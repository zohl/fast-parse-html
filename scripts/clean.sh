#!/bin/sh

source ./scripts/constants.sh

[ -e "$BUILD_DIR" ] && rm -r "$BUILD_DIR"
[ -e "$PUBLISH_DIR" ] && rm -r "$PUBLISH_DIR"

exit 0
