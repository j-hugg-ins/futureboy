#!/usr/bin/env node
/**
 * Install Minnow team skills from the deployed Minnow Tools /cursor/skills API.
 * Used by Cloud Agent environment install (before MCP session starts).
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const baseUrl = (process.env.MINNOW_TOOLS_BASE_URL || 'https://europe-west2-minnow-tech.cloudfunctions.net/tools').replace(
  /\/+$/,
  ''
);
const secret = process.env.MINNOW_TOOLS_USER_SECRET?.trim() || process.env.MINNOW_TOOLS_SECRET?.trim();
const dest = process.env.MINNOW_SKILLS_DEST || path.join(os.homedir(), '.cursor', 'skills');

if (!secret) {
  console.error('MINNOW_TOOLS_USER_SECRET or MINNOW_TOOLS_SECRET is required for API skill install');
  process.exit(1);
}

async function fetchJson(urlPath) {
  const res = await fetch(`${baseUrl}${urlPath}`, {
    headers: {
      Accept: 'application/json',
      'X-KEY': secret,
    },
    signal: AbortSignal.timeout(120_000),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${urlPath} failed: HTTP ${res.status} ${text.slice(0, 200)}`);
  }
  return JSON.parse(text);
}

const manifest = await fetchJson('/cursor/skills/manifest');
const names = (manifest.skills ?? []).map((entry) => (typeof entry === 'string' ? entry : entry.name));
if (!names.length) {
  throw new Error('manifest returned no skills');
}

fs.mkdirSync(dest, { recursive: true });

let installed = 0;
for (const name of names) {
  const payload = await fetchJson(`/cursor/skills/${encodeURIComponent(name)}`);
  if (!payload.markdown) {
    throw new Error(`skill ${name} missing markdown`);
  }
  const targetDir = path.join(dest, name);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'SKILL.md'), payload.markdown, 'utf8');
  installed += 1;
}

console.log(`Installed ${installed} team skills to ${dest}`);
