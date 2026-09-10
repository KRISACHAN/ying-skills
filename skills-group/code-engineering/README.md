**English** | [简体中文](./README.zh-CN.md)

# Code Engineering Skill Group

A reusable AI coding Skill Group for real software projects.

The goal is not to force every repository into one architecture. The goal is to help AI work inside explicit engineering boundaries through a repeatable lifecycle:

```text
Establish Guardrails
  ↓
Analyze the Project
  ↓
Design the Solution / Refactor Plan
  ↓
Implement + Verify
```

Review is an independent cross-cutting quality system that can be used for refactoring, features, bug fixes, architecture proposals, migrations, and ordinary development work.

## Source Layout

```text
skills-group/code-engineering/
├── README.md
├── README.zh-CN.md
├── references/
│   ├── engineering-principles.md
│   ├── refactoring.md
│   ├── clean-code.md
│   ├── module-first-architecture.md
│   ├── layered-architecture.md
│   ├── ports-and-adapters.md
│   ├── strategy-and-plugin.md
│   ├── comments-and-documentation.md
│   ├── verification.md
│   ├── review-system.md
│   └── artifact-protocol.md
└── skills/
    ├── project-guardrails/
    ├── architecture-audit/
    ├── refactor-plan/
    ├── refactor/
    ├── code-documentation/
    ├── solution-review/
    ├── code-review/
    └── review-followup/
```

`skills/` and `references/` are the source of truth. Tool-specific output is generated into `.generated/` and should not be edited manually.

## Engineering Baseline

All Skills share the same default engineering philosophy:

- **Refactoring** — behavior-preserving, incremental changes with continuous verification.
- **Clean Code** — clear naming, focused responsibilities, high cohesion, low coupling, explicit side effects, and reduced duplication of knowledge.
- **Module-first architecture** — organize by business/capability boundaries first, then layer inside modules where useful.
- **Layered architecture** — keep Domain, Application, Ports, Infrastructure, Interface, and Composition responsibilities explicit when the project benefits from those boundaries.
- **Ports & Adapters** — keep databases, LLMs, search engines, filesystems, SDKs, and other external mechanisms at replaceable boundaries.
- **Strategy** — use when one responsibility has real interchangeable algorithms.
- **Plugin** — use for independently addable/removable/composable extension capabilities.
- **Structured documentation** — README, AGENTS/instructions, ADRs, indexes, and Why/Invariant/Boundary/Tradeoff comments should serve both humans and AI.
- **Evidence-based verification** — do not claim completion without fresh evidence appropriate to the risk.
- **Anti-overengineering** — patterns must solve real variation, ownership, or integration problems; do not create abstraction for appearance.

Precedence:

```text
Explicit user instruction
  > explicit project contracts / rules
  > coherent existing project architecture
  > Code Engineering defaults
```

## Skills

| Stage | Skill | Purpose | Default permission |
| --- | --- | --- | --- |
| 1. Guardrails | `$project-guardrails` | Establish or audit AI engineering rules, architecture boundaries, verification requirements, and documentation navigation | May update engineering rules/config/docs; no business-behavior refactor |
| 2. Analysis | `$architecture-audit <scope>` | Build functional/architecture maps, dependency/data-flow maps, hotspots, code smells, verification gaps, and root-cause findings | Read-only code; may write audit artifacts |
| 3. Planning | `$refactor-plan <scope-or-audit>` | Turn approved findings into target structure, Refactor Units, preserved contracts, risks, and regression plans | No production implementation |
| 4. Implementation | `$refactor <approved-unit>` | Execute one approved Refactor Unit in small behavior-preserving steps with continuous verification | May change code within approved scope |
| Support | `$code-documentation <scope>` | Synchronize structured comments, README, ADRs, and navigation after structural changes | Documentation/comments only; no runtime behavior change |
| Review | `$solution-review <artifact>` | Review PRDs, specs, feature/bugfix plans, architecture proposals, migrations, or refactor plans before implementation | Review only |
| Review | `$code-review <scope>` | Review actual implementation for correctness, solution compliance, Clean Code, architecture, patterns, verification gaps, and documentation drift | Review only |
| Review | `$review-followup <report>` | Validate each finding, then minimally fix valid issues or reject invalid ones with evidence | May change solution artifacts or code as required |

`0 findings` is a valid review result. Review Skills must not manufacture issues to satisfy a quota.

## Recommended Flow

### Refactoring

```text
$project-guardrails                    # first adoption or stale project rules
        ↓ Human Review
$architecture-audit <pkg/app/module>
        ↓ Human Review
$refactor-plan <audit-or-scope>
        ↓
$solution-review <refactor-plan>
        ↓ Human Review
$refactor <approved RF unit>
        ↓
$code-documentation <scope>            # when structure/docs changed
        ↓
$code-review <implementation scope>
        ↓
PASS → next Refactor Unit
FAIL → $review-followup <report> → $code-review
```

### Feature / Requirement Work

```text
PRD / Spec / Technical Plan
        ↓
$solution-review <artifact>
        ↓ Human Review
Implementation
        ↓
$code-review <scope>
        ↓
PASS / $review-followup
```

### Bug Fix

```text
Bug Analysis / Fix Plan
        ↓
$solution-review <artifact>     # optional for simple low-risk fixes
        ↓
Implementation
        ↓
$code-review <scope>
```

## Human Gates

This Skill Group intentionally does **not** provide a one-command orchestrator that automatically runs the entire lifecycle.

For high-impact work, the intended control model is:

```text
AI executes one stage
  ↓
Persisted artifact / evidence
  ↓
Human review
  ↓
Explicitly invoke the next stage
```

This keeps the human in control of problem interpretation, architecture direction, solution approval, and implementation acceptance.

## Artifact Protocol

Existing project conventions always win. If the repository already has Requirements, Specs, ADRs, review archives, or technical-design directories, use them.

If no convention exists, the fallback is:

```text
.engineering/
├── audits/
├── plans/
└── reviews/
```

See [`references/artifact-protocol.md`](./references/artifact-protocol.md) for the fallback contract.

## Generate Tool-specific Formats

From the repository root:

```bash
pnpm generate -- --group code-engineering
```

Generate one or more tools:

```bash
pnpm generate -- --group code-engineering --tool codex
pnpm generate -- --group code-engineering --tool claude --tool gemini
```

Generated output:

```text
skills-group/code-engineering/.generated/
├── codex/.agents/skills/<skill>/...
├── cursor/.cursor/skills/<skill>/...
├── gemini/.gemini/skills/<skill>/...
├── claude/.claude/skills/<skill>/...
├── kiro/.kiro/skills/<skill>/...
└── copilot/.github/skills/<skill>/...
```

Each generated Skill is self-contained:

```text
<skill>/
├── SKILL.md
└── references/
    └── _shared/
```

The generator copies the shared group references into each generated Skill and rewrites source references such as `../../references/...` to `./references/_shared/...`.

## Migrate into a Project

Interactive migration:

```bash
pnpm migrate
```

Non-interactive Codex example:

```bash
pnpm migrate -- \
  --path ../ying-knowledge \
  --group code-engineering \
  --tool codex
```

Migration is merge-based: unrelated files already present in the target AI-tool directory are preserved. Conflicting generated Skill/Reference files are reported before replacement unless non-interactive confirmation is explicitly supplied.

## Supported Tool Layouts

| Tool | Generated project directory |
| --- | --- |
| OpenAI Codex | `.agents/skills/` |
| Cursor | `.cursor/skills/` |
| Gemini CLI | `.gemini/skills/` |
| Claude Code | `.claude/skills/` |
| Kiro | `.kiro/skills/` |
| GitHub Copilot | `.github/skills/` |
