import { describe, it, expect } from "vitest";
import { TRPCError } from "@trpc/server";
import { createAuthenticatedCaller, createUnauthenticatedCaller, createTestUser } from "./helpers";

describe("gear router", () => {
  describe("create", () => {
    it("creates a gear item for the authenticated user", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      const item = await caller.gear.create({
        name: "Orvis Helios 3F",
        category: "ROD",
        brand: "Orvis",
        model: "Helios 3F 9' 5wt",
        status: "OWNED",
      });

      expect(item.name).toBe("Orvis Helios 3F");
      expect(item.category).toBe("ROD");
      expect(item.brand).toBe("Orvis");
      expect(item.userId).toBe(user.id);
    });

    it("requires authentication", async () => {
      const caller = createUnauthenticatedCaller();
      await expect(
        caller.gear.create({ name: "Test Rod", category: "ROD" })
      ).rejects.toThrow(TRPCError);
    });

    it("validates required fields", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      await expect(
        // @ts-expect-error testing invalid input
        caller.gear.create({ category: "ROD" })
      ).rejects.toThrow();
    });

    it("validates category enum", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      await expect(
        // @ts-expect-error testing invalid enum
        caller.gear.create({ name: "Test", category: "INVALID" })
      ).rejects.toThrow();
    });
  });

  describe("list", () => {
    it("returns only the authenticated user's gear", async () => {
      const user1 = await createTestUser({ email: "user1@test.com" });
      const user2 = await createTestUser({ email: "user2@test.com" });
      const caller1 = createAuthenticatedCaller(user1.id);
      const caller2 = createAuthenticatedCaller(user2.id);

      await caller1.gear.create({ name: "Rod 1", category: "ROD" });
      await caller2.gear.create({ name: "Rod 2", category: "ROD" });

      const items1 = await caller1.gear.list({});
      const items2 = await caller2.gear.list({});

      expect(items1).toHaveLength(1);
      expect(items1[0]!.name).toBe("Rod 1");
      expect(items2).toHaveLength(1);
      expect(items2[0]!.name).toBe("Rod 2");
    });

    it("filters by category", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      await caller.gear.create({ name: "My Rod", category: "ROD" });
      await caller.gear.create({ name: "My Reel", category: "REEL" });

      const rods = await caller.gear.list({ category: "ROD" });
      expect(rods).toHaveLength(1);
      expect(rods[0]!.name).toBe("My Rod");
    });

    it("filters by status", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      await caller.gear.create({ name: "Active Rod", category: "ROD", status: "OWNED" });
      await caller.gear.create({ name: "Dream Rod", category: "ROD", status: "WISHLIST" });

      const owned = await caller.gear.list({ status: "OWNED" });
      expect(owned).toHaveLength(1);
      expect(owned[0]!.name).toBe("Active Rod");
    });

    it("searches by name, brand, and model", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      await caller.gear.create({ name: "Orvis Helios", category: "ROD", brand: "Orvis" });
      await caller.gear.create({ name: "Sage Dart", category: "ROD", brand: "Sage" });

      const results = await caller.gear.list({ search: "orvis" });
      expect(results).toHaveLength(1);
      expect(results[0]!.name).toBe("Orvis Helios");
    });
  });

  describe("getById", () => {
    it("returns a gear item by id", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);
      const created = await caller.gear.create({ name: "Test Rod", category: "ROD" });

      const item = await caller.gear.getById({ id: created.id });
      expect(item.name).toBe("Test Rod");
    });

    it("throws NOT_FOUND for another user's gear", async () => {
      const user1 = await createTestUser({ email: "u1@test.com" });
      const user2 = await createTestUser({ email: "u2@test.com" });
      const caller1 = createAuthenticatedCaller(user1.id);
      const caller2 = createAuthenticatedCaller(user2.id);

      const item = await caller1.gear.create({ name: "Private Rod", category: "ROD" });

      await expect(caller2.gear.getById({ id: item.id })).rejects.toThrow(
        expect.objectContaining({ code: "NOT_FOUND" })
      );
    });

    it("throws NOT_FOUND for nonexistent id", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      await expect(
        caller.gear.getById({ id: "nonexistent-id" })
      ).rejects.toThrow(expect.objectContaining({ code: "NOT_FOUND" }));
    });
  });

  describe("update", () => {
    it("updates a gear item", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);
      const item = await caller.gear.create({ name: "Old Name", category: "ROD" });

      const updated = await caller.gear.update({
        id: item.id,
        data: { name: "New Name", rating: 5 },
      });

      expect(updated.name).toBe("New Name");
      expect(updated.rating).toBe(5);
    });

    it("prevents updating another user's gear", async () => {
      const user1 = await createTestUser({ email: "owner@test.com" });
      const user2 = await createTestUser({ email: "other@test.com" });
      const caller1 = createAuthenticatedCaller(user1.id);
      const caller2 = createAuthenticatedCaller(user2.id);

      const item = await caller1.gear.create({ name: "My Rod", category: "ROD" });

      await expect(
        caller2.gear.update({ id: item.id, data: { name: "Stolen" } })
      ).rejects.toThrow(expect.objectContaining({ code: "NOT_FOUND" }));
    });
  });

  describe("delete", () => {
    it("deletes a gear item", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);
      const item = await caller.gear.create({ name: "Doomed Rod", category: "ROD" });

      await caller.gear.delete({ id: item.id });

      const items = await caller.gear.list({});
      expect(items).toHaveLength(0);
    });

    it("prevents deleting another user's gear", async () => {
      const user1 = await createTestUser({ email: "owner2@test.com" });
      const user2 = await createTestUser({ email: "other2@test.com" });
      const caller1 = createAuthenticatedCaller(user1.id);
      const caller2 = createAuthenticatedCaller(user2.id);

      const item = await caller1.gear.create({ name: "Protected Rod", category: "ROD" });

      await expect(
        caller2.gear.delete({ id: item.id })
      ).rejects.toThrow(expect.objectContaining({ code: "NOT_FOUND" }));
    });
  });

  describe("updateStatus", () => {
    it("updates gear status", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);
      const item = await caller.gear.create({ name: "Rod", category: "ROD", status: "OWNED" });

      const updated = await caller.gear.updateStatus({ id: item.id, status: "RETIRED" });
      expect(updated.status).toBe("RETIRED");
    });
  });

  describe("stats", () => {
    it("returns gear statistics", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      await caller.gear.create({ name: "Rod", category: "ROD", status: "OWNED" });
      await caller.gear.create({ name: "Reel", category: "REEL", status: "OWNED" });
      await caller.gear.create({ name: "Dream Rod", category: "ROD", status: "WISHLIST" });

      const stats = await caller.gear.stats();
      expect(stats.total).toBe(3);
      expect(stats.byCategory).toHaveLength(2); // ROD and REEL
      expect(stats.byStatus).toHaveLength(2); // OWNED and WISHLIST
    });

    it("returns zero for users with no gear", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      const stats = await caller.gear.stats();
      expect(stats.total).toBe(0);
      expect(stats.byCategory).toHaveLength(0);
      expect(stats.byStatus).toHaveLength(0);
    });
  });
});
