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

Write mode must not broaden the workspace roots.

Do not auto-approve destructive or broad actions such as delete, move, or bulk replace.

If the current ChatGPT/App does not support mutating MCP actions, remain read-only and report the limitation instead of claiming write access is active.

## Usage

Install dependencies:

```bash
pnpm install
```

Generate this group:

```bash
pnpm generate -- \
  --group chatgpt-integration \
  --tool codex
```

Or migrate it into an existing project:

```bash
pnpm migrate -- \
  --path ../your-project \
  --group chatgpt-integration \
  --tool codex
```

After migration, invoke `local-workspace` and provide the local directories ChatGPT should access.

Default read-only:

```text
Use local-workspace to connect this project to ChatGPT.
Keep it read-only and do not allow file modifications.
```

Explicit read-write:

```text
Use local-workspace to connect this project to ChatGPT.
Enable read-write for this directory, but do not broaden the workspace root.
```

The Skill guides:

```text
filesystem MCP
  → workspace roots
  → read-only / read-write selection
  → tunnel-client
  → Secure MCP Tunnel
  → ChatGPT connection
  → end-to-end read/search verification
  → optional write-tool verification
```

For an existing `local-workspace` profile, adding roots or changing access mode should normally edit the existing profile instead of recreating the tunnel:

```bash
tunnel-client profiles edit local-workspace
```

Then rerun:

```bash
tunnel-client doctor --profile local-workspace --explain
tunnel-client run --profile local-workspace
```

and refresh/rescan tools in ChatGPT.

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
