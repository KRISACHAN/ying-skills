**English** | [简体中文](./README.zh-CN.md)

# ChatGPT Integration

Reusable Skills for connecting ChatGPT with local and private environments.

This group owns the **context-access and integration layer**:

```text
Local code / docs / private services
               ↓
        MCP / Secure Tunnel
               ↓
             ChatGPT
               +
           Web Search
```

It is intentionally separate from `code-engineering`:

- `chatgpt-integration` defines how ChatGPT securely obtains private/local context;
- `code-engineering` defines how AI analyzes, designs, reviews, refactors, and implements software after context is available.

## Skills

| Skill | Purpose |
| --- | --- |
| `local-workspace` | Connect selected local code and documentation to regular ChatGPT through filesystem MCP + OpenAI Secure MCP Tunnel; read-only by default, optional explicit read-write |

Future Skills can cover private GitLab, internal documentation, internal APIs, databases, or remote workspaces without mixing those concerns into the engineering workflow.

## Local Workspace

Target architecture:

```text
Local code / documentation
          ↓
filesystem MCP
read-only by default
optional read-write
          ↓
Secure MCP Tunnel
          ↓
regular ChatGPT
     ↙           ↘
local context   Web Search
     ↘           ↙
research / design / optional edits
```

Typical use cases:

- inspect code cloned from an internal-only GitLab;
- combine private project context with current public technical research;
- use regular ChatGPT for research, architecture analysis, and solution design;
- explicitly allow limited file edits inside authorized roots when needed;
- avoid exposing the development machine or private Git service through a public inbound endpoint.

---

# End-to-end Setup Tutorial

The following walkthrough goes from cloning `ying-skills` to a working ChatGPT local workspace connection.

## 1. Prerequisites

Current `local-workspace` instructions are optimized for macOS.

You need:

- Git
- Homebrew
- Node.js 24+
- pnpm
- a local project or documentation directory that ChatGPT should access
- ChatGPT with Developer Mode available
- access to OpenAI Platform Tunnels and Runtime API Keys

Check the environment:

```bash
git --version
brew --version
node -v
pnpm -v
```

If Node.js 24 or pnpm is missing:

```bash
brew install node@24 pnpm

export PATH="$(brew --prefix node@24)/bin:$PATH"

node -v
pnpm -v
```

## 2. Clone `ying-skills`

```bash
git clone -b prod --single-branch \
  https://github.com/KRISACHAN/ying-skills.git

cd ying-skills

pnpm install
```

## 3. Install `local-workspace` into a Project

Assume the target project is:

```text
~/Desktop/gitlab/my-project
```

### Codex

```bash
pnpm migrate -- \
  --path ~/Desktop/gitlab/my-project \
  --group chatgpt-integration \
  --tool codex
```

This installs the Skill under:

```text
my-project/
└── .agents/
    └── skills/
        └── local-workspace/
```

### Cursor

```bash
pnpm migrate -- \
  --path ~/Desktop/gitlab/my-project \
  --group chatgpt-integration \
  --tool cursor
```

This installs the Skill under:

```text
my-project/
└── .cursor/
    └── skills/
        └── local-workspace/
```

### Codex + Cursor

```bash
pnpm migrate -- \
  --path ~/Desktop/gitlab/my-project \
  --group chatgpt-integration \
  --tool codex \
  --tool cursor
```

## 4. Run the Skill in Codex or Cursor

Open the target project in Codex or Cursor and explicitly invoke `local-workspace`.

Example instruction:

```text
Use local-workspace to connect this project to regular ChatGPT.

Keep it read-only.
Complete every step you can automatically.
Only stop when I need to create or confirm something in the OpenAI web UI.
```

The Skill will inspect the local environment, prepare filesystem MCP, install/configure `tunnel-client`, and guide the remaining OpenAI-side steps.

You can also complete the following steps manually.

## 5. Install the Required Local Tools

Install OpenAI Secure MCP Tunnel client:

```bash
brew install openai/tools/tunnel-client

tunnel-client --version
tunnel-client help quickstart
```

Verify filesystem MCP:

```bash
NPX="$(brew --prefix node@24)/bin/npx"

"$NPX" -y @j0hanz/filesystem-mcp@latest --help
```

## 6. Create an OpenAI Tunnel and Runtime API Key

Create or select a Tunnel:

```text
https://platform.openai.com/settings/organization/tunnels
```

Example:

```text
Name: local-workspace
Description: local development workspace
```

Copy the resulting Tunnel ID:

```text
tunnel_...
```

Create a Runtime API Key:

```text
https://platform.openai.com/settings/organization/api-keys
```

Export both values in the terminal:

```bash
export CONTROL_PLANE_TUNNEL_ID="tunnel_..."
export CONTROL_PLANE_API_KEY="sk-..."
```

Do not save the Runtime API Key in the target repository.

## 7. Configure the Workspace

Assume the project is:

```text
~/Desktop/gitlab/my-project
```

Resolve the absolute path:

```bash
export PROJECT_DIR="$(cd ~/Desktop/gitlab/my-project && pwd)"
export NPX="$(brew --prefix node@24)/bin/npx"
```

### Default read-only mode

```bash
export MCP_COMMAND="$NPX -y @j0hanz/filesystem-mcp@latest --read-only $PROJECT_DIR"
```

Initialize the profile:

```bash
tunnel-client init \
  --sample sample_mcp_stdio_local \
  --profile local-workspace \
  --tunnel-id "$CONTROL_PLANE_TUNNEL_ID" \
  --mcp-command "$MCP_COMMAND"
```

If `local-workspace` already exists, edit it instead:

```bash
tunnel-client profiles edit local-workspace
```

## 8. Validate and Start the Tunnel

Validate:

```bash
tunnel-client doctor \
  --profile local-workspace \
  --explain
```

Do not continue until the important checks pass.

Start the tunnel:

```bash
tunnel-client run \
  --profile local-workspace
```

Keep this terminal running while ChatGPT uses the workspace.

A healthy connection should show the Tunnel as started and list the allowed directories.

## 9. Enable Developer Mode in ChatGPT

In ChatGPT, enable Developer Mode.

Typical UI path:

```text
Settings
→ Developer Mode
→ Enable Developer Mode
```

In the Chinese UI this appears as:

```text
设置
→ 开发人员模式
→ 开启「开发人员模式」
```

The exact placement can change as the ChatGPT UI evolves.

## 10. Create the ChatGPT Plugin / App

Open the Plugins area in ChatGPT and create a new developer connection.

Typical flow:

```text
Plugins
→ +
→ Create
```

Choose:

```text
Connection: Tunnel
Tunnel: your tunnel_...
Authentication: No authentication
```

Then scan/refresh the available tools.

For read-only mode, expected tools include:

```text
list_roots
list
find_files
stat
search_text
diff
read
```

These write tools should be absent:

```text
create
edit
move
delete
patch
replace_text
```

Create the App/Plugin after the tool list looks correct.

## 11. Test the Connection

### Test 1: list roots

```text
Use Local Workspace.

List all workspace roots you can currently access.
Do not modify any files.
```

### Test 2: read a file

```text
Use Local Workspace.

Read package.json from the project root and tell me the main framework,
package manager, and project type.

Do not modify any files.
```

### Test 3: search the project

```text
Use Local Workspace.

Search the project for login, auth, and OAuth-related code and documents.
Summarize the main files and modules involved.

Do not modify any files.
```

### Test 4: combine local context with Web Search

```text
Use Local Workspace to inspect the current authentication implementation
and project documentation.

Then use Web Search to research the latest official OAuth/OIDC guidance.

Compare the current implementation with the current guidance and design
a migration plan.

Do not modify code.
```

At this point the full workflow is working:

```text
private/local code
      +
   Web Search
      ↓
regular ChatGPT
      ↓
research / architecture / solution design
```

---

## Multiple Workspace Roots

One `local-workspace` connection can expose multiple explicitly allowed directories.

Edit the existing profile:

```bash
tunnel-client profiles edit local-workspace
```

The filesystem MCP command can contain multiple roots:

```text
npx -y @j0hanz/filesystem-mcp@latest --read-only \
  /absolute/path/project-a \
  /absolute/path/project-b \
  /absolute/path/docs
```

Then restart:

```bash
tunnel-client doctor --profile local-workspace --explain
tunnel-client run --profile local-workspace
```

Ask ChatGPT to list roots again to confirm the new directory is available.

Never expose `/`, `/Users`, or the complete home directory just for convenience.

## Access Modes

### Default: read-only

Unless the user explicitly asks for writes, `local-workspace` starts `filesystem-mcp` with:

```text
--read-only
```

Only read/search/list/diff-style capabilities should be exposed.

### Optional: read-write

Only after an explicit user request, remove:

```text
--read-only
```

For example, edit the existing profile:

```bash
tunnel-client profiles edit local-workspace
```

Change:

```text
npx -y @j0hanz/filesystem-mcp@latest --read-only /path/to/project
```

to:

```text
npx -y @j0hanz/filesystem-mcp@latest /path/to/project
```

Restart the tunnel and rescan tools in ChatGPT.

Expected additional tools can include:

```text
create
edit
move
delete
patch
replace_text
```

Write mode must not broaden the workspace roots.

Do not auto-approve destructive or broad actions such as delete, move, or bulk replace.

If the current ChatGPT/App does not support mutating MCP actions, remain read-only instead of claiming write access is active.

## Common Problems

### ChatGPT reports that the MCP server does not implement OAuth

Create the connection with:

```text
Authentication: No authentication
```

The local filesystem MCP server itself does not need OAuth when reached through Secure MCP Tunnel.

### ChatGPT cannot create the connector

Confirm the local tunnel is still running and check:

```bash
tunnel-client doctor --profile local-workspace --explain
```

Then retry connector creation while `tunnel-client run --profile local-workspace` is active.

### ChatGPT cannot see a newly added directory

Edit the existing profile, restart the tunnel, then refresh/rescan tools in ChatGPT.

### Write tools do not appear after enabling write mode

Check that:

1. `--read-only` was actually removed;
2. any Docker/filesystem mount is writable;
3. `tunnel-client` was restarted;
4. the ChatGPT App/Plugin rescanned its tools;
5. the current ChatGPT/App supports mutating MCP actions.

## Security Baseline

- read-only by default;
- write access requires explicit user opt-in;
- enabling write must not broaden workspace roots;
- expose only explicit workspace roots;
- never expose the entire home directory;
- do not expose the local MCP server directly to the public internet;
- never commit Runtime API Keys;
- preserve protections around `.env`, private keys, certificates, and other secrets;
- do not auto-approve destructive/broad write actions;
- prefer OpenAI Secure MCP Tunnel for local/private connectivity.
