#!/bin/bash
set -euo pipefail

if [ "$(id -u)" -eq 0 ]; then
  echo "This script must be run as the non-root user (node). Do not use sudo."
  exit 1
fi

cd /workspace

# Use the project-local CLI so version matches package.json
if command -v pnpm >/dev/null 2>&1; then
  pnpm exec playwright install chromium
else
  npx playwright install chromium
fi