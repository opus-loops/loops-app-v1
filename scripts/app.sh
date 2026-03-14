#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PORT="${PORT:-3001}"
MODE="${1:-build}"

log() {
  printf "\n[%s] %s\n" "$(date '+%Y-%m-%d %H:%M:%S')" "$1"
}

copy_instrumentation() {
  if [[ ! -f "instrument.server.mjs" ]]; then
    log "instrument.server.mjs not found in project root"
    exit 1
  fi

  mkdir -p ".output/server"
  cp "instrument.server.mjs" ".output/server/instrument.server.mjs"
  log "Copied instrument.server.mjs to .output/server"
}

copy_pwa_runtime_files() {
  mkdir -p ".output/public"

  if [[ -f "dist/sw.js" ]]; then
    cp "dist/sw.js" ".output/public/sw.js"
    log "Copied dist/sw.js to .output/public/sw.js"
  fi

  shopt -s nullglob
  for file in dist/workbox-*.js; do
    cp "$file" ".output/public/$(basename "$file")"
    log "Copied $(basename "$file") to .output/public"
  done
  shopt -u nullglob
}

remove_temporary_artifacts() {
  # Remove the temporary PWA build output entirely.
  if [[ -d "dist" ]]; then
    rm -rf dist
    log "Removed dist directory"
  fi

  # Extra safety: remove any remaining sourcemap files from the final artifact.
  if [[ -d ".output" ]]; then
    find .output -type f -name "*.map" -delete
    log "Removed remaining .map files from .output"
  fi
}

build_app() {
  log "Cleaning previous outputs"
  rm -rf .output dist

  log "Running vite build"
  vite build

  if [[ ! -f ".output/server/index.mjs" ]]; then
    log "Build finished but .output/server/index.mjs was not found"
    exit 1
  fi

  copy_instrumentation
  copy_pwa_runtime_files
  remove_temporary_artifacts

  log "Build completed with final artifact in .output only"
}

start_app() {
  if [[ ! -f ".output/server/index.mjs" ]]; then
    log ".output/server/index.mjs not found. Run the build first."
    exit 1
  fi

  if [[ ! -f ".output/server/instrument.server.mjs" ]]; then
    log ".output/server/instrument.server.mjs not found. Run the build first."
    exit 1
  fi

  log "Starting app on port ${PORT}"
  PORT="$PORT" node --import ./.output/server/instrument.server.mjs .output/server/index.mjs
}

case "$MODE" in
  build)
    build_app
    ;;
  start)
    start_app
    ;;
  build-start)
    build_app
    start_app
    ;;
  *)
    echo "Usage: bash ./scripts/app.sh [build|start|build-start]"
    exit 1
    ;;
esac