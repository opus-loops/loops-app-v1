#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

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
  if [[ -d "dist" ]]; then
    rm -rf dist
    log "Removed dist directory"
  fi

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

  log "Build completed successfully. Final artifact is in .output"
}

build_app