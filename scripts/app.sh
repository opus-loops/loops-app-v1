#!/usr/bin/env bash
#
# Loops App production build script
#
# Responsibilities:
#   1. Build the application using Vite.
#   2. Copy server instrumentation into the Nitro output.
#   3. Copy generated PWA runtime files into the public output.
#   4. Ensure Nginx can traverse and read .output/public.
#   5. Create one immutable success or error log per build.
#   6. Include an artifact-size report only for successful builds.
#   7. Write the Azure record timestamp only on the first line of each log.
#
# Successful log:
#   /var/log/loops/build/loops-app-<BUILD_ID>-success.log
#
# Failed log:
#   /var/log/loops/build/loops-app-<BUILD_ID>-error.log
#
# Azure Monitor multiline behavior:
#   The first line contains only an ISO 8601 datetime.
#   No subsequent line starts with a datetime, allowing the complete file
#   to be ingested as one multiline record when using the timestamp delimiter.
#

set -Eeuo pipefail
umask 0027

readonly APP_NAME="loops-app"
readonly NGINX_USER="www-data"

readonly ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly LOG_DIR="/var/log/loops/build"

readonly BUILD_ID="$(date -u +%Y%m%dT%H%M%SZ)-$$"
readonly BUILD_STARTED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

readonly GIT_SHA="$(
  git -C "$ROOT_DIR" rev-parse --short HEAD 2>/dev/null ||
    printf 'unknown'
)"

# Temporary files intentionally do not end with .log, so Azure Monitor Agent
# does not ingest incomplete build output.
readonly RAW_BUILD_LOG="${LOG_DIR}/.${APP_NAME}-${BUILD_ID}.build.tmp"
readonly FINAL_TEMP_LOG="${LOG_DIR}/.${APP_NAME}-${BUILD_ID}.final.tmp"

readonly SUCCESS_LOG="${LOG_DIR}/${APP_NAME}-${BUILD_ID}-success.log"
readonly ERROR_LOG="${LOG_DIR}/${APP_NAME}-${BUILD_ID}-error.log"

log() {
  printf '%s\n' "$1"
}

log_event() {
  local event_name="$1"
  shift

  printf 'event=%s application=%s build_id=%s git_sha=%s' \
    "$event_name" \
    "$APP_NAME" \
    "$BUILD_ID" \
    "$GIT_SHA"

  if (( $# > 0 )); then
    printf ' %s' "$*"
  fi

  printf '\n'
}

write_log_record() {
  # The timestamp appears only on the first line and contains no other data.
  #
  # Azure Monitor uses this line as the beginning of the multiline record.
  # Everything received through stdin is written afterward without timestamps.
  printf '%s\n' "$BUILD_STARTED_AT"
  cat
}

require_command() {
  local command_name="$1"

  if ! command -v "$command_name" >/dev/null 2>&1; then
    printf 'Required command not found: %s\n' "$command_name" >&2
    return 1
  fi
}

copy_instrumentation() {
  if [[ ! -f "instrument.server.mjs" ]]; then
    log "instrument.server.mjs not found in project root"
    return 1
  fi

  mkdir -p ".output/server"

  cp \
    "instrument.server.mjs" \
    ".output/server/instrument.server.mjs"

  log "Copied instrument.server.mjs to .output/server"
}

copy_pwa_runtime_files() {
  local file
  local workbox_files=()

  mkdir -p ".output/public"

  if [[ -f "dist/sw.js" ]]; then
    cp \
      "dist/sw.js" \
      ".output/public/sw.js"

    log "Copied dist/sw.js to .output/public/sw.js"
  else
    log "dist/sw.js was not generated; skipping service worker copy"
  fi

  shopt -s nullglob
  workbox_files=(dist/workbox-*.js)
  shopt -u nullglob

  if (( ${#workbox_files[@]} == 0 )); then
    log "No Workbox runtime files were generated"
    return 0
  fi

  for file in "${workbox_files[@]}"; do
    cp \
      "$file" \
      ".output/public/$(basename "$file")"

    log "Copied $(basename "$file") to .output/public"
  done
}

remove_temporary_artifacts() {
  if [[ -d "dist" ]]; then
    rm -rf "dist"
    log "Removed dist directory"
  fi
}

grant_nginx_ancestor_traversal() {
  local public_dir="$1"
  local current_dir
  local parent_dir

  # Nginx needs execute permission on every directory in the path.
  # ACLs grant traversal without making private project directories readable.
  current_dir="$(dirname "$public_dir")"

  while [[ "$current_dir" != "/" ]]; do
    setfacl -m "u:${NGINX_USER}:--x" "$current_dir"

    parent_dir="$(dirname "$current_dir")"

    if [[ "$parent_dir" == "$current_dir" ]]; then
      break
    fi

    current_dir="$parent_dir"
  done
}

grant_nginx_public_access() {
  local public_dir="${ROOT_DIR}/.output/public"

  require_command setfacl

  if [[ ! -d "$public_dir" ]]; then
    log "Public output directory not found: $public_dir"
    return 1
  fi

  grant_nginx_ancestor_traversal "$public_dir"

  # Public directories must be traversable.
  find "$public_dir" \
    -type d \
    -exec chmod 0755 {} +

  # Public files are static assets and must be readable by Nginx.
  find "$public_dir" \
    -type f \
    -exec chmod 0644 {} +

  # Explicit ACLs preserve Nginx access even if inherited modes change.
  find "$public_dir" \
    -type d \
    -exec setfacl \
      -m "u:${NGINX_USER}:rx" \
      -m "d:u:${NGINX_USER}:rx" \
      {} +

  find "$public_dir" \
    -type f \
    -exec setfacl \
      -m "u:${NGINX_USER}:r--" \
      {} +

  log "Granted ${NGINX_USER} traversal and read access to .output/public"
}

verify_public_output() {
  local public_dir="${ROOT_DIR}/.output/public"
  local unreadable_file=""

  if [[ ! -d "$public_dir" ]]; then
    log "Public directory verification failed: $public_dir does not exist"
    return 1
  fi

  # When the script runs as root, verify access by impersonating www-data.
  if [[ "$(id -u)" -eq 0 ]] && command -v runuser >/dev/null 2>&1; then
    if ! runuser -u "$NGINX_USER" -- test -x "$public_dir"; then
      log "${NGINX_USER} cannot traverse $public_dir"
      return 1
    fi

    while IFS= read -r -d '' file; do
      if ! runuser -u "$NGINX_USER" -- test -r "$file"; then
        unreadable_file="$file"
        break
      fi
    done < <(find "$public_dir" -type f -print0)

    if [[ -n "$unreadable_file" ]]; then
      log "${NGINX_USER} cannot read: $unreadable_file"
      return 1
    fi
  fi

  log "Verified public-output permissions for Nginx"
}

build_application() {
  cd "$ROOT_DIR"

  require_command npm
  require_command gzip
  require_command numfmt
  require_command stat
  require_command setfacl

  log "Cleaning previous build outputs"
  rm -rf ".output" "dist"

  log "Running Vite production build"
  npm exec -- vite build

  if [[ ! -f ".output/server/index.mjs" ]]; then
    log "Build completed but .output/server/index.mjs was not found"
    return 1
  fi

  copy_instrumentation
  copy_pwa_runtime_files
  remove_temporary_artifacts
  grant_nginx_public_access
  verify_public_output

  log "Build completed successfully"
}

print_artifact_size_table() {
  local file
  local relative_path
  local size_bytes
  local gzip_bytes
  local size_human
  local gzip_human

  printf 'artifact_size_report application=%s build_id=%s\n' \
    "$APP_NAME" \
    "$BUILD_ID"

  printf '| File | Original size | Gzip size |\n'
  printf '|---|---:|---:|\n'

  while IFS= read -r -d '' file; do
    relative_path="${file#"$ROOT_DIR"/}"

    size_bytes="$(stat -c '%s' "$file")"
    gzip_bytes="$(gzip -c -- "$file" | wc -c | tr -d '[:space:]')"

    size_human="$(
      numfmt \
        --to=iec-i \
        --suffix=B \
        "$size_bytes"
    )"

    gzip_human="$(
      numfmt \
        --to=iec-i \
        --suffix=B \
        "$gzip_bytes"
    )"

    printf '| %s | %s (%s bytes) | %s (%s bytes) |\n' \
      "$relative_path" \
      "$size_human" \
      "$size_bytes" \
      "$gzip_human" \
      "$gzip_bytes"
  done < <(
    find "${ROOT_DIR}/.output" \
      -type f \
      -print0 |
      sort -z
  )
}

write_success_log() {
  {
    log_event \
      "build_started" \
      "started_at=${BUILD_STARTED_AT} workdir=${ROOT_DIR}"

    log "Vite build completed successfully"
    log "Vite output omitted from successful-build log"
    log "Nginx user: ${NGINX_USER}"
    log "Nginx public path: ${ROOT_DIR}/.output/public"
    log "Nginx permissions: verified"

    print_artifact_size_table

    log_event \
      "build_finished" \
      "status=success exit_code=0"
  } |
    write_log_record >"$FINAL_TEMP_LOG"

  mv "$FINAL_TEMP_LOG" "$SUCCESS_LOG"

  printf 'Build succeeded.\n'
  printf 'Build log: %s\n' "$SUCCESS_LOG"
}

write_error_log() {
  local exit_code="$1"

  {
    log_event \
      "build_started" \
      "started_at=${BUILD_STARTED_AT} workdir=${ROOT_DIR}"

    log "Build failed. Complete build output follows."
    printf '%s\n' '----- build output -----'

    if [[ -f "$RAW_BUILD_LOG" ]]; then
      cat "$RAW_BUILD_LOG"
    else
      log "No raw build output was captured"
    fi

    printf '%s\n' '----- end build output -----'

    log_event \
      "build_finished" \
      "status=error exit_code=${exit_code}"
  } |
    write_log_record >"$FINAL_TEMP_LOG"

  mv "$FINAL_TEMP_LOG" "$ERROR_LOG"

  printf 'Build failed with exit code %s.\n' "$exit_code" >&2
  printf 'Build log: %s\n' "$ERROR_LOG" >&2
}

cleanup_temporary_files() {
  rm -f \
    "$RAW_BUILD_LOG" \
    "$FINAL_TEMP_LOG" \
    "${RAW_BUILD_LOG}.signal"
}

handle_signal() {
  local signal_name="$1"
  local exit_code="$2"
  local signal_temp_log="${RAW_BUILD_LOG}.signal"

  set +e

  {
    printf 'Build interrupted by signal: %s\n' "$signal_name"

    if [[ -f "$RAW_BUILD_LOG" ]]; then
      cat "$RAW_BUILD_LOG"
    fi
  } >"$signal_temp_log"

  mv "$signal_temp_log" "$RAW_BUILD_LOG"

  write_error_log "$exit_code"
  cleanup_temporary_files

  exit "$exit_code"
}

mkdir -p "$LOG_DIR"

trap cleanup_temporary_files EXIT
trap 'handle_signal HUP 129' HUP
trap 'handle_signal INT 130' INT
trap 'handle_signal TERM 143' TERM

if (
  set -Eeuo pipefail
  build_application
) >"$RAW_BUILD_LOG" 2>&1; then
  BUILD_EXIT_CODE=0
else
  BUILD_EXIT_CODE=$?
fi

if (( BUILD_EXIT_CODE == 0 )); then
  write_success_log
else
  write_error_log "$BUILD_EXIT_CODE"
fi

# Keep completed logs for 14 days.
find "$LOG_DIR" \
  -type f \
  \( \
    -name "${APP_NAME}-*-success.log" \
    -o -name "${APP_NAME}-*-error.log" \
  \) \
  -mtime +14 \
  -delete

# Remove abandoned temporary files after two days.
find "$LOG_DIR" \
  -type f \
  \( \
    -name ".${APP_NAME}-*.tmp" \
    -o -name ".${APP_NAME}-*.tmp.signal" \
  \) \
  -mtime +2 \
  -delete

trap - EXIT
cleanup_temporary_files

exit "$BUILD_EXIT_CODE"