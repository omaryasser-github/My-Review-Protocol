# How to Add a New Skill

In Omar's Skills, a **skill** is any review ability the app teaches: a checkpoint, a stress check, or an audit item.
All of them live in **one file**: `src/data/review.ts`. You never touch the pages — they redraw themselves from this file.

---

## The 30-second version

1. Open `src/data/review.ts`.
2. Find the list that matches what you want to add (table below).
3. Copy an existing entry, paste it at the end of the list, and change the text.
4. Save. The app updates instantly.

| I want to add…                         | Edit this list      | Shows up on      |
|----------------------------------------|---------------------|------------------|
| A new check (pass / fail / waive)      | `BOUNDARIES[].checks` | Stress Matrix  |
| A whole new failure boundary           | `BOUNDARIES`        | Stress Matrix    |
| A new review step                      | `CHECKPOINTS[].steps` | Review Runway  |
| A new audit item                       | `PRIORITY_AUDITS[].items` | Review Runway |
| A new side effect to trace             | `SIDE_EFFECTS`      | Review Runway diagram |

---

## Example 1 — add a check to an existing boundary

Add "Unicode input handled" to **Payload Integrity**:

```ts
{ id: "payload", title: "Payload Integrity", checks: [
  // ...existing checks
  { id: "p5", text: "Unicode / emoji input handled", severity: "Warning" },
] },
```

Rules:
- `id` must be **unique** across all checks (use the boundary letter + next number).
- `severity` is one of `"Blocker"`, `"Warning"`, `"Nitpick"`. A failed **Blocker** blocks the merge.

## Example 2 — add a new boundary (e.g. Security)

```ts
{ id: "security", title: "Security", checks: [
  { id: "s1", text: "Every new endpoint checks permissions", severity: "Blocker" },
  { id: "s2", text: "No secrets in code or logs", severity: "Blocker" },
] },
```

Paste it at the end of `BOUNDARIES`. A new card appears in the Stress Matrix and the score includes it automatically.

## Example 3 — add a review step

```ts
{ id: "gate", title: "Pre-Merge Automated Gate", ...,
  steps: [ /* existing */, "Dependency scan clean" ] },
```

---

## Check it worked

- [ ] Open the page from the table — your item is there.
- [ ] Tick it — refresh — it stays ticked.
- [ ] Run `bunx vitest run` — tests pass.

## Don't

- Don't reuse or rename an existing `id` (saved progress is keyed by it).
- Don't add the item inside the page files — only in `src/data/review.ts`.
