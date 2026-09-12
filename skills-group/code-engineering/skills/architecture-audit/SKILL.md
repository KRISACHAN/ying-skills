---
name: architecture-audit
description: Read-only codebase reconnaissance and architecture diagnosis for a repository, package, app, or module. Produces a functional/architecture map plus evidence-backed hotspots, code smells, dependency and documentation problems. Use before major refactors or when understanding a brownfield scope. Do not refactor code.
---

# Architecture Audit

Understand the current system before judging or changing it.

Read:

- `../../references/engineering-principles.md`
- `../../references/clean-code.md`
- `../../references/refactoring.md`
- `../../references/module-first-architecture.md`
- `../../references/layered-architecture.md`
- `../../references/ports-and-adapters.md`
- `../../references/strategy-and-plugin.md`
- `../../references/comments-and-documentation.md`
- `../../references/artifact-protocol.md`

Then load the target project's own rules and nearest README/architecture docs.

## Mode

Code is read-only. Writing an audit artifact is allowed; changing production/test behavior is not.

## Workflow

1. **Define scope** — repository / package / app / module; record baseline ref/working-tree state.
2. **Functional map** — purpose, responsibilities, non-responsibilities, entry points, public contracts, callers/consumers.
3. **Architecture map** — modules/layers, dependency direction, data flow, state/persistence, network/filesystem/process boundaries, composition roots, extension points.
4. **Verification map** — tests and checks that protect the scope, plus important unprotected behavior.
5. **Documentation map** — README/AGENTS/ADR/spec/index coverage and obvious drift.
6. **Hotspot analysis** — large files/functions, change concentration, fan-in/fan-out, broad interfaces, mixed responsibilities, duplicated knowledge, difficult-to-test seams.
7. **Pattern analysis** — identify useful or misused layering, Port/Adapter, Strategy, Plugin, and unnecessary abstractions.
8. **Diagnose root causes** — for each meaningful issue record evidence → cost → likely root cause → safe direction → risk.
9. **Assess scope fit** — prefer keeping the current package/app/module as one refactor scope. Recommend sub-scopes only when responsibility, contract, rollback/migration risk, verification strategy, or context size forms a real independent boundary.

## Required Output Sections

- Scope & baseline
- Functional Map
- Architecture / Dependency Map
- Data & Side-effect Flow
- Public Contracts / Invariants
- Verification Map
- Documentation / Navigation Map
- Hotspots
- Evidence-backed Findings
- Scope Fit: keep as one scope or split, with reasons
- Recommended Direction (not implementation plan)
- Open Questions / Verification Gaps

Findings must include concrete paths/symbols/lines when available. File size alone is not a defect; judge cohesion, reasons to change, blast radius, testability, and navigability.

Do not turn each finding into a future Refactor Unit. The audit diagnoses problems; the planning skill decides how related findings should be grouped into a concise scope-level plan.

Persist the result using project conventions or the fallback artifact protocol. Stop after the audit; do not start refactoring.
