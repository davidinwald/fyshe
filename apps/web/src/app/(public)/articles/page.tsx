import { createCaller } from "@/trpc/server";
import { ArticleList } from "@/components/content/article-list";

export default async function ArticlesPage() {
  const trpc = await createCaller();
  const articles = await trpc.article.list({ published: true });

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Articles</h1>
        <p className="text-muted-foreground">
          Tips, guides, and stories from the fishing community.
        </p>
      </div>
      <ArticleList initialArticles={articles} />
    </div>
  );
}
