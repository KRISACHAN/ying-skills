# Artifact Protocol

Skills should persist important analysis, plans, and reviews so later steps do not depend on chat memory.

## Prefer Existing Project Conventions

If the target project already has Requirements, Specs, ADR, Reviews, or Engineering directories, follow them. Do not create a parallel source of truth.

If no convention exists, the default is:

```text
.engineering/
├── audits/
├── plans/
└── reviews/
```

## Required Metadata

Each persistent artifact should make these visible near the top when applicable:

- artifact type and status;
- target scope;
- baseline commit/ref or working-tree state;
- project standards/contracts consulted;
- related upstream artifact(s);
- decision/verdict;
- verification evidence or known gaps.

## Handoff

A downstream skill should explicitly read the upstream artifact instead of reconstructing it from memory.

```text
Audit → Plan → Solution Review → Implementation → Code Review
```

A human approval gate may exist between any high-impact steps. Do not infer approval merely because an upstream artifact exists.

## Append vs Overwrite

Preserve review/audit history. Do not overwrite an earlier review report unless the project convention explicitly models reports as mutable. Followups should link to the original report and record finding status.
