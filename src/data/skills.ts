import { Code2, GitBranch, Database, Globe, Bug, Binary, FlaskConical, Terminal, Container, Workflow, Cloud, Layers, Network, type LucideIcon } from "lucide-react";

export type Tier = "Core" | "Supplementary";
export interface Domain { id: string; label: string; icon: LucideIcon }
export interface Skill {
  id: string; name: string; domain: string; tier: Tier; summary: string;
  competencies: string[]; practice: string[]; prerequisites?: string[]; icon: LucideIcon;
}

export const DOMAINS: Domain[] = [
  { id: "foundations", label: "Foundations", icon: Code2 },
  { id: "data", label: "Data", icon: Database },
  { id: "web", label: "Web & APIs", icon: Globe },
  { id: "quality", label: "Quality", icon: FlaskConical },
  { id: "infra", label: "Infrastructure", icon: Cloud },
  { id: "architecture", label: "Architecture", icon: Layers },
];

export const SKILLS: Skill[] = [
  { id: "core-language", name: "Deep Core Language Proficiency", domain: "foundations", tier: "Core", icon: Code2,
    summary: "Runtime semantics, memory, async model and the standard library — without autocomplete.",
    competencies: ["Explains the event loop / threading model of the primary language", "Reads unfamiliar idioms without lookup", "Predicts closure, scoping and mutation behaviour"],
    practice: ["Implement a debounce, LRU cache and promise pool by hand", "Read one std-lib module source per week"] },
  { id: "vcs", name: "Version Control & Diff Hygiene", domain: "foundations", tier: "Core", icon: GitBranch,
    summary: "Small atomic commits, readable diffs, safe history operations.",
    competencies: ["Splits a change into reviewable commits", "Uses bisect to locate a regression", "Resolves conflicts without losing intent"],
    practice: ["Interactive-rebase a messy branch into 3 clean commits", "Bisect a planted bug"], prerequisites: ["cli"] },
  { id: "data-mgmt", name: "Relational & Non-Relational Data Management", domain: "data", tier: "Core", icon: Database,
    summary: "Modelling, indexing, transactions and choosing the right store.",
    competencies: ["Writes joins and window functions by hand", "Reads a query plan and adds the right index", "Picks an isolation level and explains why"],
    practice: ["Design a schema for a booking system with constraints", "Find and fix an N+1"], prerequisites: ["core-language"] },
  { id: "http-rest", name: "HTTP & REST API Architecture", domain: "web", tier: "Core", icon: Globe,
    summary: "Status codes, idempotency, caching, auth and versioning.",
    competencies: ["Designs idempotent endpoints with correct verbs", "Explains caching headers and CORS", "Handles pagination and error envelopes consistently"],
    practice: ["Build a CRUD API with curl-only testing", "Add idempotency keys to a POST"], prerequisites: ["core-language"] },
  { id: "debugging", name: "System Debugging & Diagnostics", domain: "quality", tier: "Core", icon: Bug,
    summary: "Hypothesis-driven debugging with logs, traces, profilers and debuggers.",
    competencies: ["Reproduces before fixing", "Uses a debugger and profiler fluently", "Reads stack traces across async boundaries"],
    practice: ["Fix a production-style bug from logs only", "Profile and halve a slow endpoint"], prerequisites: ["core-language", "cli"] },
  { id: "dsa", name: "Core Data Structures & Computational Complexity", domain: "foundations", tier: "Core", icon: Binary,
    summary: "Choosing structures and reasoning about Big-O in real code.",
    competencies: ["Spots accidental quadratic loops in review", "Chooses map/set/heap appropriately", "Estimates cost at production scale"],
    practice: ["Rewrite an O(n²) report to O(n log n)", "Implement a heap and a trie"], prerequisites: ["core-language"] },
  { id: "testing", name: "Software Testing Fundamentals", domain: "quality", tier: "Core", icon: FlaskConical,
    summary: "Meaningful assertions, test pyramid, and spotting hollow tests.",
    competencies: ["Writes tests that fail when behaviour breaks", "Knows when to mock and when not to", "Detects assertion-free or self-mocking tests"],
    practice: ["Mutation-test a module and kill survivors", "Write integration tests against a real DB"], prerequisites: ["core-language"] },
  { id: "cli", name: "Command Line & Terminal Operations", domain: "foundations", tier: "Core", icon: Terminal,
    summary: "Shell fluency, pipes, process and file inspection.",
    competencies: ["Composes grep/sed/awk/jq pipelines", "Inspects processes, ports and logs", "Writes safe bash scripts"],
    practice: ["Answer 10 log questions using only the shell", "Automate a daily chore in bash"] },
  { id: "containers", name: "Containerization & Infrastructure", domain: "infra", tier: "Supplementary", icon: Container,
    summary: "Images, layers, networking and local parity.",
    competencies: ["Writes small multi-stage Dockerfiles", "Debugs container networking"],
    practice: ["Containerize an app under 100MB"], prerequisites: ["cli"] },
  { id: "cicd", name: "CI/CD Pipelines", domain: "infra", tier: "Supplementary", icon: Workflow,
    summary: "Automated gates, caching, deployments and rollbacks.",
    competencies: ["Builds a pipeline with test, lint and deploy stages", "Designs a rollback path"],
    practice: ["Add a pre-merge gate that blocks coverage drops"], prerequisites: ["vcs", "testing"] },
  { id: "cloud", name: "Cloud Computing Infrastructure", domain: "infra", tier: "Supplementary", icon: Cloud,
    summary: "Compute, storage, IAM and cost awareness.",
    competencies: ["Applies least-privilege IAM", "Explains cost drivers of a deployment"],
    practice: ["Deploy a service with IaC and tear it down"], prerequisites: ["containers"] },
  { id: "design-patterns", name: "Software Design Patterns & Architecture", domain: "architecture", tier: "Supplementary", icon: Layers,
    summary: "Modularity, boundaries, and patterns that earn their keep.",
    competencies: ["Identifies coupling and proposes seams", "Writes an ADR for a decision"],
    practice: ["Refactor a god-module into bounded modules"], prerequisites: ["dsa", "testing"] },
  { id: "distributed", name: "Distributed System Design", domain: "architecture", tier: "Supplementary", icon: Network,
    summary: "Consistency, queues, retries, and failure as a default.",
    competencies: ["Designs with idempotency and at-least-once delivery", "Reasons about CAP trade-offs"],
    practice: ["Build an outbox pattern with a worker"], prerequisites: ["http-rest", "data-mgmt", "design-patterns"] },
];

export const STATUSES = ["Not started", "Learning", "Proficient"] as const;
export type SkillStatus = (typeof STATUSES)[number];
