import { describe, it, expect } from "vitest";
import { createTripSchema, updateTripSchema, tripListFiltersSchema } from "../trip";

describe("trip validators", () => {
  describe("createTripSchema", () => {
    it("accepts valid minimal input", () => {
      const result = createTripSchema.safeParse({
        title: "Weekend on the Madison",
        startDate: "2025-07-15",
      });
      expect(result.success).toBe(true);
    });

    it("accepts full input", () => {
      const result = createTripSchema.safeParse({
        title: "Montana Trip 2025",
        description: "Annual fly fishing trip",
        locationName: "Ennis, MT",
        latitude: 45.35,
        longitude: -111.73,
        waterBody: "Madison River",
        startDate: "2025-07-15",
        endDate: "2025-07-20",
        weather: "Sunny, mid 70s",
        waterConditions: "Clear, moderate flow",
        notes: "Bring extra tippet",
        visibility: "FOLLOWERS_ONLY",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty title", () => {
      const result = createTripSchema.safeParse({
        title: "",
        startDate: "2025-07-15",
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing startDate", () => {
      const result = createTripSchema.safeParse({ title: "Trip" });
      expect(result.success).toBe(false);
    });

    it("rejects title that's too long", () => {
      const result = createTripSchema.safeParse({
        title: "a".repeat(201),
        startDate: "2025-07-15",
      });
      expect(result.success).toBe(false);
    });

    it("defaults visibility to PRIVATE", () => {
      const result = createTripSchema.parse({
        title: "Trip",
        startDate: "2025-07-15",
      });
      expect(result.visibility).toBe("PRIVATE");
    });

    it("rejects invalid visibility", () => {
      const result = createTripSchema.safeParse({
        title: "Trip",
        startDate: "2025-07-15",
        visibility: "HIDDEN",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updateTripSchema", () => {
    it("allows partial updates", () => {
      const result = updateTripSchema.safeParse({ title: "New Title" });
      expect(result.success).toBe(true);
    });

    it("allows empty object", () => {
      const result = updateTripSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe("tripListFiltersSchema", () => {
    it("accepts empty filters", () => {
      const result = tripListFiltersSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts date range", () => {
      const result = tripListFiltersSchema.safeParse({
        from: "2025-01-01",
        to: "2025-12-31",
      });
      expect(result.success).toBe(true);
    });

    it("accepts search filter", () => {
      const result = tripListFiltersSchema.safeParse({ search: "madison" });
      expect(result.success).toBe(true);
    });
  });
});
