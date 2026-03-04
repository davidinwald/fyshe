"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@fyshe/ui";
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

interface StatsData {
  total: number;
  bySpecies: Array<{ species: string; _count: number }>;
  byMethod: Array<{ method: string | null; _count: number }>;
  recentCatches: Array<{
    id: string;
    species: string;
    length: unknown;
    weight: unknown;
    caughtAt: Date;
    locationName: string | null;
  }>;
}

export function CatchStats({ initialData }: { initialData: StatsData }) {
  const { data } = trpc.catch.stats.useQuery();
  const stats = data ?? initialData;

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatSize(item: { length: unknown; weight: unknown }) {
    const parts: string[] = [];
    if (item.length != null) parts.push(`${String(item.length)}"`);
    if (item.weight != null) parts.push(`${String(item.weight)} lbs`);
    return parts.join(" / ");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Catch Statistics</h1>
          <p className="text-muted-foreground">
            An overview of your fishing activity
          </p>
        </div>
        <Link
          href="/catches"
          className="text-sm text-primary hover:underline"
        >
          &larr; Back to Catches
        </Link>
      </div>

      {/* Total Catches Card */}
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Total Catches
          </p>
          <p className="text-5xl font-bold mt-2">{stats.total}</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Species Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>By Species</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.bySpecies.length === 0 ? (
              <p className="text-muted-foreground text-sm">No data yet.</p>
            ) : (
              <div className="space-y-2">
                {stats.bySpecies.map((row) => (
                  <div
                    key={row.species}
                    className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                  >
                    <span className="font-medium">{row.species}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {row._count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Method Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>By Method</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.byMethod.length === 0 ? (
              <p className="text-muted-foreground text-sm">No data yet.</p>
            ) : (
              <div className="space-y-2">
                {stats.byMethod.map((row) => (
                  <div
                    key={row.method ?? "unknown"}
                    className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                  >
                    <span className="font-medium">
                      {row.method
                        ? (METHOD_LABELS[row.method] ?? row.method)
                        : "Unknown"}
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      {row._count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Catches */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Catches</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentCatches.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No catches logged yet.
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentCatches.map((c) => (
                <Link
                  key={c.id}
                  href={`/catches/${c.id}`}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:bg-muted/50 -mx-2 px-2 rounded transition-colors"
                >
                  <div>
                    <p className="font-medium">{c.species}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(c.caughtAt)}
                      {c.locationName && ` · ${c.locationName}`}
                    </p>
                  </div>
                  {formatSize(c) && (
                    <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                      {formatSize(c)}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
