export interface ProtocolStage {
  id: string;
  section: string;
  title: string;
  why: string;
  checks: string[];
  link?: { to: "/" | "/matrix"; label: string };
}

export const INTENT_FIELDS = [
  { id: "inputs", label: "Expected inputs", hint: "Shapes, sources, who can call it" },
  { id: "outputs", label: "Expected outputs", hint: "Return values, status codes, UI state" },
  { id: "effects", label: "Allowed side effects", hint: "DB writes, HTTP calls, queues, events" },
  { id: "errors", label: "Error paths", hint: "What must fail, and how loudly" },
  { id: "acceptance", label: "Acceptance criteria", hint: "The test that proves it works" },
] as const;

export const DIFF_GATES = [
  { id: "noise", label: "Automated noise filter", detail: "Formatter, linter and type checker run first" },
  { id: "tree", label: "File modification tree", detail: "Which files changed, and are they in scope?" },
  { id: "lines", label: "Granular line inspection", detail: "Human reads only the lines that matter" },
] as const;

export const STAGES: ProtocolStage[] = [
  { id: "intent", section: "2.1", title: "Reconstruct System Intent",
    why: "Write your own mental model before reading generated code, so the code can't convince you of its own correctness.",
    checks: ["Intent written before opening the diff", "Every side effect in the code was predicted", "Unexpected behaviour listed as a finding"] },
  { id: "outside-in", section: "2.2", title: "Outside-In Reading",
    why: "Start at terminal side effects and trace backwards to the input boundary; also audit macro-level integration.",
    checks: ["Every DB write / HTTP call / queue / event traced to its input", "Schema and migration changes reviewed", "Global state and third-party integrations checked"],
    link: { to: "/", label: "Open the backward-trace diagram" } },
  { id: "deletions", section: "2.3", title: "Risk-Weighted Line Auditing",
    why: "Deleted and modified lines are the loudest: AI tools quietly drop guards, retries and validation.",
    checks: ["Every removed guard or null check justified", "No retries, timeouts or logging silently dropped", "No defaults or config keys changed without reason", "Auth and input validation intact on entry points"] },
  { id: "stress", section: "2.4", title: "Boundary Stress Testing",
    why: "Bugs concentrate at boundaries: payload, configuration, network, exceptions and concurrency.",
    checks: ["Stress Matrix completed", "Zero open blockers"],
    link: { to: "/matrix", label: "Open the Stress Matrix" } },
  { id: "tests", section: "2.5", title: "Test Suite Integrity",
    why: "Read tests before code: a test that mocks the unit under test or asserts nothing proves nothing.",
    checks: ["Tests read before implementation", "Unit under test is not mocked", "Every test asserts a business rule", "No assertions weakened, skipped or .only"] },
  { id: "gating", section: "2.6", title: "Hierarchical Diff Gating",
    why: "Let machines filter noise so human attention goes to the lines that carry risk.",
    checks: ["Automated gates green before human review", "File tree reviewed for out-of-scope edits", "Line review limited to risk-bearing changes"] },
];

export function protocolProgress(done: Record<string, boolean>) {
  const perStage = STAGES.map((s) => {
    const n = s.checks.filter((_, i) => done[`${s.id}-${i}`]).length;
    return { id: s.id, done: n, total: s.checks.length, complete: n === s.checks.length };
  });
  const total = perStage.reduce((a, s) => a + s.total, 0);
  const finished = perStage.reduce((a, s) => a + s.done, 0);
  return { perStage, total, finished, percent: Math.round((finished / total) * 100), stagesComplete: perStage.filter((s) => s.complete).length };
}
