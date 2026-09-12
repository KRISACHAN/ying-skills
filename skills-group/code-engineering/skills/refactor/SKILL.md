---
name: refactor
description: Execute an explicitly approved refactor plan or scope using small behavior-preserving transformations with continuous verification and a final scope-level convergence check. By default complete the approved scope in one pass; do not invent a new architecture while implementing.
---

# Refactor

Implement an approved refactor safely and efficiently.

Read:

- `../../references/engineering-principles.md`
- `../../references/refactoring.md`
- `../../references/clean-code.md`
- `../../references/module-first-architecture.md`
- `../../references/layered-architecture.md`
- `../../references/ports-and-adapters.md`
- `../../references/strategy-and-plugin.md`
- `../../references/verification.md`

Load the approved Refactor Plan or equivalently precise user-authorized scope and target-project rules first.

## Preconditions

- Scope and intended target are explicit.
- Observable contracts and verification strategy are known.
- The user has authorized implementation of this scope.

If these are missing, do not substitute your own broad redesign.

## Default Execution Model

Default to executing the **whole approved scope** in one coherent implementation pass.

A plan may contain multiple Work Items. Treat them as an ordered checklist inside the same task, not as separate lifecycle gates.

Only stop between Work Items when:

- the user explicitly requested staged execution;
- a stop condition is triggered;
- a work item reveals a new independent contract/migration/risk boundary;
- safe progress requires changing the approved plan or observable behavior.

Do not pause merely because one internal Work Item finished.

## Workflow

1. **Baseline** — run relevant pre-change checks or establish existing failures.
2. **Protect behavior** — add focused characterization/regression coverage first when risk is high and protection is missing.
3. **Execute Work Items in order** — rename/extract/move/simplify before introducing new abstractions; use Strategy/Plugin/Port only when the approved design and real variation justify them.
4. **Verify during execution** — run focused tests/typecheck/lint at meaningful risk boundaries, not mechanically after every trivial edit.
5. **Do not hide failures** — do not weaken tests, widen catch blocks, suppress types/lint, or change error semantics merely to make checks pass.
6. **Scope-level regression** — after the approved scope is complete, run the package/app/integration/E2E gates required by the plan and blast radius.
7. **Convergence check** — confirm the target state is reached, preserved contracts remain intact, unrelated behavior did not drift, and required documentation is synchronized or explicitly deferred.

## Boundaries

- No opportunistic feature work.
- No speculative architecture expansion outside the approved scope.
- No arbitrary line-count-driven fragmentation.
- Do not turn every finding into a separate execution unit.
- If safe progress requires behavior/schema/protocol changes not in the plan, stop and report the conflict.

## Completion Output

Report:

- completed Work Items;
- actual structural changes;
- preserved contracts;
- verification evidence;
- any divergence from plan;
- intentionally deferred issues.

A failed required check means the scope is not complete.

Do not automatically invoke or require `code-review`. The user decides whether independent review is needed and how often.
