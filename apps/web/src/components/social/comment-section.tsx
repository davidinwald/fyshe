"use client";

import { useState } from "react";
import { Button, Textarea } from "@fyshe/ui";
import { trpc } from "@/trpc/client";

interface CommentSectionProps {
  catchId?: string;
  tripId?: string;
  articleId?: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  parentId: string | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  replies?: Comment[];
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

function CommentItem({
  comment,
  target,
  depth = 0,
}: {
  comment: Comment;
  target: { catchId?: string; tripId?: string; articleId?: string };
  depth?: number;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const utils = trpc.useUtils();

  const createComment = trpc.social.createComment.useMutation({
    onSuccess: () => {
      setReplyContent("");
      setShowReply(false);
      utils.social.listComments.invalidate(target);
    },
  });

  const deleteComment = trpc.social.deleteComment.useMutation({
    onSuccess: () => {
      utils.social.listComments.invalidate(target);
    },
  });

  function handleReplySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!replyContent.trim()) return;
    createComment.mutate({
      ...target,
      content: replyContent.trim(),
      parentId: comment.id,
    });
  }

  return (
    <div className={depth > 0 ? "ml-8 border-l border-border pl-4" : ""}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {comment.user.image ? (
            <img
              src={comment.user.image}
              alt={comment.user.name ?? "User"}
              className="h-6 w-6 rounded-full"
            />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {(comment.user.name ?? "?").charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-medium">
            {comment.user.name ?? "Anonymous"}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>

        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>

        <div className="flex items-center gap-2">
          {depth < 2 && (
            <button
              type="button"
              onClick={() => setShowReply(!showReply)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Reply
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (confirm("Delete this comment?")) {
                deleteComment.mutate({ id: comment.id });
              }
            }}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Delete
          </button>
        </div>

        {showReply && (
          <form onSubmit={handleReplySubmit} className="flex gap-2 pt-1">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              className="min-h-0 text-sm"
            />
            <div className="flex flex-col gap-1">
              <Button
                type="submit"
                size="sm"
                disabled={createComment.isPending || !replyContent.trim()}
              >
                {createComment.isPending ? "..." : "Reply"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowReply(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply: Comment) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              target={target}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentSection({
  catchId,
  tripId,
  articleId,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");

  const target = { catchId, tripId, articleId };

  const { data: commentsData } = trpc.social.listComments.useQuery(target);
  const comments: Comment[] = commentsData ?? [];

  const utils = trpc.useUtils();

  const createComment = trpc.social.createComment.useMutation({
    onSuccess: () => {
      setNewComment("");
      utils.social.listComments.invalidate(target);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;
    createComment.mutate({
      ...target,
      content: newComment.trim(),
    });
  }

  // Build threaded structure: top-level comments with nested replies
  const topLevel = comments.filter((c) => !c.parentId);
  const repliesByParent = new Map<string, Comment[]>();
  for (const c of comments) {
    if (c.parentId) {
      const existing = repliesByParent.get(c.parentId) ?? [];
      existing.push(c);
      repliesByParent.set(c.parentId, existing);
    }
  }

  function attachReplies(comment: Comment): Comment {
    const replies = repliesByParent.get(comment.id) ?? [];
    return {
      ...comment,
      replies: replies.map(attachReplies),
    };
  }

  const threadedComments = topLevel.map(attachReplies);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Comments{comments.length > 0 && ` (${comments.length})`}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
        />
        <Button
          type="submit"
          size="sm"
          disabled={createComment.isPending || !newComment.trim()}
        >
          {createComment.isPending ? "Posting..." : "Post Comment"}
        </Button>
        {createComment.isError && (
          <p className="text-sm text-destructive">
            {createComment.error.message}
          </p>
        )}
      </form>

      {threadedComments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No comments yet. Be the first to comment.
        </p>
      ) : (
        <div className="space-y-4">
          {threadedComments.map((comment: Comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              target={target}
            />
          ))}
        </div>
      )}
    </div>
  );
}
