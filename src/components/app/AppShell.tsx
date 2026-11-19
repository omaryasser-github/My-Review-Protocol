import { Link } from "@tanstack/react-router";
import { Route as RouteIcon, Grid3x3, BookOpen, ShieldCheck, Moon, Sun, Terminal } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

const NAV = [
  { to: "/", label: "Review Runway", icon: RouteIcon },
  { to: "/protocol", label: "Core Protocol", icon: ShieldCheck },
  { to: "/matrix", label: "Stress Matrix", icon: Grid3x3 },
  { to: "/docs", label: "Docs", icon: BookOpen },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(true);
  useEffect(() => { const s = localStorage.getItem("theme"); if (s) setDark(s === "dark"); }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); localStorage.setItem("theme", dark ? "dark" : "light"); }, [dark]);
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground md:flex-row">
      <aside className="border-b border-border bg-card/50 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between p-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground"><Terminal className="h-4 w-4" /></span>
            <span className="font-semibold tracking-tight">Omar's Skills</span>
          </Link>
          <button aria-label="Toggle theme" onClick={() => setDark(!dark)} className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-accent !text-accent-foreground font-medium" }}>
              <n.icon className="h-4 w-4" />{n.label}
            </Link>
          ))}
        </nav>
        <p className="hidden px-6 pt-6 font-mono text-[11px] leading-relaxed text-muted-foreground md:block">
          // ship fast.<br />// own every line.
        </p>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

export function PageHeader({ kicker, title, desc }: { kicker: string; title: string; desc: string }) {
  return (
    <header className="bg-grid border-b border-border px-6 py-10 md:px-10">
      <p className="font-mono text-xs uppercase tracking-widest text-primary">{kicker}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{desc}</p>
    </header>
  );
}

export function SeverityTag({ s }: { s: "Blocker" | "Warning" | "Nitpick" }) {
  const cls = s === "Blocker" ? "bg-destructive/15 text-destructive" : s === "Warning" ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground";
  return <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-medium ${cls}`}>[{s}]</span>;
}

export function meta(title: string, description: string) {
  return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] };
}
