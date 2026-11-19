# Adding a Skill to the Canvas

This is the exact, no-guesswork recipe for adding one skill so it shows up in the **Skill Repository canvas** (the `/skills` page: the filter bar, the Core / Supplementary card grid, and the detail panel with its prerequisite links).

You only ever edit **one file**: `src/data/skills.ts`. No component, no CSS, no route.

---

## 1. Open the registry

```
src/data/skills.ts
```

It holds three things the canvas reads:

| Export | What it controls in the canvas |
| --- | --- |
| `DOMAINS` | The domain chips in the filter bar, and the domain label in the detail panel |
| `SKILLS` | Every card in the grid, and everything the detail panel shows |
| `STATUSES` | The three status buttons and the status chip on each card |

---

## 2. Pick an icon and import it

Icons come from `lucide-react` and are listed in the import at the top of the file:

```ts
import { Code2, GitBranch, Database, Globe, Bug, Binary, FlaskConical, Terminal,
  Container, Workflow, Cloud, Layers, Network, type LucideIcon } from "lucide-react";
```

If your skill needs a new icon, **add it to that import line first** — the `icon` field takes the component itself, not a string. A name that isn't imported fails the build with "X is not defined".

Pick a name from https://lucide.dev/icons (e.g. `Shield`, `GitPullRequest`, `Accessibility`).

---

## 3. Append the object to `SKILLS`

Add it at the end of the `SKILLS` array (or inside the group you want, order is free):

```ts
{
  id: "threat-modeling",
  name: "Threat Modeling",
  domain: "security",
  tier: "Supplementary",
  icon: Shield,
  summary: "Find the trust boundaries before the code exists.",
  competencies: [
    "Draws a data-flow diagram with explicit trust boundaries",
    "Runs STRIDE over one endpoint and ranks the findings",
  ],
  practice: [
    "Threat-model one real endpoint per sprint, unassisted",
  ],
  prerequisites: ["http-rest"],
},
```

### What each field does to the canvas

| Field | Effect in the canvas | Rules |
| --- | --- | --- |
| `id` | Storage key for your status; the node other skills point at | kebab-case, **unique**, never renamed later (renaming wipes its saved status) |
| `name` | Card title and detail-panel heading | short enough to fit a card |
| `domain` | Which domain chip filters it in; the label under the tier | must match an `id` in `DOMAINS` exactly |
| `tier` | Which section it lands in: `Core` or `Supplementary` | exactly one of those two strings |
| `icon` | The glyph on the card and in the panel | a Lucide component already imported |
| `summary` | One line in the detail panel | one sentence, no marketing |
| `competencies` | Bullets under "Competencies" | observable behaviours a reviewer can check, not topics |
| `practice` | Bullets under "Unassisted practice" | concrete exercises, done without AI |
| `prerequisites` | The **edges** — see step 4 | array of other skill `id`s; omit the field if none |

---

## 4. Wire it into the tree with `prerequisites`

This is the field that makes the skill *hang* in the canvas instead of floating as an orphan.

For the selected skill, the canvas computes two sets:

- **prereq** — skills listed in its `prerequisites`. Their cards get an amber border and a `prereq` tag.
- **unlocks** — skills whose `prerequisites` contain the selected skill's `id`. Their cards get a dashed border and an `unlocks` tag.

So one line is enough to connect it both ways:

```ts
prerequisites: ["http-rest"],          // Threat Modeling now hangs off HTTP & REST
// and because "threat-modeling" is now referenced, anything that lists it
// as a prerequisite will show "unlocks" when Threat Modeling is selected.
```

Rules:

- Use **ids that already exist** in `SKILLS`. A typo (`"http_rest"`, `"http"`) silently produces no edge — the panel's `requires:` line just renders an empty name, and the card looks disconnected.
- A skill with no `prerequisites` is a root node. That's fine for foundations (like `cli`), wrong for anything advanced.
- Don't create cycles: A requiring B while B requires A makes both permanently "locked-looking" in practice.
- Deep chains are fine — the panel only shows direct prerequisites, and the canvas only draws direct edges.

---

## 5. Need a new domain? Add it first

If the skill doesn't belong to an existing domain, add the domain **before** the skill:

```ts
export const DOMAINS: Domain[] = [
  { id: "foundations", label: "Foundations", icon: Code2 },
  // ...
  { id: "security", label: "Security", icon: Shield },   // <- new
];
```

Then `domain: "security"` in the skill resolves. The filter chip, the counts and the detail-panel label all appear on their own — nothing else to register.

---

## 6. Verify it in the canvas

1. Run the dev server and open **`/skills`**.
2. The card must appear in the right section (`Core` or `Supplementary`) with the right icon.
3. Click it — the detail panel shows your summary, competencies, practice, and the `requires:` line with real names (not blanks).
4. Click one of its prerequisites — your card should now show the dashed `unlocks` tag.
5. Filter by its domain and by its tier; it must survive both.
6. Set a status, reload the page — the status must persist (it's saved in your browser under the key `skill-status`, keyed by `id`).

If the card is missing entirely, the usual causes are: a duplicate `id`, a `domain` string that isn't in `DOMAINS`, a `tier` spelled differently, or a `prerequisites` id that doesn't exist.

---

## 7. Don'ts

- Don't edit `src/routes/skills.tsx` to add a skill — it's a renderer over the registry.
- Don't put a skill's status in the data file; status is per-person browser state.
- Don't reuse an `id` from a skill you deleted; old browser storage would re-apply to the new one.
- Don't write competencies as topics ("Databases") — write them as behaviours ("Picks an isolation level and explains why").
- Don't add a `push()` at runtime; edit the array literal so the type checker still validates every field.

---

## 8. One-line checklist

```
[ ] icon imported from lucide-react
[ ] object appended to SKILLS
[ ] id unique, kebab-case, never renamed
[ ] domain exists in DOMAINS (or added there first)
[ ] tier is exactly "Core" or "Supplementary"
[ ] prerequisites use real ids, no cycles
[ ] competencies are observable, practice is unassisted
[ ] /skills: card shows, panel reads, prereq/unlocks edges appear, status persists
```
