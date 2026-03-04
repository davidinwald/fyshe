import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  createMaterialSchema,
  updateMaterialSchema,
  materialListFiltersSchema,
} from "@fyshe/validators";
import { z } from "zod";

export const materialRouter = createTRPCRouter({
  list: protectedProcedure.input(materialListFiltersSchema).query(async ({ ctx, input }) => {
    const where: Record<string, unknown> = { userId: ctx.session.user.id };

    if (input.category) {
      where.category = input.category;
    }
    if (input.inStock !== undefined) {
      where.inStock = input.inStock;
    }
    if (input.search) {
      where.name = { contains: input.search, mode: "insensitive" };
    }

    return ctx.db.materialInventory.findMany({
      where,
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
  }),

  create: protectedProcedure.input(createMaterialSchema).mutation(async ({ ctx, input }) => {
    return ctx.db.materialInventory.create({
      data: {
        ...input,
        user: { connect: { id: ctx.session.user.id } },
      },
    });
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: updateMaterialSchema }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.materialInventory.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Material not found" });
      }

      return ctx.db.materialInventory.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.materialInventory.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Material not found" });
      }

      return ctx.db.materialInventory.delete({ where: { id: input.id } });
    }),
});
