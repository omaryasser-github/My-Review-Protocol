import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronRight, ArrowLeft, Database, Send, ListOrdered, Radio } from "lucide-react";
import { CHECKPOINTS, SIDE_EFFECTS, TRACE_LAYERS, PRIORITY_AUDITS } from "@/data/review";
import { PageHeader, meta } from "@/components/app/AppShell";
import { useLocalState } from "@/lib/use-local-state";

export const Route = createFileRoute("/")({
  head: () => meta("Review Runway — Omar's Skills", "A 4-checkpoint SOP for reviewing AI-generated code, outside-in."),
  component: Runway,
});

const SE_ICONS = { db: Database, http: Send, queue: ListOrdered, events: Radio } as const;

function Runway() {
  const [active, setActive] = useState(0);
  const [done, setDone] = useLocalState<Record<string, boolean>>("runway-steps", {});
  const [effect, setEffect] = useState("db");
  const [audits, setAudits] = useLocalState<Record<string, boolean>>("runway-audits", {});
  const cp = CHECKPOINTS[active];
  return (
    <div>
      <PageHeader kicker="Operational SOP" title="Review Runway" desc="Four checkpoints every AI-generated change must clear before it reaches production." />
      <section className="px-6 py-8 md:px-10">
        <div className="grid gap-2 md:grid-cols-4">
          {CHECKPOINTS.map((c, i) => {
            const n = c.steps.filter((_, j) => done[`${c.id}-${j}`]).length;
            const complete = n === c.steps.length;
            return (
              <button key={c.id} onClick={() => setActive(i)}
                className={`relative rounded-lg border p-4 text-left transition-all ${i === active ? "border-primary bg-accent/40" : "border-border bg-card hover:border-primary/50"}`}>
                <div className="flex items-center justify-between">
                  <span className={`grid h-7 w-7 place-items-center rounded-full font-mono text-xs ${complete ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{complete ? <Check className="h-3.5 w-3.5" /> : i + 1}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{n}/{c.steps.length}</span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-tight">{c.title}</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">{c.when}</p>
                {i < 3 && <ChevronRight className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-muted-foreground md:block" />}
              </button>
            );
          })}
        </div>
        <div key={cp.id} className="animate-fade-up mt-4 grid gap-6 rounded-lg border border-border bg-card p-6 md:grid-cols-2">
          <div>
            <p className="font-mono text-xs text-primary">CHECKPOINT {active + 1}</p>
            <h2 className="mt-1 text-xl font-semibold">{cp.title}</h2>
            <p className="mt-2 text-muted-foreground">{cp.goal}</p>
          </div>
          <ul className="space-y-2">
            {cp.steps.map((s, j) => {
              const k = `${cp.id}-${j}`;
              return (
                <li key={k}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 hover:bg-muted/50">
                    <input type="checkbox" checked={!!done[k]} onChange={() => setDone({ ...done, [k]: !done[k] })} className="mt-1 accent-[var(--color-primary)]" />
                    <span className={done[k] ? "text-muted-foreground line-through" : ""}>{s}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="border-t border-border px-6 py-8 md:px-10">
        <h2 className="text-xl font-semibold">Outside-In Backward Trace</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pick a terminal side effect. Read the diff from there backwards to the input boundary.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="grid grid-cols-2 gap-2">
            {SIDE_EFFECTS.map((e) => {
              const Icon = SE_ICONS[e.id as keyof typeof SE_ICONS];
              return (
                <button key={e.id} onClick={() => setEffect(e.id)}
                  className={`rounded-lg border p-4 text-left transition-all ${effect === e.id ? "border-destructive bg-destructive/10" : "border-border bg-card hover:border-destructive/50"}`}>
                  <Icon className={`h-5 w-5 ${effect === e.id ? "text-destructive" : "text-muted-foreground"}`} />
                  <p className="mt-2 text-sm font-semibold">{e.label}</p>
                  <p className="text-xs text-muted-foreground">{e.detail}</p>
                </button>
              );
            })}
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex flex-col-reverse gap-0">
              {TRACE_LAYERS.map((l, i) => (
                <div key={l.id + effect} className="animate-fade-up" style={{ animationDelay: `${(3 - i) * 90}ms` }}>
                  <div className="flex items-center gap-3 rounded-md border border-border bg-background p-3">
                    <span className="font-mono text-xs text-primary">{String(4 - i).padStart(2, "0")}</span>
                    <div><p className="text-sm font-medium">{l.label}</p><p className="text-xs text-muted-foreground">{l.detail}</p></div>
                  </div>
                  {i > 0 && <div className="flex justify-center py-1"><svg width="12" height="22"><line x1="6" y1="0" x2="6" y2="22" className="trace-line" stroke="var(--color-primary)" strokeWidth="2" /></svg></div>}
                </div>
              ))}
            </div>
            <div className="mt-1 flex justify-center py-1"><svg width="12" height="22"><line x1="6" y1="0" x2="6" y2="22" className="trace-line" stroke="var(--color-destructive)" strokeWidth="2" /></svg></div>
            <div className="flex items-center gap-2 rounded-md border border-destructive bg-destructive/10 p-3 text-sm font-medium text-destructive">
              <ArrowLeft className="h-4 w-4 rotate-90" /> Start here: {SIDE_EFFECTS.find((e) => e.id === effect)?.label}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-8 md:px-10">
        <h2 className="text-xl font-semibold">Priority Audit Guides</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {PRIORITY_AUDITS.map((a) => (
            <div key={a.title} className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold">{a.title}</h3>
              <ul className="mt-3 space-y-2">
                {a.items.map((it) => {
                  const k = `${a.title}-${it}`;
                  return (
                    <li key={k}><label className="flex cursor-pointer gap-2 text-sm">
                      <input type="checkbox" checked={!!audits[k]} onChange={() => setAudits({ ...audits, [k]: !audits[k] })} className="mt-1 accent-[var(--color-primary)]" />
                      <span className={audits[k] ? "text-muted-foreground line-through" : ""}>{it}</span>
                    </label></li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
