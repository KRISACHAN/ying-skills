# Comments and Documentation

Documentation is a navigable knowledge layer for humans and AI agents. It should preserve intent that code alone cannot reliably communicate.

## Structured Code Comments

Prefer comments for:

- **Why** — rationale not obvious from code.
- **Invariant** — conditions that must remain true.
- **Boundary** — what a component owns/does not own.
- **Tradeoff** — why a less-obvious implementation is intentional.
- **Lifecycle/Ordering** — important sequencing, concurrency, or state-transition constraints.

Avoid comments that merely narrate syntax or stale implementation detail.

## Document Roles

- `README`: what the project/package/module is, responsibilities, architecture, public entry points, data flow, usage, verification, navigation.
- `AGENTS.md` or equivalent agent instructions: rules for modifying this subtree, required reading, forbidden dependencies, invariants, verification commands.
- `ADR`: durable architecture decisions—Context, Decision, Alternatives, Consequences.
- Architecture index: repository → app/package → module → important docs/contracts.

## Progressive Disclosure

Do not create a single giant document. A reader/agent should be able to start at repository-level context and progressively navigate to the nearest relevant package/module documentation.

## Synchronization

When structure, ownership, public contracts, invariants, or important tradeoffs change, update the relevant documentation in the same change or explicitly record the documentation debt.
