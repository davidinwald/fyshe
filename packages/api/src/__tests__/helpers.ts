import { appRouter } from "../root";
import { createTRPCContext } from "../trpc";
import { testDb } from "./setup";

/** Create a tRPC caller with an authenticated session */
export function createAuthenticatedCaller(userId: string) {
  const ctx = createTRPCContext({
    session: {
      user: { id: userId, name: "Test User", email: "test@example.com", image: null },
      expires: new Date(Date.now() + 86400000).toISOString(),
    },
    db: testDb,
  });
  return appRouter.createCaller(ctx);
}

/** Create a tRPC caller with no session (unauthenticated) */
export function createUnauthenticatedCaller() {
  const ctx = createTRPCContext({
    session: null,
    db: testDb,
  });
  return appRouter.createCaller(ctx);
}

/** Create a test user in the database and return its id */
export async function createTestUser(overrides?: { name?: string; email?: string }) {
  const user = await testDb.user.create({
    data: {
      name: overrides?.name ?? "Test User",
      email: overrides?.email ?? `test-${crypto.randomUUID()}@example.com`,
    },
  });
  return user;
}
