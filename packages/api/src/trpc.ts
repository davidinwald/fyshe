import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { type Session } from "next-auth";
import { type PrismaClient } from "@fyshe/db";

export interface CreateContextOptions {
  session: Session | null;
  db: PrismaClient;
}

export function createTRPCContext(opts: CreateContextOptions) {
  return {
    session: opts.session,
    db: opts.db,
  };
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
