import { describe, it, expect } from "vitest";
import { createGearSchema, updateGearSchema, gearListFiltersSchema } from "../gear";

describe("gear validators", () => {
  describe("createGearSchema", () => {
    it("accepts valid minimal input", () => {
      const result = createGearSchema.safeParse({
        name: "Test Rod",
        category: "ROD",
      });
      expect(result.success).toBe(true);
    });

    it("accepts full input", () => {
      const result = createGearSchema.safeParse({
        name: "Orvis Helios 3F",
        category: "ROD",
        brand: "Orvis",
        model: "Helios 3F 9' 5wt",
        description: "A premium fly rod",
        status: "OWNED",
        rating: 5,
        notes: "My favorite rod",
        purchaseDate: "2024-01-15",
        purchasePrice: 899.99,
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty name", () => {
      const result = createGearSchema.safeParse({
        name: "",
        category: "ROD",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid category", () => {
      const result = createGearSchema.safeParse({
        name: "Test",
        category: "INVALID",
      });
      expect(result.success).toBe(false);
    });

    it("rejects rating out of range", () => {
      expect(
        createGearSchema.safeParse({ name: "X", category: "ROD", rating: 0 }).success
      ).toBe(false);
      expect(
        createGearSchema.safeParse({ name: "X", category: "ROD", rating: 6 }).success
      ).toBe(false);
    });

    it("rejects negative purchase price", () => {
      const result = createGearSchema.safeParse({
        name: "Test",
        category: "ROD",
        purchasePrice: -10,
      });
      expect(result.success).toBe(false);
    });

    it("defaults status to OWNED", () => {
      const result = createGearSchema.parse({ name: "Test", category: "ROD" });
      expect(result.status).toBe("OWNED");
    });
  });

  describe("updateGearSchema", () => {
    it("allows partial updates", () => {
      const result = updateGearSchema.safeParse({ name: "New Name" });
      expect(result.success).toBe(true);
    });

    it("allows empty object", () => {
      const result = updateGearSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe("gearListFiltersSchema", () => {
    it("accepts empty filters", () => {
      const result = gearListFiltersSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts valid category filter", () => {
      const result = gearListFiltersSchema.safeParse({ category: "ROD" });
      expect(result.success).toBe(true);
    });

    it("rejects invalid status filter", () => {
      const result = gearListFiltersSchema.safeParse({ status: "BROKEN" });
      expect(result.success).toBe(false);
    });
  });
});
