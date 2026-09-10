---
name: review-followup
description: Validate and resolve findings from a solution-review or code-review report. Classifies each finding as Valid, Partially Valid, Invalid, or Obsolete before changing anything; then applies minimal fixes to the solution artifact or code and performs appropriate verification. Does not blindly obey review findings.
---

# Review Followup

Treat a review report as claims to verify, not absolute authority.

Read:

- `../../references/engineering-principles.md`
- `../../references/verification.md`
- `../../references/artifact-protocol.md`

Also load the reference files used by the originating review type and the current target-project standards.

## Workflow

1. **Load original report and current state** — identify review type, reviewed baseline, and whether code/artifact has changed since.
2. **Verify each finding independently** against source artifacts, code, tests, contracts, and project rules.
3. **Classify** every finding:
   - `Valid` — evidence and impact are correct.
   - `Partially Valid` — core concern is real but scope/severity/remedy is overstated or incomplete.
   - `Invalid` — evidence/assumption is wrong or conflicts with authoritative project contract.
   - `Obsolete` — later changes already resolved or invalidated it.
4. **Resolve valid concerns minimally**:
   - solution finding → edit the solution/spec/plan, preserving unrelated content;
   - code finding → edit code/tests/docs as required, respecting the approved solution.
5. **Verify** relevant behavior. For code fixes, run focused checks and the regression required by blast radius. For solution fixes, re-check internal consistency and referenced contracts.
6. **Record status** — link back to the original report; state evidence, actual fix or rejection rationale, verification results, and remaining concerns.

## Boundaries

- Do not implement unrelated improvements while resolving findings.
- Do not weaken tests/contracts to satisfy a reviewer.
- Do not mark a finding resolved without evidence.
- Do not automatically run a fresh review and call it approved; the normal next step is to invoke the corresponding review skill again.

Output a followup artifact when the project keeps review history; otherwise provide a structured summary suitable for re-review.
