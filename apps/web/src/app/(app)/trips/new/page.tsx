import { TripForm } from "@/components/trip/trip-form";

export default function NewTripPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Plan a Trip</h1>
        <p className="text-muted-foreground">
          Create a new fishing trip to track your adventure.
        </p>
      </div>
      <TripForm />
    </div>
  );
}
