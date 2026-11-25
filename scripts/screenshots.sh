#!/usr/bin/env bash
# Captures the home page at desktop and mobile widths in dark and light themes.
# Usage: scripts/screenshots.sh [base-url] [out-dir]
set -euo pipefail
URL="${1:-http://localhost:3000}"
OUT="${2:-screenshots}"
mkdir -p "$OUT"

for size in "desktop 1440 900" "mobile 390 844"; do
  read -r name w h <<<"$size"
  agent-browser set viewport "$w" "$h" 2 >/dev/null
  for theme in dark light; do
    agent-browser open "$URL" >/dev/null
    agent-browser storage local set theme "$theme" >/dev/null
    agent-browser open "$URL" >/dev/null
    agent-browser wait 1800 >/dev/null
    agent-browser screenshot --full "$OUT/$name-$theme.png" >/dev/null
    echo "$OUT/$name-$theme.png"
  done
done
agent-browser close >/dev/null
