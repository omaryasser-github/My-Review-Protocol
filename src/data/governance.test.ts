import { describe, it, expect } from "vitest";
import { boundaryTrends, rebuildDue } from "./governance";

describe("governance", () => {
  it("ranks the boundary with the most blocker weight first", () => {
    const t = boundaryTrends([
      { boundary: "Concurrency", severity: "Nitpick" },
      { boundary: "Concurrency", severity: "Nitpick" },
      { boundary: "Payload Integrity", severity: "Blocker" },
    ]);
    expect(t[0]!.boundary).toBe("Payload Integrity");
    expect(t.find((r) => r.boundary === "Concurrency")!.share).toBe(67);
  });
  it("makes a rebuild due 30 days after the last one", () => {
    expect(rebuildDue([{ id: "1", date: "2026-11-01", feature: "x", lesson: "" }], new Date("2026-11-21"))).toBe(10);
    expect(rebuildDue([], new Date())).toBe(0);
  });
});
