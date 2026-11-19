import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { OWNERSHIP_QUESTIONS, rebuildDue, type Rebuild } from "@/data/governance";
import { PageHeader, meta } from "@/components/app/AppShell";
import { useLocalState } from "@/lib/use-local-state";

export const Route = createFileRoute("/ownership")({
  head: () => meta("Ownership & Practice — Omar's Skills", "Line ownership check before merge and a monthly unassisted rebuild tracker."),
  component: Ownership,
});

function Ownership() {
  const [own, setOwn] = useLocalState<Record<string, boolean>>("ownership-checks", {});
  const [rebuilds, setRebuilds] = useLocalState<Rebuild[]>("rebuilds", []);
  const [draft, setDraft] = useState({ date: "", feature: "", lesson: "" });
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => { setToday(new Date()); setDraft((d) => ({ ...d, date: new Date().toISOString().slice(0, 10) })); }, []);
  const owned = OWNERSHIP_QUESTIONS.filter((q) => own[q.id]).length;
  const due = today ? rebuildDue(rebuilds, today) : 0;
  return (
    <div>
      <PageHeader kicker="Section 3.4 · Knowledge Ownership" title="Ownership & Practice" desc="Speed is borrowed. Ownership is earned: explain every line you merge, and rebuild one feature a month with no AI." />
      <div className="grid gap-6 px-6 py-8 md:px-10 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Line Ownership Check</h2>
            <button onClick={() => setOwn({})} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><RotateCcw className="h-3 w-3" />Reset</button>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Answer honestly before every merge. If any is "no", you don't own it yet.</p>
          <ul className="mt-4 space-y-2">
            {OWNERSHIP_QUESTIONS.map((q) => (
              <li key={q.id}><label className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 hover:bg-muted/50">
                <input type="checkbox" checked={!!own[q.id]} onChange={() => setOwn({ ...own, [q.id]: !own[q.id] })} className="mt-1 accent-[var(--color-primary)]" />
                <span className="text-sm">{q.text}</span>
              </label></li>
            ))}
          </ul>
          <p className={`mt-4 rounded px-2 py-1 font-mono text-xs ${owned === OWNERSHIP_QUESTIONS.length ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
            {owned === OWNERSHIP_QUESTIONS.length ? "YOU OWN THIS CHANGE" : `NOT OWNED YET · ${owned}/${OWNERSHIP_QUESTIONS.length}`}
          </p>
        </section>
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Monthly Unassisted Rebuild</h2>
          <p className="mt-1 text-sm text-muted-foreground">Once a month, rebuild a small feature from scratch: no AI, real debugger, your own syntax.</p>
          <p className={`mt-3 font-mono text-sm ${due < 0 || !rebuilds.length ? "text-destructive" : "text-primary"}`}>
            {!rebuilds.length ? "No rebuild logged — start one now" : due < 0 ? `Overdue by ${-due} day${due === -1 ? "" : "s"}` : `Next rebuild due in ${due} day${due === 1 ? "" : "s"}`}
          </p>
          <form className="mt-4 grid gap-2" onSubmit={(e) => { e.preventDefault(); if (!draft.feature.trim() || !draft.date) return; setRebuilds([{ ...draft, id: crypto.randomUUID() }, ...rebuilds]); setDraft({ ...draft, feature: "", lesson: "" }); }}>
            <div className="flex gap-2">
              <input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className="rounded-md border border-input bg-background px-2 py-2 text-sm" />
              <input value={draft.feature} onChange={(e) => setDraft({ ...draft, feature: e.target.value })} placeholder="Feature rebuilt" className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <input value={draft.lesson} onChange={(e) => setDraft({ ...draft, lesson: e.target.value })} placeholder="What did you have to look up or debug?" className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <button className="flex items-center justify-center gap-1 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"><Plus className="h-4 w-4" />Log rebuild</button>
          </form>
          <ul className="mt-4 space-y-2">
            {rebuilds.map((r) => (
              <li key={r.id} className="animate-fade-up flex items-start gap-3 rounded-md border border-border p-3">
                <span className="font-mono text-[11px] text-muted-foreground">{r.date}</span>
                <div className="min-w-0 flex-1"><p className="text-sm font-medium">{r.feature}</p>{r.lesson && <p className="text-xs text-muted-foreground">{r.lesson}</p>}</div>
                <button aria-label="Delete" onClick={() => setRebuilds(rebuilds.filter((x) => x.id !== r.id))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
