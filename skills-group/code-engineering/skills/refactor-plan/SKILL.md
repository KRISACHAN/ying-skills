---
name: refactor-plan
description: Turn an approved architecture audit or explicitly scoped technical-debt problem into a concise behavior-preserving scope-level refactor plan with target structure, work items, preserved contracts, risks, and regression strategy. Planning only; do not implement production-code changes.
---

# Refactor Plan

Convert diagnosis into one executable plan for the approved scope.

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

## Default Granularity

Default to **one plan per meaningful scope**: package, app, module, or another explicitly approved boundary.

Do not create one Refactor Unit per finding. Multiple findings should normally become internal Work Items in the same scope-level plan.

Split the scope into separate execution plans only when there is a real independent boundary, such as:

- different business responsibility or ownership;
- different public contract or persisted schema;
- independent rollback/migration risk;
- materially different verification strategy;
- the scope is too large for reliable understanding or execution in one pass.

File count, LOC, or finding count alone is not a reason to split.

## Workflow

1. **Restate confirmed problems** — do not silently expand scope beyond the audit/user request.
2. **Freeze observable contracts** — public APIs/types, persisted schema/data semantics, errors, ordering, side effects, UI/API/IPC behavior, concurrency, compatibility.
3. **Describe target state** — responsibilities and dependency direction first; file/folder layout second.
4. **Define Work Items** — group related changes by responsibility/root cause; use named refactorings where useful.
5. **Order the work** — dependencies, safest sequence, characterization coverage, migration or rollback concerns.
6. **Define verification strategy** — baseline, focused checks during execution, scope-level regression at completion, and any characterization tests needed before structure changes.
7. **Define stop conditions** — unexplained test failure, required behavior change, migration ambiguity, or architecture uncertainty should stop implementation.
8. **Check for overengineering** — every introduced layer/interface/strategy/plugin/adapter must have a concrete responsibility or variation.

## Plan Template

```text
Scope
Confirmed Problems / Evidence
Preserved Contracts
Target State
Non-goals

Work Items
- WI-01 — ...
- WI-02 — ...
- WI-03 — ...

Execution Order
Verification Strategy
Risks
Stop / Rollback Conditions
Documentation Impact
Definition of Done
```

Work Item IDs are organizational aids, not mandatory lifecycle gates. They do not imply separate review, separate approval, separate artifact, or separate execution unless the user explicitly requests that granularity.

## Output

Persist one concise Refactor Plan using project conventions or the fallback artifact protocol.

Do not automatically invoke or require `solution-review`. The user decides whether an independent solution review is useful before implementation.
