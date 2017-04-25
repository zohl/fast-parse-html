#!/bin/sh
source ./scripts/constants.sh

flow check \
&& eslint "$BUILD_DIR/"*

