#!/bin/sh
set -eu

TEMPLATE="/usr/share/nginx/html/env-config.js.template"
OUTPUT="/usr/share/nginx/html/env-config.js"

if [ -f "$TEMPLATE" ]; then
  envsubst '${VITE_API_BASE_URL} ${VITE_APP_NAME}' < "$TEMPLATE" > "$OUTPUT"
fi
