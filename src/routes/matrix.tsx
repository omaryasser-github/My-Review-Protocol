import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Plus, Trash2, RotateCcw } from "lucide-react";
import { BOUNDARIES, scoreMatrix, type Severity } from "@/data/review";
import { PageHeader, SeverityTag, meta } from "@/components/app/AppShell";
import { useLocalState } from "@/lib/use-local-state";
import { boundaryTrends } from "@/data/governance";

export const Route = createFileRoute("/matrix")({
  head: () => meta("Boundary Stress Matrix — Omar's Skills", "Audit AI code across the 5 critical failure boundaries."),
  component: Matrix,
});

const STATES = [
  { v: "pass", label: "Pass", cls: "bg-success text-primary-foreground" },
  { v: "fail", label: "Fail", cls: "bg-destructive text-destructive-foreground" },
  { v: "waive", label: "Waive", cls: "bg-warning text-primary-foreground" },
];

interface Failure { id: string; boundary: string; severity: Severity; note: string }

function Matrix() {
  const [results, setResults] = useLocalState<Record<string, string>>("matrix", {});
  const [log, setLog] = useLocalState<Failure[]>("failure-log", []);
  const [context, setContext] = useState("");
  const [draft, setDraft] = useState<{ boundary: string; severity: Severity; note: string }>({ boundary: BOUNDARIES[0]!.title, severity: "Blocker", note: "" });
  const [copied, setCopied] = useState(false);
  const s = scoreMatrix(results);

  const prompt = `You are a hostile senior reviewer red-teaming an AI-generated change.
Context: ${context || "<describe the change, files and side effects>"}

Attack the change across these 5 boundaries and list concrete failing inputs or scenarios for each:
${BOUNDARIES.map((b, i) => `${i + 1}. ${b.title}: ${b.checks.map((c) => c.text).join("; ")}`).join("\n")}

For every finding output: [Blocker|Warning|Nitpick] <boundary> — <scenario> — <expected vs actual> — <fix>.
Do not praise. Do not summarise. If you cannot break a boundary, say what you tried.`;

  return (
    <div>
      <PageHeader kicker="Audit" title="Boundary Stress Matrix" desc="Bugs live at the edges. Mark each check pass, fail or waive — blockers stop the merge." />
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-6 border-b border-border bg-background/90 px-6 py-3 backdrop-blur md:px-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-2xl font-bold text-primary">{s.score}%</span>
          <div className="h-2 w-40 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${s.score}%` }} /></div>
        </div>
        <span className="font-mono text-xs text-muted-foreground">{s.decided}/{s.total} reviewed</span>
        <span className={`font-mono text-xs ${s.blockers ? "text-destructive" : "text-muted-foreground"}`}>{s.blockers} open blocker{s.blockers === 1 ? "" : "s"}</span>
        <span className={`ml-auto rounded px-2 py-1 font-mono text-xs ${s.blockers ? "bg-destructive/15 text-destructive" : s.decided === s.total ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
          {s.blockers ? "MERGE BLOCKED" : s.decided === s.total ? "READY TO MERGE" : "IN REVIEW"}
        </span>
        <button onClick={() => setResults({})} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><RotateCcw className="h-3 w-3" />Reset</button>
      </div>
      <div className="grid gap-4 px-6 py-8 md:px-10 xl:grid-cols-2">
        {BOUNDARIES.map((b, bi) => (
          <div key={b.id} className="rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-5 py-3">
              <span className="font-mono text-xs text-primary">B{bi + 1}</span>
              <h2 className="font-semibold">{b.title}</h2>
            </div>
            <ul className="divide-y divide-border">
              {b.checks.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                  <SeverityTag s={c.severity} />
                  <span className="min-w-0 flex-1 text-sm">{c.text}</span>
                  <div className="flex overflow-hidden rounded-md border border-border">
                    {STATES.map((st) => (
                      <button key={st.v} onClick={() => setResults({ ...results, [c.id]: results[c.id] === st.v ? "" : st.v })}
                        className={`px-2.5 py-1 text-xs transition-colors ${results[c.id] === st.v ? st.cls : "text-muted-foreground hover:bg-muted"}`}>{st.label}</button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="grid gap-6 border-t border-border px-6 py-8 md:px-10 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold">Red-Team Prompt Generator</h2>
          <textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder="Describe the change (e.g. 'Adds POST /orders that writes to orders table and calls Stripe')"
            className="mt-3 h-20 w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:border-primary" />
          <div className="relative mt-3">
            <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted p-4 font-mono text-xs">{prompt}</pre>
            <button onClick={() => { navigator.clipboard.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="absolute right-2 top-2 flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs text-primary-foreground"><Copy className="h-3 w-3" />{copied ? "Copied" : "Copy"}</button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Failure-Mode Log</h2>
          <form className="mt-3 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); if (!draft.note.trim()) return; setLog([{ ...draft, id: crypto.randomUUID() }, ...log]); setDraft({ ...draft, note: "" }); }}>
            <select value={draft.boundary} onChange={(e) => setDraft({ ...draft, boundary: e.target.value })} className="rounded-md border border-input bg-background px-2 py-2 text-sm">
              {BOUNDARIES.map((b) => <option key={b.id}>{b.title}</option>)}
            </select>
            <select value={draft.severity} onChange={(e) => setDraft({ ...draft, severity: e.target.value as Severity })} className="rounded-md border border-input bg-background px-2 py-2 text-sm">
              <option>Blocker</option><option>Warning</option><option>Nitpick</option>
            </select>
            <input value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} placeholder="What broke?" className="min-w-40 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <button className="flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"><Plus className="h-4 w-4" />Log</button>
          </form>
          <div className="mt-4 rounded-md border border-border bg-card p-4">
            <p className="font-mono text-xs text-primary">3.3 · FAILURE TRENDS</p>
            <p className="mt-1 text-xs text-muted-foreground">Which boundaries fail most in your log (blockers weigh 3, warnings 2, nitpicks 1). Check the top ones hardest.</p>
            <ul className="mt-3 space-y-2">
              {boundaryTrends(log).map((t, i) => (
                <li key={t.boundary} className="text-xs">
                  <div className="flex justify-between"><span className={i === 0 && t.risk ? "font-semibold text-destructive" : ""}>{t.boundary}</span><span className="font-mono text-muted-foreground">{t.count} · {t.share}% · {t.blockers} blk</span></div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className={`h-full transition-all ${t.blockers ? "bg-destructive" : "bg-primary"}`} style={{ width: `${t.share}%` }} /></div>
                </li>
              ))}
            </ul>
          </div>
          <ul className="mt-4 space-y-2">
            {log.length === 0 && <li className="text-sm text-muted-foreground">No failure modes logged yet.</li>}
            {log.map((f) => (
              <li key={f.id} className="animate-fade-up flex items-start gap-3 rounded-md border border-border bg-card p-3">
                <SeverityTag s={f.severity} />
                <div className="min-w-0 flex-1"><p className="text-sm">{f.note}</p><p className="font-mono text-[11px] text-muted-foreground">{f.boundary}</p></div>
                <button aria-label="Delete" onClick={() => setLog(log.filter((x) => x.id !== f.id))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
