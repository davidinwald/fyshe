import { createTRPCRouter } from "./trpc";
import { healthRouter } from "./routers/health";
import { userRouter } from "./routers/user";
import { gearRouter } from "./routers/gear";
import { catchRouter } from "./routers/catch";
import { tripRouter } from "./routers/trip";

export const appRouter = createTRPCRouter({
  health: healthRouter,
  user: userRouter,
  gear: gearRouter,
  catch: catchRouter,
  trip: tripRouter,
});

export type AppRouter = typeof appRouter;
