"use client";

import { useState } from "react";
import { Badge, Card, CardContent, Input, Select, SelectOption } from "@fyshe/ui";
import { trpc } from "@/trpc/client";
import Link from "next/link";

const METHOD_LABELS: Record<string, string> = {
  FLY: "Fly",
  SPIN: "Spin",
  BAIT: "Bait",
  TROLLING: "Trolling",
  ICE: "Ice",
  SURF: "Surf",
  OTHER: "Other",
};

const METHOD_COLORS: Record<string, "default" | "secondary" | "outline"> = {
  FLY: "default",
  SPIN: "secondary",
  BAIT: "outline",
  TROLLING: "secondary",
  ICE: "outline",
  SURF: "default",
  OTHER: "outline",
};

interface CatchItem {
  id: string;
  species: string;
  length: unknown;
  weight: unknown;
  method: string | null;
  locationName: string | null;
  caughtAt: Date;
  released: boolean;
  notes: string | null;
  photos: { url: string }[];
  gear: { gear: { id: string; name: string; category: string } }[];
  trip: { id: string; title: string } | null;
}

export function CatchList({ initialItems }: { initialItems: CatchItem[] }) {
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState<string>("");

  const filters = {
    search: search || undefined,
    method: method || undefined,
  };

  const { data: items } = trpc.catch.list.useQuery(
    filters as Parameters<typeof trpc.catch.list.useQuery>[0],
  );

  const displayItems = items ?? initialItems;

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatMeasurement(item: CatchItem) {
    const parts: string[] = [];
    if (item.length) parts.push(`${item.length}"`);
    if (item.weight) parts.push(`${item.weight} lbs`);
    return parts.join(" / ");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search catches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
        <Select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-40"
        >
          <SelectOption value="">All Methods</SelectOption>
          {Object.entries(METHOD_LABELS).map(([value, label]) => (
            <SelectOption key={value} value={value}>
              {label}
            </SelectOption>
          ))}
        </Select>
      </div>

      {displayItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No catches logged yet.</p>
            <a href="/catches/new" className="text-primary hover:underline text-sm">
              Log your first catch
            </a>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item: CatchItem) => (
            <Link key={item.id} href={`/catches/${item.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight">{item.species}</h3>
                    {item.method && (
                      <Badge variant={METHOD_COLORS[item.method] ?? "outline"}>
                        {METHOD_LABELS[item.method] ?? item.method}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(item.caughtAt)}
                    {item.locationName && ` · ${item.locationName}`}
                  </p>
                  {formatMeasurement(item) && (
                    <p className="text-sm">{formatMeasurement(item)}</p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.released && (
                      <Badge variant="outline">Released</Badge>
                    )}
                    {item.trip && (
                      <Badge variant="secondary">{item.trip.title}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
