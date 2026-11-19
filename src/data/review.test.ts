import { describe, it, expect } from "vitest";
import { scoreMatrix, BOUNDARIES } from "./review";
describe("scoreMatrix", () => {
  it("counts failed blockers", () => {
    expect(scoreMatrix({ p1: "fail", p2: "fail" }).blockers).toBe(1);
  });
  it("waived checks count toward score", () => {
    const all = Object.fromEntries(BOUNDARIES.flatMap((b) => b.checks).map((c) => [c.id, "waive"]));
    expect(scoreMatrix(all).score).toBe(100);
  });
});
