# AI-Generated Code Review — Standard Operating Procedure

Applies to any change where an AI assistant authored more than trivial lines.

## Checkpoint 1 — Pre-Execution Scope Bounding
Before the assistant writes anything:
1. Write a one-paragraph scope: the files it may touch, the behaviour that must change, and what must **not** change.
2. List the terminal side effects the change is allowed to introduce (new tables, new HTTP calls, new events).
3. Name the acceptance test that will prove it works.

**Exit criteria:** scope written and pasted into the prompt.

## Checkpoint 2 — Incremental Approval Gating
1. Ask for a plan before code. Reject plans that exceed scope.
2. Approve changes in small slices (one module / one concern per step).
3. Stop the run the moment it edits a file outside scope.

**Exit criteria:** every slice approved by a human, none outside scope.

## Checkpoint 3 — Post-Run Diff Auditing (outside-in)
1. **Deletions first.** Read every removed or modified line. Was a guard, retry, log, validation or assertion removed? Why?
2. **Terminal side effects.** Find every DB write, outbound request, queue publish and event emission in the diff.
3. **Trace backwards** from each one to the input boundary: what data reaches it, validated by what, authorised by whom?
4. **Boundary layer security.** Authn/authz checks, input validation, secret handling, injection surfaces.
5. **Mock & assertion sanitization.** Tests that mock the unit under test, assert nothing, or were weakened to pass are blockers.
6. Run the Boundary Stress Matrix and tag findings `[Blocker]`, `[Warning]`, `[Nitpick]`.

**Exit criteria:** zero open blockers; warnings ticketed or waived with a reason.

## Checkpoint 4 — Pre-Merge Automated Gate
- Typecheck, lint, unit + integration tests green.
- Coverage did not drop on touched files.
- Dependency/security scan clean; no new secrets in the diff.
- Migration reviewed and reversible.

**Exit criteria:** CI green and reviewer signs off by name.

## Severity tags
| Tag | Meaning | Merge? |
|---|---|---|
| `[Blocker]` | Correctness, security or data-loss risk | No |
| `[Warning]` | Likely bug or maintainability debt | With ticket or waiver |
| `[Nitpick]` | Style / naming | Yes |

## Red-team prompt
Use the generator in the Stress Matrix to ask a *second* model to attack the change across the five boundaries. Log each failure mode it finds, then verify it yourself — the red-team model is a lead, not a verdict.
