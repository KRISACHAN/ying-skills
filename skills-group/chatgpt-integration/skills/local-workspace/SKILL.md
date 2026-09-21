---
name: local-workspace
description: Connect local macOS code and documentation to regular ChatGPT conversations through a filesystem MCP server and OpenAI Secure MCP Tunnel. Default to read-only access for research and solution design; switch to read-write only when the user explicitly requests it and the current ChatGPT/App supports mutating MCP actions.
---

# Local Workspace

Connect selected local project directories to regular ChatGPT conversations through a filesystem MCP server and OpenAI Secure MCP Tunnel.

Read first:

- `../../references/secure-mcp-tunnel.md`

Target workflow:

```text
Local Git repository / docs
        ↓
filesystem MCP
(read-only by default,
 optional read-write)
        ↓
OpenAI Secure MCP Tunnel
        ↓
regular ChatGPT conversation
      ↙             ↘
local context     Web Search
      ↘             ↙
 research / design / optional edits
```

This Skill configures workspace access. Default to read-only. Never enable write access unless the user explicitly asks for it.

## Goals

The resulting environment should allow ChatGPT to:

- inspect local source files;
- search local code and documentation;
- combine local context with Web Search;
- perform technical research and architecture analysis;
- design implementation or migration solutions;
- optionally modify files inside explicitly authorized roots when write mode is explicitly enabled and supported by the current client.

## Access Modes

### Read-only — default

Use read-only for research, analysis, review, architecture work, and solution design.

Start `filesystem-mcp` with:

```text
--read-only
```

Expected capabilities include:

```text
list_roots
list
find_files
stat
search_text
diff
read
```

Mutating tools must not be exposed in this mode:

```text
create
edit
move
delete
patch
replace_text
```

### Read-write — explicit opt-in

Enable write access only when the user explicitly asks ChatGPT to modify local files.

For read-write mode, remove `--read-only` from the filesystem MCP command.

Expected additional tools can include:

```text
create
edit
move
delete
patch
replace_text
```

Enabling write access must **not** broaden the workspace roots.

If the current ChatGPT/App does not support or permit mutating MCP actions, report that limitation and keep the connection read-only. Do not claim write access is working unless the write tools are actually discoverable.

## Preferred Components

Use:

- `@j0hanz/filesystem-mcp` as the local filesystem MCP server;
- `--read-only` by default;
- explicit allowed workspace roots;
- OpenAI `tunnel-client` for Secure MCP Tunnel;
- Homebrew for `tunnel-client` installation on macOS.

Do not expose a local MCP HTTP endpoint directly to the public internet.

Do not introduce GitLab API integration when the required repository is already available in the local checkout.

## Safety Requirements

Always preserve these constraints:

1. Default to read-only access.
2. Enable read-write only after an explicit user request.
3. Never silently broaden workspace roots when enabling write access.
4. Never expose the entire home directory.
5. Only expose explicitly selected project/document directories.
6. Never expose `/`, `/Users`, `$HOME`, or another broad parent directory as a workspace root.
7. Never commit API keys, tunnel credentials, `.env` files, private keys, or generated secret configuration.
8. Never print secret values back to the user.
9. Preserve the filesystem MCP built-in sensitive-file denylist.
10. Do not use `--allow-sensitive` unless the user explicitly requests it and understands the implications.
11. Prefer additional deny rules for repository-specific secrets.
12. When write mode is enabled, do not auto-approve destructive or broad operations such as recursive delete, move, or bulk replacement. Require user confirmation when the client supports action approvals.
13. Do not treat access mode as permission to modify unrelated files. Write only what the user requested inside authorized roots.

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

### 2. Establish Workspace Roots

Obtain the exact project/document directories from the user or current workspace context.

Resolve and validate every root:

```bash
PROJECT_DIR="$(cd "/path/to/project" && pwd)"
test -d "$PROJECT_DIR"
```

For multiple repositories or documentation directories, configure every allowed root explicitly.

Never silently broaden access to a parent directory.

### 3. Determine Access Mode

Default:

```text
read-only
```

Switch to:

```text
read-write
```

only if the user explicitly asks to allow ChatGPT to create or modify files.

If the request is ambiguous, remain read-only.

### 4. Ensure Node.js Compatibility

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

### 5. Validate Filesystem MCP

Confirm the package can run:

```bash
"$NPX" -y @j0hanz/filesystem-mcp@latest --help
```

Read-only:

```bash
"$NPX" -y @j0hanz/filesystem-mcp@latest \
  --read-only \
  "$PROJECT_DIR"
```

Read-write:

```bash
"$NPX" -y @j0hanz/filesystem-mcp@latest \
  "$PROJECT_DIR"
```

For repositories needing additional protection, keep explicit deny patterns in either mode:

```text
--deny "**/.env*"
--deny "**/*.pem"
--deny "**/*.key"
```

In read-only mode, seeing a mutating tool is a configuration failure.

In read-write mode, missing mutating tools means write access is not yet available; check the MCP command and the current ChatGPT/App capability before proceeding.

### 6. Install Secure MCP Tunnel

On macOS:

```bash
brew install openai/tools/tunnel-client

tunnel-client --version
tunnel-client help quickstart
```

Do not bypass macOS Gatekeeper with `xattr`, `spctl`, or similar workarounds when the supported Homebrew installation is available.

### 7. Obtain Tunnel Credentials

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

### 8. Create or Update the Tunnel Profile

Resolve absolute paths:

```bash
PROJECT_DIR="$(cd "/path/to/project" && pwd)"
NPX="$(brew --prefix node@24)/bin/npx"
```

For read-only:

```bash
MCP_COMMAND="$NPX -y @j0hanz/filesystem-mcp@latest --read-only $PROJECT_DIR"
```

For read-write:

```bash
MCP_COMMAND="$NPX -y @j0hanz/filesystem-mcp@latest $PROJECT_DIR"
```

For multiple roots, append each absolute root explicitly to the MCP command.

For a new profile:

```bash
tunnel-client init \
  --sample sample_mcp_stdio_local \
  --profile local-workspace \
  --tunnel-id "$CONTROL_PLANE_TUNNEL_ID" \
  --mcp-command "$MCP_COMMAND"
```

If `local-workspace` already exists, inspect/edit the existing profile instead of blindly replacing it:

```bash
tunnel-client profiles edit local-workspace
```

Use the same approach when adding another workspace root or switching between read-only and read-write modes.

### 9. Validate

Run:

```bash
tunnel-client doctor \
  --profile local-workspace \
  --explain
```

Do not report success while diagnostics fail.

### 10. Start

For interactive local use:

```bash
tunnel-client run \
  --profile local-workspace
```

Keep the process running while ChatGPT uses the connection.

For stdio MCP deployments, only one active `tunnel-client` process may use a tunnel ID.

### 11. Connect Regular ChatGPT

After the tunnel is healthy:

1. Open ChatGPT Settings.
2. Enable Developer Mode where required.
3. Create or refresh the MCP/App connection.
4. Select the Secure MCP Tunnel.
5. Scan/refresh the exposed tools.
6. Verify the tool surface matches the selected access mode.

For read-only mode, mutating tools must be absent.

For read-write mode, mutating tools must actually be discoverable before reporting write access as enabled.

When write tools appear, keep destructive/broad actions behind explicit approval where the ChatGPT/App action policy supports it.

### 12. Verify End-to-End

Always verify reading first:

```text
Use the local workspace connection.

List the workspace roots, read package.json, and explain what kind of
project this is.

Do not modify any files.
```

Then verify search:

```text
Search the local workspace for authentication-related code and summarize
the relevant modules.

Do not modify any files.
```

For read-write mode, do not modify existing project files merely to test the connection. Confirm that write tools are discoverable. If the user explicitly wants an end-to-end write test, use a user-approved temporary/scratch file inside an authorized root.

## Recommended Usage

Read-only research:

```text
Read the authentication implementation and project documentation from the
local workspace.

Then use Web Search to research the current official OAuth/OIDC and
framework recommendations.

Compare those recommendations with the existing implementation and design
a migration plan.

Do not modify code.
```

Explicit write task:

```text
Use local-workspace in write mode.

Update only docs/auth-migration.md according to the agreed migration plan.
Do not modify source code or any other file.
```

Recommended responsibility split remains:

```text
ChatGPT
  → Web research
  → local code/document analysis
  → architecture and solution design
  → optional targeted file edits when write mode is explicitly enabled

Codex
  → implementation-heavy coding
  → tests
  → command execution
  → refactoring

Git / private GitLab
  → source control
  → merge requests
  → CI/CD
```

## Optional Hardening

For read-only defense in depth:

```bash
docker run -i --rm \
  -v "$PROJECT_DIR:/workspace:ro" \
  ghcr.io/j0hanz/filesystem-mcp:latest \
  --read-only \
  /workspace
```

For read-write mode, the filesystem/container mount must also permit writes. Keep the mount restricted to the same explicit workspace root; do not widen it merely to make write mode work.

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

If write tools are visible in read-only mode, ensure the MCP command contains `--read-only`.

If write tools are missing in read-write mode:

1. confirm `--read-only` has been removed;
2. confirm any Docker/filesystem mount is writable;
3. restart `tunnel-client`;
4. refresh/rescan tools in ChatGPT;
5. confirm the current ChatGPT/App supports mutating MCP actions.

## Completion Report

At completion report:

- workspace root(s) exposed;
- filesystem MCP implementation;
- access mode: read-only or read-write;
- tunnel profile name;
- `tunnel-client doctor` result;
- discovered tool surface matches the selected mode;
- ChatGPT read/search verification result;
- any remaining manual steps.

Never include API keys or other secret values.
