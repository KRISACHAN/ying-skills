#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SOURCE_SKILLS="$ROOT/.agents/skills"
SOURCE_REFS="$ROOT/.agents/references"

if [[ ! -d "$SOURCE_SKILLS" || ! -d "$SOURCE_REFS" ]]; then
  echo "[code-engineering] expected .agents/skills and .agents/references under project root" >&2
  exit 1
fi

if [[ $# -eq 0 ]]; then
  set -- claude kiro
fi

sync_target() {
  local name="$1"
  local base

  case "$name" in
    claude)
      base="$ROOT/.claude"
      ;;
    kiro)
      base="$ROOT/.kiro"
      ;;
    *)
      echo "[code-engineering] unsupported compatibility target: $name" >&2
      echo "supported: claude, kiro" >&2
      exit 2
      ;;
  esac

  mkdir -p "$base/skills" "$base/references"
  cp -R "$SOURCE_SKILLS/." "$base/skills/"
  cp -R "$SOURCE_REFS/." "$base/references/"
  echo "[code-engineering] synced $name -> ${base#$ROOT/}/skills + references"
}

for target in "$@"; do
  sync_target "$target"
done
