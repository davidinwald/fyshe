import { describe, it, expect } from "vitest";
import { TRPCError } from "@trpc/server";
import { createAuthenticatedCaller, createUnauthenticatedCaller, createTestUser } from "./helpers";

describe("trip router", () => {
  describe("create", () => {
    it("creates a trip for the authenticated user", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      const trip = await caller.trip.create({
        title: "Montana Weekend",
        startDate: new Date("2025-07-15"),
        endDate: new Date("2025-07-17"),
        locationName: "Ennis, MT",
        waterBody: "Madison River",
      });

      expect(trip.title).toBe("Montana Weekend");
      expect(trip.userId).toBe(user.id);
      expect(trip.waterBody).toBe("Madison River");
    });

    it("requires authentication", async () => {
      const caller = createUnauthenticatedCaller();
      await expect(
        caller.trip.create({ title: "Trip", startDate: new Date() })
      ).rejects.toThrow(TRPCError);
    });
  });

  describe("list", () => {
    it("returns the user's trips", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      await caller.trip.create({ title: "Trip 1", startDate: new Date("2025-06-01") });
      await caller.trip.create({ title: "Trip 2", startDate: new Date("2025-07-01") });

      const trips = await caller.trip.list({});
      expect(trips).toHaveLength(2);
    });

    it("includes trips where user is a member", async () => {
      const owner = await createTestUser({ email: "owner@test.com" });
      const member = await createTestUser({ email: "member@test.com" });
      const ownerCaller = createAuthenticatedCaller(owner.id);
      const memberCaller = createAuthenticatedCaller(member.id);

      const trip = await ownerCaller.trip.create({
        title: "Group Trip",
        startDate: new Date("2025-08-01"),
      });

      await ownerCaller.trip.addMember({ tripId: trip.id, userId: member.id });

      const memberTrips = await memberCaller.trip.list({});
      expect(memberTrips).toHaveLength(1);
      expect(memberTrips[0]!.title).toBe("Group Trip");
    });

    it("does not return other users' private trips", async () => {
      const user1 = await createTestUser({ email: "u1@test.com" });
      const user2 = await createTestUser({ email: "u2@test.com" });
      const caller1 = createAuthenticatedCaller(user1.id);
      const caller2 = createAuthenticatedCaller(user2.id);

      await caller1.trip.create({ title: "Secret Trip", startDate: new Date() });

      const trips = await caller2.trip.list({});
      expect(trips).toHaveLength(0);
    });

    it("filters by search", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);

      await caller.trip.create({ title: "Madison River Weekend", startDate: new Date() });
      await caller.trip.create({ title: "Lake Michigan Day", startDate: new Date() });

      const results = await caller.trip.list({ search: "madison" });
      expect(results).toHaveLength(1);
      expect(results[0]!.title).toBe("Madison River Weekend");
    });
  });

  describe("getById", () => {
    it("returns a trip with members and catches", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);
      const trip = await caller.trip.create({
        title: "Test Trip",
        startDate: new Date("2025-07-15"),
      });

      const detail = await caller.trip.getById({ id: trip.id });
      expect(detail.title).toBe("Test Trip");
      expect(detail.members).toBeDefined();
      expect(detail.catches).toBeDefined();
    });

    it("throws NOT_FOUND for inaccessible trip", async () => {
      const user1 = await createTestUser({ email: "own@test.com" });
      const user2 = await createTestUser({ email: "oth@test.com" });
      const caller1 = createAuthenticatedCaller(user1.id);
      const caller2 = createAuthenticatedCaller(user2.id);

      const trip = await caller1.trip.create({ title: "Private", startDate: new Date() });

      await expect(caller2.trip.getById({ id: trip.id })).rejects.toThrow(
        expect.objectContaining({ code: "NOT_FOUND" })
      );
    });
  });

  describe("update", () => {
    it("updates a trip", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);
      const trip = await caller.trip.create({ title: "Old", startDate: new Date() });

      const updated = await caller.trip.update({
        id: trip.id,
        data: { title: "New Title", waterBody: "Snake River" },
      });

      expect(updated.title).toBe("New Title");
      expect(updated.waterBody).toBe("Snake River");
    });

    it("prevents non-owner from updating", async () => {
      const owner = await createTestUser({ email: "own2@test.com" });
      const other = await createTestUser({ email: "oth2@test.com" });
      const ownerCaller = createAuthenticatedCaller(owner.id);
      const otherCaller = createAuthenticatedCaller(other.id);

      const trip = await ownerCaller.trip.create({ title: "Mine", startDate: new Date() });

      await expect(
        otherCaller.trip.update({ id: trip.id, data: { title: "Stolen" } })
      ).rejects.toThrow(expect.objectContaining({ code: "NOT_FOUND" }));
    });
  });

  describe("delete", () => {
    it("deletes a trip", async () => {
      const user = await createTestUser();
      const caller = createAuthenticatedCaller(user.id);
      const trip = await caller.trip.create({ title: "Deleteme", startDate: new Date() });

      await caller.trip.delete({ id: trip.id });

      const trips = await caller.trip.list({});
      expect(trips).toHaveLength(0);
    });
  });

  describe("members", () => {
    it("adds and removes members", async () => {
      const owner = await createTestUser({ email: "own3@test.com" });
      const friend = await createTestUser({ email: "friend@test.com" });
      const ownerCaller = createAuthenticatedCaller(owner.id);

      const trip = await ownerCaller.trip.create({
        title: "Group Trip",
        startDate: new Date(),
      });

      await ownerCaller.trip.addMember({ tripId: trip.id, userId: friend.id });

      let detail = await ownerCaller.trip.getById({ id: trip.id });
      expect(detail.members).toHaveLength(1);
      expect(detail.members[0]!.userId).toBe(friend.id);

      await ownerCaller.trip.removeMember({ tripId: trip.id, userId: friend.id });

      detail = await ownerCaller.trip.getById({ id: trip.id });
      expect(detail.members).toHaveLength(0);
    });

    it("prevents non-owner from adding members", async () => {
      const owner = await createTestUser({ email: "own4@test.com" });
      const other = await createTestUser({ email: "oth4@test.com" });
      const ownerCaller = createAuthenticatedCaller(owner.id);
      const otherCaller = createAuthenticatedCaller(other.id);

      const trip = await ownerCaller.trip.create({ title: "Mine", startDate: new Date() });

      await expect(
        otherCaller.trip.addMember({ tripId: trip.id, userId: other.id })
      ).rejects.toThrow(expect.objectContaining({ code: "NOT_FOUND" }));
    });
  });
});
