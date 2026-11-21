# My-Review-Protocol

An interactive AI-code review workstation. It turns the **AI-Generated Code Review Protocol** into a tool you can run: a review checklist you tick off and a stress matrix that blocks a merge.

> ship fast. own every line.

## What's inside

| Section | Path | What it does |
| --- | --- | --- |
| **Review Runway** | `/` | The four review checkpoints in order — scope bounding, approval gating, diff auditing, pre-merge gate — plus a side-effect map that traces a database write, outbound request, background job or event back to the input boundary it came from, and the three priority audit checklists. |
| **Core Review Protocol** | `/protocol` | Six guided stages from Section 2 of the guide (stages 2.1 and 2.2 include the Section 3.2 AI self-explanation prompt) — write your intent before reading the code, then outside-in reading, line auditing, stress testing, test integrity and diff gating. Progress is saved. |
| **Stress Matrix** | `/matrix` | 16 checks across five boundaries (payload, configuration, network, exceptions, concurrency), each tagged `Blocker`, `Warning` or `Nitpick`. Mark pass / fail / waive and the score and merge status update live — a failed blocker reads **Merge blocked**. Includes a red-team prompt generator with a copy button and a log of failure modes you hit, with Section 3.3 failure trends ranking which boundaries break most. |
| **Ownership & Practice** | `/ownership` | Section 3.4: a three-question line-ownership check to answer before every merge. |
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
    review.test.ts tests for the scoring rule
  routes/
    index.tsx      Review Runway
    protocol.tsx   Core Review Protocol
    matrix.tsx     Stress Matrix
    ownership.tsx  Ownership & Practice
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
  FEATURES.md                  every feature and skill in the app
  ADDING_A_SKILL.md            easiest way to add a new skill
```

### Adding or changing content

- **New review check** — add it to a boundary's `checks` array in `src/data/review.ts` with a `severity`. The score, blocker count and merge status pick it up with no other change.
- **New doc** — drop a `.md` file in `docs/` and register it in `src/routes/docs.tsx`; it renders in the Docs tab.

`scoreMatrix()` is the one piece of real logic (score, decided count, failed blockers) and it's covered by `src/data/review.test.ts`. If you change a scoring rule, change that test with it.

### Where your progress lives

Tick marks, logged failure modes and the theme are stored in **your browser's localStorage** (`use-local-state.ts`). There is no backend and no account: nothing syncs between people or devices, and clearing site data resets you to zero. That's deliberate — this is a personal and team reference tool, not a service.

## Tech

TanStack Start (React 19, file-based routing) · TypeScript · Tailwind CSS v4 · shadcn/ui primitives · Lucide icons · react-markdown · Vitest.
