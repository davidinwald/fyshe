import { createTRPCRouter } from "./trpc";
import { authRouter } from "./routers/auth";
import { healthRouter } from "./routers/health";
import { userRouter } from "./routers/user";
import { gearRouter } from "./routers/gear";
import { catchRouter } from "./routers/catch";
import { tripRouter } from "./routers/trip";
import { flyRouter } from "./routers/fly";
import { materialRouter } from "./routers/material";
import { baitRouter } from "./routers/bait";
import { socialRouter } from "./routers/social";
import { articleRouter } from "./routers/article";
import { feedRouter } from "./routers/feed";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  health: healthRouter,
  user: userRouter,
  gear: gearRouter,
  catch: catchRouter,
  trip: tripRouter,
  fly: flyRouter,
  material: materialRouter,
  bait: baitRouter,
  social: socialRouter,
  article: articleRouter,
  feed: feedRouter,
});

export type AppRouter = typeof appRouter;
