import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PHASES } from "@/data/roadmap";
import { PageHeader, meta } from "@/components/app/AppShell";
import { useLocalState } from "@/lib/use-local-state";

export const Route = createFileRoute("/roadmap")({
  head: () => meta("Growth Roadmap — Omar's Skills", "A phased anti-atrophy roadmap for junior developers."),
  component: Roadmap,
});

function Roadmap() {
  const [done, setDone] = useLocalState<Record<string, boolean>>("roadmap", {});
  const total = PHASES.reduce((n, p) => n + p.milestones.length, 0);
  const count = Object.values(done).filter(Boolean).length;
  return (
    <div>
      <PageHeader kicker="Anti-atrophy" title="Phased Growth Roadmap" desc="Deliberate, unassisted reps that keep fundamentals sharp while AI handles the typing. Progress saves in this browser." />
      <div className="px-6 py-8 md:px-10">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-muted-foreground">{count}/{total} milestones</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${(count / total) * 100}%` }} /></div>
        </div>
        <ol className="relative mt-8 space-y-8 border-l border-border pl-8">
          {PHASES.map((p, i) => {
            const n = p.milestones.filter((_, j) => done[`${p.id}-${j}`]).length;
            const pct = Math.round((n / p.milestones.length) * 100);
            return (
              <li key={p.id} className="relative">
                <span className={`absolute -left-[45px] grid h-7 w-7 place-items-center rounded-full border-2 font-mono text-xs ${pct === 100 ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}>{pct === 100 ? <Check className="h-3.5 w-3.5" /> : i + 1}</span>
                <p className="font-mono text-xs uppercase tracking-widest text-primary">Phase {i + 1} · {p.focus}</p>
                <div className="flex items-baseline justify-between"><h2 className="text-xl font-semibold">{p.title}</h2><span className="font-mono text-sm text-muted-foreground">{pct}%</span></div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {p.milestones.map((m, j) => {
                    const k = `${p.id}-${j}`;
                    return (
                      <label key={k} className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors ${done[k] ? "border-primary/40 bg-accent/30" : "border-border bg-card hover:bg-muted/50"}`}>
                        <input type="checkbox" checked={!!done[k]} onChange={() => setDone({ ...done, [k]: !done[k] })} className="mt-1 accent-[var(--color-primary)]" />
                        <span className={`text-sm ${done[k] ? "text-muted-foreground line-through" : ""}`}>{m}</span>
                      </label>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
