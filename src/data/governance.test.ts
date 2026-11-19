import { describe, it, expect } from "vitest";
import { boundaryTrends } from "./governance";

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
});
