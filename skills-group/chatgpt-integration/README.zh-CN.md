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
| `local-workspace` | 通过 Filesystem MCP + OpenAI Secure MCP Tunnel 将本地项目代码和文档接入普通 ChatGPT；默认只读，可按需显式开启读写 |

后续可以继续扩展私有 GitLab、内部文档、内部 API、数据库、远程 Workspace 等能力，而无需把这些接入逻辑混入 `code-engineering`。

## Local Workspace

目标架构：

```text
Mac 本地代码 / 文档
       ↓
Filesystem MCP
默认只读 / 可选读写
       ↓
Secure MCP Tunnel
       ↓
普通 ChatGPT
   ↙          ↘
本地上下文    Web Search
   ↘          ↙
调研 / 方案设计 / 可选文件修改
```

适用于：

- 阅读公司内网 GitLab 已 clone 到本地的代码；
- 将本地项目上下文与公网最新技术资料结合；
- 使用普通 ChatGPT 做调研、架构分析和方案设计；
- 用户明确需要时，让 ChatGPT 对授权目录执行有限的文件修改；
- 不开放开发机或公司 Git 服务的公网入站访问。

## 权限模式

### 默认：只读

如果用户没有明确要求写入，`local-workspace` 使用：

```text
--read-only
```

只暴露读取、搜索、目录浏览、diff 等能力。

### 可选：读写

只有用户明确要求“允许 ChatGPT 修改本地文件”时，才移除：

```text
--read-only
```

读写模式不会扩大目录范围，仍然只能访问明确授权的 Workspace Roots。

即使开启读写，也不应自动批准删除、移动、批量替换等高风险操作。

如果当前 ChatGPT / App 不支持写入型 MCP Action，应保持只读并明确说明，不要假装写权限已经生效。

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

迁移后调用 `local-workspace` Skill，并提供希望 ChatGPT 访问的本地目录。

默认只读：

```text
使用 local-workspace，把当前项目接入 ChatGPT。
默认只读，不允许修改任何文件。
```

显式开启读写：

```text
使用 local-workspace，把当前项目接入 ChatGPT。
为这个目录开启读写模式，但不要扩大 Workspace Root。
```

Skill 会依次完成：

```text
Filesystem MCP
  → 配置 Workspace Roots
  → 选择只读 / 读写模式
  → 安装 / 配置 tunnel-client
  → Secure MCP Tunnel
  → ChatGPT 连接
  → 端到端读取 / 搜索验证
  → 按需验证写工具是否可用
```

已有 `local-workspace` 配置需要新增目录或切换权限模式时，不需要重建 Tunnel，优先编辑现有 profile：

```bash
tunnel-client profiles edit local-workspace
```

修改后重新执行：

```bash
tunnel-client doctor --profile local-workspace --explain
tunnel-client run --profile local-workspace
```

并在 ChatGPT 中刷新 / 重新扫描工具。

## 使用示例

只读方案设计：

```text
读取 local-workspace 中登录相关的实现和项目文档。

然后 Web Search 当前 OAuth/OIDC 的官方最新实践。

结合现有实现，给我设计一套迁移方案。

不要修改代码。
```

明确的写入任务：

```text
使用 local-workspace 的读写模式。

只修改 docs/auth-migration.md，
按照我们已经确认的方案更新文档。
不要修改源码或其他文件。
```

## 安全基线

默认遵守：

- 默认只读；
- 写权限必须由用户明确开启；
- 开启写权限不能扩大 Workspace Root；
- 只授权明确指定的项目目录；
- 不暴露整个 Home 目录；
- 不把本地 MCP Server 直接暴露到公网；
- 不把 Runtime API Key 写入代码仓库；
- 保留对 `.env`、私钥、证书等敏感文件的保护；
- 删除、移动、批量替换等高风险操作不应自动批准；
- 本地 / 私有网络连接优先使用 OpenAI Secure MCP Tunnel。
