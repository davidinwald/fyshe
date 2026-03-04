import { describe, it, expect } from "vitest";
import {
  createArticleSchema,
  updateArticleSchema,
  articleListFiltersSchema,
} from "../content";

describe("content validators", () => {
  describe("createArticleSchema", () => {
    it("accepts valid minimal input", () => {
      const result = createArticleSchema.safeParse({
        title: "My Article",
        content: "Some content here",
        category: "TECHNIQUE",
      });
      expect(result.success).toBe(true);
    });

    it("accepts full input", () => {
      const result = createArticleSchema.safeParse({
        title: "Fly Fishing Tips",
        content: "Detailed content...",
        excerpt: "A quick summary",
        category: "GEAR_REVIEW",
        tags: ["gear", "review"],
        coverImage: "https://example.com/image.jpg",
        isPublished: true,
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty title", () => {
      expect(
        createArticleSchema.safeParse({
          title: "",
          content: "Content",
          category: "TECHNIQUE",
        }).success,
      ).toBe(false);
    });

    it("rejects empty content", () => {
      expect(
        createArticleSchema.safeParse({
          title: "Title",
          content: "",
          category: "TECHNIQUE",
        }).success,
      ).toBe(false);
    });

    it("rejects invalid category", () => {
      expect(
        createArticleSchema.safeParse({
          title: "Title",
          content: "Content",
          category: "INVALID",
        }).success,
      ).toBe(false);
    });

    it("defaults tags to empty array", () => {
      const result = createArticleSchema.parse({
        title: "Title",
        content: "Content",
        category: "TECHNIQUE",
      });
      expect(result.tags).toEqual([]);
    });

    it("defaults isPublished to false", () => {
      const result = createArticleSchema.parse({
        title: "Title",
        content: "Content",
        category: "TECHNIQUE",
      });
      expect(result.isPublished).toBe(false);
    });

    it("rejects title over 200 chars", () => {
      expect(
        createArticleSchema.safeParse({
          title: "x".repeat(201),
          content: "Content",
          category: "TECHNIQUE",
        }).success,
      ).toBe(false);
    });
  });

  describe("updateArticleSchema", () => {
    it("allows partial updates", () => {
      expect(updateArticleSchema.safeParse({ title: "New Title" }).success).toBe(true);
    });

    it("allows empty object", () => {
      expect(updateArticleSchema.safeParse({}).success).toBe(true);
    });

    it("allows updating category", () => {
      expect(
        updateArticleSchema.safeParse({ category: "CONSERVATION" }).success,
      ).toBe(true);
    });
  });

  describe("articleListFiltersSchema", () => {
    it("accepts empty filters", () => {
      expect(articleListFiltersSchema.safeParse({}).success).toBe(true);
    });

    it("accepts category filter", () => {
      expect(
        articleListFiltersSchema.safeParse({ category: "TECHNIQUE" }).success,
      ).toBe(true);
    });

    it("accepts all filters", () => {
      const result = articleListFiltersSchema.safeParse({
        category: "GEAR_REVIEW",
        tag: "review",
        authorId: "user1",
        search: "fishing",
        published: true,
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid category", () => {
      expect(
        articleListFiltersSchema.safeParse({ category: "INVALID" }).success,
      ).toBe(false);
    });
  });
});
