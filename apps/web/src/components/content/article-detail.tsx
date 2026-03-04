import { Badge } from "@fyshe/ui";

const CATEGORY_LABELS: Record<string, string> = {
  TECHNIQUE: "Technique",
  GEAR_REVIEW: "Gear Review",
  LOCATION_GUIDE: "Location Guide",
  SEASONAL_TIP: "Seasonal Tip",
  FLY_TYING: "Fly Tying",
  CONSERVATION: "Conservation",
};

interface ArticleDetailProps {
  article: {
    id: string;
    title: string;
    content: string;
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
  };
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  return (
    <article className="space-y-6">
      {article.coverImage && (
        <div className="aspect-video overflow-hidden rounded-lg">
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">
            {CATEGORY_LABELS[article.category] ?? article.category}
          </Badge>
          {article.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
          {article.title}
        </h1>

        <div className="flex items-center gap-3">
          {article.author.image ? (
            <img
              src={article.author.image}
              alt={article.author.name ?? "Author"}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
              {(article.author.name ?? "?").charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-medium">
              {article.author.name ?? "Anonymous"}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(article.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div
        className="prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}
