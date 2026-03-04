import { createCaller } from "@/trpc/server";
import { TripDetail } from "@/components/trip/trip-detail";
import { notFound } from "next/navigation";

export default async function TripDetailPage({
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

  return <TripDetail trip={trip} />;
}
