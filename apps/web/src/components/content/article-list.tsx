"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, Card, CardContent, Input, Select, SelectOption } from "@fyshe/ui";
import { ARTICLE_CATEGORIES } from "@fyshe/validators";
import { trpc } from "@/trpc/client";

const CATEGORY_LABELS: Record<string, string> = {
  TECHNIQUE: "Technique",
  GEAR_REVIEW: "Gear Review",
  LOCATION_GUIDE: "Location Guide",
  SEASONAL_TIP: "Seasonal Tip",
  FLY_TYING: "Fly Tying",
  CONSERVATION: "Conservation",
};

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  tags: string[];
  coverImage: string | null;
  isPublished: boolean;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count?: {
    likes: number;
    comments: number;
  };
}

interface ArticleListProps {
  initialArticles: Article[];
}

export function ArticleList({ initialArticles }: ArticleListProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filters = {
    published: true,
    search: search || undefined,
    category: category || undefined,
  };

  const { data } = trpc.article.list.useQuery(
    filters as Parameters<typeof trpc.article.list.useQuery>[0],
  );

  const articles = data ?? initialArticles;

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-48"
        >
          <SelectOption value="">All Categories</SelectOption>
          {ARTICLE_CATEGORIES.map((cat) => (
            <SelectOption key={cat} value={cat}>
              {CATEGORY_LABELS[cat] ?? cat}
            </SelectOption>
          ))}
        </Select>
      </div>

      {articles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No articles found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                {article.coverImage && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight line-clamp-2">
                      {article.title}
                    </h3>
                    <Badge variant="secondary">
                      {CATEGORY_LABELS[article.category] ?? article.category}
                    </Badge>
                  </div>

                  {article.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{article.author.name ?? "Anonymous"}</span>
                    <span>&middot;</span>
                    <span>{formatDate(article.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {article._count && (
                      <>
                        <span className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            className="h-3 w-3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                            />
                          </svg>
                          {article._count.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            className="h-3 w-3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                            />
                          </svg>
                          {article._count.comments}
                        </span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
