# Vision & Architecture

## The problem
AI assistants let a team ship features in hours instead of days. That speed is real, and so is the cost nobody books: **code that nobody on the team truly owns**, and **junior engineers whose fundamentals quietly atrophy** because the assistant always types first.

Omar's Skills exists to keep the speed while protecting two things that cannot be outsourced:

1. **Production integrity** — every line that ships has been read, bounded and stress-tested by a human who can defend it.
2. **Technical ownership** — every engineer, especially early-career ones, keeps building the mental models that let them debug at 3 a.m. without an assistant.

## Principles
- **Generation is cheap, verification is the job.** Review time is the real budget. The protocol spends it where failures actually happen.
- **Outside-in, not top-down.** Reading AI code from line 1 rewards plausibility. Starting from the terminal side effects — DB writes, outbound HTTP, queue publishes, emitted events — and tracing backwards to the input boundary rewards correctness.
- **Boundaries fail, middles rarely do.** Bugs concentrate at payload edges, config, network, exception paths and concurrency. The Boundary Stress Matrix makes those five explicit and scored.
- **Deletions are the loudest lines in a diff.** AI tools silently remove guards, retries, and assertions. Removed lines get audited before added lines.

## System architecture
```text
 Core Protocol  ──►  6 Section-2 stages + AI self-explanation prompt (3.2)
 Review Runway  ──►  4 checkpoints + outside-in trace + priority audits
 Stress Matrix  ──►  5 boundaries x checks, pass/fail/waive, red-team prompt, failure trends (3.3)
 Ownership      ──►  line-ownership check + monthly unassisted rebuild (3.4)
 Docs           ──►  this folder, rendered in-app
```
All content is data-driven. Pages are thin renderers over `src/data/*`, so the methodology can evolve without touching UI code.
