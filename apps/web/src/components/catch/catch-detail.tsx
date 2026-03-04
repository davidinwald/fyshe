"use client";

import { useRouter } from "next/navigation";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Separator } from "@fyshe/ui";
import { trpc } from "@/trpc/client";

const METHOD_LABELS: Record<string, string> = {
  FLY: "Fly",
  SPIN: "Spin",
  BAIT: "Bait",
  TROLLING: "Trolling",
  ICE: "Ice",
  SURF: "Surf",
  OTHER: "Other",
};

const VISIBILITY_LABELS: Record<string, string> = {
  PUBLIC: "Public",
  PRIVATE: "Private",
  FOLLOWERS_ONLY: "Followers Only",
};

interface CatchDetailProps {
  item: {
    id: string;
    species: string;
    length: unknown;
    weight: unknown;
    method: string | null;
    locationName: string | null;
    latitude: unknown;
    longitude: unknown;
    waterTemp: unknown;
    weather: string | null;
    caughtAt: Date;
    released: boolean;
    notes: string | null;
    visibility: string;
    createdAt: Date;
    photos: { id: string; url: string; isPrimary: boolean }[];
    gear: { gear: { id: string; name: string; category: string; brand: string | null; model: string | null } }[];
    trip: { id: string; title: string } | null;
  };
}

export function CatchDetail({ item }: CatchDetailProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const deleteCatch = trpc.catch.delete.useMutation({
    onSuccess: () => {
      utils.catch.list.invalidate();
      utils.catch.stats.invalidate();
      router.push("/catches");
    },
  });

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatTime(date: Date) {
    return new Date(date).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{item.species}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-muted-foreground">
              {formatDate(item.caughtAt)}
            </span>
            {item.method && (
              <Badge>{METHOD_LABELS[item.method] ?? item.method}</Badge>
            )}
            {item.released && <Badge variant="outline">Released</Badge>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/catches/${item.id}/edit`)}>
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Delete this catch?")) {
                deleteCatch.mutate({ id: item.id });
              }
            }}
            disabled={deleteCatch.isPending}
          >
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {item.length != null && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Length</p>
                <p>{String(item.length)}&quot;</p>
              </div>
            )}
            {item.weight != null && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weight</p>
                <p>{String(item.weight)} lbs</p>
              </div>
            )}
          </div>

          {item.locationName && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <p>{item.locationName}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
            <p>
              {formatDate(item.caughtAt)} at {formatTime(item.caughtAt)}
            </p>
          </div>

          {(item.waterTemp != null || item.weather) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {item.waterTemp != null && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Water Temp</p>
                  <p>{String(item.waterTemp)}&deg;F</p>
                </div>
              )}
              {item.weather && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Weather</p>
                  <p>{item.weather}</p>
                </div>
              )}
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-muted-foreground">Visibility</p>
            <p>{VISIBILITY_LABELS[item.visibility] ?? item.visibility}</p>
          </div>

          {item.trip && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Trip</p>
              <a
                href={`/trips/${item.trip.id}`}
                className="text-primary hover:underline"
              >
                {item.trip.title}
              </a>
            </div>
          )}

          <Separator />

          {item.gear.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Gear Used</p>
              <div className="flex flex-wrap gap-2">
                {item.gear.map((g) => (
                  <a key={g.gear.id} href={`/gear/${g.gear.id}`}>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                      {g.gear.name}
                      {g.gear.brand && ` (${g.gear.brand})`}
                    </Badge>
                  </a>
                ))}
              </div>
            </div>
          )}

          {item.notes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="whitespace-pre-wrap">{item.notes}</p>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Logged {new Date(item.createdAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      <Button variant="ghost" onClick={() => router.push("/catches")}>
        &larr; Back to Catches
      </Button>
    </div>
  );
}
