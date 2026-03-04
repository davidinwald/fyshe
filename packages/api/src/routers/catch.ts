import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  createCatchSchema,
  updateCatchSchema,
  catchListFiltersSchema,
} from "@fyshe/validators";
import { z } from "zod";

export const catchRouter = createTRPCRouter({
  list: protectedProcedure.input(catchListFiltersSchema).query(async ({ ctx, input }) => {
    const where: Record<string, unknown> = { userId: ctx.session.user.id };

    if (input.species) {
      where.species = { contains: input.species, mode: "insensitive" };
    }
    if (input.method) {
      where.method = input.method;
    }
    if (input.tripId) {
      where.tripId = input.tripId;
    }
    if (input.from || input.to) {
      where.caughtAt = {
        ...(input.from && { gte: input.from }),
        ...(input.to && { lte: input.to }),
      };
    }
    if (input.search) {
      where.OR = [
        { species: { contains: input.search, mode: "insensitive" } },
        { locationName: { contains: input.search, mode: "insensitive" } },
        { notes: { contains: input.search, mode: "insensitive" } },
      ];
    }

    return ctx.db.catch.findMany({
      where,
      include: {
        photos: { where: { isPrimary: true }, take: 1 },
        gear: { include: { gear: { select: { id: true, name: true, category: true } } } },
        trip: { select: { id: true, title: true } },
      },
      orderBy: { caughtAt: "desc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.catch.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
        include: {
          photos: true,
          gear: { include: { gear: true } },
          trip: { select: { id: true, title: true } },
        },
      });

      if (!item) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Catch not found" });
      }

      return item;
    }),

  create: protectedProcedure.input(createCatchSchema).mutation(async ({ ctx, input }) => {
    const { gearIds, tripId, ...data } = input;

    return ctx.db.catch.create({
      data: {
        ...data,
        user: { connect: { id: ctx.session.user.id } },
        ...(tripId && { trip: { connect: { id: tripId } } }),
        ...(gearIds?.length && {
          gear: {
            create: gearIds.map((gearId) => ({ gear: { connect: { id: gearId } } })),
          },
        }),
      },
      include: { photos: true, gear: { include: { gear: true } } },
    });
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: updateCatchSchema }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.catch.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Catch not found" });
      }

      const { gearIds, ...data } = input.data;

      return ctx.db.catch.update({
        where: { id: input.id },
        data: {
          ...data,
          ...(gearIds !== undefined && {
            gear: {
              deleteMany: {},
              ...(gearIds.length > 0 && {
                create: gearIds.map((gearId) => ({ gear: { connect: { id: gearId } } })),
              }),
            },
          }),
        },
        include: { photos: true, gear: { include: { gear: true } } },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.catch.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Catch not found" });
      }

      return ctx.db.catch.delete({ where: { id: input.id } });
    }),

  stats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const [total, bySpecies, byMethod, recentCatches] = await Promise.all([
      ctx.db.catch.count({ where: { userId } }),
      ctx.db.catch.groupBy({
        by: ["species"],
        where: { userId },
        _count: true,
        orderBy: { _count: { species: "desc" } },
        take: 10,
      }),
      ctx.db.catch.groupBy({
        by: ["method"],
        where: { userId, method: { not: null } },
        _count: true,
      }),
      ctx.db.catch.findMany({
        where: { userId },
        orderBy: { caughtAt: "desc" },
        take: 5,
        select: {
          id: true,
          species: true,
          length: true,
          weight: true,
          caughtAt: true,
          locationName: true,
        },
      }),
    ]);

    return { total, bySpecies, byMethod, recentCatches };
  }),
});
