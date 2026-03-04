import { createCaller } from "@/trpc/server";
import { TripForm } from "@/components/trip/trip-form";
import { notFound } from "next/navigation";

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trpc = await createCaller();

  let trip;
  try {
    trip = await trpc.trip.getById({ id });
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Trip</h1>
        <p className="text-muted-foreground">
          Update the details of your fishing trip.
        </p>
      </div>
      <TripForm initialData={trip} />
    </div>
  );
}
