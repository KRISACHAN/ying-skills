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
| `local-workspace` | Connect selected local code and documentation to regular ChatGPT through a read-only filesystem MCP server and OpenAI Secure MCP Tunnel |

Future Skills can cover private GitLab, internal documentation, internal APIs, databases, or remote workspaces without mixing those concerns into the engineering workflow.

## Local Workspace

Target architecture:

```text
Local code / documentation
          ↓
read-only filesystem MCP
          ↓
Secure MCP Tunnel
          ↓
regular ChatGPT
     ↙           ↘
local context   Web Search
     ↘           ↙
      solution design
```

Typical use cases:

- inspect code cloned from an internal-only GitLab;
- combine private project context with current public technical research;
- use regular ChatGPT for research, architecture analysis, and solution design;
- keep Codex focused on implementation, testing, command execution, and refactoring;
- avoid exposing the development machine or private Git service through a public inbound endpoint.

## Usage

Install dependencies:

```bash
pnpm install
```

Generate this group for one supported AI tool:

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

After migration, invoke the `local-workspace` Skill and provide the local project directory you want ChatGPT to read.

The Skill will guide the environment through:

```text
filesystem MCP
  → read-only workspace roots
  → tunnel-client
  → Secure MCP Tunnel
  → ChatGPT connection
  → end-to-end read/search verification
```

After setup, a typical ChatGPT request is:

```text
Read the authentication implementation and project documentation from the
local workspace.

Then use Web Search to research the current official OAuth/OIDC guidance.

Compare it with the existing implementation and design a migration plan.

Do not modify code.
```

## Security Baseline

- read-only by default;
- expose only explicit workspace roots;
- never expose the entire home directory;
- do not expose the local MCP server directly to the public internet;
- never commit Runtime API Keys;
- preserve protections around `.env`, private keys, certificates, and other secrets;
- prefer OpenAI Secure MCP Tunnel for local/private connectivity.
