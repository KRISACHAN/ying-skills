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
pnpm generate
pnpm migrate
```

Generate a specific group/tool combination:

```bash
pnpm generate -- --group code-engineering --tool codex
pnpm generate -- --group code-engineering --tool claude --tool gemini
```

Non-interactive migration:

```bash
pnpm migrate -- \
  --path ../ying-knowledge \
  --group code-engineering \
  --tool codex
```

Migration is merge-based: unrelated project files are preserved and colliding generated files follow the migration overwrite flow. Removed source Skills are not automatically deleted from target projects.

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

Each generated Skill is self-contained. Shared group references are bundled into that Skill under `references/_shared/`, while the source repository maintains one copy of the shared engineering guidance.

## Skill Groups

### [Code Engineering](./skills-group/code-engineering/)

A general-purpose engineering workflow for AI-assisted software development and brownfield refactoring.

```text
Guardrails
  ↓
Architecture Analysis
  ↓
Solution / Refactor Planning
  ↓
Implementation + Verification
```

Support capabilities include separate **structured code comments** and **engineering documentation** Skills. Code comments form a code-level semantic knowledge layer for requirements, capabilities, responsibilities, boundaries, contracts, lifecycle, and tradeoffs; engineering documentation manages README, AGENTS, ADRs, architecture indexes, and progressive repository navigation.

An independent optional Review subsystem can be applied to refactoring, features, bug fixes, architecture proposals, and ordinary implementation work.

The default engineering baseline emphasizes Refactoring, Clean Code, module-first and layered architecture, Ports & Adapters, Strategy/Plugin where justified, structured semantic context for humans and AI, anti-overengineering, and evidence-based verification.
