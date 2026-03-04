"use client";

import Link from "next/link";
import { Card, CardContent } from "@fyshe/ui";
import { trpc } from "@/trpc/client";

interface ActivityItem {
  id: string;
  type: "catch" | "trip";
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  catch?: {
    id: string;
    species: string;
  };
  trip?: {
    id: string;
    title: string;
    location: string | null;
  };
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

function getActionText(item: ActivityItem): {
  text: string;
  href: string;
} {
  if (item.type === "catch" && item.catch) {
    return {
      text: `caught a ${item.catch.species}`,
      href: `/catches/${item.catch.id}`,
    };
  }
  if (item.type === "trip" && item.trip) {
    const location = item.trip.location
      ? ` to ${item.trip.location}`
      : "";
    return {
      text: `went on a trip${location}`,
      href: `/trips/${item.trip.id}`,
    };
  }
  return { text: "did something", href: "#" };
}

export function ActivityFeed() {
  const { data, isLoading } = trpc.feed.activity.useQuery();

  const items: ActivityItem[] = (data as ActivityItem[] | undefined) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
              <div className="h-3 w-1/3 rounded bg-muted animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            No recent activity from people you follow.
          </p>
          <Link
            href="/explore"
            className="text-primary hover:underline text-sm"
          >
            Explore the community
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item: ActivityItem) => {
        const action = getActionText(item);
        return (
          <Link key={item.id} href={action.href}>
            <div className="flex items-center gap-3 rounded-md p-3 hover:bg-accent transition-colors">
              {item.user.image ? (
                <img
                  src={item.user.image}
                  alt={item.user.name ?? "User"}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {(item.user.name ?? "?").charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">
                    {item.user.name ?? "Someone"}
                  </span>{" "}
                  {action.text}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatRelativeTime(item.createdAt)}
                </p>
              </div>
            </div>
          </Link>
        );
      })}

    </div>
  );
}
