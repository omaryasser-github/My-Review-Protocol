import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText } from "lucide-react";
import vision from "../../docs/VISION_AND_ARCHITECTURE.md?raw";
import sop from "../../docs/CODE_REVIEW_SOP.md?raw";
import extending from "../../docs/EXTENDING_SKILLS.md?raw";
import adding from "../../docs/ADDING_A_SKILL.md?raw";
import { meta } from "@/components/app/AppShell";

export const Route = createFileRoute("/docs")({
  head: () => meta("Docs — Omar's Skills", "Vision, code review SOP and guide to extending the skill repository."),
  component: Docs,
});

const DOCS = [
  { id: "vision", title: "Vision & Architecture", file: "VISION_AND_ARCHITECTURE.md", body: vision },
  { id: "sop", title: "Code Review SOP", file: "CODE_REVIEW_SOP.md", body: sop },
  { id: "extending", title: "Extending Skills", file: "EXTENDING_SKILLS.md", body: extending },
  { id: "adding", title: "Adding a Skill to the Canvas", file: "ADDING_A_SKILL.md", body: adding },
];

function Docs() {
  const [id, setId] = useState(DOCS[0]!.id);
  const doc = DOCS.find((d) => d.id === id)!;
  return (
    <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
      <nav className="border-b border-border p-4 lg:border-b-0 lg:border-r">
        <p className="mb-3 px-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">docs/</p>
        {DOCS.map((d) => (
          <button key={d.id} onClick={() => setId(d.id)} className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm ${d.id === id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"}`}>
            <FileText className="h-4 w-4 shrink-0" /><span className="truncate font-mono text-xs">{d.file}</span>
          </button>
        ))}
      </nav>
      <article key={id} className="prose-doc animate-fade-up max-w-3xl px-6 py-10 md:px-12">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.body}</ReactMarkdown>
      </article>
    </div>
  );
}
