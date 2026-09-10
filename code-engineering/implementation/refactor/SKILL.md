---
name: refactor
description: Execute one explicitly approved Refactor Unit using small behavior-preserving transformations with continuous verification and final convergence checks. Requires an approved plan/unit or an equivalently precise user-authorized scope. Do not invent a new architecture while implementing.
---

# Refactor

Implement an approved refactor safely.

Read:

- `../../references/engineering-principles.md`
- `../../references/refactoring.md`
- `../../references/clean-code.md`
- `../../references/module-first-architecture.md`
- `../../references/layered-architecture.md`
- `../../references/ports-and-adapters.md`
- `../../references/strategy-and-plugin.md`
- `../../references/verification.md`

Load the approved Refactor Plan/Unit and target-project rules first.

## Preconditions

- Scope and intended target are explicit.
- Observable contracts and regression plan are known.
- The user has approved this unit or otherwise explicitly authorized equivalent implementation scope.

If these are missing, do not substitute your own broad redesign.

## Workflow

1. **Baseline** — run relevant pre-change checks or establish existing failures.
2. **Protect behavior** — add focused characterization/regression coverage first when risk is high and protection is missing.
3. **Transform in small steps** — rename/extract/move/simplify before introducing new abstractions; use Strategy/Plugin/Port only when the approved design and real variation justify them.
4. **Verify after meaningful steps** — focused tests/typecheck/lint as appropriate; inspect the diff before stacking more changes.
5. **Do not hide failures** — do not weaken tests, widen catch blocks, suppress types/lint, or change error semantics merely to make checks pass.
6. **Broaden regression** — run the plan's required package/app/integration/E2E gates.
7. **Convergence check** — confirm the unit's target is actually reached, preserved contracts remain intact, unrelated behavior did not drift, and required documentation updates are identified.

## Boundaries

- No opportunistic feature work.
- No speculative architecture expansion outside the approved unit.
- No arbitrary line-count-driven fragmentation.
- If safe progress requires behavior/schema/protocol changes not in the plan, stop and report the conflict.

## Completion Output

Report actual transformations, structural changes, preserved contracts, verification evidence, any divergence from plan, and intentionally deferred issues. A failed required check means the unit is not complete.
