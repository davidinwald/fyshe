import { describe, it, expect } from "vitest";
import { createUnauthenticatedCaller } from "./helpers";

describe("health router", () => {
  it("returns ok status", async () => {
    const caller = createUnauthenticatedCaller();
    const result = await caller.health.check();
    expect(result.status).toBe("ok");
  });
});
