**English** | [简体中文](./README.zh-CN.md)

# Code Engineering Skill Group

A reusable AI coding Skill Group for real software projects.

The default lifecycle is intentionally small:

```text
Guardrails
  ↓
Architecture Audit
  ↓
Plan
  ↓
Implement + Verify
```

Review is an **optional cross-cutting tool**, not a mandatory gate. The user decides whether to run `solution-review`, `code-review`, or `review-followup`, and how many times to run them.

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
- **Layered architecture** — keep Domain, Application, Ports, Infrastructure, Interface, and Composition responsibilities explicit when useful.
- **Ports & Adapters** — keep databases, LLMs, search engines, filesystems, SDKs, and other external mechanisms at replaceable boundaries.
- **Strategy** — use when one responsibility has real interchangeable algorithms.
- **Plugin** — use for independently addable/removable/composable extension capabilities.
- **Structured documentation** — README, AGENTS/instructions, ADRs, indexes, and Why/Invariant/Boundary/Tradeoff comments serve both humans and AI.
- **Evidence-based verification** — do not claim completion without fresh evidence appropriate to the risk.
- **Anti-overengineering** — patterns must solve real variation, ownership, or integration problems; do not create abstraction for appearance.

Precedence:

```text
Explicit user instruction
  > explicit project contracts / rules
  > coherent existing project architecture
  > Code Engineering defaults
```

## Default Scope Granularity

The default execution unit is a meaningful **scope**, not an individual finding.

Prefer:

```text
package / app / module
  ↓
one audit
  ↓
one plan
  ↓
one implementation pass with internal work items
  ↓
one scope-level verification
```

Split a scope only when there is a real independent boundary, for example:

- different business responsibilities or ownership;
- different public contracts or persisted schemas;
- independent rollback/migration risk;
- materially different verification strategies;
- the scope is too large for reliable understanding or execution in one pass.

Do **not** split merely because the audit found several issues, several files are large, or the plan contains multiple work items.

## Skills

| Stage | Skill | Purpose | Default permission |
| --- | --- | --- | --- |
| 1. Guardrails | `$project-guardrails` | Establish or audit AI engineering rules, architecture boundaries, verification requirements, and documentation navigation | May update engineering rules/config/docs; no business-behavior refactor |
| 2. Analysis | `$architecture-audit <scope>` | Build functional/architecture maps, dependencies/data flow, hotspots, code smells, verification gaps, and root-cause findings | Read-only code; may write audit artifacts |
| 3. Planning | `$refactor-plan <scope-or-audit>` | Turn confirmed problems into one scope-level target, work items, preserved contracts, risks, and regression strategy | No production implementation |
| 4. Implementation | `$refactor <approved-plan-or-scope>` | Execute the approved scope in small behavior-preserving steps and verify the whole scope | May change code within approved scope |
| Support | `$code-documentation <scope>` | Synchronize structured comments, README, ADRs, and navigation after structural changes | Documentation/comments only; no runtime behavior change |
| Optional Review | `$solution-review <artifact>` | Review a PRD/spec/design/refactor plan when the user wants an independent second opinion | Review only |
| Optional Review | `$code-review <scope>` | Review an implementation when the user wants independent assurance | Review only |
| Optional Review | `$review-followup <report>` | Validate selected review findings and resolve only the valid ones | May change solution artifacts or code as required |

`0 findings` is a valid review result. Review Skills must not manufacture issues to satisfy a quota.

## Recommended Refactor Flow

```text
$project-guardrails                    # once per project, or when rules are stale
        ↓
$architecture-audit <pkg/app/module>
        ↓
$refactor-plan <audit-or-scope>
        ↓
$refactor <approved-plan-or-scope>
        ↓
$code-documentation <scope>            # only when documentation/navigation needs updating
```

The user may insert review anywhere:

```text
Plan ───────────────→ $solution-review     # optional, any number of times
Implementation ────→ $code-review         # optional, any number of times
Review report ─────→ $review-followup      # optional, only when the user wants findings handled
```

Review does not automatically block the next stage. Re-review after followup is also optional unless the user or project policy explicitly requires it.

## Feature / Bugfix Usage

The review subsystem is reusable outside refactoring:

```text
PRD / Spec / Fix Plan
  ├─→ $solution-review    # optional
  ↓
Implementation
  ├─→ $code-review        # optional
  └─→ $review-followup    # only when requested
```

## Human Control

This Skill Group intentionally does **not** provide a one-command orchestrator.

The user controls:

- when to move to the next stage;
- whether a review is needed;
- which scope to review;
- whether followup is needed;
- whether a second review is worth the cost.

The Skills provide engineering discipline; they do not impose ceremony.

## Artifact Protocol

Persist only artifacts that carry durable information across sessions or stages. Existing project conventions always win.

Typical durable artifacts:

```text
Audit
Plan
Implementation / verification summary when useful
Review report when the user explicitly requests review
```

Do not create one artifact per tiny refactoring step unless the project explicitly requires that level of traceability.

If no project convention exists, the fallback is:

```text
.engineering/
├── audits/
├── plans/
└── reviews/
```

See [`references/artifact-protocol.md`](./references/artifact-protocol.md).

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

The generator copies shared references into each generated Skill and rewrites source references such as `../../references/...` to `./references/_shared/...`.

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
