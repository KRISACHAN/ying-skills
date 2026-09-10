# ying-skills

通用 AI Coding Skill Groups 与迁移工具。

## 目录

```text
ying-skills/
├── scripts/
│   ├── generate-skills.mjs
│   └── migrate-skills.mjs
└── skills-group/
    └── code-engineering/
        ├── README.md
        ├── references/
        └── skills/
```

`skills-group/` 是 Skill Group 源码目录；每个子目录是一组可独立维护和迁移的 Skills。`scripts/` 负责把统一源码生成成不同 AI 工具支持的项目目录格式，并合并迁移到已有项目。

## 使用

安装依赖（当前没有第三方运行时依赖，但使用 pnpm 作为项目入口）：

```bash
pnpm install
```

生成全部 Skill Group 的全部 AI 工具格式：

```bash
pnpm generate
```

只生成指定 Group / 工具：

```bash
pnpm generate -- --group code-engineering --tool codex
pnpm generate -- --group code-engineering --tool claude --tool gemini
```

交互式迁移到项目：

```bash
pnpm migrate
```

执行后输入目标项目路径，再选择 Skill Group 与 AI 工具。迁移采用合并模式：保留目标项目其他文件；若目标路径已有同名 Skill/Reference，会先提示再覆盖这些冲突文件。

也支持非交互调用：

```bash
pnpm migrate -- --path ../ying-knowledge --group code-engineering --tool codex
```

多个工具：

```bash
pnpm migrate -- --path ../my-project --group code-engineering --tool codex --tool claude
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

各 Group 的 `.generated/` 是脚本产物，不提交 Git；真正的 Source of Truth 始终是 `skills-group/<group>/skills/` 与 `references/`。

## Skill Groups

- [`code-engineering`](./skills-group/code-engineering/) — 面向真实代码项目的工程治理、架构分析、方案设计、行为保持式重构、结构化文档与独立 Review。
