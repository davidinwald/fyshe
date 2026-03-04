import { createCaller } from "@/trpc/server";
import { BaitList } from "@/components/fly/bait-list";

export default async function BaitLibraryPage() {
  const trpc = await createCaller();
  const baits = await trpc.bait.list({});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bait Library</h1>
          <p className="text-muted-foreground">
            {baits.length} bait type{baits.length !== 1 ? "s" : ""} available
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/flies/bait/recommend"
            className="text-sm text-primary hover:underline"
          >
            Get Recommendations
          </a>
          <a
            href="/flies"
            className="text-sm text-primary hover:underline"
          >
            Back to Patterns
          </a>
        </div>
      </div>
      <BaitList initialItems={baits} />
    </div>
  );
}
