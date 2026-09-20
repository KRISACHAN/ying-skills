# Secure MCP Tunnel

Use OpenAI Secure MCP Tunnel when an MCP server runs on a developer machine, private network, VM, or another environment that should not expose a public inbound MCP endpoint.

## Preferred Architecture

```text
ChatGPT
   ↓
OpenAI-hosted tunnel endpoint
   ↓
outbound secure connection
   ↓
tunnel-client
   ↓
private/local MCP server
```

The private environment initiates the connection outward.

Do not create a public MCP endpoint merely to make a local/private service reachable from ChatGPT.

## Security Principles

### Least Privilege

Expose only the resources needed for the task.

Prefer explicit roots such as:

```text
/path/to/project-a
/path/to/project-b/docs
```

Never default to broad roots such as:

```text
/
/Users
$HOME
```

### Read-only by Default

For research, analysis, architecture work, and solution design, prefer read-only MCP capabilities.

Mutation should be introduced only when the workflow genuinely requires it.

### Defense in Depth

When practical, combine:

```text
read-only MCP tool surface
+
read-only filesystem/container permissions
```

### Secrets

Never store tunnel Runtime API Keys in Git repositories, Skill source files, generated Skills, or shared documentation.

Use environment variables or an appropriate local secret-management mechanism.

Never echo secret values or include them in completion reports.

### Runtime Credentials

Use a Runtime API Key for the long-running tunnel process.

Do not use an organization Admin API Key as the normal daemon credential.

Typical runtime variables:

```bash
export CONTROL_PLANE_TUNNEL_ID="tunnel_..."
export CONTROL_PLANE_API_KEY="sk-..."
```

### Tunnel Lifecycle

For stdio MCP servers, avoid multiple active `tunnel-client` processes using the same tunnel ID.

Stop the existing process before replacing it.

Use separate tunnels when independent services need independent lifecycle or security boundaries.

## Validation

Before reporting the connection as ready:

```bash
tunnel-client doctor \
  --profile <profile> \
  --explain
```

Then verify an actual harmless MCP read/search operation from ChatGPT.

Configuration success is not equivalent to end-to-end success.

## Official Resources

- Tunnels: https://platform.openai.com/settings/organization/tunnels
- Runtime API Keys: https://platform.openai.com/settings/organization/api-keys
- Secure MCP Tunnel guide: https://developers.openai.com/api/docs/guides/secure-mcp-tunnels
- tunnel-client: https://github.com/openai/tunnel-client
