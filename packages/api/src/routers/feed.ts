import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const feedRouter = createTRPCRouter({
  activity: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Get the list of users the current user follows
    const following = await ctx.db.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);

    if (followingIds.length === 0) {
      return [];
    }

    // Fetch recent catches from followed users (PUBLIC or FOLLOWERS_ONLY)
    const catches = await ctx.db.catch.findMany({
      where: {
        userId: { in: followingIds },
        visibility: { in: ["PUBLIC", "FOLLOWERS_ONLY"] },
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
        photos: { take: 1 },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { caughtAt: "desc" },
      take: 20,
    });

    // Fetch recent trips from followed users (PUBLIC or FOLLOWERS_ONLY)
    const trips = await ctx.db.trip.findMany({
      where: {
        userId: { in: followingIds },
        visibility: { in: ["PUBLIC", "FOLLOWERS_ONLY"] },
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
        photos: { take: 1 },
        _count: { select: { likes: true, comments: true, catches: true } },
      },
      orderBy: { startDate: "desc" },
      take: 20,
    });

    // Merge and sort by date
    type FeedItem =
      | { type: "catch"; date: Date; data: (typeof catches)[number] }
      | { type: "trip"; date: Date; data: (typeof trips)[number] };

    const items: FeedItem[] = [
      ...catches.map((c) => ({
        type: "catch" as const,
        date: c.caughtAt,
        data: c,
      })),
      ...trips.map((t) => ({
        type: "trip" as const,
        date: t.startDate,
        data: t,
      })),
    ];

    items.sort((a, b) => b.date.getTime() - a.date.getTime());

    return items.slice(0, 20);
  }),

  explore: publicProcedure
    .input(z.object({ cursor: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const cursor = input?.cursor;

      const catches = await ctx.db.catch.findMany({
        where: {
          visibility: "PUBLIC",
          photos: { some: {} },
          ...(cursor ? { id: { lt: cursor } } : {}),
        },
        include: {
          user: { select: { id: true, name: true, image: true } },
          photos: { take: 1 },
          _count: { select: { likes: true, comments: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 21, // Take one extra to determine if there's a next page
      });

      let nextCursor: string | undefined;
      if (catches.length > 20) {
        const next = catches.pop();
        nextCursor = next?.id;
      }

      return {
        items: catches,
        nextCursor,
      };
    }),
});
