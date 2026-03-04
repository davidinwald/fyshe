import { describe, it, expect } from "vitest";
import { TRPCError } from "@trpc/server";
import { createAuthenticatedCaller, createUnauthenticatedCaller, createTestUser } from "./helpers";

describe("catch router", () => {
  describe("create", () => {
    it("creates a catch for the authenticated user", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      const item = await caller.catch.create({
        species: "Rainbow Trout",
        length: 14.5,
        weight: 1.2,
        method: "FLY",
        locationName: "Madison River",
        released: true,
      });

      expect(item.species).toBe("Rainbow Trout");
      expect(item.userId).toBe(user.id);
      expect(item.released).toBe(true);
    });

    it("requires authentication", async () => {
      const caller = createUnauthenticatedCaller();
      await expect(
        caller.catch.create({ species: "Trout" })
      ).rejects.toThrow(TRPCError);
    });

    it("links gear to the catch", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);
      const rod = await caller.gear.create({ name: "My Rod", category: "ROD" });
      const reel = await caller.gear.create({ name: "My Reel", category: "REEL" });

      const item = await caller.catch.create({
        species: "Brown Trout",
        gearIds: [rod.id, reel.id],
      });

      expect(item.gear).toHaveLength(2);
    });

    it("links catch to a trip", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);
      const trip = await caller.trip.create({
        title: "Test Trip",
        startDate: new Date("2025-07-15"),
      });

      const item = await caller.catch.create({
        species: "Brook Trout",
        tripId: trip.id,
      });

      expect(item.tripId).toBe(trip.id);
    });
  });

  describe("list", () => {
    it("returns only the authenticated user's catches", async () => {
      const user1 = await createTestUser({ email: "u1@test.com" });
      const user2 = await createTestUser({ email: "u2@test.com" });
      const caller1 = createAuthenticatedCaller(user1.id);
      const caller2 = createAuthenticatedCaller(user2.id);

      await caller1.catch.create({ species: "Trout" });
      await caller2.catch.create({ species: "Bass" });

      const items = await caller1.catch.list({});
      expect(items).toHaveLength(1);
      expect(items[0]!.species).toBe("Trout");
    });

    it("filters by method", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      await caller.catch.create({ species: "Trout", method: "FLY" });
      await caller.catch.create({ species: "Bass", method: "SPIN" });

      const flyCatches = await caller.catch.list({ method: "FLY" });
      expect(flyCatches).toHaveLength(1);
      expect(flyCatches[0]!.species).toBe("Trout");
    });

    it("searches by species and location", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      await caller.catch.create({ species: "Rainbow Trout", locationName: "Madison River" });
      await caller.catch.create({ species: "Largemouth Bass", locationName: "Lake Michigan" });

      const results = await caller.catch.list({ search: "rainbow" });
      expect(results).toHaveLength(1);
      expect(results[0]!.species).toBe("Rainbow Trout");
    });
  });

  describe("getById", () => {
    it("returns a catch with gear and photos", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);
      const rod = await caller.gear.create({ name: "Rod", category: "ROD" });
      const created = await caller.catch.create({
        species: "Cutthroat Trout",
        gearIds: [rod.id],
      });

      const item = await caller.catch.getById({ id: created.id });
      expect(item.species).toBe("Cutthroat Trout");
      expect(item.gear).toHaveLength(1);
    });

    it("throws NOT_FOUND for another user's catch", async () => {
      const user1 = await createTestUser({ email: "owner@test.com" });
      const user2 = await createTestUser({ email: "other@test.com" });
      const caller1 = createAuthenticatedCaller(user1.id);
      const caller2 = createAuthenticatedCaller(user2.id);

      const item = await caller1.catch.create({ species: "Secret Fish" });

      await expect(caller2.catch.getById({ id: item.id })).rejects.toThrow(
        expect.objectContaining({ code: "NOT_FOUND" })
      );
    });
  });

  describe("update", () => {
    it("updates a catch", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);
      const item = await caller.catch.create({ species: "Trout" });

      const updated = await caller.catch.update({
        id: item.id,
        data: { species: "Brown Trout", length: 18.5 },
      });

      expect(updated.species).toBe("Brown Trout");
    });

    it("updates gear associations", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);
      const rod1 = await caller.gear.create({ name: "Rod 1", category: "ROD" });
      const rod2 = await caller.gear.create({ name: "Rod 2", category: "ROD" });

      const item = await caller.catch.create({ species: "Trout", gearIds: [rod1.id] });
      expect(item.gear).toHaveLength(1);

      const updated = await caller.catch.update({
        id: item.id,
        data: { gearIds: [rod2.id] },
      });
      expect(updated.gear).toHaveLength(1);
      expect(updated.gear[0]!.gearId).toBe(rod2.id);
    });
  });

  describe("delete", () => {
    it("deletes a catch", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);
      const item = await caller.catch.create({ species: "Doomed Fish" });

      await caller.catch.delete({ id: item.id });

      const items = await caller.catch.list({});
      expect(items).toHaveLength(0);
    });

    it("prevents deleting another user's catch", async () => {
      const user1 = await createTestUser({ email: "o1@test.com" });
      const user2 = await createTestUser({ email: "o2@test.com" });
      const caller1 = createAuthenticatedCaller(user1.id);
      const caller2 = createAuthenticatedCaller(user2.id);

      const item = await caller1.catch.create({ species: "Protected Fish" });

      await expect(
        caller2.catch.delete({ id: item.id })
      ).rejects.toThrow(expect.objectContaining({ code: "NOT_FOUND" }));
    });
  });

  describe("stats", () => {
    it("returns catch statistics", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      await caller.catch.create({ species: "Rainbow Trout", method: "FLY" });
      await caller.catch.create({ species: "Rainbow Trout", method: "FLY" });
      await caller.catch.create({ species: "Brown Trout", method: "SPIN" });

      const stats = await caller.catch.stats();
      expect(stats.total).toBe(3);
      expect(stats.bySpecies).toHaveLength(2);
      expect(stats.byMethod).toHaveLength(2);
      expect(stats.recentCatches).toHaveLength(3);
    });

    it("returns zero for users with no catches", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      const stats = await caller.catch.stats();
      expect(stats.total).toBe(0);
    });
  });
});
