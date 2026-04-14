#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

STACK_NAME="${STACK_NAME:-loops-app-staging}"
DEPLOY_DIR="${DEPLOY_DIR:-$SCRIPT_DIR}"
STACK_FILE_PATH="${STACK_FILE_PATH:-$DEPLOY_DIR/stack.staging.yml}"
ENV_FILE_PATH="${ENV_FILE_PATH:-}"
APP_IMAGE="${APP_IMAGE:-ghcr.io/opus-loops/loops-app-v1:staging}"
APP_ENV_CONFIG_PREFIX="${APP_ENV_CONFIG_PREFIX:-loops_client_env_staging}"
CREATED_ENV_FILE_PATH=""

main() {
  trap cleanup EXIT

  echo "Preparing staging deployment directory at $DEPLOY_DIR"
  mkdir -p "$DEPLOY_DIR"
  cd "$DEPLOY_DIR"

  if [ ! -f "$STACK_FILE_PATH" ]; then
    echo "Missing stack file at $STACK_FILE_PATH. The deployment workflow must copy stack.staging.yml from the repository to the VM before running this script." >&2
    exit 1
  fi

  if [ -z "${ENV_VARS:-}" ]; then
    echo "ENV_VARS is required" >&2
    exit 1
  fi

  write_env_file

  login_to_ghcr_if_needed
  ensure_swarm_manager

  echo "Pulling image $APP_IMAGE"
  docker pull "$APP_IMAGE"

  local app_env_config_name
  app_env_config_name="$(ensure_app_env_config)"

  echo "Deploying stack $STACK_NAME with config $app_env_config_name"
  APP_IMAGE="$APP_IMAGE" APP_ENV_CONFIG_NAME="$app_env_config_name" docker stack deploy \
    --with-registry-auth \
    --compose-file "$STACK_FILE_PATH" \
    "$STACK_NAME"
}

ensure_app_env_config() {
  local config_hash
  local config_name

  config_hash="$(sha256_file "$ENV_FILE_PATH" | cut -c1-12)"
  config_name="${APP_ENV_CONFIG_PREFIX}_${config_hash}"

  if ! docker config inspect "$config_name" >/dev/null 2>&1; then
    docker config create "$config_name" "$ENV_FILE_PATH" >/dev/null
  fi

  printf '%s\n' "$config_name"
}

write_env_file() {
  local previous_umask

  previous_umask="$(umask)"
  umask 077

  if [ -n "$ENV_FILE_PATH" ]; then
    CREATED_ENV_FILE_PATH="$ENV_FILE_PATH"
    printf '%s' "$ENV_VARS" > "$ENV_FILE_PATH"
  else
    CREATED_ENV_FILE_PATH="$(mktemp "${TMPDIR:-/tmp}/loops-staging-env.XXXXXX")"
    ENV_FILE_PATH="$CREATED_ENV_FILE_PATH"
    printf '%s' "$ENV_VARS" > "$ENV_FILE_PATH"
  fi

  umask "$previous_umask"
}

cleanup() {
  if [ -n "$CREATED_ENV_FILE_PATH" ] && [ -f "$CREATED_ENV_FILE_PATH" ]; then
    rm -f "$CREATED_ENV_FILE_PATH"
  fi
}

ensure_swarm_manager() {
  local swarm_state
  swarm_state="$(docker info --format '{{.Swarm.LocalNodeState}}')"

  if [ "$swarm_state" != "active" ]; then
    local advertise_addr
    advertise_addr="$(hostname -I | awk '{print $1}')"

    if [ -z "$advertise_addr" ]; then
      echo "Unable to determine swarm advertise address" >&2
      exit 1
    fi

    echo "Initializing Docker swarm manager on $advertise_addr"
    docker swarm init --advertise-addr "$advertise_addr"
  fi

  if [ "$(docker info --format '{{.Swarm.ControlAvailable}}')" != "true" ]; then
    echo "This node is part of a swarm but is not a manager node" >&2
    exit 1
  fi
}

login_to_ghcr_if_needed() {
  local ghcr_access_token="${GHCR_ACCESS_TOKEN:-${GHCR_TOKEN:-}}"

  if [ -z "${GHCR_USERNAME:-}" ] || [ -z "$ghcr_access_token" ]; then
    return
  fi

  printf '%s' "$ghcr_access_token" | docker login ghcr.io --username "$GHCR_USERNAME" --password-stdin
}

sha256_file() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | awk '{print $1}'
    return
  fi

  shasum -a 256 "$1" | awk '{print $1}'
}

main "$@"
