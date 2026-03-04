import { describe, it, expect } from "vitest";
import {
  followInputSchema,
  likeInputSchema,
  createCommentSchema,
  updateCommentSchema,
  commentListInputSchema,
} from "../social";

describe("social validators", () => {
  describe("followInputSchema", () => {
    it("accepts valid userId", () => {
      expect(followInputSchema.safeParse({ userId: "abc123" }).success).toBe(true);
    });

    it("rejects empty userId", () => {
      expect(followInputSchema.safeParse({ userId: "" }).success).toBe(false);
    });
  });

  describe("likeInputSchema", () => {
    it("accepts catchId only", () => {
      expect(likeInputSchema.safeParse({ catchId: "c1" }).success).toBe(true);
    });

    it("accepts tripId only", () => {
      expect(likeInputSchema.safeParse({ tripId: "t1" }).success).toBe(true);
    });

    it("accepts articleId only", () => {
      expect(likeInputSchema.safeParse({ articleId: "a1" }).success).toBe(true);
    });

    it("rejects empty input", () => {
      expect(likeInputSchema.safeParse({}).success).toBe(false);
    });

    it("rejects multiple targets", () => {
      expect(likeInputSchema.safeParse({ catchId: "c1", tripId: "t1" }).success).toBe(false);
    });
  });

  describe("createCommentSchema", () => {
    it("accepts valid comment on a catch", () => {
      const result = createCommentSchema.safeParse({
        content: "Nice catch!",
        catchId: "c1",
      });
      expect(result.success).toBe(true);
    });

    it("accepts reply to a comment", () => {
      const result = createCommentSchema.safeParse({
        content: "Thanks!",
        catchId: "c1",
        parentId: "comment1",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty content", () => {
      expect(
        createCommentSchema.safeParse({ content: "", catchId: "c1" }).success,
      ).toBe(false);
    });

    it("rejects content over 2000 chars", () => {
      expect(
        createCommentSchema.safeParse({
          content: "x".repeat(2001),
          catchId: "c1",
        }).success,
      ).toBe(false);
    });

    it("rejects no target", () => {
      expect(
        createCommentSchema.safeParse({ content: "Hello" }).success,
      ).toBe(false);
    });

    it("rejects multiple targets", () => {
      expect(
        createCommentSchema.safeParse({
          content: "Hello",
          catchId: "c1",
          tripId: "t1",
        }).success,
      ).toBe(false);
    });
  });

  describe("updateCommentSchema", () => {
    it("accepts valid content", () => {
      expect(updateCommentSchema.safeParse({ content: "Updated" }).success).toBe(true);
    });

    it("rejects empty content", () => {
      expect(updateCommentSchema.safeParse({ content: "" }).success).toBe(false);
    });
  });

  describe("commentListInputSchema", () => {
    it("accepts catchId", () => {
      expect(commentListInputSchema.safeParse({ catchId: "c1" }).success).toBe(true);
    });

    it("accepts articleId", () => {
      expect(commentListInputSchema.safeParse({ articleId: "a1" }).success).toBe(true);
    });

    it("rejects empty input", () => {
      expect(commentListInputSchema.safeParse({}).success).toBe(false);
    });

    it("rejects multiple targets", () => {
      expect(
        commentListInputSchema.safeParse({ catchId: "c1", articleId: "a1" }).success,
      ).toBe(false);
    });
  });
});
