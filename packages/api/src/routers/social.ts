import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  followInputSchema,
  likeInputSchema,
  createCommentSchema,
  updateCommentSchema,
  commentListInputSchema,
} from "@fyshe/validators";
import { z } from "zod";
import type { Prisma } from "@fyshe/db";

export const socialRouter = createTRPCRouter({
  // ── Follow ─────────────────────────────────────────────

  follow: protectedProcedure.input(followInputSchema).mutation(async ({ ctx, input }) => {
    const currentUserId = ctx.session.user.id;

    if (input.userId === currentUserId) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "You cannot follow yourself" });
    }

    return ctx.db.follow.create({
      data: {
        follower: { connect: { id: currentUserId } },
        following: { connect: { id: input.userId } },
      },
    });
  }),

  unfollow: protectedProcedure.input(followInputSchema).mutation(async ({ ctx, input }) => {
    return ctx.db.follow.delete({
      where: {
        followerId_followingId: {
          followerId: ctx.session.user.id as string,
          followingId: input.userId,
        },
      },
    });
  }),

  followers: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const follows = await ctx.db.follow.findMany({
        where: { followingId: input.userId },
        include: {
          follower: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return follows.map((f) => f.follower);
    }),

  following: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const follows = await ctx.db.follow.findMany({
        where: { followerId: input.userId },
        include: {
          following: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return follows.map((f) => f.following);
    }),

  isFollowing: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const existing = await ctx.db.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: ctx.session.user.id as string,
            followingId: input.userId,
          },
        },
      });

      return !!existing;
    }),

  // ── Like ───────────────────────────────────────────────

  toggleLike: protectedProcedure.input(likeInputSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    const where: Record<string, unknown> = { userId };
    if (input.catchId) where.catchId = input.catchId;
    if (input.tripId) where.tripId = input.tripId;
    if (input.articleId) where.articleId = input.articleId;

    const existing = await ctx.db.like.findFirst({ where });

    if (existing) {
      await ctx.db.like.delete({ where: { id: existing.id } });
      return { liked: false };
    }

    const data: Prisma.LikeCreateInput = {
      user: { connect: { id: userId } },
      ...(input.catchId && { catch: { connect: { id: input.catchId } } }),
      ...(input.tripId && { trip: { connect: { id: input.tripId } } }),
      ...(input.articleId && { article: { connect: { id: input.articleId } } }),
    };

    await ctx.db.like.create({ data });

    return { liked: true };
  }),

  getLikes: publicProcedure
    .input(
      z.object({
        catchId: z.string().optional(),
        tripId: z.string().optional(),
        articleId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = {};
      if (input.catchId) where.catchId = input.catchId;
      if (input.tripId) where.tripId = input.tripId;
      if (input.articleId) where.articleId = input.articleId;

      const count = await ctx.db.like.count({ where });

      let liked = false;
      const userId = ctx.session?.user?.id;
      if (userId) {
        const existing = await ctx.db.like.findFirst({
          where: { ...where, userId },
        });
        liked = !!existing;
      }

      return { count, liked };
    }),

  // ── Comment ────────────────────────────────────────────

  createComment: protectedProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const data: Prisma.CommentCreateInput = {
        content: input.content,
        user: { connect: { id: ctx.session.user.id } },
        ...(input.catchId && { catch: { connect: { id: input.catchId } } }),
        ...(input.tripId && { trip: { connect: { id: input.tripId } } }),
        ...(input.articleId && { article: { connect: { id: input.articleId } } }),
        ...(input.parentId && { parent: { connect: { id: input.parentId } } }),
      };

      return ctx.db.comment.create({
        data,
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      });
    }),

  updateComment: protectedProcedure
    .input(z.object({ id: z.string(), data: updateCommentSchema }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.comment.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Comment not found" });
      }

      return ctx.db.comment.update({
        where: { id: input.id },
        data: { content: input.data.content },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      });
    }),

  deleteComment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.comment.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Comment not found" });
      }

      return ctx.db.comment.delete({ where: { id: input.id } });
    }),

  listComments: publicProcedure
    .input(commentListInputSchema)
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = { parentId: null };
      if (input.catchId) where.catchId = input.catchId;
      if (input.tripId) where.tripId = input.tripId;
      if (input.articleId) where.articleId = input.articleId;

      return ctx.db.comment.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, image: true } },
          replies: {
            include: {
              user: { select: { id: true, name: true, image: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      });
    }),
});
