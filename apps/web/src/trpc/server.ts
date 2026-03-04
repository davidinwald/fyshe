import "server-only";

import { createTRPCContext } from "@fyshe/api";
import { appRouter } from "@fyshe/api";
import { auth } from "@fyshe/auth";
import { db } from "@fyshe/db";

export async function createCaller() {
  const session = await auth();
  const ctx = createTRPCContext({ session, db });
  return appRouter.createCaller(ctx);
}
