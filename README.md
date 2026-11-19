# Boundary Checkpoint Compass

Build an interactive, highly-structured visual web app and extensible Engineering Skill Repository called "Omar's Skills", based on the AI-Generated Code Review Protocol and Junior Developer Growth Framework.

Also create a `docs/` folder containing detailed markdown files explaining the senior engineering vision, why this system was built this way, how the outside-in review protocol defends production, how the junior developer anti-atrophy roadmap works, and how to extend this repository with new skills in the future.

### Application Structure & Key Views

1. **Review Runway (Operational Code Review SOP):**
   - Interactive 4-Checkpoint Process: Pre-Execution Scope Bounding → Incremental Approval Gating → Post-Run Diff Auditing → Pre-Merge Automated Gate.
   - Interactive Visual Diagram: Outside-In & Terminal Side-Effect Backward Tracing (visualizing how to trace backwards from terminal mutations—DB writes, outbound HTTP requests, background queues, event emissions—back to input boundaries).
   - Priority Audit Guides: Line deletion and modification auditing, boundary layer security, and mock/assertion sanitization.

2. **Boundary Stress Matrix:**
   - Interactive audit checklist covering the 5 critical failure boundaries:
     * Payload Integrity (empty payloads, zero-values, structural type mismatches, malformed JSON)
     * Configuration (missing env vars, fallback failures, uninitialized feature flags)
     * Network Failure (upstream timeouts, transient network drops, circuit breaker handling)
     * Exception Paths (uncaught exceptions, generic catch blocks, missing transactional rollback)
     * Concurrency (race conditions, state mutation safety, unhandled concurrent operations)
   - Interactive pass/fail/waive toggles with progress scoring and severity tags (`[Blocker]`, `[Warning]`, `[Nitpick]`).
   - Red-Team AI Auditing prompt generator & failure-mode logger.

3. **Engineering Skill Repository & Interactive Taxonomy:**
   - Visual, interactive skill tree featuring the 8 Core Engineering Skills:
     1. Deep Core Language Proficiency
     2. Version Control & Diff Hygiene
     3. Relational & Non-Relational Data Management
     4. HTTP & REST API Architecture
     5. System Debugging & Diagnostics
     6. Core Data Structures & Computational Complexity
     7. Software Testing Fundamentals
     8. Command Line & Terminal Operations
   - Supplementary & Mid-Level Skills: Containerization & Infrastructure, CI/CD Pipelines, Cloud Computing Infrastructure, Software Design Patterns & Architecture, Distributed System Design.
   - Filterable by domain, tier (`Core` vs `Supplementary`), and status.
   - Modular data structure: Extensible TypeScript/JSON registry so new skills can be added effortlessly.

4. **Targeted Phased Growth Roadmap:**
   - Phase 1 (Immediate Focus): Foundational Proficiency
   - Phase 2 (Intermediate Focus): Architecture & Quality
   - Phase 3 (Ongoing Mastery): Technical Ownership & Monthly Unassisted Feature Rebuilds
   - Interactive progress tracking that persists to local state.

5. **In-App Docs Viewer & `docs/` Repository Files:**
   - Create comprehensive markdown files in the project's `docs/` directory:
     * `docs/VISION_AND_ARCHITECTURE.md`: High-level philosophy on fast AI-assisted shipping without sacrificing technical ownership, explaining the outside-in review paradigm and why junior developer foundational skills must be actively protected.
     * `docs/CODE_REVIEW_SOP.md`: The complete step-by-step Standard Operating Procedure for reviewing AI-generated code.
     * `docs/EXTENDING_SKILLS.md`: Developer guide on how to add new skill domains (e.g., DevOps, Security, Frontend) to the repository schema.
   - Provide an in-app viewer tab so team members can read these docs directly in the application.

Design with a high-craft, modern engineering aesthetic (clean dark/light mode, Lucide icons, responsive split-screen layouts, smooth animations, and clear typography).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e4b6c114-fff3-489e-be49-b918effd104d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
