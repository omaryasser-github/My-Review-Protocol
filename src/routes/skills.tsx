import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DOMAINS, SKILLS, STATUSES, type SkillStatus } from "@/data/skills";
import { PageHeader, meta } from "@/components/app/AppShell";
import { useLocalState } from "@/lib/use-local-state";

export const Route = createFileRoute("/skills")({
  head: () => meta("Skill Repository — Omar's Skills", "Interactive taxonomy of core and supplementary engineering skills."),
  component: Skills,
});

const chip = (on: boolean) => `rounded-full border px-3 py-1 text-xs transition-colors ${on ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"}`;
const statusCls: Record<SkillStatus, string> = { "Not started": "bg-muted text-muted-foreground", Learning: "bg-warning/15 text-warning", Proficient: "bg-success/15 text-success" };

function Skills() {
  const [domain, setDomain] = useState("all");
  const [tier, setTier] = useState("all");
  const [status, setStatus] = useState("all");
  const [statuses, setStatuses] = useLocalState<Record<string, SkillStatus>>("skill-status", {});
  const [selected, setSelected] = useState(SKILLS[0]!.id);
  const st = (id: string) => statuses[id] ?? "Not started";
  const list = SKILLS.filter((s) => (domain === "all" || s.domain === domain) && (tier === "all" || s.tier === tier) && (status === "all" || st(s.id) === status));
  const sel = SKILLS.find((s) => s.id === selected)!;
  const prereqs = new Set(sel.prerequisites ?? []);
  const unlocks = new Set(SKILLS.filter((s) => s.prerequisites?.includes(sel.id)).map((s) => s.id));

  return (
    <div>
      <PageHeader kicker="Taxonomy" title="Engineering Skill Repository" desc="8 core skills every engineer must own unassisted, plus supplementary mid-level skills. Click a skill to see its links." />
      <div className="space-y-2 border-b border-border px-6 py-4 md:px-10">
        <div className="flex flex-wrap gap-2"><button className={chip(domain === "all")} onClick={() => setDomain("all")}>All domains</button>
          {DOMAINS.map((d) => <button key={d.id} className={chip(domain === d.id)} onClick={() => setDomain(d.id)}>{d.label}</button>)}</div>
        <div className="flex flex-wrap gap-2">
          {["all", "Core", "Supplementary"].map((t) => <button key={t} className={chip(tier === t)} onClick={() => setTier(t)}>{t === "all" ? "All tiers" : t}</button>)}
          <span className="mx-1 w-px bg-border" />
          {["all", ...STATUSES].map((t) => <button key={t} className={chip(status === t)} onClick={() => setStatus(t)}>{t === "all" ? "Any status" : t}</button>)}
        </div>
      </div>
      <div className="grid gap-6 px-6 py-8 md:px-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          {(["Core", "Supplementary"] as const).map((t) => {
            const items = list.filter((s) => s.tier === t);
            if (!items.length) return null;
            return (
              <div key={t}>
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">{t} · {items.length}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {items.map((s) => {
                    const rel = s.id === sel.id ? "border-primary bg-accent/40" : prereqs.has(s.id) ? "border-warning/70" : unlocks.has(s.id) ? "border-primary/50 border-dashed" : "border-border";
                    return (
                      <button key={s.id} onClick={() => setSelected(s.id)} className={`animate-fade-up flex items-start gap-3 rounded-lg border bg-card p-4 text-left transition-all hover:-translate-y-0.5 ${rel}`}>
                        <s.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-tight">{s.name}</p>
                          <span className={`mt-2 inline-block rounded px-1.5 py-0.5 font-mono text-[10px] ${statusCls[st(s.id)]}`}>{st(s.id)}</span>
                          {prereqs.has(s.id) && <span className="ml-1 font-mono text-[10px] text-warning">prereq</span>}
                          {unlocks.has(s.id) && <span className="ml-1 font-mono text-[10px] text-primary">unlocks</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {!list.length && <p className="text-sm text-muted-foreground">No skills match these filters.</p>}
        </div>
        <aside key={sel.id} className="animate-fade-up h-fit rounded-lg border border-border bg-card p-6 lg:sticky lg:top-6">
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground"><span className="text-primary">{sel.tier}</span>·{DOMAINS.find((d) => d.id === sel.domain)?.label}</div>
          <h2 className="mt-2 text-xl font-semibold">{sel.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{sel.summary}</p>
          <div className="mt-4 flex gap-1">
            {STATUSES.map((x) => <button key={x} onClick={() => setStatuses({ ...statuses, [sel.id]: x })} className={`flex-1 rounded-md border px-2 py-1.5 text-xs ${st(sel.id) === x ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-muted"}`}>{x}</button>)}
          </div>
          <h3 className="mt-6 text-sm font-semibold">Competencies</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{sel.competencies.map((c) => <li key={c}>{c}</li>)}</ul>
          <h3 className="mt-4 text-sm font-semibold">Unassisted practice</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{sel.practice.map((c) => <li key={c}>{c}</li>)}</ul>
          {!!sel.prerequisites?.length && <p className="mt-4 font-mono text-xs text-muted-foreground">requires: {sel.prerequisites.map((p) => SKILLS.find((s) => s.id === p)?.name).join(", ")}</p>}
        </aside>
      </div>
    </div>
  );
}
