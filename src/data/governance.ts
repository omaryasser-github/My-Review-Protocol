import { BOUNDARIES, type Severity } from "./review";

/** Section 3.2 — AI self-explanation prompt. */
export const JUSTIFICATION_ASKS = [
  "Why this design pattern and structure, and what simpler option was rejected?",
  "List every helper, abstraction or dependency I did not ask for, and why it exists.",
  "State every assumed constraint: input volume, latency, concurrency, data shape.",
  "Describe the end-to-end flow as a numbered list from input to each side effect.",
  "Which lines would you remove first if this had to be half the size?",
] as const;

export function justificationPrompt(target: string) {
  return `You generated the code below. Justify it before I review it.
Code / scope: ${target.trim() || "<paste the module, function or line range>"}

Answer each point concretely, citing line numbers:
${JUSTIFICATION_ASKS.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Then produce a short Mermaid flowchart of the flow. I will check every claim against the code, so mark anything you are unsure of as UNVERIFIED.`;
}

/** Section 3.3 — empirical failure trends from the failure-mode log. */
export interface LoggedFailure { boundary: string; severity: Severity }
const WEIGHT: Record<Severity, number> = { Blocker: 3, Warning: 2, Nitpick: 1 };

export function boundaryTrends(log: LoggedFailure[]) {
  const rows = BOUNDARIES.map((b) => {
    const hits = log.filter((f) => f.boundary === b.title);
    return { boundary: b.title, count: hits.length, blockers: hits.filter((f) => f.severity === "Blocker").length, risk: hits.reduce((a, f) => a + WEIGHT[f.severity], 0) };
  });
  const total = log.length;
  return rows.map((r) => ({ ...r, share: total ? Math.round((r.count / total) * 100) : 0 })).sort((a, b) => b.risk - a.risk);
}

/** Section 3.4 — knowledge ownership. */
export const OWNERSHIP_QUESTIONS = [
  { id: "tradeoffs", text: "I can explain the design trade-offs and what was rejected." },
  { id: "failures", text: "I can name how it fails in production and what the user sees." },
  { id: "mechanics", text: "I can walk through the low-level mechanics line by line without the AI." },
] as const;

export interface Rebuild { id: string; date: string; feature: string; lesson: string }

/** Days until the next monthly unassisted rebuild is due (negative = overdue). */
export function rebuildDue(rebuilds: Rebuild[], today: Date) {
  if (!rebuilds.length) return 0;
  const last = rebuilds.map((r) => new Date(r.date).getTime()).reduce((a, b) => Math.max(a, b));
  return Math.ceil((last + 30 * 864e5 - today.getTime()) / 864e5);
}
