import { z } from "zod";

export const ARTICLE_CATEGORIES = [
  "TECHNIQUE",
  "GEAR_REVIEW",
  "LOCATION_GUIDE",
  "SEASONAL_TIP",
  "FLY_TYING",
  "CONSERVATION",
] as const;

export const articleCategorySchema = z.enum(ARTICLE_CATEGORIES);

export const createArticleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(500).optional(),
  category: articleCategorySchema,
  tags: z.array(z.string()).default([]),
  coverImage: z.string().url().optional(),
  isPublished: z.boolean().default(false),
});

export const updateArticleSchema = createArticleSchema.partial();

export const articleListFiltersSchema = z.object({
  category: articleCategorySchema.optional(),
  tag: z.string().optional(),
  authorId: z.string().optional(),
  search: z.string().optional(),
  published: z.boolean().optional(),
});
