---
name: refactor-plan
description: Turn an approved architecture audit or explicitly scoped technical-debt problem into a behavior-preserving refactor plan with target structure, small Refactor Units, contracts, risks, and regression evidence. Planning only; do not implement production-code changes.
---

# Refactor Plan

Convert diagnosis into an executable, reviewable plan.

Read:

- `../../references/engineering-principles.md`
- `../../references/refactoring.md`
- `../../references/clean-code.md`
- `../../references/module-first-architecture.md`
- `../../references/layered-architecture.md`
- `../../references/ports-and-adapters.md`
- `../../references/strategy-and-plugin.md`
- `../../references/verification.md`
- `../../references/artifact-protocol.md`

Load the upstream audit when one exists. If the project has its own architecture/spec/requirements, they are authoritative.

## Workflow

1. **Restate approved problems** — do not silently expand scope beyond the audit/user request.
2. **Freeze observable contracts** — public APIs/types, persisted schema/data semantics, errors, ordering, side effects, UI/API/IPC behavior, concurrency, compatibility.
3. **Describe target state** — responsibilities and dependency direction first; file/folder layout second.
4. **Select transformations** — prefer named small refactorings and seams over rewrite-style replacement.
5. **Create Refactor Units** — RF-001, RF-002, ... Each unit should be independently understandable, verifiable, and preferably reversible.
6. **Bind regression to each unit** — baseline checks, focused checks, broad checks, and any characterization tests needed before structure changes.
7. **Define stop/rollback conditions** — unexplained test failure, required behavior change, migration ambiguity, or architecture uncertainty should stop that branch.
8. **Check for overengineering** — every introduced layer/interface/strategy/plugin/adapter must have a concrete responsibility or variation.

## Refactor Unit Template

```text
RF-XXX — Name
Problem / Evidence
Current Responsibility
Target Responsibility
Preserved Contracts
Non-goals
Transformations
Affected Scope
Expected Structural Changes
Regression Plan
Risks
Stop / Rollback Conditions
Definition of Done
```

## Output

Persist a Refactor Plan using project conventions or the fallback artifact protocol. The plan is not approval. Stop for human/solution review before implementation.
