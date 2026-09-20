[English](./README.md) | **简体中文**

# ying-skills

面向真实软件项目的通用 AI Coding Skill Groups 与迁移工具。

仓库将每个 Skill Group 维护为与具体 AI 工具无关的统一源码，再根据不同工具生成对应的项目级 Skills 目录格式，并支持直接合并迁移到已有项目。

## 仓库结构

```text
ying-skills/
├── scripts/
│   ├── generate-skills.mjs
│   └── migrate-skills.mjs
└── skills-group/
    ├── code-engineering/
    │   ├── README.md
    │   ├── README.zh-CN.md
    │   ├── references/
    │   └── skills/
    └── chatgpt-integration/
        ├── README.md
        ├── README.zh-CN.md
        ├── references/
        └── skills/
```

- `skills-group/`：所有可复用 Skill Group 的 Source of Truth。
- `scripts/`：负责生成不同 AI 工具的目录格式，并合并迁移到已有项目。
- 生成产物不提交 Git；Skill 源码与共享 references 始终保持工具无关。

## 快速开始

```bash
pnpm install
pnpm generate
pnpm migrate
```

只生成指定 Group / 工具：

```bash
pnpm generate -- --group code-engineering --tool codex
pnpm generate -- --group code-engineering --tool claude --tool gemini
pnpm generate -- --group chatgpt-integration --tool codex
```

非交互迁移：

```bash
pnpm migrate -- \
  --path ../ying-knowledge \
  --group code-engineering \
  --tool codex

# 示例：安装 ChatGPT 本地 / 私有环境接入 Skills
pnpm migrate -- \
  --path ../your-project \
  --group chatgpt-integration \
  --tool codex
```

迁移采用合并模式：目标项目中无关文件会保留，同名生成文件按迁移覆盖规则处理。已经从 Source Group 删除的旧 Skill 不会自动从目标项目删除。

## 当前支持的 AI 工具格式

| 工具 | 项目级 Skills 目录 |
| --- | --- |
| OpenAI Codex | `.agents/skills/` |
| Cursor | `.cursor/skills/` |
| Gemini CLI | `.gemini/skills/` |
| Claude Code | `.claude/skills/` |
| Kiro | `.kiro/skills/` |
| GitHub Copilot | `.github/skills/` |

生成产物位于：

```text
skills-group/<group>/.generated/
```

生成后的每个 Skill 都是自包含的。Group 级共享 references 会被打包进每个 Skill 的 `references/_shared/`；源码仓库仍只维护一份该 Group 的共享规范。

## Skill Groups

### [Code Engineering](./skills-group/code-engineering/)

面向 AI 辅助软件开发与 Brownfield 重构的通用代码工程工作流。

```text
建立规范
  ↓
架构分析
  ↓
方案 / 重构计划
  ↓
实施 + 验证
```

支撑能力中，**结构化代码注释**与**工程文档**已经拆成独立 Skill：代码注释负责在源码中保存需求语义、能力、职责、边界、Contract、Lifecycle 与 Tradeoff；工程文档负责 README、AGENTS、ADR、Architecture Index 与 Repository 级渐进式导航。

同时提供独立、可选的 Review 子系统，可复用于重构、Feature、Bugfix、架构方案和普通代码开发。

默认工程基线强调：Refactoring、Clean Code、Module-first 与分层架构、Ports & Adapters、在真实变化点使用 Strategy / Plugin、面向人和 AI 的结构化语义上下文、Anti-overengineering，以及基于证据的验证。


### [ChatGPT Integration](./skills-group/chatgpt-integration/)

面向 ChatGPT 与本地、私有环境连接的集成能力。

当前提供 `local-workspace`：通过只读 Filesystem MCP 与 OpenAI Secure MCP Tunnel，将本地代码和文档接入普通 ChatGPT。

目标工作流：

```text
本地 / 私有项目上下文
        +
    Web Search
        ↓
   普通 ChatGPT
        ↓
调研 / 架构分析 / 方案设计
```

生成：

```bash
pnpm generate -- \
  --group chatgpt-integration \
  --tool codex
```

或迁移到已有项目：

```bash
pnpm migrate -- \
  --path ../your-project \
  --group chatgpt-integration \
  --tool codex
```

迁移完成后调用生成的 `local-workspace` Skill。它会指导完成只读 Filesystem MCP、OpenAI Secure MCP Tunnel、ChatGPT 连接，以及最终的读取 / 搜索端到端验证。
