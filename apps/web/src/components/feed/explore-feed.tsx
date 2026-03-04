"use client";

import Link from "next/link";
import { Button, Card, CardContent } from "@fyshe/ui";
import { trpc } from "@/trpc/client";
import { LikeButton } from "@/components/social/like-button";

interface ExploreCatch {
  id: string;
  species: string;
  locationName: string | null;
  caughtAt: Date;
  photos: { url: string }[];
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ExploreFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = trpc.feed.explore.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const items: ExploreCatch[] =
    data?.pages.flatMap((page) => page.items as ExploreCatch[]) ?? [];

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="aspect-video rounded bg-muted animate-pulse" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No public catches to explore yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card
            key={item.id}
            className="hover:border-primary/50 transition-colors overflow-hidden"
          >
            {item.photos.length > 0 && (
              <Link href={`/catches/${item.id}`}>
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.photos[0]!.url}
                    alt={item.species}
                    className="h-full w-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              </Link>
            )}
            <CardContent className="p-4 space-y-2">
              <Link href={`/catches/${item.id}`}>
                <h3 className="font-semibold hover:text-primary transition-colors">
                  {item.species}
                </h3>
              </Link>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link
                  href={`/angler/${item.user.id}`}
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  {item.user.image ? (
                    <img
                      src={item.user.image}
                      alt={item.user.name ?? "User"}
                      className="h-5 w-5 rounded-full"
                    />
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {(item.user.name ?? "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>{item.user.name ?? "Anonymous"}</span>
                </Link>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {formatDate(item.caughtAt)}
                  {item.locationName && ` · ${item.locationName}`}
                </span>
              </div>

              <div className="pt-1">
                <LikeButton catchId={item.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
