import { describe, it, expect } from "vitest";
import { STAGES, protocolProgress } from "./protocol";

describe("protocol", () => {
  it("covers the six Section 2 stages", () => {
    expect(STAGES.map((s) => s.section)).toEqual(["2.1", "2.2", "2.3", "2.4", "2.5", "2.6"]);
  });
  it("marks a stage complete only when all its checks are ticked", () => {
    const p = protocolProgress({ "stress-0": true, "stress-1": true, "tests-0": true });
    expect(p.stagesComplete).toBe(1);
    expect(p.finished).toBe(3);
  });
});
