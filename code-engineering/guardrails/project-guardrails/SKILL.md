---
name: project-guardrails
description: Establish or audit durable engineering guardrails for an existing code project: AI instructions, architecture boundaries, verification rules, documentation navigation, and enforceable quality gates. Use when onboarding a project to AI coding or when its engineering rules are missing, stale, or weak. Do not refactor business code.
---

# Project Guardrails

Create a durable project engineering profile that later AI work can discover and obey.

Read the shared defaults first:

- `../../references/engineering-principles.md`
- `../../references/module-first-architecture.md`
- `../../references/layered-architecture.md`
- `../../references/comments-and-documentation.md`
- `../../references/verification.md`

## Scope

Inspect the repository's existing sources of truth before adding anything:

- root and nested agent instructions (`AGENTS.md` or equivalent);
- README / CONTRIBUTING / architecture docs / ADRs;
- package/workspace manifests and repository layout;
- lint, formatter, typecheck/compiler, tests and CI;
- package/app/module boundaries and documented public contracts.

Existing explicit project rules outrank this skill group's defaults.

## Workflow

1. **Discover** — map current engineering instructions, architecture docs, verification commands, and hard gates.
2. **Assess gaps** — identify missing/contradictory/stale rules, architecture boundaries that exist only implicitly, and claims that are not executable.
3. **Define the profile** — document project purpose, major app/package/module responsibilities, dependency rules, code-quality expectations, documentation index, and verification matrix.
4. **Improve instructions** — create/update repository and scoped AI instructions only where they add real local value. Keep them short and navigable.
5. **Prefer executable constraints** — when a rule can safely be enforced with existing lint/type/structural test/CI infrastructure, prefer that over prose-only policy.
6. **Do not break the project to enforce ideals** — if a new hard gate would fail large amounts of existing code, record it as staged debt/target unless the user explicitly authorizes a cleanup campaign.
7. **Verify** — run the narrowest checks needed to prove documentation/config changes are internally consistent.

## Guardrail Content

The profile should make these discoverable:

- project architecture and ownership;
- allowed/forbidden dependency directions;
- public contracts and sensitive boundaries;
- refactoring expectations (behavior preservation, small steps);
- Clean Code expectations without numeric dogma;
- Strategy / Plugin / Adapter decision rules;
- structured comment/document roles;
- verification commands by scope;
- where requirements, plans, ADRs, and review artifacts live.

## Boundaries

- Do not redesign or refactor business behavior.
- Do not impose Module-first/layering when the project has a coherent alternative architecture.
- Do not add dependencies merely to enforce style when existing tooling can express the rule.
- Do not duplicate the same instruction across many files; use progressive disclosure and nearest-scope overrides.

## Output

Summarize what was discovered, what guardrails were added/changed, what remains advisory, verification performed, and intentionally deferred governance debt.
