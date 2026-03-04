import { createTRPCRouter } from "./trpc";
import { healthRouter } from "./routers/health";
import { userRouter } from "./routers/user";
import { gearRouter } from "./routers/gear";

export const appRouter = createTRPCRouter({
  health: healthRouter,
  user: userRouter,
  gear: gearRouter,
});

export type AppRouter = typeof appRouter;
