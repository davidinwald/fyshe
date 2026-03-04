"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
import {
  Button,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@fyshe/ui";

interface TripMember {
  id: string;
  user: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
  [key: string]: unknown;
}

interface TripCatch {
  id: string;
  species?: string | null;
  weight?: unknown;
  length?: unknown;
  caughtAt?: string | Date | null;
  notes?: string | null;
  photos?: unknown[];
  [key: string]: unknown;
}

interface Trip {
  id: string;
  title: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  locationName?: string | null;
  waterBody?: string | null;
  weather?: string | null;
  waterConditions?: string | null;
  description?: string | null;
  notes?: string | null;
  visibility: string;
  latitude?: unknown;
  longitude?: unknown;
  photos?: unknown[];
  members?: TripMember[];
  catches?: TripCatch[];
  [key: string]: unknown;
}

interface TripDetailProps {
  trip: Trip;
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateRange(
  startDate: string | Date,
  endDate?: string | Date | null,
): string {
  const start = formatDate(startDate);
  if (!endDate) return start;
  const end = formatDate(endDate);
  return `${start} — ${end}`;
}

export function TripDetail({ trip }: TripDetailProps) {
  const router = useRouter();

  const deleteMutation = trpc.trip.delete.useMutation({
    onSuccess: () => {
      router.push("/trips");
    },
  });

  function handleDelete() {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      deleteMutation.mutate({ id: trip.id });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{trip.title}</h1>
            {trip.visibility && (
              <Badge
                variant={
                  trip.visibility === "PUBLIC" ? "default" : "secondary"
                }
              >
                {trip.visibility}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            {formatDateRange(trip.startDate, trip.endDate)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/trips/${trip.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {deleteMutation.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {deleteMutation.error.message}
        </div>
      )}

      {/* Trip Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {trip.description && (
                <div>
                  <p className="text-muted-foreground mb-1 text-sm font-medium">
                    Description
                  </p>
                  <p className="text-sm">{trip.description}</p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {trip.locationName && (
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Location
                    </p>
                    <p className="text-sm">{trip.locationName}</p>
                  </div>
                )}
                {trip.waterBody && (
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Water Body
                    </p>
                    <p className="text-sm">{trip.waterBody}</p>
                  </div>
                )}
                {trip.weather && (
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Weather
                    </p>
                    <p className="text-sm">{trip.weather}</p>
                  </div>
                )}
                {trip.waterConditions && (
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Water Conditions
                    </p>
                    <p className="text-sm">{trip.waterConditions}</p>
                  </div>
                )}
              </div>

              {trip.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Notes
                    </p>
                    <p className="whitespace-pre-wrap text-sm">{trip.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Catches Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Catches{" "}
                  {trip.catches && trip.catches.length > 0 && (
                    <span className="text-muted-foreground font-normal">
                      ({trip.catches.length})
                    </span>
                  )}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {!trip.catches || trip.catches.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No catches recorded yet.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {trip.catches.map((c: TripCatch) => (
                    <Card key={c.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            {c.species && (
                              <p className="font-medium">{c.species}</p>
                            )}
                            <div className="text-muted-foreground mt-1 flex gap-3 text-sm">
                              {c.weight != null && <span>{String(c.weight)} lbs</span>}
                              {c.length != null && <span>{String(c.length)} in</span>}
                            </div>
                          </div>
                          {c.caughtAt && (
                            <span className="text-muted-foreground text-xs">
                              {new Date(c.caughtAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {c.notes && (
                          <p className="text-muted-foreground mt-2 text-xs">
                            {c.notes}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Members */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                Members{" "}
                {trip.members && trip.members.length > 0 && (
                  <span className="text-muted-foreground font-normal">
                    ({trip.members.length})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!trip.members || trip.members.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No members added yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {trip.members.map((member: TripMember) => (
                    <li
                      key={member.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {member.user.name ?? "Unknown"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
