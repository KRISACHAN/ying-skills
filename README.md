**English** | [简体中文](./README.zh-CN.md)

# ying-skills

Reusable AI coding skill groups and migration tooling for real software projects.

The repository keeps each skill group in a tool-neutral source format, then generates and merges the corresponding project-level skill layout for supported AI coding tools.

## Repository Layout

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

- `skills-group/` is the source-of-truth directory for reusable Skill Groups.
- `scripts/` generates tool-specific layouts and merges them into existing projects.
- Generated output is not committed. Source skills and shared references remain tool-neutral.

## Quick Start

```bash
pnpm install
```

Generate all Skill Groups for all supported tools:

```bash
pnpm generate
```

Generate a specific group/tool combination:

```bash
pnpm generate -- --group code-engineering --tool codex
pnpm generate -- --group code-engineering --tool claude --tool gemini
```

Interactively migrate skills into an existing project:

```bash
pnpm migrate
```

The migration flow asks for:

```text
Project path
  ↓
Skill Group
  ↓
AI tool(s)
  ↓
Generate
  ↓
Collision check
  ↓
Merge
```

Existing unrelated project files are preserved. If a generated Skill or Reference already exists at the target path, the migration command reports the collision before replacing the conflicting files.

Non-interactive migration is also supported:

```bash
pnpm migrate -- \
  --path ../ying-knowledge \
  --group code-engineering \
  --tool codex
```

Multiple tools can be migrated in one run:

```bash
pnpm migrate -- \
  --path ../my-project \
  --group code-engineering \
  --tool codex \
  --tool claude
```

## Supported AI Tool Layouts

| Tool | Project-level Skills directory |
| --- | --- |
| OpenAI Codex | `.agents/skills/` |
| Cursor | `.cursor/skills/` |
| Gemini CLI | `.gemini/skills/` |
| Claude Code | `.claude/skills/` |
| Kiro | `.kiro/skills/` |
| GitHub Copilot | `.github/skills/` |

Generated artifacts are written under:

```text
skills-group/<group>/.generated/
```

Each generated Skill is self-contained. Shared group references are bundled into that Skill under `references/_shared/`, while the source repository still maintains only one copy of the shared engineering guidance.

## Skill Groups

### [Code Engineering](./skills-group/code-engineering/)

A general-purpose engineering workflow for AI-assisted software development and brownfield refactoring.

Core flow:

```text
Guardrails
  ↓
Architecture Analysis
  ↓
Solution / Refactor Planning
  ↓
Implementation + Verification
```

An independent Review subsystem can be applied to refactoring, features, bug fixes, architecture proposals, and ordinary implementation work.

The default engineering baseline emphasizes Refactoring, Clean Code, module-first and layered architecture, Ports & Adapters, Strategy/Plugin where justified, structured documentation for humans and AI, and evidence-based verification.
