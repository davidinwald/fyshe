import { createCaller } from "@/trpc/server";
import { MaterialInventory } from "@/components/fly/material-inventory";

export default async function MaterialInventoryPage() {
  const trpc = await createCaller();
  const materials = await trpc.material.list({});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Material Inventory</h1>
          <p className="text-muted-foreground">
            Manage your fly tying materials and supplies.
          </p>
        </div>
        <a
          href="/flies"
          className="text-sm text-primary hover:underline"
        >
          Back to Patterns
        </a>
      </div>
      <MaterialInventory initialItems={materials} />
    </div>
  );
}
