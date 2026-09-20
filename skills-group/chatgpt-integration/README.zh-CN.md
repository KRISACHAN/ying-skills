[English](./README.md) | **简体中文**

# ChatGPT Integration

面向 ChatGPT 与本地、私有环境集成的通用 Skill Group。

这个 Group 专门负责 **上下文接入与集成层**：

```text
本地代码 / 文档 / 私有服务
           ↓
     MCP / Secure Tunnel
           ↓
        ChatGPT
           +
       Web Search
```

它与 `code-engineering` 的职责明确分离：

- `chatgpt-integration`：解决 ChatGPT 如何安全获得本地或私有上下文；
- `code-engineering`：解决拿到上下文之后，如何分析、设计、Review、重构和实现软件。

## Skills

| Skill | 用途 |
| --- | --- |
| `local-workspace` | 通过只读 Filesystem MCP + OpenAI Secure MCP Tunnel，将本地项目代码和文档接入普通 ChatGPT |

后续可以继续扩展私有 GitLab、内部文档、内部 API、数据库、远程 Workspace 等能力，而无需把这些接入逻辑混入 `code-engineering`。

## Local Workspace

目标架构：

```text
Mac 本地代码 / 文档
       ↓
只读 Filesystem MCP
       ↓
Secure MCP Tunnel
       ↓
普通 ChatGPT
   ↙          ↘
本地上下文    Web Search
   ↘          ↙
    技术方案设计
```

适用于：

- 阅读公司内网 GitLab 已 clone 到本地的代码；
- 将本地项目上下文与公网最新技术资料结合；
- 使用普通 ChatGPT 做调研、架构分析和方案设计；
- 将 Codex 主要保留给代码实现、测试、命令执行和重构；
- 不开放开发机或公司 Git 服务的公网入站访问。

## 用法

安装仓库依赖：

```bash
pnpm install
```

只生成这个 Group：

```bash
pnpm generate -- \
  --group chatgpt-integration \
  --tool codex
```

或者迁移到已有项目：

```bash
pnpm migrate -- \
  --path ../your-project \
  --group chatgpt-integration \
  --tool codex
```

迁移后调用 `local-workspace` Skill，并提供希望 ChatGPT 读取的本地项目目录。

Skill 会依次完成：

```text
Filesystem MCP
  → 配置只读 Workspace Root
  → 安装 / 配置 tunnel-client
  → Secure MCP Tunnel
  → ChatGPT 连接
  → 端到端读取 / 搜索验证
```

配置完成后，可以在普通 ChatGPT 中这样使用：

```text
读取 local-workspace 中登录相关的实现和项目文档。

然后 Web Search 当前 OAuth/OIDC 的官方最新实践。

结合现有实现，给我设计一套迁移方案。

不要修改代码。
```

这样普通 ChatGPT 可以同时利用：

```text
本地私有代码 / 文档
        +
    Web Search
        ↓
  技术方案设计
```

## 安全基线

默认遵守：

- 只读优先；
- 只授权明确指定的项目目录；
- 不暴露整个 Home 目录；
- 不把本地 MCP Server 直接暴露到公网；
- 不把 Runtime API Key 写入代码仓库；
- 保留对 `.env`、私钥、证书等敏感文件的保护；
- 本地 / 私有网络连接优先使用 OpenAI Secure MCP Tunnel。
