import { createCaller } from "@/trpc/server";
import { GearList } from "@/components/gear/gear-list";

export default async function GearPage() {
  const trpc = await createCaller();
  const [items, stats] = await Promise.all([
    trpc.gear.list({}),
    trpc.gear.stats(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gear</h1>
          <p className="text-muted-foreground">
            {stats.total} items in your collection
          </p>
        </div>
        <a
          href="/gear/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Add Gear
        </a>
      </div>
      <GearList initialItems={items} />
    </div>
  );
}
