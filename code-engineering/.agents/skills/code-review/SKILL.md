---
name: code-review
description: Independent review of implemented code for correctness, solution/spec compliance, Clean Code and refactoring quality, architecture boundaries, Strategy/Plugin/Adapter fit, security/performance risks, verification gaps, and documentation drift. Review only; do not fix findings.
---

# Code Review

Review what was actually implemented.

Read:

- `../../references/engineering-principles.md`
- `../../references/clean-code.md`
- `../../references/refactoring.md`
- `../../references/module-first-architecture.md`
- `../../references/layered-architecture.md`
- `../../references/ports-and-adapters.md`
- `../../references/strategy-and-plugin.md`
- `../../references/comments-and-documentation.md`
- `../../references/verification.md`
- `../../references/artifact-protocol.md`

Load project-specific standards, nearest module/package docs, related solution/spec/plan, and relevant diff/commit/PR/path evidence.

## Review Lenses

1. **Correctness & data safety** — behavior, states, errors, transactions, persistence, ordering, concurrency, compatibility.
2. **Solution/spec compliance** — implementation matches approved requirements/plan and does not add hidden scope.
3. **Architecture** — module ownership, dependency direction, public boundaries, composition, infrastructure leakage, architecture drift.
4. **Clean Code / Refactoring** — naming, cohesion, abstraction levels, duplication of knowledge, long/complex flows, broad responsibilities, testability.
5. **Pattern fit** — Strategy/Plugin/Port/Adapter are justified; flag speculative or missing abstractions with evidence.
6. **Security & performance** — only evidence-backed risks relevant to the scope.
7. **Verification gap** — ask not only “is the code wrong?” but also “if this important behavior broke, would a current test/gate fail?”
8. **Documentation** — Why/invariant/boundary comments and README/ADR/index updates match structural changes.

## Scope

Honor explicit user scope first. If no scope is supplied, use the project's normal review convention; if none exists, prefer staged diff, then unstaged diff, and stop if there is nothing concrete to review.

## Findings

- Findings require evidence and impact; cite path/line/symbol when possible.
- Separate blockers from improvements.
- Do not manufacture findings to reach a quota. `0 findings` is valid.
- Do not fix code in this skill.

Recommended verdicts: **PASS / WATCH / REQUEST_CHANGES**.

Persist the report using project conventions or the fallback artifact protocol, including standards consulted, verification evidence observed, and gaps not independently verified.
