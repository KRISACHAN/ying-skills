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

Review is an **optional cross-cutting quality tool**, not a mandatory gate. The user decides whether to run `solution-review`, `code-review`, or `review-followup`, and how many times to run them.

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
│   ├── code-comments.md
│   ├── engineering-documentation.md
│   ├── verification.md
│   ├── review-system.md
│   └── artifact-protocol.md
└── skills/
    ├── project-guardrails/
    ├── architecture-audit/
    ├── refactor-plan/
    ├── refactor/
    ├── code-comments/
    ├── engineering-documentation/
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
- **Structured Code Comments** — make requirements, capabilities, responsibilities, boundaries, contracts, lifecycle, and tradeoffs understandable in code; do not optimize for either fewer or more comments.
- **Engineering Documentation** — README, AGENTS/instructions, ADRs, architecture indexes, and focused module docs form progressive navigation for humans and AI.
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

Split only when responsibility, contract, rollback/migration risk, verification strategy, or context size forms a real independent boundary. Do not split merely because there are several findings, large files, or multiple work items.

## Skills

| Stage | Skill | Purpose | Default permission |
| --- | --- | --- | --- |
| 1. Guardrails | `$project-guardrails` | Establish/audit AI engineering rules, architecture boundaries, comment/doc conventions, verification, and knowledge navigation | May update engineering rules/config/docs; no business-behavior refactor |
| 2. Analysis | `$architecture-audit <scope>` | Build functional/architecture maps, dependencies/data flow, hotspots, smells, knowledge-navigation gaps, and verification gaps | Read-only code; may write audit artifacts |
| 3. Planning | `$refactor-plan <scope-or-audit>` | Turn confirmed problems into one scope-level target, work items, preserved contracts, risks, and regression strategy | No production implementation |
| 4. Implementation | `$refactor <approved-plan-or-scope>` | Execute the approved scope in small behavior-preserving steps and verify the whole scope | May change code within approved scope |
| Support | `$code-comments <scope>` | Add/synchronize structured semantic code comments for requirements, capabilities, responsibilities, boundaries, invariants, lifecycle, and tradeoffs | Comments/doc-comments only; no runtime behavior change |
| Support | `$engineering-documentation <scope>` | Maintain README, AGENTS, ADRs, architecture indexes, and focused engineering docs | Engineering docs only; no runtime behavior or source-comment changes |
| Optional Review | `$solution-review <artifact>` | Review a PRD/spec/design/refactor plan when the user wants a second opinion | Review only |
| Optional Review | `$code-review <scope>` | Review an implementation when the user wants independent assurance | Review only |
| Optional Review | `$review-followup <report>` | Validate selected findings and resolve only valid ones | May change solution artifacts or code as required |

`0 findings` is a valid review result. Review Skills must not manufacture issues to satisfy a quota.

## Structured Code Comments vs Engineering Documentation

These are intentionally separate capabilities:

```text
$code-comments
= code-level knowledge layer
= Module/File → API/Class → Function → Inline

$engineering-documentation
= repository-level knowledge navigation
= Repository → App/Package → Module → Contract/ADR
```

`code-comments` aims for **sufficient semantic context**, not minimal comments. Use the structure that carries real information:

```text
Purpose
Capability
Responsibility
Boundary / Non-responsibility
Contract / Invariant
Lifecycle / Side Effect / Ordering
Tradeoff / Why
Requirement semantics
```

Use consistent semantic structure with adaptive depth. Do not mechanically fill every field, and do not narrate obvious syntax.

`engineering-documentation` must describe the current accepted system, not an aspirational architecture. Reuse the established README / AGENTS / ADR / requirements / architecture-doc system instead of creating parallel sources of truth.

## Recommended Refactor Flow

```text
$project-guardrails                    # usually once per project, or when rules are stale
        ↓
$architecture-audit <pkg/app/module>
        ↓
$refactor-plan <audit-or-scope>
        ↓
$refactor <approved-plan-or-scope>
```

Support Skills are invoked independently when useful:

```text
Implementation / existing code
  ├─→ $code-comments <scope>
  └─→ $engineering-documentation <scope>
```

A refactor should still synchronize comments/docs directly made stale by its own changes. Use the support Skills for dedicated scope-wide comment or documentation work.

Review can be inserted anywhere by the user:

```text
Plan ───────────────→ $solution-review     # optional
Implementation ────→ $code-review         # optional
Review report ─────→ $review-followup      # optional
```

Review does not automatically block the next stage. Re-review after followup is also optional unless project policy requires it.

## Human Control

This Skill Group intentionally does **not** provide a one-command orchestrator. The user decides when to move stages, whether dedicated comment/documentation work is useful, and whether/how often to review.

## Artifact Protocol

Persist only artifacts that carry durable information across sessions or stages. Existing project conventions always win.

Typical durable artifacts:

```text
Audit
Plan
Implementation / verification summary when useful
Review report when explicitly requested
```

Do not create one artifact per tiny refactoring step unless the project explicitly requires that traceability.

If no project convention exists, the fallback is:

```text
.engineering/
├── audits/
├── plans/
└── reviews/
```

See [`references/artifact-protocol.md`](./references/artifact-protocol.md).

## Generate Tool-specific Formats

```bash
pnpm generate -- --group code-engineering
pnpm generate -- --group code-engineering --tool codex
```

Generated Skills are self-contained and receive the Group shared references under `references/_shared/`.

## Migrate into a Project

```bash
pnpm migrate -- \
  --path ../ying-knowledge \
  --group code-engineering \
  --tool codex
```

Migration is merge-based: unrelated target files are preserved and colliding generated files follow the migration overwrite flow.

> Migration does not delete target Skills that were removed from the Source Group. Projects that previously migrated the old `code-documentation` Skill must delete their old `code-documentation/` target directory once after upgrading to this version.

## Supported Tool Layouts

| Tool | Generated project directory |
| --- | --- |
| OpenAI Codex | `.agents/skills/` |
| Cursor | `.cursor/skills/` |
| Gemini CLI | `.gemini/skills/` |
| Claude Code | `.claude/skills/` |
| Kiro | `.kiro/skills/` |
| GitHub Copilot | `.github/skills/` |
