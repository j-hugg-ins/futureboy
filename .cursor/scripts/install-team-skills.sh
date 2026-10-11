#!/usr/bin/env bash
set -euo pipefail

# Install Minnow team skills for Cloud Agents.
# 1) Minnow Tools HTTP API (/cursor/skills) — preferred once deployed
# 2) Shallow-clone minnow-core + symlink install — fallback
# See docs/agents/cursor-skills.md
# Never fails the environment install: on any failure it warns and exits 0.

warn_skip() {
  echo "WARN: team skills not installed ($1); continuing without them" >&2
  exit 0
}

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
API_INSTALL="$SCRIPT_DIR/install-team-skills-from-api.mjs"
GIT_INSTALL="${MINNOW_TOOLS_GIT_INSTALL:-/tmp/minnow-tools/scripts/cloud-agent-install-team-skills.sh}"

if [[ -f "$API_INSTALL" ]] && [[ -n "${MINNOW_TOOLS_USER_SECRET:-${MINNOW_TOOLS_SECRET:-}}" ]]; then
  if node "$API_INSTALL"; then
    echo "OK: team skills installed via Minnow Tools API"
    exit 0
  fi
  echo "WARN: API skill install failed — falling back to git clone" >&2
fi

if [[ ! -f "$GIT_INSTALL" ]]; then
  MINNOW_TOOLS_DIR="${MINNOW_TOOLS_DIR:-/tmp/minnow-tools}"
  REPO_URL="${MINNOW_TOOLS_REPO:-https://github.com/minnow-tech/minnow-core.git}"
  BRANCH="${MINNOW_TOOLS_BRANCH:-master}"
  if [[ ! -d "$MINNOW_TOOLS_DIR/.git" ]]; then
    echo "Cloning minnow-core ($BRANCH) for team skills..."
    if [[ -n "${NODE_AUTH_TOKEN:-}" ]]; then
      REPO_URL="https://x-access-token:${NODE_AUTH_TOKEN}@github.com/minnow-tech/minnow-core.git"
    fi
    git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$MINNOW_TOOLS_DIR" \
      || warn_skip "git clone of minnow-core failed"
  fi
  GIT_INSTALL="$MINNOW_TOOLS_DIR/scripts/cloud-agent-install-team-skills.sh"
fi

if [[ ! -f "$GIT_INSTALL" ]]; then
  warn_skip "API failed and git fallback missing"
fi

bash "$GIT_INSTALL" || warn_skip "git fallback install failed"
echo "OK: team skills installed via git fallback"
