"use client";

import { useState } from "react";
import { Button } from "@fyshe/ui";
import { trpc } from "@/trpc/client";

interface LikeButtonProps {
  catchId?: string;
  tripId?: string;
  articleId?: string;
  initialCount?: number;
  initialLiked?: boolean;
}

export function LikeButton({
  catchId,
  tripId,
  articleId,
  initialCount,
  initialLiked,
}: LikeButtonProps) {
  const target = { catchId, tripId, articleId };

  const { data: likesData } = trpc.social.getLikes.useQuery(target);

  const count = likesData?.count ?? initialCount ?? 0;
  const liked = likesData?.liked ?? initialLiked ?? false;

  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);
  const [optimisticCount, setOptimisticCount] = useState<number | null>(null);

  const utils = trpc.useUtils();

  const toggleLike = trpc.social.toggleLike.useMutation({
    onMutate: () => {
      const currentLiked = optimisticLiked ?? liked;
      const currentCount = optimisticCount ?? count;
      setOptimisticLiked(!currentLiked);
      setOptimisticCount(currentLiked ? currentCount - 1 : currentCount + 1);
    },
    onSuccess: () => {
      setOptimisticLiked(null);
      setOptimisticCount(null);
      utils.social.getLikes.invalidate(target);
    },
    onError: () => {
      setOptimisticLiked(null);
      setOptimisticCount(null);
    },
  });

  const displayLiked = optimisticLiked ?? liked;
  const displayCount = optimisticCount ?? count;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => toggleLike.mutate(target)}
      disabled={toggleLike.isPending}
      className="gap-1.5"
      aria-label={displayLiked ? `Unlike (${displayCount} likes)` : `Like (${displayCount} likes)`}
      aria-pressed={displayLiked}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={displayLiked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        className={`h-4 w-4 ${displayLiked ? "text-red-500" : "text-muted-foreground"}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      <span className="text-xs tabular-nums">{displayCount}</span>
    </Button>
  );
}
