---
name: code-documentation
description: Create or synchronize structured code comments and architecture documentation for a repository/package/app/module after implementation or when documentation is missing or stale. Focus on Why, invariants, boundaries, tradeoffs, README/AGENTS navigation, ADRs, and indexes. Do not change runtime behavior.
---

# Code Documentation

Maintain a navigable knowledge layer for humans and AI.

Read:

- `../../references/comments-and-documentation.md`
- `../../references/engineering-principles.md`
- `../../references/module-first-architecture.md`

Load project documentation conventions before creating new files.

## Workflow

1. Map existing README/AGENTS/ADR/architecture/spec indexes and avoid creating parallel sources of truth.
2. Read the target code enough to understand actual responsibility and current behavior; documentation must describe reality, not desired architecture.
3. Add/update structured comments only for non-obvious Why, Invariant, Boundary, Tradeoff, Lifecycle/Ordering concerns.
4. Ensure package/app/module README documents purpose, responsibilities/non-responsibilities, public entry points, dependencies, data flow, extension points, and verification where useful.
5. Update agent instructions only when a subtree has durable modification rules that differ from parent scope.
6. Record durable architecture decisions as ADRs when the project uses ADRs or when a decision is important enough to outlive the implementation discussion.
7. Maintain progressive indexes so a reader can navigate Repository → App/Package → Module → Contract/ADR.
8. Verify links/commands/examples where practical.

## Boundaries

- Do not narrate obvious syntax.
- Do not add comments as compensation for confusing code when a safe code simplification is the real fix; report that separately.
- Do not rewrite requirements/history to match current implementation unless explicitly requested.
- Do not change runtime behavior.

Output a summary of updated knowledge surfaces and any documentation debt intentionally left open.
