"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge, Button, Card, CardContent } from "@fyshe/ui";
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
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface MyArticlesProps {
  initialArticles: Article[];
}

export function MyArticles({ initialArticles }: MyArticlesProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data } = trpc.article.myArticles.useQuery();
  const articles = data ?? initialArticles;

  const deleteArticle = trpc.article.delete.useMutation({
    onSuccess: () => {
      utils.article.myArticles.invalidate();
      utils.article.list.invalidate();
    },
  });

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (articles.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            You haven&apos;t written any articles yet.
          </p>
          <Link
            href="/articles/new"
            className="text-primary hover:underline text-sm"
          >
            Write your first article
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {articles.map((article) => (
        <Card key={article.id}>
          <CardContent className="flex items-center justify-between p-4 gap-4">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold truncate">{article.title}</h3>
                <Badge
                  variant={article.isPublished ? "default" : "outline"}
                >
                  {article.isPublished ? "Published" : "Draft"}
                </Badge>
                <Badge variant="secondary">
                  {CATEGORY_LABELS[article.category] ?? article.category}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {article.isPublished ? "Published" : "Last updated"}{" "}
                {formatDate(article.updatedAt)}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {article.isPublished && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/articles/${article.slug}`}>View</Link>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(`/articles/${article.id}/edit`)
                }
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm("Delete this article?")) {
                    deleteArticle.mutate({ id: article.id });
                  }
                }}
                disabled={deleteArticle.isPending}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
