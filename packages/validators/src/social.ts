import { z } from "zod";

// ── Follow ──────────────────────────────────────────────

export const followInputSchema = z.object({
  userId: z.string().min(1),
});

// ── Like ────────────────────────────────────────────────

export const likeInputSchema = z.object({
  catchId: z.string().optional(),
  tripId: z.string().optional(),
  articleId: z.string().optional(),
}).refine(
  (data) => {
    const set = [data.catchId, data.tripId, data.articleId].filter(Boolean);
    return set.length === 1;
  },
  { message: "Exactly one of catchId, tripId, or articleId must be provided" },
);

// ── Comment ─────────────────────────────────────────────

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(2000),
  catchId: z.string().optional(),
  tripId: z.string().optional(),
  articleId: z.string().optional(),
  parentId: z.string().optional(),
}).refine(
  (data) => {
    const set = [data.catchId, data.tripId, data.articleId].filter(Boolean);
    return set.length === 1;
  },
  { message: "Exactly one of catchId, tripId, or articleId must be provided" },
);

export const updateCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(2000),
});

export const commentListInputSchema = z.object({
  catchId: z.string().optional(),
  tripId: z.string().optional(),
  articleId: z.string().optional(),
}).refine(
  (data) => {
    const set = [data.catchId, data.tripId, data.articleId].filter(Boolean);
    return set.length === 1;
  },
  { message: "Exactly one of catchId, tripId, or articleId must be provided" },
);
