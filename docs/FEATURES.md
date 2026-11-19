# Features & Skills

## Features

| Page | What it does |
|------|--------------|
| **Review Runway** (`/`) | 4-checkpoint review process with tick-off steps, an interactive outside-in backward-trace diagram, and 3 priority audit checklists. |
| **Core Review Protocol** (`/protocol`) | Guided 6-stage walk through Section 2 of the guide: write your intent first (inputs, outputs, side effects, error paths, acceptance), outside-in reading, risk-weighted line auditing, boundary stress testing, test suite integrity and hierarchical diff gating. Live progress and reset. |
| **Stress Matrix** (`/matrix`) | Pass / fail / waive every check across 5 failure boundaries, live score, open-blocker count and merge status (Merge Blocked / In Review / Ready to Merge). Includes a red-team AI prompt generator and a failure-mode log. |
| **Docs** (`/docs`) | Reads the markdown files in `docs/` inside the app. |
| **Dark / light mode** | Toggle in the sidebar, remembered per browser. |
| **Saved progress** | Everything you tick is kept in your browser — no login. |

## Skills

### Review checkpoints
1. **Pre-Execution Scope Bounding** — write the scope, list allowed side effects, name the acceptance test.
2. **Incremental Approval Gating** — plan before code, approve one concern per slice, halt on out-of-scope files.
3. **Post-Run Diff Auditing** — read deletions first, inventory side effects, trace back to the input, run the matrix.
4. **Pre-Merge Automated Gate** — typecheck/lint/tests green, coverage held, security scan clean, migrations reversible.

### Core protocol stages (Section 2)
2.1 Reconstruct System Intent · 2.2 Outside-In Reading · 2.3 Risk-Weighted Line Auditing · 2.4 Boundary Stress Testing · 2.5 Test Suite Integrity · 2.6 Hierarchical Diff Gating (noise filter → file tree → line inspection)

### Backward tracing
Side effects: DB writes · Outbound HTTP · Background queues · Event emissions
Traced through: Side-effect adapter → Business logic → Validation & AuthZ → Input boundary

### Priority audits
- **Line deletion & modification** — removed guards, retries, logging; weakened validation; changed defaults.
- **Boundary layer security** — auth on new entry points, input validation, no secrets, parameterized queries.
- **Mock & assertion sanitization** — unit under test not mocked, real assertions, nothing loosened or skipped.

### Boundary stress checks (16)
| Boundary | Checks |
|----------|--------|
| Payload Integrity | Empty payload [Blocker] · Zero-values [Warning] · Type mismatches [Blocker] · Malformed JSON → 400 [Warning] |
| Configuration | Missing env vars fail fast [Blocker] · Safe fallbacks [Warning] · Flags default off [Warning] |
| Network Failure | Explicit timeouts [Blocker] · Retry + backoff [Warning] · Circuit breaker [Nitpick] |
| Exception Paths | No uncaught async errors [Blocker] · No swallowing catch [Warning] · Transactional rollback [Blocker] |
| Concurrency | Read-modify-write races [Blocker] · Shared state safety [Warning] · Duplicate requests [Warning] |

To add your own, see **ADDING_A_SKILL.md**.
