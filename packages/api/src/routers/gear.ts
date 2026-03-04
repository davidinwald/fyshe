import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  createGearSchema,
  updateGearSchema,
  gearListFiltersSchema,
  gearStatusEnum,
} from "@fyshe/validators";
import { z } from "zod";

export const gearRouter = createTRPCRouter({
  list: protectedProcedure.input(gearListFiltersSchema).query(async ({ ctx, input }) => {
    const where: Record<string, unknown> = { userId: ctx.session.user.id };

    if (input.category) {
      where.category = input.category;
    }
    if (input.status) {
      where.status = input.status;
    }
    if (input.search) {
      where.OR = [
        { name: { contains: input.search, mode: "insensitive" } },
        { brand: { contains: input.search, mode: "insensitive" } },
        { model: { contains: input.search, mode: "insensitive" } },
      ];
    }

    return ctx.db.gearItem.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.gearItem.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!item) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Gear item not found" });
      }

      return item;
    }),

  create: protectedProcedure.input(createGearSchema).mutation(async ({ ctx, input }) => {
    return ctx.db.gearItem.create({
      data: {
        ...input,
        purchasePrice: input.purchasePrice ?? undefined,
        user: { connect: { id: ctx.session.user.id } },
      },
    });
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: updateGearSchema }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.gearItem.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Gear item not found" });
      }

      return ctx.db.gearItem.update({
        where: { id: input.id },
        data: {
          ...input.data,
          purchasePrice: input.data.purchasePrice ?? undefined,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.gearItem.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Gear item not found" });
      }

      return ctx.db.gearItem.delete({ where: { id: input.id } });
    }),

  updateStatus: protectedProcedure
    .input(z.object({ id: z.string(), status: gearStatusEnum }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.gearItem.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Gear item not found" });
      }

      return ctx.db.gearItem.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  stats: protectedProcedure.query(async ({ ctx }) => {
    const [total, byCategory, byStatus] = await Promise.all([
      ctx.db.gearItem.count({ where: { userId: ctx.session.user.id } }),
      ctx.db.gearItem.groupBy({
        by: ["category"],
        where: { userId: ctx.session.user.id },
        _count: true,
      }),
      ctx.db.gearItem.groupBy({
        by: ["status"],
        where: { userId: ctx.session.user.id },
        _count: true,
      }),
    ]);

    return { total, byCategory, byStatus };
  }),
});
