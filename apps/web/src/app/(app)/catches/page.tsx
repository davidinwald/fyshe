import { createCaller } from "@/trpc/server";
import { CatchList } from "@/components/catch/catch-list";

export default async function CatchesPage() {
  const trpc = await createCaller();
  const [catches, stats] = await Promise.all([
    trpc.catch.list({}),
    trpc.catch.stats(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Catches</h1>
          <p className="text-muted-foreground">
            {stats.total} catches logged
            {stats.bySpecies.length > 0 && ` · ${stats.bySpecies.length} species`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/catches/stats"
            className="text-sm text-primary hover:underline"
          >
            View Statistics
          </a>
          <a
            href="/catches/new"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Log Catch
          </a>
        </div>
      </div>
      <CatchList initialItems={catches} />
    </div>
  );
}
