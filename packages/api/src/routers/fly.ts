import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  createFlyPatternSchema,
  updateFlyPatternSchema,
  flyPatternListFiltersSchema,
  flyRecommendationInputSchema,
} from "@fyshe/validators";
import { z } from "zod";

export const flyRouter = createTRPCRouter({
  list: publicProcedure.input(flyPatternListFiltersSchema).query(async ({ ctx, input }) => {
    const where: Record<string, unknown> = {};

    if (input.category) {
      where.category = input.category;
    }
    if (input.type) {
      where.type = input.type;
    }
    if (input.difficulty) {
      where.difficulty = input.difficulty;
    }
    if (input.season) {
      where.seasons = { has: input.season };
    }
    if (input.waterType) {
      where.waterTypes = { has: input.waterType };
    }
    if (input.species) {
      where.targetSpecies = { has: input.species };
    }
    if (input.search) {
      where.OR = [
        { name: { contains: input.search, mode: "insensitive" } },
        { description: { contains: input.search, mode: "insensitive" } },
      ];
    }
    if (input.createdByMe && ctx.session?.user) {
      where.createdById = ctx.session.user.id;
    }

    // Visibility: show public patterns, or patterns created by the current user
    const userId = ctx.session?.user?.id;
    if (userId) {
      where.OR = where.OR
        ? [{ AND: where.OR, OR: [{ isPublic: true }, { createdById: userId }] }]
        : [{ isPublic: true }, { createdById: userId }];

      // If we already had a search OR, we need to restructure the query
      if (input.search) {
        // Reset and rebuild with AND logic
        delete where.OR;
        where.AND = [
          {
            OR: [
              { name: { contains: input.search, mode: "insensitive" } },
              { description: { contains: input.search, mode: "insensitive" } },
            ],
          },
          {
            OR: [{ isPublic: true }, { createdById: userId }],
          },
        ];
      }
    } else {
      where.isPublic = true;
    }

    return ctx.db.flyPattern.findMany({
      where,
      include: {
        materials: true,
        _count: { select: { tyingSteps: true } },
      },
      orderBy: { name: "asc" },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.flyPattern.findUnique({
        where: { id: input.id },
        include: {
          materials: true,
          tyingSteps: { orderBy: { stepNumber: "asc" } },
        },
      });

      if (!item) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Fly pattern not found" });
      }

      // If not public, only the creator can see it
      const userId = ctx.session?.user?.id;
      if (!item.isPublic && item.createdById !== userId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Fly pattern not found" });
      }

      return item;
    }),

  create: protectedProcedure.input(createFlyPatternSchema).mutation(async ({ ctx, input }) => {
    const { materials, tyingSteps, ...data } = input;

    return ctx.db.flyPattern.create({
      data: {
        ...data,
        isPublic: false,
        createdBy: { connect: { id: ctx.session.user.id } },
        ...(materials?.length && {
          materials: {
            create: materials,
          },
        }),
        ...(tyingSteps?.length && {
          tyingSteps: {
            create: tyingSteps,
          },
        }),
      },
      include: {
        materials: true,
        tyingSteps: { orderBy: { stepNumber: "asc" } },
      },
    });
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: updateFlyPatternSchema }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.flyPattern.findFirst({
        where: { id: input.id, createdById: ctx.session.user.id },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Fly pattern not found" });
      }

      const { materials, tyingSteps, ...data } = input.data;

      return ctx.db.flyPattern.update({
        where: { id: input.id },
        data: {
          ...data,
          ...(materials !== undefined && {
            materials: {
              deleteMany: {},
              ...(materials.length > 0 && {
                create: materials,
              }),
            },
          }),
          ...(tyingSteps !== undefined && {
            tyingSteps: {
              deleteMany: {},
              ...(tyingSteps.length > 0 && {
                create: tyingSteps,
              }),
            },
          }),
        },
        include: {
          materials: true,
          tyingSteps: { orderBy: { stepNumber: "asc" } },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.flyPattern.findFirst({
        where: { id: input.id, createdById: ctx.session.user.id },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Fly pattern not found" });
      }

      return ctx.db.flyPattern.delete({ where: { id: input.id } });
    }),

  recommend: publicProcedure
    .input(flyRecommendationInputSchema)
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = { isPublic: true };

      if (input.season) {
        where.seasons = { has: input.season };
      }
      if (input.waterType) {
        where.waterTypes = { has: input.waterType };
      }
      if (input.targetSpecies) {
        where.targetSpecies = { has: input.targetSpecies };
      }
      if (input.region) {
        where.regions = { has: input.region };
      }

      const patterns = await ctx.db.flyPattern.findMany({
        where,
        include: {
          materials: true,
          _count: { select: { tyingSteps: true } },
        },
        take: 20,
      });

      // Score each pattern
      const scored = patterns.map((pattern) => {
        let score = 0;

        // Season match: 30 points
        if (input.season) {
          score += pattern.seasons.includes(input.season) ? 30 : 0;
        } else {
          score += 30;
        }

        // Water type match: 25 points
        if (input.waterType) {
          score += pattern.waterTypes.includes(input.waterType) ? 25 : 0;
        } else {
          score += 25;
        }

        // Species match: 25 points
        if (input.targetSpecies) {
          score += pattern.targetSpecies.includes(input.targetSpecies) ? 25 : 0;
        } else {
          score += 25;
        }

        // Region match: 10 points
        if (input.region) {
          score += pattern.regions.includes(input.region) ? 10 : 0;
        } else {
          score += 10;
        }

        return { ...pattern, score };
      });

      // Sort by score descending, return top 10
      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, 10);
    }),
});
