import { describe, it, expect } from "vitest";
import {
  createFlyPatternSchema,
  updateFlyPatternSchema,
  flyPatternListFiltersSchema,
  flyRecommendationInputSchema,
  createMaterialSchema,
  updateMaterialSchema,
  materialListFiltersSchema,
  baitTypeListFiltersSchema,
  baitRecommendationInputSchema,
} from "../fly";

describe("fly validators", () => {
  describe("createFlyPatternSchema", () => {
    it("accepts valid minimal input", () => {
      const result = createFlyPatternSchema.safeParse({
        name: "Adams",
        category: "DRY_FLY",
      });
      expect(result.success).toBe(true);
    });

    it("accepts full input with materials and steps", () => {
      const result = createFlyPatternSchema.safeParse({
        name: "Pheasant Tail Nymph",
        description: "A classic nymph pattern",
        category: "NYMPH",
        type: "IMITATOR",
        hookSize: "14-18",
        hookType: "Standard nymph hook",
        threadColor: "Brown",
        difficulty: "BEGINNER",
        seasons: ["SPRING", "FALL"],
        waterTypes: ["RIVER", "STREAM"],
        targetSpecies: ["Rainbow Trout", "Brown Trout"],
        regions: ["Rocky Mountain"],
        materials: [
          { part: "Tail", material: "Pheasant Tail Fibers", color: "Natural" },
          { part: "Body", material: "Pheasant Tail Fibers", color: "Natural", quantity: "4-6 fibers" },
        ],
        tyingSteps: [
          { stepNumber: 1, instruction: "Secure hook in vise and start thread" },
          { stepNumber: 2, instruction: "Tie in pheasant tail fibers for tail", tip: "Keep fibers even" },
        ],
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty name", () => {
      const result = createFlyPatternSchema.safeParse({ name: "", category: "DRY_FLY" });
      expect(result.success).toBe(false);
    });

    it("rejects invalid category", () => {
      const result = createFlyPatternSchema.safeParse({ name: "Test", category: "INVALID" });
      expect(result.success).toBe(false);
    });

    it("rejects invalid type", () => {
      const result = createFlyPatternSchema.safeParse({ name: "Test", category: "NYMPH", type: "INVALID" });
      expect(result.success).toBe(false);
    });

    it("rejects invalid difficulty", () => {
      const result = createFlyPatternSchema.safeParse({ name: "Test", category: "NYMPH", difficulty: "IMPOSSIBLE" });
      expect(result.success).toBe(false);
    });

    it("rejects invalid season in array", () => {
      const result = createFlyPatternSchema.safeParse({ name: "Test", category: "NYMPH", seasons: ["MONSOON"] });
      expect(result.success).toBe(false);
    });

    it("rejects invalid water type in array", () => {
      const result = createFlyPatternSchema.safeParse({ name: "Test", category: "NYMPH", waterTypes: ["OCEAN"] });
      expect(result.success).toBe(false);
    });

    it("defaults difficulty to INTERMEDIATE", () => {
      const result = createFlyPatternSchema.parse({ name: "Test", category: "DRY_FLY" });
      expect(result.difficulty).toBe("INTERMEDIATE");
    });

    it("defaults seasons to empty array", () => {
      const result = createFlyPatternSchema.parse({ name: "Test", category: "DRY_FLY" });
      expect(result.seasons).toEqual([]);
    });

    it("validates material part is required", () => {
      const result = createFlyPatternSchema.safeParse({
        name: "Test",
        category: "DRY_FLY",
        materials: [{ part: "", material: "Dubbing" }],
      });
      expect(result.success).toBe(false);
    });

    it("validates tying step instruction is required", () => {
      const result = createFlyPatternSchema.safeParse({
        name: "Test",
        category: "DRY_FLY",
        tyingSteps: [{ stepNumber: 1, instruction: "" }],
      });
      expect(result.success).toBe(false);
    });

    it("validates tying step number must be positive", () => {
      const result = createFlyPatternSchema.safeParse({
        name: "Test",
        category: "DRY_FLY",
        tyingSteps: [{ stepNumber: 0, instruction: "Do something" }],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updateFlyPatternSchema", () => {
    it("allows partial updates", () => {
      const result = updateFlyPatternSchema.safeParse({ name: "Updated Adams" });
      expect(result.success).toBe(true);
    });

    it("allows empty object", () => {
      const result = updateFlyPatternSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("allows updating materials", () => {
      const result = updateFlyPatternSchema.safeParse({
        materials: [{ part: "Tail", material: "Hackle Fibers" }],
      });
      expect(result.success).toBe(true);
    });
  });

  describe("flyPatternListFiltersSchema", () => {
    it("accepts empty filters", () => {
      expect(flyPatternListFiltersSchema.safeParse({}).success).toBe(true);
    });

    it("accepts category filter", () => {
      expect(flyPatternListFiltersSchema.safeParse({ category: "NYMPH" }).success).toBe(true);
    });

    it("accepts multiple filters", () => {
      const result = flyPatternListFiltersSchema.safeParse({
        category: "DRY_FLY",
        difficulty: "BEGINNER",
        season: "SUMMER",
        waterType: "RIVER",
        search: "adams",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid category", () => {
      expect(flyPatternListFiltersSchema.safeParse({ category: "INVALID" }).success).toBe(false);
    });
  });

  describe("flyRecommendationInputSchema", () => {
    it("accepts empty input", () => {
      expect(flyRecommendationInputSchema.safeParse({}).success).toBe(true);
    });

    it("accepts all filters", () => {
      const result = flyRecommendationInputSchema.safeParse({
        season: "SPRING",
        waterType: "RIVER",
        targetSpecies: "Rainbow Trout",
        region: "Rocky Mountain",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("createMaterialSchema", () => {
    it("accepts valid input", () => {
      const result = createMaterialSchema.safeParse({
        category: "Dubbing",
        name: "Hare's Ear Dubbing",
        color: "Natural",
        brand: "Hareline",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty category", () => {
      expect(createMaterialSchema.safeParse({ category: "", name: "Test" }).success).toBe(false);
    });

    it("rejects empty name", () => {
      expect(createMaterialSchema.safeParse({ category: "Hook", name: "" }).success).toBe(false);
    });

    it("defaults inStock to true", () => {
      const result = createMaterialSchema.parse({ category: "Hook", name: "Dry Fly Hook #14" });
      expect(result.inStock).toBe(true);
    });
  });

  describe("updateMaterialSchema", () => {
    it("allows partial updates", () => {
      expect(updateMaterialSchema.safeParse({ inStock: false }).success).toBe(true);
    });

    it("allows empty object", () => {
      expect(updateMaterialSchema.safeParse({}).success).toBe(true);
    });
  });

  describe("materialListFiltersSchema", () => {
    it("accepts empty filters", () => {
      expect(materialListFiltersSchema.safeParse({}).success).toBe(true);
    });

    it("accepts all filters", () => {
      const result = materialListFiltersSchema.safeParse({
        category: "Dubbing",
        inStock: true,
        search: "hare",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("baitTypeListFiltersSchema", () => {
    it("accepts empty filters", () => {
      expect(baitTypeListFiltersSchema.safeParse({}).success).toBe(true);
    });

    it("accepts category filter", () => {
      expect(baitTypeListFiltersSchema.safeParse({ category: "LIVE_BAIT" }).success).toBe(true);
    });

    it("accepts multiple filters", () => {
      const result = baitTypeListFiltersSchema.safeParse({
        category: "LIVE_BAIT",
        season: "SUMMER",
        waterType: "LAKE",
        species: "Bass",
        search: "worm",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid category", () => {
      expect(baitTypeListFiltersSchema.safeParse({ category: "DYNAMITE" }).success).toBe(false);
    });
  });

  describe("baitRecommendationInputSchema", () => {
    it("accepts empty input", () => {
      expect(baitRecommendationInputSchema.safeParse({}).success).toBe(true);
    });

    it("accepts all filters", () => {
      const result = baitRecommendationInputSchema.safeParse({
        season: "FALL",
        waterType: "LAKE",
        targetSpecies: "Largemouth Bass",
        region: "Southeast",
      });
      expect(result.success).toBe(true);
    });
  });
});
