import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ArrowRight, RotateCcw } from "lucide-react";
import { STAGES, INTENT_FIELDS, DIFF_GATES, protocolProgress } from "@/data/protocol";
import { PageHeader, meta } from "@/components/app/AppShell";
import { useLocalState } from "@/lib/use-local-state";

export const Route = createFileRoute("/protocol")({
  head: () => meta("Core Review Protocol — Omar's Skills", "Six guided stages for reviewing unexamined AI-generated modules, from intent to diff gating."),
  component: Protocol,
});

function Protocol() {
  const [active, setActive] = useState(0);
  const [done, setDone] = useLocalState<Record<string, boolean>>("protocol-checks", {});
  const [intent, setIntent] = useLocalState<Record<string, string>>("protocol-intent", {});
  const prog = protocolProgress(done);
  const stage = STAGES[active]!;
  return (
    <div>
      <PageHeader kicker="Section 2 · Core Protocol" title="Core Review Protocol" desc="Six stages for reviewing an AI-generated module you have never seen. Write your intent first, then let the code prove it." />
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-4 border-b border-border bg-background/90 px-6 py-3 backdrop-blur md:px-10">
        <div className="h-2 min-w-40 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${prog.percent}%` }} /></div>
        <span className="font-mono text-xs">{prog.percent}% · {prog.stagesComplete}/6 stages</span>
        <button onClick={() => { setDone({}); setIntent({}); }} className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted"><RotateCcw className="h-3 w-3" />Reset</button>
      </div>
      <section className="grid gap-6 px-6 py-8 md:px-10 lg:grid-cols-[260px_1fr]">
        <ol className="space-y-2">
          {STAGES.map((s, i) => {
            const p = prog.perStage[i]!;
            return (
              <li key={s.id}>
                <button onClick={() => setActive(i)} className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all ${i === active ? "border-primary bg-accent/40" : "border-border bg-card hover:border-primary/50"}`}>
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[11px] ${p.complete ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{p.complete ? <Check className="h-3.5 w-3.5" /> : s.section}</span>
                  <span className="min-w-0 flex-1 text-sm font-medium leading-tight">{s.title}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{p.done}/{p.total}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <div key={stage.id} className="animate-fade-up space-y-6 rounded-lg border border-border bg-card p-6">
          <div>
            <p className="font-mono text-xs text-primary">STAGE {stage.section}</p>
            <h2 className="mt-1 text-2xl font-semibold">{stage.title}</h2>
            <p className="mt-2 text-muted-foreground">{stage.why}</p>
          </div>
          {stage.id === "intent" && (
            <div className="grid gap-3 md:grid-cols-2">
              {INTENT_FIELDS.map((f) => (
                <label key={f.id} className="block">
                  <span className="text-sm font-medium">{f.label}</span>
                  <textarea value={intent[f.id] ?? ""} onChange={(e) => setIntent({ ...intent, [f.id]: e.target.value })} placeholder={f.hint} rows={3}
                    className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm focus:border-primary focus:outline-none" />
                </label>
              ))}
            </div>
          )}
          {stage.id === "gating" && (
            <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
              {DIFF_GATES.map((g, i) => (
                <div key={g.id} className="flex flex-1 items-center gap-2">
                  <div className="flex-1 rounded-md border border-border bg-background p-3">
                    <p className="font-mono text-xs text-primary">GATE {i + 1}</p>
                    <p className="text-sm font-medium">{g.label}</p>
                    <p className="text-xs text-muted-foreground">{g.detail}</p>
                  </div>
                  {i < DIFF_GATES.length - 1 && <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground md:block" />}
                </div>
              ))}
            </div>
          )}
          <ul className="space-y-2">
            {stage.checks.map((c, j) => {
              const k = `${stage.id}-${j}`;
              return (
                <li key={k}><label className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 hover:bg-muted/50">
                  <input type="checkbox" checked={!!done[k]} onChange={() => setDone({ ...done, [k]: !done[k] })} className="mt-1 accent-[var(--color-primary)]" />
                  <span className={done[k] ? "text-muted-foreground line-through" : ""}>{c}</span>
                </label></li>
              );
            })}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-3">
            {stage.link ? <Link to={stage.link.to} className="text-sm font-medium text-primary hover:underline">{stage.link.label} →</Link> : <span />}
            {active < STAGES.length - 1 && <button onClick={() => setActive(active + 1)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Next stage</button>}
          </div>
        </div>
      </section>
    </div>
  );
}
