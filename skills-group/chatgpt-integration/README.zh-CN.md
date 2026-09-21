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

---

# 从 Clone 到连接成功：完整教程

下面按 macOS 环境说明如何从 0 开始，把本地项目接入普通 ChatGPT。

## 1. 环境准备

当前 `local-workspace` Skill 主要按 macOS 编写。

需要：

- Git
- Homebrew
- Node.js 24+
- pnpm
- 一个希望 ChatGPT 访问的本地代码/文档目录
- ChatGPT 中可用的开发人员模式
- OpenAI Platform 的 Tunnel 和 Runtime API Key 权限

先检查：

```bash
git --version
brew --version
node -v
pnpm -v
```

如果没有 Node.js 24 或 pnpm：

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

## 3. 把 `local-workspace` 安装到业务项目

假设业务项目目录是：

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

会生成：

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

会生成：

```text
my-project/
└── .cursor/
    └── skills/
        └── local-workspace/
```

### Codex + Cursor 都需要

```bash
pnpm migrate -- \
  --path ~/Desktop/gitlab/my-project \
  --group chatgpt-integration \
  --tool codex \
  --tool cursor
```

## 4. 在 Codex / Cursor 中执行 Skill

打开业务项目，不是打开 `ying-skills`。

显式调用 `local-workspace`，可以直接给 AI：

```text
使用 local-workspace，把当前项目接入普通 ChatGPT。

默认只读。
可以自动完成的步骤直接执行。
只有需要我去 OpenAI 网页创建或确认配置时再停下来告诉我。
```

Skill 会检查本地环境、准备 Filesystem MCP、安装/配置 `tunnel-client`，并指导完成 ChatGPT 侧连接。

下面的步骤也可以完全手工执行。

## 5. 安装本地依赖

安装 OpenAI Secure MCP Tunnel Client：

```bash
brew install openai/tools/tunnel-client

tunnel-client --version
tunnel-client help quickstart
```

检查 Filesystem MCP：

```bash
NPX="$(brew --prefix node@24)/bin/npx"

"$NPX" -y @j0hanz/filesystem-mcp@latest --help
```

## 6. 创建 OpenAI Tunnel 和 Runtime API Key

打开：

```text
https://platform.openai.com/settings/organization/tunnels
```

创建一个 Tunnel，例如：

```text
Name: local-workspace
Description: local development workspace
```

复制生成的 Tunnel ID：

```text
tunnel_...
```

然后打开：

```text
https://platform.openai.com/settings/organization/api-keys
```

创建 Runtime API Key。

回到 Terminal：

```bash
export CONTROL_PLANE_TUNNEL_ID="tunnel_..."
export CONTROL_PLANE_API_KEY="sk-..."
```

不要把 Runtime API Key 写进业务项目、Skill 或提交到 Git。

## 7. 配置本地 Workspace

假设要开放：

```text
~/Desktop/gitlab/my-project
```

解析绝对路径：

```bash
export PROJECT_DIR="$(cd ~/Desktop/gitlab/my-project && pwd)"
export NPX="$(brew --prefix node@24)/bin/npx"
```

### 默认：只读

```bash
export MCP_COMMAND="$NPX -y @j0hanz/filesystem-mcp@latest --read-only $PROJECT_DIR"
```

初始化：

```bash
tunnel-client init \
  --sample sample_mcp_stdio_local \
  --profile local-workspace \
  --tunnel-id "$CONTROL_PLANE_TUNNEL_ID" \
  --mcp-command "$MCP_COMMAND"
```

如果已经存在 `local-workspace` profile，不要重新创建，直接编辑：

```bash
tunnel-client profiles edit local-workspace
```

## 8. 检查并启动 Tunnel

先检查：

```bash
tunnel-client doctor \
  --profile local-workspace \
  --explain
```

重要检查通过后，再启动：

```bash
tunnel-client run \
  --profile local-workspace
```

ChatGPT 使用期间，这个 Terminal 需要保持运行。

正常情况下会看到 Tunnel 启动成功，并列出允许访问的目录。

## 9. 在 ChatGPT 开启开发人员模式

ChatGPT 中文界面中找到：

```text
设置
→ 开发人员模式
→ 开启「开发人员模式」
```

英文通常显示为：

```text
Settings
→ Developer Mode
→ Enable Developer Mode
```

ChatGPT UI 可能随版本调整，具体位置以当前客户端为准。

## 10. 在 ChatGPT 创建插件 / App

打开 ChatGPT 的插件页面：

```text
插件
→ 右上角 +
→ 创建
```

创建连接时选择：

```text
连接方式：Tunnel / 隧道
Tunnel：刚才创建的 tunnel_...
身份验证：无身份验证
```

然后扫描 / 刷新工具。

默认只读时，应看到类似：

```text
list_roots
list
find_files
stat
search_text
diff
read
```

不应该看到：

```text
create
edit
move
delete
patch
replace_text
```

确认工具列表正确后创建插件，例如命名为：

```text
Local Workspace
```

## 11. 测试连接

### 测试 1：列出 Root

```text
使用 Local Workspace。

列出当前所有可以访问的 workspace root。
不要修改任何文件。
```

### 测试 2：读取文件

```text
使用 Local Workspace。

读取项目根目录的 package.json，
告诉我项目的主要框架、包管理器和项目类型。

不要修改任何文件。
```

### 测试 3：搜索代码

```text
使用 Local Workspace。

搜索项目中所有和 login、auth、OAuth 相关的代码和文档，
告诉我主要涉及哪些文件和模块。

不要修改任何文件。
```

### 测试 4：本地代码 + Web Search

```text
使用 Local Workspace 阅读当前项目中登录和认证相关的代码与文档。

然后 Web Search 当前 OAuth/OIDC 的官方最新实践。

结合现有实现，设计一套迁移方案。

不要修改代码。
```

到这里完整链路就已经打通：

```text
本地 / 私有代码
      +
   Web Search
      ↓
普通 ChatGPT
      ↓
调研 / 架构分析 / 方案设计
```

---

## 多个 Workspace Root

同一个 `local-workspace` 可以开放多个明确指定的本地目录。

编辑已有 profile：

```bash
tunnel-client profiles edit local-workspace
```

Filesystem MCP 命令可以追加多个目录：

```text
npx -y @j0hanz/filesystem-mcp@latest --read-only \
  /absolute/path/project-a \
  /absolute/path/project-b \
  /absolute/path/docs
```

修改后重启：

```bash
tunnel-client doctor --profile local-workspace --explain
tunnel-client run --profile local-workspace
```

然后在 ChatGPT 中重新列出 roots 验证。

不要为了方便直接开放：

```text
/
/Users
$HOME
```

## 权限模式

### 默认：只读

如果用户没有明确要求写入，`local-workspace` 使用：

```text
--read-only
```

只暴露读取、搜索、目录浏览、diff 等能力。

### 可选：读写

只有用户明确要求 ChatGPT 修改本地文件时，才去掉：

```text
--read-only
```

编辑已有 profile：

```bash
tunnel-client profiles edit local-workspace
```

把：

```text
npx -y @j0hanz/filesystem-mcp@latest --read-only /path/to/project
```

改成：

```text
npx -y @j0hanz/filesystem-mcp@latest /path/to/project
```

然后重启 Tunnel，并在 ChatGPT 中刷新 / 重新扫描工具。

正常会新增：

```text
create
edit
move
delete
patch
replace_text
```

读写模式不能扩大 Workspace Root。

删除、移动、批量替换等高风险操作不应自动批准。

如果当前 ChatGPT / App 不支持写入型 MCP Action，应继续保持只读，不要假装写权限已经生效。

## 常见问题

### ChatGPT 提示 MCP Server 没有实现 OAuth

创建连接时选择：

```text
身份验证：无身份验证
```

通过 Secure MCP Tunnel 连接时，本地 Filesystem MCP 本身不需要额外实现 OAuth。

### 创建连接器时报错

先确认 Tunnel 仍在运行：

```bash
tunnel-client doctor --profile local-workspace --explain
tunnel-client run --profile local-workspace
```

保持 `run` 运行的同时，再回 ChatGPT 创建连接器。

### 新增目录后 ChatGPT 看不到

编辑已有 profile，重启 Tunnel，然后在 ChatGPT 中刷新 / 重新扫描工具。

### 开启读写后看不到写工具

依次检查：

1. 是否真的删除了 `--read-only`；
2. 如果用了 Docker / 文件系统只读挂载，是否仍然是只读；
3. 是否重启了 `tunnel-client`；
4. ChatGPT 插件是否重新扫描了工具；
5. 当前 ChatGPT / App 是否支持写入型 MCP Action。

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
