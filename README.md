# Omar's Skills

An interactive engineering skill repository and AI-code review workstation. It turns two working documents — an **AI-Generated Code Review Protocol** and a **Junior Developer Growth Framework** — into a tool you can actually run: a review checklist you tick off, a stress matrix that blocks a merge, a skill tree you track, and a roadmap you work through.

> ship fast. own every line.

## What's inside

| Section | Path | What it does |
| --- | --- | --- |
| **Review Runway** | `/` | The four review checkpoints in order — scope bounding, approval gating, diff auditing, pre-merge gate — plus a side-effect map that traces a database write, outbound request, background job or event back to the input boundary it came from, and the three priority audit checklists. |
| **Stress Matrix** | `/matrix` | 16 checks across five boundaries (payload, configuration, network, exceptions, concurrency), each tagged `Blocker`, `Warning` or `Nitpick`. Mark pass / fail / waive and the score and merge status update live — a failed blocker reads **Merge blocked**. Includes a red-team prompt generator with a copy button and a log of failure modes you hit. |
| **Skill Repository** | `/skills` | 8 core and 5 supplementary skills across 6 domains, filterable by domain, tier and status. Each skill shows its competencies, practice exercises, what it builds on and what it unlocks. Set your own status: Not started → Learning → Proficient. |
| **Growth Roadmap** | `/roadmap` | Three phases — Foundational Proficiency, Architecture & Quality, Technical Ownership — with milestone checkboxes and progress bars. |
| **Docs** | `/docs` | Reads the markdown files in `docs/` straight into the app, so the repo docs and the in-app docs are the same file. |

Dark and light mode, no login, nothing to install.

## Quick start

```sh
npm install       # or: bun install
npm run dev       # or: bun run dev
```

Open the URL the dev server prints (usually `http://localhost:8080`).

### Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the test suite once |
| `npm run lint` | ESLint over the repo |
| `npm run format` | Prettier write |

## How it's put together

The rule this repo follows: **all methodology content lives as typed data in `src/data/*`; pages are thin renderers.** Content can grow without touching the UI, and the UI can change without touching the content.

```
src/
  data/
    review.ts      checkpoints, side effects, trace layers, audit checklists,
                   the 16 boundary checks + scoreMatrix()
    skills.ts      DOMAINS, SKILLS (8 core + 5 supplementary), STATUSES
    roadmap.ts     PHASES and their milestones
    review.test.ts tests for the scoring rule
  routes/
    index.tsx      Review Runway
    matrix.tsx     Stress Matrix
    skills.tsx     Skill Repository
    roadmap.tsx    Growth Roadmap
    docs.tsx       in-app docs viewer
    __root.tsx     shell, theme, 404 and error screens
  components/app/
    AppShell.tsx   sidebar nav, PageHeader, SeverityTag, head() helper
  lib/
    use-local-state.ts  localStorage-backed state hook
  styles.css       Tailwind v4 theme tokens (dark/light)
docs/
  VISION_AND_ARCHITECTURE.md   the senior-engineering vision and why it's built this way
  CODE_REVIEW_SOP.md           the standard operating procedure for reviewing AI output
  EXTENDING_SKILLS.md          how to add a new skill domain
```

### Adding or changing content

- **New skill** — add one object to `SKILLS` in `src/data/skills.ts`: `id`, `name`, `domain`, `tier`, `summary`, `competencies`, `practice`, optional `prerequisites`, and a Lucide `icon`. It appears in the repository automatically.
- **New domain** (e.g. Security, DevOps, Frontend) — add it to `DOMAINS` in the same file and point skills at it. `docs/EXTENDING_SKILLS.md` walks through it end to end.
- **New review check** — add it to a boundary's `checks` array in `src/data/review.ts` with a `severity`. The score, blocker count and merge status pick it up with no other change.
- **New milestone or phase** — edit `PHASES` in `src/data/roadmap.ts`.
- **New doc** — drop a `.md` file in `docs/` and register it in `src/routes/docs.tsx`; it renders in the Docs tab.

`scoreMatrix()` is the one piece of real logic (score, decided count, failed blockers) and it's covered by `src/data/review.test.ts`. If you change a scoring rule, change that test with it.

### Where your progress lives

Tick marks, skill statuses, logged failure modes and the theme are stored in **your browser's localStorage** (`use-local-state.ts`). There is no backend and no account: nothing syncs between people or devices, and clearing site data resets you to zero. That's deliberate — this is a personal and team reference tool, not a service.

## Tech

TanStack Start (React 19, file-based routing) · TypeScript · Tailwind CSS v4 · shadcn/ui primitives · Lucide icons · react-markdown · Vitest.
