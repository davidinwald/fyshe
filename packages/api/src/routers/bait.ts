import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  baitTypeListFiltersSchema,
  baitRecommendationInputSchema,
} from "@fyshe/validators";
import { z } from "zod";

export const baitRouter = createTRPCRouter({
  list: publicProcedure.input(baitTypeListFiltersSchema).query(async ({ ctx, input }) => {
    const where: Record<string, unknown> = {};

    if (input.category) {
      where.category = input.category;
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

    return ctx.db.baitType.findMany({
      where,
      orderBy: { name: "asc" },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.baitType.findUnique({
        where: { id: input.id },
      });

      if (!item) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Bait type not found" });
      }

      return item;
    }),

  recommend: publicProcedure
    .input(baitRecommendationInputSchema)
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = {};

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

      const baitTypes = await ctx.db.baitType.findMany({
        where,
        take: 20,
      });

      // Score each bait type
      const scored = baitTypes.map((bait) => {
        let score = 0;

        // Season match: 30 points
        if (input.season) {
          score += bait.seasons.includes(input.season) ? 30 : 0;
        } else {
          score += 30;
        }

        // Water type match: 25 points
        if (input.waterType) {
          score += bait.waterTypes.includes(input.waterType) ? 25 : 0;
        } else {
          score += 25;
        }

        // Species match: 25 points
        if (input.targetSpecies) {
          score += bait.targetSpecies.includes(input.targetSpecies) ? 25 : 0;
        } else {
          score += 25;
        }

        // Region match: 10 points
        if (input.region) {
          score += bait.regions.includes(input.region) ? 10 : 0;
        } else {
          score += 10;
        }

        return { ...bait, score };
      });

      // Sort by score descending, return top 10
      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, 10);
    }),
});
