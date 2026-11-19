export type Severity = "Blocker" | "Warning" | "Nitpick";

export const CHECKPOINTS = [
  { id: "scope", title: "Pre-Execution Scope Bounding", when: "Before generation",
    goal: "Constrain what the assistant may touch and what must not change.",
    steps: ["Write a one-paragraph scope with allowed files", "List permitted new side effects", "Name the acceptance test"] },
  { id: "gating", title: "Incremental Approval Gating", when: "During generation",
    goal: "Approve small slices; stop on out-of-scope edits.",
    steps: ["Require a plan before code", "Approve one concern per slice", "Halt on files outside scope"] },
  { id: "diff", title: "Post-Run Diff Auditing", when: "After generation",
    goal: "Audit outside-in: deletions, side effects, backward trace.",
    steps: ["Read deletions and modifications first", "Inventory terminal side effects", "Trace each back to its input boundary", "Run the Boundary Stress Matrix"] },
  { id: "gate", title: "Pre-Merge Automated Gate", when: "Before merge",
    goal: "Machines verify what humans should not have to.",
    steps: ["Typecheck, lint, tests green", "Coverage did not drop on touched files", "Security & secret scan clean", "Migrations reversible"] },
];

export const SIDE_EFFECTS = [
  { id: "db", label: "DB Writes", detail: "INSERT / UPDATE / DELETE, migrations" },
  { id: "http", label: "Outbound HTTP", detail: "Third-party APIs, webhooks" },
  { id: "queue", label: "Background Queues", detail: "Jobs, cron, workers" },
  { id: "events", label: "Event Emissions", detail: "Pub/sub, analytics, emails" },
];
export const TRACE_LAYERS = [
  { id: "boundary", label: "Input Boundary", detail: "Request, form, message, CLI arg" },
  { id: "validation", label: "Validation & AuthZ", detail: "Schema checks, permission gates" },
  { id: "logic", label: "Business Logic", detail: "Transformations, branching" },
  { id: "persistence", label: "Side-Effect Adapter", detail: "Repository, client, publisher" },
];

export const PRIORITY_AUDITS = [
  { title: "Line Deletion & Modification", items: ["Removed null/guard checks", "Removed retries, timeouts or logging", "Weakened validation regex or types", "Changed defaults or config keys"] },
  { title: "Boundary Layer Security", items: ["AuthN/AuthZ on every new entry point", "Input validated before use", "No secrets in code or logs", "Injection surfaces parameterized"] },
  { title: "Mock & Assertion Sanitization", items: ["Unit under test is not mocked", "Every test asserts behaviour", "No assertions loosened to pass", "No skipped or .only tests"] },
];

export interface Check { id: string; text: string; severity: Severity }
export const BOUNDARIES: { id: string; title: string; checks: Check[] }[] = [
  { id: "payload", title: "Payload Integrity", checks: [
    { id: "p1", text: "Empty payload / missing body handled", severity: "Blocker" },
    { id: "p2", text: "Zero-values (0, '', false) not treated as missing", severity: "Warning" },
    { id: "p3", text: "Structural type mismatches rejected", severity: "Blocker" },
    { id: "p4", text: "Malformed JSON returns 400, not 500", severity: "Warning" } ] },
  { id: "config", title: "Configuration", checks: [
    { id: "c1", text: "Missing env vars fail fast at startup", severity: "Blocker" },
    { id: "c2", text: "Fallback values are safe, not silent", severity: "Warning" },
    { id: "c3", text: "Uninitialized feature flags default to off", severity: "Warning" } ] },
  { id: "network", title: "Network Failure", checks: [
    { id: "n1", text: "Upstream calls have explicit timeouts", severity: "Blocker" },
    { id: "n2", text: "Transient drops retried with backoff + idempotency", severity: "Warning" },
    { id: "n3", text: "Circuit breaker / degraded mode exists", severity: "Nitpick" } ] },
  { id: "exception", title: "Exception Paths", checks: [
    { id: "e1", text: "No uncaught exceptions on async paths", severity: "Blocker" },
    { id: "e2", text: "No generic catch that swallows errors", severity: "Warning" },
    { id: "e3", text: "Multi-step writes roll back transactionally", severity: "Blocker" } ] },
  { id: "concurrency", title: "Concurrency", checks: [
    { id: "x1", text: "Race conditions on read-modify-write guarded", severity: "Blocker" },
    { id: "x2", text: "Shared state mutation is safe", severity: "Warning" },
    { id: "x3", text: "Concurrent duplicate requests handled", severity: "Warning" } ] },
];

export function scoreMatrix(results: Record<string, string>) {
  const all = BOUNDARIES.flatMap((b) => b.checks);
  const decided = all.filter((c) => results[c.id]);
  const passed = all.filter((c) => results[c.id] === "pass" || results[c.id] === "waive");
  const blockers = all.filter((c) => c.severity === "Blocker" && results[c.id] === "fail");
  return { total: all.length, decided: decided.length, score: Math.round((passed.length / all.length) * 100), blockers: blockers.length };
}
