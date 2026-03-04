import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, createTRPCContext } from "@fyshe/api";
import { auth } from "@fyshe/auth";
import { db } from "@fyshe/db";

const handler = async (req: Request) => {
  const session = await auth();

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ session, db }),
  });
};

export { handler as GET, handler as POST };
