import { describe, it, expect } from "vitest";
import { TRPCError } from "@trpc/server";
import { createAuthenticatedCaller, createUnauthenticatedCaller, createTestUser } from "./helpers";

describe("user router", () => {
  describe("me", () => {
    it("returns the authenticated user with preferences", async () => {
      const user = await createTestUser({ name: "Jane Doe" });
      const caller = createAuthenticatedCaller(user.id);

      const result = await caller.user.me();
      expect(result).not.toBeNull();
      expect(result!.name).toBe("Jane Doe");
      expect(result!.preferences).toBeNull(); // no preferences set yet
    });

    it("requires authentication", async () => {
      const caller = createUnauthenticatedCaller();
      await expect(caller.user.me()).rejects.toThrow(TRPCError);
    });
  });

  describe("updateProfile", () => {
    it("updates user profile fields", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      const updated = await caller.user.updateProfile({
        name: "Updated Name",
        bio: "Loves fly fishing",
        location: "Montana",
        isPublic: true,
      });

      expect(updated.name).toBe("Updated Name");
      expect(updated.bio).toBe("Loves fly fishing");
      expect(updated.location).toBe("Montana");
      expect(updated.isPublic).toBe(true);
    });

    it("allows partial updates", async () => {
      const user = await createTestUser({ name: "Original" });
      const caller = createAuthenticatedCaller(user.id);

      const updated = await caller.user.updateProfile({ bio: "New bio" });
      expect(updated.bio).toBe("New bio");
      expect(updated.name).toBe("Original"); // unchanged
    });

    it("requires authentication", async () => {
      const caller = createUnauthenticatedCaller();
      await expect(
        caller.user.updateProfile({ name: "Hacker" })
      ).rejects.toThrow(TRPCError);
    });
  });

  describe("updatePreferences", () => {
    it("creates preferences if none exist", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      const prefs = await caller.user.updatePreferences({
        preferredMethods: ["FLY", "SPIN"],
        unitSystem: "IMPERIAL",
        defaultVisibility: "PUBLIC",
      });

      expect(prefs.preferredMethods).toEqual(["FLY", "SPIN"]);
      expect(prefs.unitSystem).toBe("IMPERIAL");
      expect(prefs.defaultVisibility).toBe("PUBLIC");
    });

    it("updates existing preferences", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      await caller.user.updatePreferences({ unitSystem: "IMPERIAL" });
      const updated = await caller.user.updatePreferences({ unitSystem: "METRIC" });

      expect(updated.unitSystem).toBe("METRIC");
    });

    it("preserves unmodified fields on update", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      await caller.user.updatePreferences({
        preferredMethods: ["FLY"],
        unitSystem: "IMPERIAL",
      });

      const updated = await caller.user.updatePreferences({
        unitSystem: "METRIC",
      });

      expect(updated.unitSystem).toBe("METRIC");
      // preferredMethods should still be present from the first call
      expect(updated.preferredMethods).toEqual(["FLY"]);
    });
  });

  describe("getPublicProfile", () => {
    it("returns a public user profile", async () => {
      const user = await createTestUser({ name: "Public Angler" });
      const caller = createAuthenticatedCaller(user.id);

      // Make profile public
      await caller.user.updateProfile({ isPublic: true });

      // Fetch as unauthenticated
      const publicCaller = createUnauthenticatedCaller();
      const profile = await publicCaller.user.getPublicProfile({ id: user.id });

      expect(profile).not.toBeNull();
      expect(profile!.name).toBe("Public Angler");
      expect(profile!.id).toBe(user.id);
    });

    it("returns null for private profiles", async () => {
      const user = await createTestUser({ name: "Private Angler" });
      // isPublic defaults to false

      const publicCaller = createUnauthenticatedCaller();
      const profile = await publicCaller.user.getPublicProfile({ id: user.id });

      expect(profile).toBeNull();
    });

    it("does not expose email or sensitive data", async () => {
      const user = await createTestUser({ name: "Visible Angler" });
      const caller = createAuthenticatedCaller(user.id);
      await caller.user.updateProfile({ isPublic: true });

      const publicCaller = createUnauthenticatedCaller();
      const profile = await publicCaller.user.getPublicProfile({ id: user.id });

      expect(profile).not.toBeNull();
      // Should only have selected fields
      const keys = Object.keys(profile!);
      expect(keys).not.toContain("email");
      expect(keys).not.toContain("emailVerified");
    });
  });
});
