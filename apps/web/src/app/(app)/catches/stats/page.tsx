import { createCaller } from "@/trpc/server";
import { CatchStats } from "@/components/catch/catch-stats";

export default async function CatchStatsPage() {
  const trpc = await createCaller();
  const stats = await trpc.catch.stats();

  return <CatchStats initialData={stats} />;
}
