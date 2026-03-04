import { describe, it, expect } from "vitest";
import { updateProfileSchema, updatePreferencesSchema } from "../user";

describe("user validators", () => {
  describe("updateProfileSchema", () => {
    it("accepts valid profile update", () => {
      const result = updateProfileSchema.safeParse({
        name: "Jane Doe",
        bio: "Fly fishing enthusiast",
        location: "Montana",
        isPublic: true,
      });
      expect(result.success).toBe(true);
    });

    it("allows partial updates", () => {
      const result = updateProfileSchema.safeParse({ name: "Jane" });
      expect(result.success).toBe(true);
    });

    it("rejects name that's too long", () => {
      const result = updateProfileSchema.safeParse({
        name: "a".repeat(101),
      });
      expect(result.success).toBe(false);
    });

    it("rejects bio that's too long", () => {
      const result = updateProfileSchema.safeParse({
        bio: "a".repeat(501),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updatePreferencesSchema", () => {
    it("accepts valid preferences", () => {
      const result = updatePreferencesSchema.safeParse({
        preferredMethods: ["FLY", "SPIN"],
        unitSystem: "IMPERIAL",
        defaultVisibility: "PUBLIC",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid fishing method", () => {
      const result = updatePreferencesSchema.safeParse({
        preferredMethods: ["DYNAMITE"],
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid unit system", () => {
      const result = updatePreferencesSchema.safeParse({
        unitSystem: "FURLONGS",
      });
      expect(result.success).toBe(false);
    });
  });
});
