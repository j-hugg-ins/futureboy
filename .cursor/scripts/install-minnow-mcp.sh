#!/usr/bin/env bash
set -euo pipefail

# Cloud Agent boot — install @minnow-tech/minnow-tools-mcp from GitHub Packages.
# Requires NODE_AUTH_TOKEN + network access to npm.pkg.github.com — see minnow-tools docs/cloud-agents.md.
# Uses ~/.local prefix — pair with start PATH export in .cursor/environment.json.

NPM_GLOBAL="${HOME}/.local"
PACKAGE="@minnow-tech/minnow-tools-mcp@latest"
REGISTRY="https://npm.pkg.github.com"

if [[ -z "${NODE_AUTH_TOKEN:-}" ]]; then
  echo "ERROR: NODE_AUTH_TOKEN not set." >&2
  echo "Add a team Runtime secret (classic GitHub PAT with read:packages)." >&2
  exit 1
fi

mkdir -p "${HOME}/.npm" "${NPM_GLOBAL}/bin"
printf '@minnow-tech:registry=%s\n//npm.pkg.github.com/:_authToken=%s\n' "$REGISTRY" "$NODE_AUTH_TOKEN" > "${HOME}/.npmrc"
echo "Installing Minnow MCP from GitHub Packages..."
npm install -g --prefix "${NPM_GLOBAL}" "${PACKAGE}"
echo "Global npm prefix: ${NPM_GLOBAL} (bin: ${NPM_GLOBAL}/bin)"

BIN="${NPM_GLOBAL}/bin/minnow-tools-mcp"
if [[ ! -x "${BIN}" ]]; then
  echo "ERROR: minnow-tools-mcp not found at ${BIN}" >&2
  exit 1
fi
echo "OK: minnow-tools-mcp installed at ${BIN}"
