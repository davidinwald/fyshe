"use client";

import { useState } from "react";
import { Button } from "@fyshe/ui";
import { trpc } from "@/trpc/client";

interface FollowButtonProps {
  userId: string;
  initialFollowing?: boolean;
}

export function FollowButton({ userId, initialFollowing }: FollowButtonProps) {
  const { data: isFollowingData } = trpc.social.isFollowing.useQuery({
    userId,
  });

  const isFollowing = isFollowingData ?? initialFollowing ?? false;

  const [optimisticFollowing, setOptimisticFollowing] = useState<
    boolean | null
  >(null);

  const utils = trpc.useUtils();

  const follow = trpc.social.follow.useMutation({
    onMutate: () => {
      setOptimisticFollowing(true);
    },
    onSuccess: () => {
      setOptimisticFollowing(null);
      utils.social.isFollowing.invalidate({ userId });
      utils.social.followers.invalidate();
      utils.social.following.invalidate();
    },
    onError: () => {
      setOptimisticFollowing(null);
    },
  });

  const unfollow = trpc.social.unfollow.useMutation({
    onMutate: () => {
      setOptimisticFollowing(false);
    },
    onSuccess: () => {
      setOptimisticFollowing(null);
      utils.social.isFollowing.invalidate({ userId });
      utils.social.followers.invalidate();
      utils.social.following.invalidate();
    },
    onError: () => {
      setOptimisticFollowing(null);
    },
  });

  const displayFollowing = optimisticFollowing ?? isFollowing;
  const isPending = follow.isPending || unfollow.isPending;

  function handleClick() {
    if (displayFollowing) {
      unfollow.mutate({ userId });
    } else {
      follow.mutate({ userId });
    }
  }

  return (
    <Button
      variant={displayFollowing ? "outline" : "default"}
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending
        ? "..."
        : displayFollowing
          ? "Following"
          : "Follow"}
    </Button>
  );
}
