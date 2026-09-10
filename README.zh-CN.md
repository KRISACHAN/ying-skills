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
    └── code-engineering/
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
```

生成全部 Skill Group 的全部工具格式：

```bash
pnpm generate
```

只生成指定 Group / 工具：

```bash
pnpm generate -- --group code-engineering --tool codex
pnpm generate -- --group code-engineering --tool claude --tool gemini
```

交互式迁移到已有项目：

```bash
pnpm migrate
```

迁移流程会依次询问：

```text
项目路径
  ↓
Skill Group
  ↓
AI 工具
  ↓
生成
  ↓
冲突检查
  ↓
合并
```

迁移采用合并模式：目标项目中无关文件会保留。如果目标路径已经存在同名 Skill 或 Reference，脚本会先报告冲突，再决定是否覆盖冲突文件。

也支持非交互调用：

```bash
pnpm migrate -- \
  --path ../ying-knowledge \
  --group code-engineering \
  --tool codex
```

一次迁移到多个工具：

```bash
pnpm migrate -- \
  --path ../my-project \
  --group code-engineering \
  --tool codex \
  --tool claude
```

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

生成后的每个 Skill 都是自包含的。Group 级共享 references 会被打包进每个 Skill 的 `references/_shared/`；源码仓库仍只维护一份共享工程规范。

## Skill Groups

### [Code Engineering](./skills-group/code-engineering/)

面向 AI 辅助软件开发与 Brownfield 重构的通用代码工程工作流。

核心流程：

```text
建立规范
  ↓
架构分析
  ↓
方案 / 重构计划
  ↓
实施 + 验证
```

同时提供独立 Review 子系统，可复用于重构、Feature、Bugfix、架构方案和普通代码开发。

默认工程基线强调：Refactoring、Clean Code、Module-first 与分层架构、Ports & Adapters、在真实变化点使用 Strategy / Plugin、面向人和 AI 的结构化文档，以及基于证据的验证。
