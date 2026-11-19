import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { OWNERSHIP_QUESTIONS } from "@/data/governance";
import { PageHeader, meta } from "@/components/app/AppShell";
import { useLocalState } from "@/lib/use-local-state";

export const Route = createFileRoute("/ownership")({
  head: () => meta("Ownership & Practice — Omar's Skills", "Line ownership check before merge: explain trade-offs, failure modes and low-level mechanics."),
  component: Ownership,
});

function Ownership() {
  const [own, setOwn] = useLocalState<Record<string, boolean>>("ownership-checks", {});
  const owned = OWNERSHIP_QUESTIONS.filter((q) => own[q.id]).length;
  return (
    <div>
      <PageHeader kicker="Section 3.4 · Knowledge Ownership" title="Ownership & Practice" desc="Speed is borrowed. Ownership is earned: explain every line you merge." />
      <div className="px-6 py-8 md:px-10">
        <section className="mx-auto max-w-3xl rounded-lg border border-border bg-card p-6">
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
      </div>
    </div>
  );
}
