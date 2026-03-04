"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Label,
} from "@fyshe/ui";

interface Trip {
  id: string;
  title: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  locationName?: string | null;
  waterBody?: string | null;
  visibility: string;
  latitude?: unknown;
  longitude?: unknown;
  _count?: {
    catches?: number;
    members?: number;
    photos?: number;
  };
  photos?: unknown[];
}

interface TripListProps {
  initialItems: Trip[];
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
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

export function TripList({ initialItems }: TripListProps) {
  const [search, setSearch] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  const filters = {
    search: search || undefined,
    from: startDateFilter || undefined,
    to: endDateFilter || undefined,
  };

  const { data: trips } = trpc.trip.list.useQuery(
    filters as Parameters<typeof trpc.trip.list.useQuery>[0],
  );

  const displayTrips = trips ?? initialItems;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1">
          <Label htmlFor="trip-search">Search</Label>
          <Input
            id="trip-search"
            placeholder="Search trips by title or location..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="start-date-filter">From</Label>
          <Input
            id="start-date-filter"
            type="date"
            value={startDateFilter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setStartDateFilter(e.target.value)
            }
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="end-date-filter">To</Label>
          <Input
            id="end-date-filter"
            type="date"
            value={endDateFilter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEndDateFilter(e.target.value)
            }
          />
        </div>
      </div>

      {/* Trip Grid */}
      {displayTrips.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg font-medium">No trips found</p>
          <p className="text-muted-foreground mt-1 text-sm">
            {(search || startDateFilter || endDateFilter)
              ? "Try adjusting your filters."
              : "Plan your first fishing trip to get started."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayTrips.map((trip) => (
            <a key={trip.id} href={`/trips/${trip.id}`} className="block">
              <Card className="hover:border-primary/50 h-full transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-1 text-lg">
                      {trip.title}
                    </CardTitle>
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
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground text-sm">
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </p>
                  {trip.locationName && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Location:</span>{" "}
                      {trip.locationName}
                    </p>
                  )}
                  {trip.waterBody && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Water:</span>{" "}
                      {trip.waterBody}
                    </p>
                  )}
                  <div className="flex items-center gap-4 pt-2">
                    {trip._count?.catches != null && (
                      <span className="text-muted-foreground text-xs">
                        {trip._count.catches}{" "}
                        {trip._count.catches === 1 ? "catch" : "catches"}
                      </span>
                    )}
                    {trip._count?.members != null && (
                      <span className="text-muted-foreground text-xs">
                        {trip._count.members}{" "}
                        {trip._count.members === 1 ? "member" : "members"}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
