import { createCaller } from "@/trpc/server";
import { FlyPatternList } from "@/components/fly/fly-pattern-list";

export default async function FliesPage() {
  const trpc = await createCaller();
  const patterns = await trpc.fly.list({});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fly Patterns</h1>
          <p className="text-muted-foreground">
            {patterns.length} pattern{patterns.length !== 1 ? "s" : ""} in library
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/flies/recommend"
            className="text-sm text-primary hover:underline"
          >
            Get Recommendations
          </a>
          <a
            href="/flies/inventory"
            className="text-sm text-primary hover:underline"
          >
            Material Inventory
          </a>
          <a
            href="/flies/bait"
            className="text-sm text-primary hover:underline"
          >
            Bait Library
          </a>
          <a
            href="/flies/new"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create Pattern
          </a>
        </div>
      </div>
      <FlyPatternList initialItems={patterns} />
    </div>
  );
}
