import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  createArticleSchema,
  updateArticleSchema,
  articleListFiltersSchema,
} from "@fyshe/validators";
import { z } from "zod";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const articleRouter = createTRPCRouter({
  list: publicProcedure.input(articleListFiltersSchema).query(async ({ ctx, input }) => {
    const where: Record<string, unknown> = {};
    const userId = ctx.session?.user?.id;

    if (input.category) {
      where.category = input.category;
    }
    if (input.tag) {
      where.tags = { has: input.tag };
    }
    if (input.authorId) {
      where.authorId = input.authorId;
    }
    if (input.search) {
      where.OR = [
        { title: { contains: input.search, mode: "insensitive" } },
        { content: { contains: input.search, mode: "insensitive" } },
      ];
    }

    // Visibility: show published by default, allow drafts only for the author
    if (input.published === false && userId && input.authorId === userId) {
      // Author requesting their own drafts
      where.isPublished = false;
    } else {
      where.isPublished = true;
    }

    return ctx.db.article.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const article = await ctx.db.article.findUnique({
        where: { slug: input.slug },
        include: {
          author: { select: { id: true, name: true, image: true } },
          _count: { select: { likes: true, comments: true } },
        },
      });

      if (!article) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Article not found" });
      }

      // If not published, only the author can see it
      const userId = ctx.session?.user?.id;
      if (!article.isPublished && article.authorId !== userId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Article not found" });
      }

      return article;
    }),

  create: protectedProcedure.input(createArticleSchema).mutation(async ({ ctx, input }) => {
    const slug = generateSlug(input.title);

    // Ensure slug uniqueness by appending a suffix if needed
    const existing = await ctx.db.article.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    return ctx.db.article.create({
      data: {
        author: { connect: { id: ctx.session.user.id } },
        slug: finalSlug,
        title: input.title,
        content: input.content,
        excerpt: input.excerpt,
        category: input.category,
        tags: input.tags,
        coverImage: input.coverImage,
        isPublished: input.isPublished,
        publishedAt: input.isPublished ? new Date() : null,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: updateArticleSchema }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.article.findFirst({
        where: { id: input.id, authorId: ctx.session.user.id },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Article not found" });
      }

      const data: Record<string, unknown> = { ...input.data };

      // If transitioning from draft to published, set publishedAt
      if (input.data.isPublished && !existing.isPublished) {
        data.publishedAt = new Date();
      }

      return ctx.db.article.update({
        where: { id: input.id },
        data,
        include: {
          author: { select: { id: true, name: true, image: true } },
          _count: { select: { likes: true, comments: true } },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.article.findFirst({
        where: { id: input.id, authorId: ctx.session.user.id },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Article not found" });
      }

      return ctx.db.article.delete({ where: { id: input.id } });
    }),

  myArticles: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.article.findMany({
      where: { authorId: ctx.session.user.id },
      include: {
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),
});
