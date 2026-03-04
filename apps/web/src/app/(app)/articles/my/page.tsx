import { createCaller } from "@/trpc/server";
import { MyArticles } from "@/components/content/my-articles";

export default async function MyArticlesPage() {
  const trpc = await createCaller();
  const articles = await trpc.article.myArticles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Articles</h1>
          <p className="text-muted-foreground">
            Manage your published and draft articles.
          </p>
        </div>
        <a
          href="/articles/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          New Article
        </a>
      </div>
      <MyArticles initialArticles={articles} />
    </div>
  );
}
