# Extending the Skill Repository

All skills live in **`src/data/skills.ts`**. The UI reads the registry; you never touch a component to add a skill.

> Want the exact field-by-field recipe, including how `prerequisites` becomes a visible edge in the canvas and how to verify it? See **[ADDING_A_SKILL.md](ADDING_A_SKILL.md)**.

## Schema
```ts
export interface Skill {
  id: string;            // kebab-case, unique
  name: string;
  domain: Domain;        // must exist in DOMAINS
  tier: "Core" | "Supplementary";
  summary: string;
  competencies: string[]; // observable, testable behaviours
  practice: string[];     // concrete unassisted exercises
  prerequisites?: string[]; // other skill ids — drawn as tree edges
}
```

## Adding a skill
1. Append an object to `SKILLS`.
2. Write competencies as things a reviewer can *observe* ("Can explain isolation levels and pick one"), not topics ("Databases").
3. Add `prerequisites` so it hangs correctly in the tree.

## Adding a new domain (e.g. DevOps, Security, Frontend)
1. Add an entry to `DOMAINS` with an `id`, `label` and a Lucide `icon` name already imported in `src/data/skills.ts`.
2. Add skills that reference the new domain id.
3. The filter bar, tree and counts update automatically.

```ts
DOMAINS.push({ id: "security", label: "Security", icon: Shield });
SKILLS.push({
  id: "threat-modeling", name: "Threat Modeling", domain: "security",
  tier: "Supplementary", summary: "STRIDE-driven design review.",
  competencies: ["Produces a data-flow diagram with trust boundaries"],
  practice: ["Threat-model one existing endpoint per sprint"],
  prerequisites: ["http-rest"],
});
```

## Status
Per-user status (`Not started`, `Learning`, `Proficient`) is stored in the browser, keyed by skill id. Renaming an id resets that skill's status, so treat ids as permanent.

## Extending other modules
- Boundaries and checks: `src/data/review.ts` (`BOUNDARIES`).
- Checkpoints: `src/data/review.ts` (`CHECKPOINTS`).
- Roadmap milestones: `src/data/roadmap.ts`.
- Docs: add a markdown file in `docs/` and register it in `src/routes/docs.tsx`.
