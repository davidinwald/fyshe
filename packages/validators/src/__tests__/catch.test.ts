import { describe, it, expect } from "vitest";
import { createCatchSchema, updateCatchSchema, catchListFiltersSchema } from "../catch";

describe("catch validators", () => {
  describe("createCatchSchema", () => {
    it("accepts valid minimal input", () => {
      const result = createCatchSchema.safeParse({ species: "Rainbow Trout" });
      expect(result.success).toBe(true);
    });

    it("accepts full input", () => {
      const result = createCatchSchema.safeParse({
        species: "Brook Trout",
        length: 14.5,
        weight: 1.2,
        method: "FLY",
        locationName: "Madison River, MT",
        latitude: 45.6,
        longitude: -111.05,
        waterTemp: 55,
        weather: "Sunny, 72°F",
        notes: "Caught on a size 16 Adams",
        released: true,
        visibility: "PUBLIC",
        caughtAt: "2025-07-15T08:30:00Z",
        gearIds: ["gear1", "gear2"],
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty species", () => {
      const result = createCatchSchema.safeParse({ species: "" });
      expect(result.success).toBe(false);
    });

    it("rejects negative length", () => {
      const result = createCatchSchema.safeParse({ species: "Trout", length: -5 });
      expect(result.success).toBe(false);
    });

    it("rejects negative weight", () => {
      const result = createCatchSchema.safeParse({ species: "Trout", weight: -1 });
      expect(result.success).toBe(false);
    });

    it("rejects invalid method", () => {
      const result = createCatchSchema.safeParse({ species: "Trout", method: "DYNAMITE" });
      expect(result.success).toBe(false);
    });

    it("rejects latitude out of range", () => {
      expect(
        createCatchSchema.safeParse({ species: "Trout", latitude: 91 }).success
      ).toBe(false);
      expect(
        createCatchSchema.safeParse({ species: "Trout", latitude: -91 }).success
      ).toBe(false);
    });

    it("rejects longitude out of range", () => {
      expect(
        createCatchSchema.safeParse({ species: "Trout", longitude: 181 }).success
      ).toBe(false);
    });

    it("defaults released to true", () => {
      const result = createCatchSchema.parse({ species: "Trout" });
      expect(result.released).toBe(true);
    });

    it("defaults visibility to PRIVATE", () => {
      const result = createCatchSchema.parse({ species: "Trout" });
      expect(result.visibility).toBe("PRIVATE");
    });

    it("rejects invalid visibility", () => {
      const result = createCatchSchema.safeParse({ species: "Trout", visibility: "SECRET" });
      expect(result.success).toBe(false);
    });
  });

  describe("updateCatchSchema", () => {
    it("allows partial updates", () => {
      const result = updateCatchSchema.safeParse({ species: "Brown Trout" });
      expect(result.success).toBe(true);
    });

    it("allows empty object", () => {
      const result = updateCatchSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe("catchListFiltersSchema", () => {
    it("accepts empty filters", () => {
      const result = catchListFiltersSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts method filter", () => {
      const result = catchListFiltersSchema.safeParse({ method: "FLY" });
      expect(result.success).toBe(true);
    });

    it("accepts date range", () => {
      const result = catchListFiltersSchema.safeParse({
        from: "2025-01-01",
        to: "2025-12-31",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid method", () => {
      const result = catchListFiltersSchema.safeParse({ method: "NET" });
      expect(result.success).toBe(false);
    });
  });
});
