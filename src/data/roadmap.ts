export const PHASES = [
  { id: "p1", title: "Foundational Proficiency", focus: "Immediate Focus", milestones: [
    "Complete 10 unassisted CLI log investigations", "Hand-write joins, window functions and an index fix",
    "Implement 3 core data structures without AI", "Debug one real bug end-to-end using only logs + debugger",
    "Ship 5 PRs with clean atomic commits" ] },
  { id: "p2", title: "Architecture & Quality", focus: "Intermediate Focus", milestones: [
    "Run the full Review SOP on 5 AI-generated PRs", "Write an integration test suite against a real database",
    "Author an ADR for a design decision", "Add a pre-merge gate to CI", "Lead a Boundary Stress Matrix review" ] },
  { id: "p3", title: "Technical Ownership", focus: "Ongoing Mastery", milestones: [
    "Monthly unassisted feature rebuild — month 1", "Monthly unassisted feature rebuild — month 2",
    "Monthly unassisted feature rebuild — month 3", "Own an on-call rotation for a service",
    "Mentor a peer through Phase 1" ] },
];
