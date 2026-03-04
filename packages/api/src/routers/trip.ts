import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  createTripSchema,
  updateTripSchema,
  tripListFiltersSchema,
} from "@fyshe/validators";
import { z } from "zod";

export const tripRouter = createTRPCRouter({
  list: protectedProcedure.input(tripListFiltersSchema).query(async ({ ctx, input }) => {
    const where: Record<string, unknown> = {
      OR: [
        { userId: ctx.session.user.id },
        { members: { some: { userId: ctx.session.user.id } } },
      ],
    };

    if (input.from || input.to) {
      where.startDate = {
        ...(input.from && { gte: input.from }),
        ...(input.to && { lte: input.to }),
      };
    }
    if (input.search) {
      where.AND = [
        {
          OR: [
            { title: { contains: input.search, mode: "insensitive" } },
            { locationName: { contains: input.search, mode: "insensitive" } },
            { waterBody: { contains: input.search, mode: "insensitive" } },
          ],
        },
      ];
    }

    return ctx.db.trip.findMany({
      where,
      include: {
        _count: { select: { catches: true, members: true, photos: true } },
        photos: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { startDate: "desc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const trip = await ctx.db.trip.findFirst({
        where: {
          id: input.id,
          OR: [
            { userId: ctx.session.user.id },
            { members: { some: { userId: ctx.session.user.id } } },
          ],
        },
        include: {
          photos: true,
          members: { include: { user: { select: { id: true, name: true, image: true } } } },
          catches: {
            include: {
              photos: { where: { isPrimary: true }, take: 1 },
            },
            orderBy: { caughtAt: "desc" },
          },
        },
      });

      if (!trip) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Trip not found" });
      }

      return trip;
    }),

  create: protectedProcedure.input(createTripSchema).mutation(async ({ ctx, input }) => {
    return ctx.db.trip.create({
      data: {
        ...input,
        user: { connect: { id: ctx.session.user.id } },
      },
    });
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: updateTripSchema }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.trip.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Trip not found" });
      }

      return ctx.db.trip.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.trip.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Trip not found" });
      }

      return ctx.db.trip.delete({ where: { id: input.id } });
    }),

  addMember: protectedProcedure
    .input(z.object({ tripId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const trip = await ctx.db.trip.findFirst({
        where: { id: input.tripId, userId: ctx.session.user.id },
      });

      if (!trip) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Trip not found" });
      }

      return ctx.db.tripMember.create({
        data: {
          trip: { connect: { id: input.tripId } },
          user: { connect: { id: input.userId } },
        },
      });
    }),

  removeMember: protectedProcedure
    .input(z.object({ tripId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const trip = await ctx.db.trip.findFirst({
        where: { id: input.tripId, userId: ctx.session.user.id },
      });

      if (!trip) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Trip not found" });
      }

      return ctx.db.tripMember.deleteMany({
        where: { tripId: input.tripId, userId: input.userId },
      });
    }),
});
