import { createCaller } from "@/trpc/server";
import { TripList } from "@/components/trip/trip-list";

export default async function TripsPage() {
  const trpc = await createCaller();
  const trips = await trpc.trip.list({});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trips</h1>
          <p className="text-muted-foreground">{trips.length} trips logged</p>
        </div>
        <a
          href="/trips/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Plan Trip
        </a>
      </div>
      <TripList initialItems={trips} />
    </div>
  );
}
