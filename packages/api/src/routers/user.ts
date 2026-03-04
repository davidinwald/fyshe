import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { updateProfileSchema, updatePreferencesSchema } from "@fyshe/validators";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { preferences: true },
    });
  }),

  updateProfile: protectedProcedure.input(updateProfileSchema).mutation(async ({ ctx, input }) => {
    return ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: input,
    });
  }),

  updatePreferences: protectedProcedure
    .input(updatePreferencesSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return ctx.db.userPreferences.upsert({
        where: { userId },
        create: {
          user: { connect: { id: userId } },
          ...input,
        },
        update: input,
      });
    }),

  getPublicProfile: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findFirst({
        where: { id: input.id, isPublic: true },
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
          location: true,
          createdAt: true,
        },
      });
    }),
});
