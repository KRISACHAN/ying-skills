---
name: local-workspace
description: Connect local macOS code and documentation to regular ChatGPT conversations through a read-only filesystem MCP server and OpenAI Secure MCP Tunnel. Use when the user wants ChatGPT Web Search and private local project context together for research, architecture analysis, or solution design without using Codex/Work for the analysis step.
---

# Local Workspace

Connect selected local project directories to regular ChatGPT conversations through a read-only MCP server and OpenAI Secure MCP Tunnel.

Read first:

- `../../references/secure-mcp-tunnel.md`

Target workflow:

```text
Local Git repository / docs
        ↓
read-only filesystem MCP
        ↓
OpenAI Secure MCP Tunnel
        ↓
regular ChatGPT conversation
      ↙             ↘
local context     Web Search
      ↘             ↙
     solution design
```

This Skill configures access only. Do not modify the target project's source code.

## Goals

The resulting environment should allow ChatGPT to:

- inspect local source files;
- search local code and documentation;
- combine local context with Web Search;
- perform technical research and architecture analysis;
- design implementation or migration solutions;
- use regular ChatGPT conversations for analysis instead of requiring Codex/Work.

Local workspace access must remain read-only.

## Preferred Components

Use:

- `@j0hanz/filesystem-mcp` as the local filesystem MCP server;
- `--read-only` to remove mutating MCP tools;
- explicitly selected workspace roots;
- OpenAI `tunnel-client` for Secure MCP Tunnel;
- Homebrew for `tunnel-client` installation on macOS.

Do not expose a local MCP HTTP endpoint directly to the public internet.

Do not introduce GitLab API integration when the required repository is already available in the local checkout.

## Safety Requirements

Always preserve these constraints:

1. Local workspace access is read-only.
2. Never expose the entire home directory.
3. Only expose explicitly selected project/document directories.
4. Never expose `/`, `/Users`, `$HOME`, or another broad parent directory as a workspace root.
5. Never commit API keys, tunnel credentials, `.env` files, private keys, or generated secret configuration.
6. Never print secret values back to the user.
7. Preserve the filesystem MCP built-in sensitive-file denylist.
8. Do not use `--allow-sensitive` unless the user explicitly requests it and understands the implications.
9. Prefer additional deny rules for repository-specific secrets.
10. Do not modify project source files as part of this Skill.

## Workflow

### 1. Inspect Existing Environment

Before installing anything:

```bash
uname -m
sw_vers
command -v brew || true
command -v node || true
command -v npx || true
command -v tunnel-client || true
node -v 2>/dev/null || true
tunnel-client --version 2>/dev/null || true
```

Reuse valid existing installations. Do not reinstall tools unnecessarily.

Do not assume a fixed Homebrew path; resolve it with `brew --prefix`.

### 2. Establish Workspace Root

Obtain the exact project directory from the user or current workspace context.

Resolve and validate it:

```bash
PROJECT_DIR="$(cd "/path/to/project" && pwd)"
test -d "$PROJECT_DIR"
```

For multiple repositories or document directories, configure every allowed root explicitly.

Never silently broaden access to a parent directory.

### 3. Ensure Node.js Compatibility

Check:

```bash
node -v
```

`@j0hanz/filesystem-mcp` currently requires Node.js 24 or newer.

If needed:

```bash
brew install node@24

NODE_PREFIX="$(brew --prefix node@24)"
NODE="$NODE_PREFIX/bin/node"
NPX="$NODE_PREFIX/bin/npx"

"$NODE" -v
"$NPX" -v
```

Do not replace the user's default Node.js installation unless necessary.

### 4. Validate Filesystem MCP

Confirm the package can run:

```bash
"$NPX" -y @j0hanz/filesystem-mcp@latest --help
```

Run it with read-only access:

```bash
"$NPX" -y @j0hanz/filesystem-mcp@latest \
  --read-only \
  "$PROJECT_DIR"
```

For repositories needing additional protection:

```text
--deny "**/.env*"
--deny "**/*.pem"
--deny "**/*.key"
```

Expected read-only capabilities include:

```text
list_roots
list
find_files
stat
search_text
diff
read
```

Mutating tools must not be exposed:

```text
create
edit
move
delete
patch
replace_text
```

If they appear, stop and correct the MCP configuration.

### 5. Install Secure MCP Tunnel

On macOS:

```bash
brew install openai/tools/tunnel-client

tunnel-client --version
tunnel-client help quickstart
```

Do not bypass macOS Gatekeeper with `xattr`, `spctl`, or similar workarounds when the supported Homebrew installation is available.

### 6. Obtain Tunnel Credentials

Create/select a tunnel:

```text
https://platform.openai.com/settings/organization/tunnels
```

Create a Runtime API Key:

```text
https://platform.openai.com/settings/organization/api-keys
```

Expected environment:

```bash
export CONTROL_PLANE_TUNNEL_ID="tunnel_..."
export CONTROL_PLANE_API_KEY="sk-..."
```

The Runtime API Key is for the local tunnel daemon.

Do not use an organization Admin API Key as the long-lived runtime credential.

Do not save the Runtime API Key inside the target repository.

If these values are unavailable, stop automatic setup here and tell the user exactly what needs to be created.

### 7. Create the Tunnel Profile

Resolve absolute paths:

```bash
PROJECT_DIR="$(cd "/path/to/project" && pwd)"
NPX="$(brew --prefix node@24)/bin/npx"

MCP_COMMAND="$NPX -y @j0hanz/filesystem-mcp@latest --read-only $PROJECT_DIR"
```

Initialize:

```bash
tunnel-client init \
  --sample sample_mcp_stdio_local \
  --profile local-workspace \
  --tunnel-id "$CONTROL_PLANE_TUNNEL_ID" \
  --mcp-command "$MCP_COMMAND"
```

If the profile already exists, inspect and reuse it rather than blindly overwriting it.

### 8. Validate

Run:

```bash
tunnel-client doctor \
  --profile local-workspace \
  --explain
```

Do not report success while diagnostics fail.

### 9. Start

For interactive local use:

```bash
tunnel-client run \
  --profile local-workspace
```

Keep the process running while ChatGPT uses the connection.

For stdio MCP deployments, only one active `tunnel-client` process may use a tunnel ID.

### 10. Connect Regular ChatGPT

After the tunnel is healthy:

1. Open ChatGPT Settings.
2. Enable Developer Mode where required.
3. Create an MCP/App connection.
4. Select the Secure MCP Tunnel.
5. Allow ChatGPT to discover the tools.
6. Confirm only read-only filesystem tools are available.

Do not switch to Codex or Work solely for research or solution design when the goal is to use regular ChatGPT conversations.

### 11. Verify End-to-End

Test reading:

```text
Use the local workspace connection.

List the workspace roots, read package.json, and explain what kind of
project this is.

Do not modify any files.
```

Then test search:

```text
Search the local workspace for authentication-related code and summarize
the relevant modules.

Do not modify any files.
```

Setup is complete only after ChatGPT can successfully perform both.

## Recommended Usage

Example:

```text
Read the authentication implementation and project documentation from the
local workspace.

Then use Web Search to research the current official OAuth/OIDC and
framework recommendations.

Compare those recommendations with the existing implementation and design
a migration plan.

Do not modify code.
```

Recommended responsibility split:

```text
ChatGPT
  → Web research
  → local code/document analysis
  → architecture and solution design

Codex
  → implementation
  → tests
  → command execution
  → refactoring

Git / private GitLab
  → source control
  → merge requests
  → CI/CD
```

## Optional Hardening

For defense in depth, run filesystem MCP in Docker and mount the project read-only:

```bash
docker run -i --rm \
  -v "$PROJECT_DIR:/workspace:ro" \
  ghcr.io/j0hanz/filesystem-mcp:latest \
  --read-only \
  /workspace
```

This combines OS-level read-only access with a read-only MCP tool surface.

Do not require Docker for the initial setup unless stronger isolation is desired.

## Troubleshooting

If filesystem MCP fails:

```bash
node -v
"$NPX" -y @j0hanz/filesystem-mcp@latest --help
```

If tunnel diagnostics fail:

```bash
tunnel-client doctor \
  --profile local-workspace \
  --explain
```

Check:

- Runtime API Key;
- tunnel ID;
- organization tunnel permissions;
- outbound HTTPS connectivity;
- MCP child-process startup.

If ChatGPT cannot discover tools, confirm the daemon is running:

```bash
tunnel-client run --profile local-workspace
```

If write tools are visible, treat it as a configuration failure and verify the MCP command includes `--read-only`.

## Completion Report

At completion report:

- workspace root(s) exposed;
- filesystem MCP implementation;
- read-only status;
- tunnel profile name;
- `tunnel-client doctor` result;
- ChatGPT read/search verification result;
- remaining manual steps.

Never include API keys or other secret values.
